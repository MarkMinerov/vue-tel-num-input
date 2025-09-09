# 🚀 Getting Started

Welcome to **Vue Tel Num Input** — a fully customizable Vue 3 component for phone number input with country selection, flags, masks, and localization.

## 📦 Installation

First, install the component and its peer dependency:

```bash
npm i libphonenumber-js vue-tel-num-input
```

> ℹ️ Uses libphonenumber-js under the hood for formatting and validation.

Then import component and minimal styles in your `.vue` file:

```ts
import VueTelNumInput from "vue-tel-num-input";
import "vue-tel-num-input/css";
```

## ⚡ Quick Start

```vue
<script setup lang="ts">
import { ref } from "vue";
import VueTelNumInput from "vue-tel-num-input";

const phone = ref("");
</script>

<template>
  <VueTelNumInput v-model="phone" default-country-code="US" />
</template>
```

That’s it 🎉 You now have a fully functional phone number input.

## 🧾 Why Vue Tel Num Input?

- **Flexible by default** – good defaults, full customization when needed
- **Composability** – bring your own flags, masks, and data sources
- **DX-first** – clean props, typed model, documented events & slots
- **Performance-aware** – lazy assets, optional virtual scroll

## 🔗 Next Steps

- [**Examples**](/examples) – usage examples
- [**Props**](/props) – full list of props and options
- [**Events**](/events) – emitted events and usage
- [**Slots**](/slots) – customize every part of the UI
