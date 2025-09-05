<template>
    <div class="tel-num-input" ref="telNumInput" :class="[sizeClass, { expanded: model.expanded }]">
        <div class="tel-num-input__head">
            <div v-if="!prefix.hidden" class="prefix-container" @click="switchDropdown()">
                <slot name="prefix:flag">
                    <FlagIcon v-if="!prefix.hideFlag" :flag="flag" :value="model.iso" class="prefix-container__flag" />
                </slot>

                <slot name="prefix:code">
                    <span v-if="!prefix.hideCode" class="prefix-container__code">{{ model.code }}</span>
                </slot>

                <slot name="prefix:countryName">
                    <span v-if="!prefix.hideCountryName" class="prefix-container__country-name">{{ model.name }}</span>
                </slot>

                <slot name="prefix:chevron">
                    <svg v-if="!prefix.hideChevron" class="prefix-container__chevron" viewBox="0 0 16 16">
                        <path d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708" />
                    </svg>
                </slot>
            </div>

            <input type="text" @focus="emit('focus')" @blur="emit('blur')" :placeholder="placVal" :disabled="disabled" />
        </div>

        <!-- <span style="color: white">{{ model }}</span> -->
        <!-- ADD SEARCH  -->

        <div v-if="model.expanded && !list.hidden" class="tel-num-input__body" v-bind="containerProps" :style="{ height: `${list.height}px` }">
            <div v-bind="wrapperProps">
                <div v-for="{ index, data } of items" @click="selectItem(data)" :key="index" :style="{ height: `${itemHeightFallback}px` }" class="tel-num-input__body--item">
                    <slot name="prefix:flag">
                        <FlagIcon v-if="!list.hideFlag" :flag="flag" :value="data.iso" class="prefix-container__flag" />
                    </slot>

                    <slot name="prefix:code">
                        <span v-if="!list.hideCode" class="prefix-container__code">{{ data.code }}</span>
                    </slot>

                    <slot name="prefix:countryName">
                        <span v-if="!list.hideCountryName" class="prefix-container__country-name">{{ data.name }}</span>
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, toRefs, ref, useTemplateRef } from "vue";
import type { CountryConfig, FlagConfig } from "~/types";
import { useValidCountries } from "~/composables/useValidCountries";
import { usePlaceholder } from "~/composables/usePlaceholder";

import { onClickOutside, useVirtualList } from "@vueuse/core";

import FlagIcon from "./FlagIcon.vue";

const DEFAULT_LIST_HEIGHT = 200;

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
    (e: "toggle", value: boolean): void;
    (e: "focus"): void;
    (e: "blur"): void;
}>();

const props = withDefaults(
    defineProps<
        Partial<{
            size: "sm" | "md" | "lg" | "xl" | "xxl";
            disableSizing: boolean;
            countryCodes: string[];
            excludeCountryCodes: string[];
            defaultCountryCode: string;
            placeholder: Record<string, string> | string;
            locale: string;
            disabled: boolean;
            silent: boolean;
            flag: FlagConfig;
            itemHeight: number;
            prefix: {
                hidden: boolean;
                hideCode: boolean;
                hideFlag: boolean;
                hideChevron: boolean;
                hideCountryName: boolean;
            };
            list: {
                hidden: boolean;
                hideCode: boolean;
                hideFlag: boolean;
                hideChevron: boolean;
                hideCountryName: boolean;
                height: number;
            };
        }>
    >(),
    {
        size: "lg",
        disableSizing: false,
        countryCodes: () => [],
        excludeCountryCodes: () => [],
        defaultCountryCode: "US",
        disabled: false,
        silent: false,
        prefix: () => ({ hidden: false, hideCode: false, hideFlag: false, hideCountryName: false, hideChevron: false }),
        list: () => ({ hidden: false, hideCode: false, hideFlag: false, hideCountryName: false, hideChevron: false, height: DEFAULT_LIST_HEIGHT }),
    }
);

const rowSizes = {
    sm: 32,
    md: 36,
    lg: 40,
    xl: 48,
    xxl: 56,
};

const { countryCodes, excludeCountryCodes, defaultCountryCode, silent, locale, placeholder, disableSizing, size, list, prefix, itemHeight } = toRefs(props);

const sizeClass = computed(() => (disableSizing.value ? "" : `tel-num-input--${size.value ?? "lg"}`));
const itemHeightFallback = computed(() => itemHeight.value || rowSizes[size.value || "lg"]);
const { validCountries, validDefCountryCode, config } = useValidCountries(countryCodes, excludeCountryCodes, defaultCountryCode, silent);
const { placVal } = usePlaceholder(locale, placeholder, silent);

const {
    list: items,
    containerProps,
    wrapperProps,
} = useVirtualList(validCountries, {
    itemHeight: itemHeightFallback.value,
});

const telNumInputEl = useTemplateRef<HTMLElement>("telNumInput");
onClickOutside(telNumInputEl, () => {
    switchDropdown(false);
});

const model = ref({
    iso: validDefCountryCode,
    name: config[validDefCountryCode.value].name,
    code: config[validDefCountryCode.value].code,
    mask: config[validDefCountryCode.value].mask,
    expanded: false,
});

const switchDropdown = (value?: boolean) => {
    if (value == null) model.value.expanded = !model.value.expanded;
    else model.value.expanded = value;

    emit("toggle", model.value.expanded);
};

const selectItem = (data: CountryConfig) => {
    model.value = {
        ...data,
        expanded: false,
    };
};

// Development flow:
// 1. Basic structure: button with code + flag, input for phone number
// 2. Dropdown for country codes, user can choose country code + choose only which country codes to show

// Features:

// TODO: Dropdown for country codes
// user can pass slot DONE
// user can pass list of country codes DONE
// user can choose from where to load country flag icon: API, local assets, emojis DONE
// virtual scroll for country codes ? DONE

// TODO: Button with chevron, country code, flag DONE
// user can pass slot for button DONE
// user can pass his own text for code DONE
// user can pass his own flag icon DONE
// user can pass his prefix and suffix slot
// add search (user can pass anything to replace the search with)
// return to last selected country code in list

// TODO: Input for phone number
// user can pass slot for input
// user can pass his own placeholder + translates + locale
// user can pass mask for input
// user can decide he wants to use mask for input or not
// is global code or local code
// user can decide whether to apply default styles or not

// props and methods:
// https://iamstevendao.github.io/vue-tel-input/usage/props.html
</script>

<style lang="scss" scoped>
@use "~/assets/styles/layout.scss" as *;

.tel-num-input {
    display: flex;
    flex-direction: column;
    width: 100%;
    font-family: inherit;
    font-size: var(--tel-input-font-size, 14px);
    color: #333;
    position: relative;

    &.expanded {
        .tel-num-input__head {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;

            .prefix-container__chevron {
                transform: rotate(180deg);
            }
        }
    }

    &__head {
        display: flex;
        flex-direction: row;
        align-items: center;
        border: 1px solid #ccc;
        border-radius: var(--tel-input-border-radius, 6px);
        overflow: hidden;
        background-color: #fff;
        height: var(--tel-input-height, 40px);

        .prefix-container {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 var(--tel-input-prefix-padding-x, 12px);
            background-color: #f9f9f9;
            border-right: 1px solid #ccc;
            cursor: pointer;
            transition: background-color 0.2s;
            height: 100%;
            font-size: var(--tel-input-font-size, 14px);
            gap: var(--tel-input-prefix-gap, 8px);

            &:hover {
                background-color: #eee;
            }

            &:active {
                background-color: #ddd;
            }

            &__chevron {
                width: var(--tel-input-icon-size, 12px);
                height: var(--tel-input-icon-size, 12px);
                transition: var(--tel-input-chevron-transition-func, ease) var(--tel-input-transition-duration, 0.3s) var(--tel-input-chevron-transition-delay, 0s) var(--tel-input-chevron-transition-prop, transform);
            }
        }

        input {
            flex: 1;
            padding: var(--tel-input-padding-y, 8px) var(--tel-input-padding-x, 12px);
            border: none;
            outline: none;
            font-size: var(--tel-input-font-size, 14px);
            width: var(--tel-input-input-width, 200px);
            height: 100%;
            background-color: var(--tel-input-input-bg, #fff);
            color: var(--tel-input-input-color, #333);

            &::placeholder {
                color: #aaa;
            }
        }
    }

    &__body {
        position: absolute;
        top: 100%;
        width: 100%;
        background-color: var(--tel-input-body-bg, #f9f9f9);
        border-bottom-left-radius: var(--tel-input-border-radius, 6px);
        border-bottom-right-radius: var(--tel-input-border-radius, 6px);

        &--item {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: var(--tel-input-prefix-gap, 8px);
            padding: 0 var(--tel-item-padding-x, 12px);
            font-size: var(--tel-input-font-size, 14px);
            color: var(--tel-input-body-item-color, #333);
            background-color: var(--tel-input-body-item-bg, #fff);

            &:hover {
                background-color: var(--tel-input-body-item-hover-bg, #eee);
                color: var(--tel-input-body-item-hover-color, #333);
                cursor: var(--tel-input-body-item-hover-cursor, pointer);
            }

            &.selected {
                background-color: var(--tel-input-body-item-selected-bg, #ddd);
                color: var(--tel-input-body-item-selected-color, #333);
            }
        }
    }
}
</style>
