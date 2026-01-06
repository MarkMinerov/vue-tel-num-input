import { CountryCode } from 'libphonenumber-js';
export declare const useGetNames: () => {
    getNames: (iso: CountryCode) => {
        name: string | undefined;
        nativeName: string | undefined;
    };
};
