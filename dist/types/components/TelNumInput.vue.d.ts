import { Country, FlagConfig } from '../types';
declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: {
        'prefix:before'?(_: {}): any;
        'prefix:flag'?(_: {}): any;
        'prefix:code'?(_: {}): any;
        'prefix:countryName'?(_: {}): any;
        'prefix:chevron'?(_: {}): any;
        'prefix:after'?(_: {}): any;
        input?(_: {}): any;
        'body:search'?(_: {}): any;
        'search:before'?(_: {}): any;
        'search:icon'?(_: {}): any;
        'search:input'?(_: {}): any;
        'search:after'?(_: {}): any;
        'item:before'?(_: {}): any;
        'item:flag'?(_: {}): any;
        'item:code'?(_: {}): any;
        'item:countryName'?(_: {}): any;
        'item:after'?(_: {}): any;
    };
    refs: {
        telNumInput: HTMLDivElement;
        inputEl: HTMLInputElement;
        searchEl: HTMLInputElement;
        scrollList: HTMLDivElement;
    };
    rootEl: HTMLDivElement;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: import('vue').DefineComponent<Partial<{
    size: "sm" | "md" | "lg" | "xl" | "xxl";
    disableSizing: boolean;
    countryCodes: string[];
    excludeCountryCodes: string[];
    defaultCountryCode: string;
    placeholder: Record<string, string> | string;
    locale: string;
    itemHeight: number;
    disabled: boolean;
    silent: boolean;
    flag: FlagConfig;
    animationName: string;
    initialValue: string;
    international: boolean;
    displayName: "native" | "english";
    autoDetectCountry: boolean;
    input: Partial<{
        required: boolean;
        clearOnCountrySelect: boolean;
        focusAfterCountrySelect: boolean;
        lockCountryCode: boolean;
        formatterEnabled: boolean;
        maxLength: number;
    }>;
    search: Partial<{
        hidden: boolean;
        placeholder: Record<string, string> | string;
        locale: string;
        clearOnSelect: boolean;
        autoFocus: boolean;
    }>;
    prefix: Partial<{
        hidden: boolean;
        hideCode: boolean;
        hideFlag: boolean;
        hideChevron: boolean;
        hideCountryName: boolean;
    }>;
    list: Partial<{
        hidden: boolean;
        hideCode: boolean;
        hideFlag: boolean;
        hideCountryName: boolean;
        itemsPerView: number;
        returnToSelected: boolean;
    }>;
}>, {
    switchDropdown: (value?: boolean) => void;
    selectItem: (data: Country) => void;
    formatNow: (raw?: string) => void;
    inputEl: Readonly<import('vue').ShallowRef<HTMLInputElement | null>>;
    searchEl: Readonly<import('vue').ShallowRef<HTMLInputElement | null>>;
    telNumInputEl: Readonly<import('vue').ShallowRef<HTMLElement | null>>;
    country: import('vue').Ref<string | null, string | null>;
    requestUserCountry: () => Promise<string | null>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    blur: () => any;
    focus: () => any;
    toggle: (value: boolean) => any;
    "update:modelValue": (value: {
        iso: string;
        name: string;
        code: string;
        value: string;
        search: string;
        expanded: boolean;
        valid: boolean;
    }) => any;
}, string, import('vue').PublicProps, Readonly<Partial<{
    size: "sm" | "md" | "lg" | "xl" | "xxl";
    disableSizing: boolean;
    countryCodes: string[];
    excludeCountryCodes: string[];
    defaultCountryCode: string;
    placeholder: Record<string, string> | string;
    locale: string;
    itemHeight: number;
    disabled: boolean;
    silent: boolean;
    flag: FlagConfig;
    animationName: string;
    initialValue: string;
    international: boolean;
    displayName: "native" | "english";
    autoDetectCountry: boolean;
    input: Partial<{
        required: boolean;
        clearOnCountrySelect: boolean;
        focusAfterCountrySelect: boolean;
        lockCountryCode: boolean;
        formatterEnabled: boolean;
        maxLength: number;
    }>;
    search: Partial<{
        hidden: boolean;
        placeholder: Record<string, string> | string;
        locale: string;
        clearOnSelect: boolean;
        autoFocus: boolean;
    }>;
    prefix: Partial<{
        hidden: boolean;
        hideCode: boolean;
        hideFlag: boolean;
        hideChevron: boolean;
        hideCountryName: boolean;
    }>;
    list: Partial<{
        hidden: boolean;
        hideCode: boolean;
        hideFlag: boolean;
        hideCountryName: boolean;
        itemsPerView: number;
        returnToSelected: boolean;
    }>;
}>> & Readonly<{
    onBlur?: (() => any) | undefined;
    onFocus?: (() => any) | undefined;
    onToggle?: ((value: boolean) => any) | undefined;
    "onUpdate:modelValue"?: ((value: {
        iso: string;
        name: string;
        code: string;
        value: string;
        search: string;
        expanded: boolean;
        valid: boolean;
    }) => any) | undefined;
}>, {
    size: "sm" | "md" | "lg" | "xl" | "xxl";
    prefix: Partial<{
        hidden: boolean;
        hideCode: boolean;
        hideFlag: boolean;
        hideChevron: boolean;
        hideCountryName: boolean;
    }>;
    input: Partial<{
        required: boolean;
        clearOnCountrySelect: boolean;
        focusAfterCountrySelect: boolean;
        lockCountryCode: boolean;
        formatterEnabled: boolean;
        maxLength: number;
    }>;
    silent: boolean;
    countryCodes: string[];
    excludeCountryCodes: string[];
    international: boolean;
    displayName: "native" | "english";
    defaultCountryCode: string;
    search: Partial<{
        hidden: boolean;
        placeholder: Record<string, string> | string;
        locale: string;
        clearOnSelect: boolean;
        autoFocus: boolean;
    }>;
    disableSizing: boolean;
    list: Partial<{
        hidden: boolean;
        hideCode: boolean;
        hideFlag: boolean;
        hideCountryName: boolean;
        itemsPerView: number;
        returnToSelected: boolean;
    }>;
    animationName: string;
    autoDetectCountry: boolean;
    disabled: boolean;
    initialValue: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    telNumInput: HTMLDivElement;
    inputEl: HTMLInputElement;
    searchEl: HTMLInputElement;
    scrollList: HTMLDivElement;
}, HTMLDivElement>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
