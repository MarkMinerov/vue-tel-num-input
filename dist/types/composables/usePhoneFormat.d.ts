import { Ref } from 'vue';
type InputEl = HTMLInputElement | null | undefined;
export declare function usePhoneFormat(params: {
    value: Ref<string>;
    iso: Ref<string>;
    international: Ref<boolean>;
    needFormat: Ref<boolean>;
    inputEl: Ref<InputEl>;
    excludeCountryCodes: Ref<string[]>;
    onAfterFormat?: (formatted: string) => void;
}): {
    isComposing: Ref<boolean, boolean>;
    setComposing: (v: boolean) => boolean;
    formatNow: (raw?: string) => void;
};
export {};
