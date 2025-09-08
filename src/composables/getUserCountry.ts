import { watch, Ref, ref } from "vue";

export const getUserCountry = async (enabled: Ref<boolean>) => {
  const API_URL = "https://ipapi.co/country/";
  const country = ref<string | null>(null);

  const getUserCountry = async () => {
    try {
      const response = await fetch(API_URL);
      country.value = await response.text();
    } catch (error) {
      console.error("Error fetching user country:", error);
      return null;
    }

    return country.value;
  };

  watch(enabled, (newVal) => {
    if (newVal) getUserCountry();
  });

  if (enabled.value) await getUserCountry();

  return { country, getUserCountry };
};
