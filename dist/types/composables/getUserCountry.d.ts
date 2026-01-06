import { Ref, ComputedRef } from 'vue';
import { Country } from '../types';
export declare const getUserCountry: ({ enabled, validCountries, isoRef, silent, }: {
    enabled: Ref<boolean>;
    validCountries: ComputedRef<Country[]>;
    isoRef?: Ref<string>;
    silent: Ref<boolean>;
}) => {
    country: Ref<string | null, string | null>;
    requestUserCountry: () => Promise<string | null>;
};
