import { Ref, computed, watch } from "vue";
import configJson from "~/assets/configs/iso.json";
import type { ConfigType } from "~/types";

import { useWarn } from "./useWarn";

const config = configJson as unknown as ConfigType;

export const useValidCountries = (refCountryCodes: Ref<string[]>, excludeCountryCodes: Ref<string[]>, defCountryCode: Ref<string>, silent: Ref<boolean>) => {
    let warn = useWarn(silent.value);
    watch(silent, (newVal) => (warn = useWarn(newVal)));

    const isoCodes = Object.keys(config);

    const validCountryCodes = computed(() => {
        const propsCountryCodes = Array.from(new Set(refCountryCodes.value));
        let countryCodes: string[];

        if (!propsCountryCodes?.length) {
            countryCodes = isoCodes;
        } else {
            const validCodes = propsCountryCodes.filter((code) => isoCodes.includes(code));
            const invalidCodes = propsCountryCodes.filter((code) => !isoCodes.includes(code));
            if (invalidCodes.length > 0) warn(`[TelNumInput] Country codes not found: ${invalidCodes.join(", ")}`);
            countryCodes = validCodes;
        }

        countryCodes = countryCodes.filter((code: string) => !excludeCountryCodes.value?.includes(code));

        return countryCodes;
    });

    const validCountries = computed(() => validCountryCodes.value.map((code: string) => ({ ...config[code], code })));

    const validDefCountryCode = computed(() => {
        if (!defCountryCode.value || !isoCodes.includes(defCountryCode.value)) return "US";
        return defCountryCode.value;
    });

    return { isoCodes, validCountryCodes, validCountries, validDefCountryCode };
};
