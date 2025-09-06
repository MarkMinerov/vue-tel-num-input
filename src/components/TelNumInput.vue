<template>
    <div class="tel-num-input" ref="telNumInput" :class="[sizeClass, { expanded: model.expanded, empty: !filteredCountries.length }]">
        <div class="tel-num-input__head">
            <div v-if="!prefix.hidden" class="prefix-container" @click="switchDropdown()">
                <slot name="prefix:before" />

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

                <slot name="prefix:after" />
            </div>

            <input type="text" @focus="emit('focus')" @blur="emit('blur')" :placeholder="placVal" :disabled="disabled" />
        </div>

        <!-- <span style="color: white">{{ model }}</span> -->
        <!-- ADD SEARCH  -->

        <div v-if="model.expanded && !list.hidden" class="tel-num-input__body">
            <slot name="body:search">
                <div class="search-container" :style="{ height: `${itemHeightComp}px` }">
                    <slot name="search:before" />

                    <slot name="search:icon">
                        <svg width="50" height="50" viewBox="0 0 50 50">
                            <path
                                d="M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z"
                            />
                        </svg>
                    </slot>

                    <slot name="search:input">
                        <input v-if="!search.hidden" type="text" v-model="model.search" :placeholder="searchPlacVal" />
                    </slot>

                    <slot name="search:after" />
                </div>
            </slot>

            <div class="list-container" ref="scrollList" :style="{ maxHeight: `${listHeight}px` }">
                <div v-for="(data, index) of filteredCountries" :tabindex="index" @click="selectItem(data)" :class="{ selected: model.code == data.code }" :key="index" :style="{ height: `${itemHeightComp}px` }" class="tel-num-input__body--item">
                    <slot name="item:before" />

                    <slot name="item:flag">
                        <FlagIcon v-if="!list.hideFlag" :flag="flag" :value="data.iso" class="tel-num-input__body--item__flag" />
                    </slot>

                    <slot name="item:code">
                        <span v-if="!list.hideCode" class="tel-num-input__body--item__code">{{ data.code }}</span>
                    </slot>

                    <slot name="item:countryName">
                        <span v-if="!list.hideCountryName" class="tel-num-input__body--item__country-name">{{ data.name }}</span>
                    </slot>

                    <slot name="item:after" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, toRefs, toRef, ref, useTemplateRef, nextTick, watch } from "vue";
import type { CountryConfig, FlagConfig } from "~/types";
import { useValidCountries } from "~/composables/useValidCountries";
import { usePlaceholder } from "~/composables/usePlaceholder";

import { onClickOutside, useVirtualList } from "@vueuse/core";

import FlagIcon from "./FlagIcon.vue";

const DEFAULT_ITEMS_PER_VIEW = 5;

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
            search: {
                hidden: boolean;
                placeholder?: Record<string, string> | string;
                locale?: string;
                clearOnSelect: boolean;
            };
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
                itemsPerView: number;
                returnToSelected: boolean;
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
        prefix: () => ({
            hidden: false,
            hideCode: false,
            hideFlag: false,
            hideCountryName: false,
            hideChevron: false,
        }),
        list: () => ({
            hidden: false,
            hideCode: false,
            hideFlag: false,
            hideCountryName: false,
            returnToSelected: true,
            itemsPerView: DEFAULT_ITEMS_PER_VIEW,
            hideChevron: false,
        }),
        search: () => ({
            hidden: false,
            clearOnSelect: true,
        }),
    }
);

const rowSizes = {
    sm: 32,
    md: 36,
    lg: 40,
    xl: 48,
    xxl: 56,
};

const { countryCodes, excludeCountryCodes, defaultCountryCode, silent, locale, placeholder, search, disableSizing, size, list, prefix, itemHeight } = toRefs(props);
const searchLocale = toRef(() => props.search.locale);
const searchPlaceholder = toRef(() => props.search.placeholder);

const sizeClass = computed(() => (disableSizing.value ? "" : `tel-num-input--${size.value ?? "lg"}`));
const listHeight = computed(() => (list.value.itemsPerView || DEFAULT_ITEMS_PER_VIEW) * itemHeightComp.value);
const itemHeightComp = computed(() => itemHeight.value || rowSizes[size.value || "lg"]);
const selectedCountryIdx = computed(() => filteredCountries.value.findIndex((c) => c.code === model.value.code));

const { validCountries, validDefCountryCode, config } = useValidCountries(countryCodes, excludeCountryCodes, defaultCountryCode, silent);
const { placVal } = usePlaceholder(locale, placeholder, silent, "Enter phone number");
const { placVal: searchPlacVal } = usePlaceholder(searchLocale, searchPlaceholder, silent, "Search...");

const model = ref({
    iso: validDefCountryCode,
    name: config[validDefCountryCode.value].name,
    code: config[validDefCountryCode.value].code,
    mask: config[validDefCountryCode.value].mask,
    search: "",
    expanded: false,
});

const filteredCountries = computed(() => {
    if (!model.value.search) return validCountries.value;
    return validCountries.value.filter((c) => c.name.toLowerCase().includes(model.value.search.toLowerCase()) || c.code.includes(model.value.search) || c.iso.toLowerCase().includes(model.value.search.toLowerCase()));
});

// const {
//     list: items,
//     containerProps,
//     wrapperProps,
// } = useVirtualList(filteredCountries, {
//     itemHeight: itemHeightComp.value,
// });

const telNumInputEl = useTemplateRef<HTMLElement>("telNumInput");
const scrollListEl = useTemplateRef<HTMLElement>("scrollList");
onClickOutside(telNumInputEl, () => {
    switchDropdown(false);
});

const switchDropdown = (value?: boolean) => {
    if (value == null) model.value.expanded = !model.value.expanded;
    else model.value.expanded = value;

    if (list.value.returnToSelected && model.value.expanded && selectedCountryIdx.value >= 0) {
        nextTick(() => scrollListEl.value?.scrollTo({ top: selectedCountryIdx.value * itemHeightComp.value }));
    }

    emit("toggle", model.value.expanded);
};

const selectItem = (data: CountryConfig) => {
    model.value = {
        ...model.value,
        ...data,
        expanded: false,
    };

    if (search.value.clearOnSelect) {
        model.value.search = "";
    }
};

watch(
    () => model.value.search,
    () => scrollListEl.value?.scrollTo({ top: 0 })
);

// Development flow:
// 1. Basic structure: button with code + flag, input for phone number
// 2. Dropdown for country codes, user can choose country code + choose only which country codes to show

// Features:

// TODO: Dropdown for country codes
// user can pass slot DONE
// user can pass list of country codes DONE
// user can choose from where to load country flag icon: API, local assets, emojis DONE

// TODO: Button with chevron, country code, flag DONE
// user can pass slot for button DONE
// user can pass his own text for code DONE
// user can pass his own flag icon DONE
// user can pass his prefix and suffix slot DONE
// add search (user can pass anything to replace the search with)
// return to last selected country code in list
// clear search with cross icon

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

    * {
        box-sizing: border-box;
    }

    &.expanded {
        .tel-num-input__head {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;

            .prefix-container__chevron {
                transform: rotate(180deg);
            }
        }
    }

    &.empty {
        .search-container {
            border-bottom: none;
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
            padding: 0 var(--tel-input-padding-x, 12px);
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
        border: var(--tel-input-body-border, 1px solid #ccc);
        border-top: unset;
        border-bottom-left-radius: var(--tel-input-border-radius, 6px);
        border-bottom-right-radius: var(--tel-input-border-radius, 6px);
        overflow: hidden;

        .search-container {
            display: flex;
            flex-direction: row;
            align-items: center;
            border-bottom: var(--tel-input-body-item-border, 1px solid #eee);

            svg {
                width: var(--tel-input-icon-size, 16px);
                height: var(--tel-input-icon-size, 16px);
                margin-left: var(--tel-input--search-icon-margin-x, 12px);
                fill: var(--tel-input-search-icon-color, #333);
            }

            input {
                height: 100%;
                width: 100%;
                padding: 0 var(--tel-search-input-padding-x, 12px);
                border: var(--tel-input-search-border, none);
                color: var(--tel-input-input-color, #333);
                background-color: var(--tel-input-input-bg, #fff);
                font-size: var(--tel-input-font-size, 14px);
                outline: var(--tel-input-search-outline, none);
            }
        }

        .list-container {
            background-color: var(--tel-input-body-bg, #f9f9f9);
            scrollbar-width: var(--tel-scrollbar-width, thin);
            scrollbar-color: var(--tel-scrollbar-thumb, #bbb) var(--tel-scrollbar-track, #f9f9f9);
            overflow: auto;

            &::-webkit-scrollbar {
                width: var(--tel-scrollbar-width, 6px);
            }
            &::-webkit-scrollbar-thumb {
                background: var(--tel-scrollbar-thumb, #bbb);
                border-radius: var(--tel-scrollbar-radius, 12px);
            }
            &::-webkit-scrollbar-track {
                background: var(--tel-scrollbar-track, #f9f9f9);
            }
        }

        &--item {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: var(--tel-input-prefix-gap, 8px);
            padding: 0 var(--tel-item-padding-x, 12px);
            font-size: var(--tel-input-font-size, 14px);
            color: var(--tel-input-body-item-color, #333);
            background-color: var(--tel-input-body-item-bg, #fff);
            transition: var(--tel-input-transition-duration, 0.3s) var(--tel-input-transition-func, ease) var(--tel-input-transition-delay, 0s) var(--tel-input-transition-prop, background-color, color);
            border-bottom: var(--tel-input-body-item-border, 1px solid #eee);

            &:last-child {
                border-bottom: none;
            }

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
