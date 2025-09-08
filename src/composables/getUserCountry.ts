import { watch, Ref, ref, ComputedRef } from "vue";
import { useWarn } from "./useWarn";
import { Country } from "~/types";

export const getUserCountry = ({
  enabled,
  validCountries,
  isoRef,
  silent,
}: {
  enabled: Ref<boolean>;
  validCountries: ComputedRef<Country[]>;
  isoRef?: Ref<string>;
  silent: Ref<boolean>;
}) => {
  let warn = useWarn(silent.value);
  watch(silent, (newVal) => (warn = useWarn(newVal)));

  const API_URL = "https://ipapi.co/country/";
  const country = ref<string | null>(null);

  const requestUserCountry = async () => {
    try {
      const response = await fetch(API_URL);
      const value = await response.text();
      if (validCountries.value.find((c) => c.iso === value)) {
        country.value = value;
        if (isoRef) isoRef.value = value;
      }
    } catch (error) {
      warn("Error fetching user country:", error);
      return null;
    }

    return country.value;
  };

  watch(enabled, (newVal) => {
    if (newVal) requestUserCountry();
  });

  if (enabled.value) requestUserCountry();

  return { country, requestUserCountry };
};
