import { Ref } from 'vue';
import { Country } from '../types';
export declare const useValidCountries: (refCountryCodes: Ref<string[]>, excludeCountryCodes: Ref<string[]>, defCountryCode: Ref<string>, silent: Ref<boolean>) => {
    isoCodes: any;
    validCountries: import('vue').ComputedRef<Country[]>;
    defaultIso: import('vue').ComputedRef<string>;
};
