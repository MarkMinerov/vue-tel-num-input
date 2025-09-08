import { Ref, computed, watch } from "vue";
import configJson from "~/assets/configs/iso.json";
import type { ConfigType, Country } from "~/types";

import { useWarn } from "./useWarn";

const config = configJson as unknown as ConfigType;

export const useValidCountries = (
  refCountryCodes: Ref<string[]>,
  excludeCountryCodes: Ref<string[]>,
  defCountryCode: Ref<string>,
  silent: Ref<boolean>
) => {
  let warn = useWarn(silent.value);
  watch(silent, (newVal) => (warn = useWarn(newVal)));

  const isoCodes = Object.keys(config).map((code) => code.toUpperCase());

  const validCountryCodes = computed(() => {
    const propsCountryCodes = Array.from(
      new Set(refCountryCodes.value.map((code) => code.toUpperCase()))
    );
    let countryCodes: string[];

    if (!propsCountryCodes?.length) {
      countryCodes = isoCodes;
    } else {
      const validCodes = propsCountryCodes.filter((code) =>
        isoCodes.includes(code)
      );
      const invalidCodes = propsCountryCodes.filter(
        (code) => !isoCodes.includes(code)
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
    validCountryCodes.value.map((code: string) => ({
      ...config[code],
      iso: code,
    }))
  );

  const defaultIso = computed(() => {
    const defCode = defCountryCode.value?.toUpperCase();

    if (!defCode || !isoCodes.includes(defCode)) return "US";
    return defCode;
  });

  return { isoCodes, validCountries, defaultIso, config };
};
