import { ComputedRef, Ref, watch } from "vue";
import { parsePhoneNumberWithError, CountryCode } from "libphonenumber-js";
import { useWarn } from "./useWarn";

export const useInit = (countryCode: ComputedRef<string>, initialValue: string, international: boolean, silent: Ref<boolean>) => {
    let warn = useWarn(silent.value);
    watch(silent, (newVal) => (warn = useWarn(newVal)));
    let initialData = null;

    if (initialValue.length) {
        if (international) {
            if (countryCode.value) warn(`Prop 'country-code' is ignored when 'initial-value' is set and 'international' is true.`);
            try {
                initialData = parsePhoneNumberWithError(initialValue);
            } catch (error) {
                warn(`Initial value '${initialValue}' is not a valid phone number.`);
            }
        } else {
            if (!countryCode.value) warn(`Prop 'country-code' should be set when 'initial-value' is provided and 'international' is false.`);
            else {
                try {
                    initialData = parsePhoneNumberWithError(initialValue, {
                        defaultCountry: countryCode.value as CountryCode,
                    });
                } catch (error) {
                    warn(`Initial value '${initialValue}' is not a valid phone number when 'country-code' is set as ${countryCode.value}.`);
                }
            }
        }
    }

    return { initialData };
};
