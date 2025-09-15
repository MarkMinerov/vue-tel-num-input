import { Ref, computed, watch } from "vue";
import { type Country } from "~/types";
import { getCountries, type CountryCode } from "libphonenumber-js";

import { useWarn } from "./useWarn";
import { useGetNames } from "./useGetNames";

export const useValidCountries = (
  refCountryCodes: Ref<string[]>,
  excludeCountryCodes: Ref<string[]>,
  defCountryCode: Ref<string>,
  silent: Ref<boolean>
) => {
  let warn = useWarn(silent.value);
  watch(silent, (newVal) => (warn = useWarn(newVal)));

  const isoCodes = getCountries();
  const { getNames } = useGetNames();

  const validCountryCodes = computed(() => {
    const propsCountryCodes = Array.from(
      new Set(refCountryCodes.value.map((code) => code.toUpperCase()))
    );
    let countryCodes: string[];

    if (!propsCountryCodes?.length) {
      countryCodes = isoCodes;
    } else {
      const validCodes = propsCountryCodes.filter((code) =>
        isoCodes.includes(code as CountryCode)
      );
      const invalidCodes = propsCountryCodes.filter(
        (code) => !isoCodes.includes(code as CountryCode)
      );
      if (invalidCodes.length > 0)
        warn(
          `[TelNumInput] Country codes not found: ${invalidCodes.join(", ")}`
        );
      countryCodes = validCodes;
    }

    const excludeCountryCodesUpper = excludeCountryCodes.value.map((code) =>
      code.toUpperCase()
    );
    countryCodes = countryCodes.filter(
      (code: string) => !excludeCountryCodesUpper.includes(code)
    );

    return countryCodes;
  });

  const validCountries = computed<Country[]>(() =>
    validCountryCodes.value.map((code: string) => {
      const { name, nativeName } = getNames(code as CountryCode);

      console.log(name, nativeName);

      return {
        iso: code,
        name,
        nativeName,
      };
    })
  );

  const defaultIso = computed(() => {
    const defCode = defCountryCode.value?.toUpperCase();

    if (!defCode || !isoCodes.includes(defCode as CountryCode)) return "US";
    return defCode;
  });

  return { isoCodes, validCountries, defaultIso };
};
