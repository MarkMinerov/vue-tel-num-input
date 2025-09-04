<template>
    <div class="tel-num-input" :class="sizeClass">
        <div class="tel-num-input__head">
            <div class="prefix-container"></div>
            <input type="text" :placeholder="placeholder" :disabled="disabled" />
        </div>

        <div class="tel-num-input__body">
            <div v-for="item of validCountries" class="tel-num-input__body--item">
                {{ item.code }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, toRefs } from "vue";
import { useValidCountries } from "~/composables/useValidCountries";
import { usePlaceholder } from "~/composables/usePlaceholder";

const props = withDefaults(
    defineProps<{
        size?: "sm" | "md" | "lg" | "xl" | "xxl";
        disableSizing?: boolean;
        countryCodes?: string[];
        excludeCountryCodes?: string[];
        defaultCountryCode?: string;
        placeholder?: Record<string, string> | string;
        locale?: string;
        disabled?: boolean;
        silent?: boolean;
    }>(),
    {
        size: "lg",
        disableSizing: false,
        countryCodes: () => [],
        excludeCountryCodes: () => [],
        defaultCountryCode: "US",
        disabled: false,
        silent: false,
    }
);

const refProps = toRefs(props);
const sizeClass = computed(() => (refProps.disableSizing.value ? "" : `tel-num-input--${refProps.size.value ?? "lg"}`));

const { validCountries } = useValidCountries(refProps.countryCodes, refProps.excludeCountryCodes, refProps.defaultCountryCode, refProps.silent);
const { placeholder } = usePlaceholder(refProps.locale, refProps.placeholder, refProps.silent);
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

            &:hover {
                background-color: #eee;
            }

            &:active {
                background-color: #ddd;
            }
        }

        input {
            flex: 1;
            padding: var(--tel-input-padding-y, 8px) var(--tel-input-padding-x, 12px);
            border: none;
            outline: none;
            font-size: var(--tel-input-font-size, 14px);

            &::placeholder {
                color: #aaa;
            }
        }
    }
}
</style>
