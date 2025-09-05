<template>
    <div class="tel-num-input" ref="telNumInput" :class="[sizeClass, { expanded: model.expanded }]">
        <div class="tel-num-input__head">
            <div v-if="!prefix.hidden" class="prefix-container" @click="switchDropdown()">
                <slot name="prefix:flag">
                    <FlagIcon v-if="!prefix.hideFlag" :flag="flag" :value="model.countryCode" class="prefix-container__flag" />
                </slot>

                <slot name="prefix:code">
                    <span v-if="!prefix.hideCode" class="prefix-container__code">{{ model.config.code }}</span>
                </slot>

                <slot name="prefix:countryName">
                    <span v-if="!prefix.hideCountryName" class="prefix-container__country-name">{{ model.config.name }}</span>
                </slot>

                <slot name="prefix:chevron">
                    <svg v-if="!prefix.hideChevron" class="prefix-container__chevron" viewBox="0 0 16 16">
                        <path d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708" />
                    </svg>
                </slot>
            </div>

            <input type="text" :placeholder="placVal" :disabled="disabled" />
        </div>

        <!-- <div class="tel-num-input__body">
            <div v-for="item of validCountries" class="tel-num-input__body--item">
                {{ item.code }}
            </div>
        </div> -->
    </div>
</template>

<script lang="ts" setup>
import { computed, toRefs, reactive, useTemplateRef } from "vue";
import type { FlagConfig } from "~/types";
import { useValidCountries } from "~/composables/useValidCountries";
import { usePlaceholder } from "~/composables/usePlaceholder";

import { onClickOutside } from "@vueuse/core";

import FlagIcon from "./FlagIcon.vue";

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
            prefix: {
                hidden: boolean;
                hideCode: boolean;
                hideFlag: boolean;
                hideChevron: boolean;
                hideCountryName: boolean;
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
    }
);

const { countryCodes, excludeCountryCodes, defaultCountryCode, silent, locale, placeholder, disableSizing, size } = toRefs(props);

const sizeClass = computed(() => (disableSizing.value ? "" : `tel-num-input--${size.value ?? "lg"}`));
const { validCountries, validDefCountryCode, config } = useValidCountries(countryCodes, excludeCountryCodes, defaultCountryCode, silent);
const { placVal } = usePlaceholder(locale, placeholder, silent);

const telNumInputEl = useTemplateRef<HTMLElement>("telNumInput");
onClickOutside(telNumInputEl, (event) => {
    switchDropdown(false);
});

const model = reactive({
    countryCode: validDefCountryCode,
    config: config[validDefCountryCode.value],
    expanded: false,
});

const switchDropdown = (value?: boolean) => {
    if (value == null) model.expanded = !model.expanded;
    else model.expanded = value;
};

// Development flow:
// 1. Basic structure: button with code + flag, input for phone number
// 2. Dropdown for country codes, user can choose country code + choose only which country codes to show

// Features:

// TODO: Dropdown for country codes
// user can pass slot
// user can pass list of country codes
// user can choose from where to load country flag icon: API, local assets, emojis
// virtual scroll for country codes ?

// TODO: Button with chevron, country code, flag
// user can pass slot for button
// user can pass his own text for code
// user can pass his own flag icon

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

    &.expanded {
        .tel-num-input__head {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;

            .prefix-container__chevron {
                transform: rotate(180deg);
            }
        }

        /* .tel-num-input__body {
            display: block;
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid #ccc;
            border-top: none;
            border-bottom-left-radius: 6px;
            border-bottom-right-radius: 6px;
            background-color: #fff;
        } */
    }

    &__head {
        display: flex;
        flex-direction: row;
        align-items: center;
        border: 1px solid #ccc;
        border-radius: 6px;
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

            &::placeholder {
                color: #aaa;
            }
        }
    }
}
</style>
