import { CountryCode } from "libphonenumber-js";

export const useGetNames = () => {
  const getNames = (iso: CountryCode) => {
    const name = new Intl.DisplayNames(["en"], { type: "region" });
    const nativeName = new Intl.DisplayNames([iso.toLowerCase()], {
      type: "region",
    });

    return { name: name.of(iso), nativeName: nativeName.of(iso) };
  };

  return { getNames };
};
