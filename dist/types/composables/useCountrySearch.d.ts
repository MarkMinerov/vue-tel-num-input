import { ComputedRef, Ref } from 'vue';
import { Country } from '../types';
type Options<T extends Country> = {
    countries: ComputedRef<T[]> | Ref<T[]> | T[];
    query: Ref<string>;
    codeGetter: (iso: string) => string;
    limit?: number | null;
    normalizeDiacritics?: boolean;
};
export declare function useCountrySearch<T extends Country>(opts: Options<T>): {
    results: ComputedRef<T[]>;
};
export {};
