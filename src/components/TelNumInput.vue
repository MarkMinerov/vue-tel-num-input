<template>
    <div class="tel-num-input">
        <div class="tel-num-input__head">
            <div class="prefix-container"></div>
            <input type="text" />
        </div>

        <div class="tel-num-input__body"></div>
        <!-- <input /> -->
    </div>
</template>

<script lang="ts" setup>
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
.tel-num-input {
    display: flex;
    flex-direction: column;
    width: 100%;
    font-family: inherit;
    font-size: 14px;
    color: #333;

    &__head {
        display: flex;
        flex-direction: row;
        align-items: center;
        border: 1px solid #ccc;
        border-radius: 6px;
        overflow: hidden;
        background-color: #fff;

        .prefix-container {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 12px;
            background-color: #f9f9f9;
            border-right: 1px solid #ccc;
            cursor: pointer;
            transition: background-color 0.2s;
            height: 100%;

            &:hover {
                background-color: #eee;
            }

            &:active {
                background-color: #ddd;
            }
        }

        input {
            flex: 1;
            padding: 8px 12px;
            border: none;
            outline: none;
            font-size: 14px;

            &::placeholder {
                color: #aaa;
            }
        }
    }
}
</style>
