# 📞 Vue Tel Num Input

A fully customizable and flexible **phone number input component** for Vue 3.  
It provides a polished user experience with country code selection, flags, masking, localization, and more.

---

## ✨ Vision

The goal is to build a **developer-friendly, highly configurable** phone input field.  
The component should cover the most common use cases while allowing full customization through props, slots, and configuration.

---

## 🚧 Development Flow

1. **Basic structure**

    - Button with country code + flag
    - Input field for phone number

2. **Dropdown for country codes**
    - User can choose a country code
    - Developer can control which countries to show

---

## 🔑 Features (planned & in progress)

-   **Country code dropdown**

    -   Pass a custom slot for rendering items
    -   Limit available countries via props
    -   Choose how to load flag icons:
        -   CDN (e.g., flagcdn)
        -   Local assets / sprite
        -   Emojis
    -   Optional: virtual scroll for large country lists

-   **Country selector button**

    -   Slot support for full customization
    -   Custom text/code rendering
    -   Custom flag rendering
    -   Chevron / dropdown indicator

-   **Phone number input**
    -   Slot for custom input
    -   Placeholder customization + localization support
    -   Masking (optional)
    -   Switch between local/national code vs global format
    -   Option to disable default styles (style from scratch)

---

## 🎯 Goals

-   **Flexibility:** provide sensible defaults, but allow replacing any part (button, input, dropdown) with your own implementation.
-   **Customization:** choose your own data sources, icons, masks, and styles.
-   **Developer Experience:** clean API, TypeScript support, documented props & slots.
-   **Performance:** lazy-loading assets (flags, sprites, CDN images), optional virtualization for dropdown.

---

## 🛠 Installation

```bash
npm install vue-tel-num-input
```

## 🚀 Usage (basic)

```vue
<script setup lang="ts">
import { ref } from "vue";
import VueTelNumInput from "vue-tel-num-input";
import "vue-tel-num-input/css";

const phone = ref("");
</script>

<template>
    <VueTelNumInput v-model="phone" default-country-code="US" />
</template>
```

## ⚙️ Props (planned)

| Prop                  | Type                                     | Default                | Description                                   |
| --------------------- | ---------------------------------------- | ---------------------- | --------------------------------------------- |
| `size`                | `"sm" \| "md" \| "lg" \| "xl"`           | `"lg"`                 | Control sizing (uses CSS variables)           |
| `disableSizing`       | `boolean`                                | `false`                | Disable built-in sizing system                |
| `countryCodes`        | `string[]`                               | `[]`                   | Only show specific countries                  |
| `excludeCountryCodes` | `string[]`                               | `[]`                   | Exclude specific countries                    |
| `defaultCountryCode`  | `string`                                 | `"US"`                 | ISO2 default country                          |
| `placeholder`         | `string \| Record<string,string>`        | `"Enter phone number"` | Custom placeholder or localization dictionary |
| `locale`              | `string`                                 | `-`                    | Used if placeholder is an object              |
| `disabled`            | `boolean`                                | `false`                | Disable input                                 |
| `flagSource`          | `"emoji" \| "sprite" \| "cdn" \| "none"` | `"emoji"`              | Source of flag icons                          |

## 📌 Roadmap / TODO

-   [ ] Implement dropdown with slots
-   [ ] Implement multiple flag strategies (emoji, sprite, CDN, custom resolver)
-   [ ] Add virtual scroll for large country lists

-   [ ] Expose slots for button, input, dropdown

-   [ ] Add phone number masking (via maska or libphonenumber-js AsYouType)

-   [ ] Add localization support for placeholders

-   [ ] Add prop to toggle global vs local phone number format

-   [ ] Add option to completely disable default styles

## 🤝 Contributing

Contributions, feature requests, and feedback are welcome!
Please open an issue or submit a PR.

## 📜 License

MIT
© 2025 Mark Minerov
