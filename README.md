# Vue Tel Num Input

A fully customizable **phone number input** for Vue 3 with country selection, flags, masking, and localization. Built for flexibility and great DX.

## Features

- Country selector with searchable dropdown
- Multiple flag strategies: emoji / sprite / CDN / custom
- Masking (libphonenumber-js `AsYouType` or a custom mask)
- Localized placeholders (per-locale strings)
- Global (`+1 234…`) vs national (`(234) …`) formatting
- Slots for full UI customization (button, input, list items, search)
- TypeScript-first API (exports useful types)
- Performant lists (optional virtual scroll)
- Opt-in default styles, easy to replace

## Install

```bash
npm i vue-tel-num-input
# or
pnpm add vue-tel-num-input
# or
yarn add vue-tel-num-input
```

Minimal styles (recommended):

```ts
// main.ts
import "vue-tel-num-input/css";
```

## Quick Start

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

## Why this component?

- **Flexible by default**: sensible defaults, but every piece is swappable.
- **Composable**: bring your data sources, flags, and masks.
- **DX > ceremony**: clear props, typed model, documented slots & events.
- **Performance-aware**: lazy assets, optional virtualization.

## Props

| Prop                  | Type                                     | Default                | Description                                                 |
| --------------------- | ---------------------------------------- | ---------------------- | ----------------------------------------------------------- |
| `size`                | `"sm" \| "md" \| "lg" \| "xl" \| "xxl"`  | `"lg"`                 | Component sizing (affects row/item heights via CSS vars).   |
| `disableSizing`       | `boolean`                                | `false`                | Turn off built-in sizing classes.                           |
| `countryCodes`        | `string[]`                               | `[]`                   | Allowlist of ISO2 codes to show.                            |
| `excludeCountryCodes` | `string[]`                               | `[]`                   | Blocklist of ISO2 codes to hide.                            |
| `defaultCountryCode`  | `string`                                 | `"US"`                 | Initial country ISO2.                                       |
| `initialValue`        | `string`                                 | `""`                   | Initial input value.                                        |
| `international`       | `boolean`                                | `true`                 | Format as international (`+XX`) if true, national if false. |
| `placeholder`         | `string \| Record<string,string>`        | `"Enter phone number"` | Static placeholder or locale map.                           |
| `locale`              | `string`                                 | `-`                    | Key to pick from `placeholder` object.                      |
| `disabled`            | `boolean`                                | `false`                | Disable input.                                              |
| `flagSource`\*        | `"emoji" \| "sprite" \| "cdn" \| "none"` | `"emoji"`              | Flag rendering strategy (see below).                        |
| `displayName`         | `"english" \| "native"`                  | `"english"`            | Country name to display.                                    |
| `itemHeight`          | `number`                                 | by `size`              | Row height override (px).                                   |
| `autoDetectCountry`   | `boolean`                                | `false`                | Detect user country on mount (best effort).                 |
| `input`               | `object`                                 | see below              | Input behavior flags.                                       |
| `search`              | `object`                                 | see below              | Search box behavior flags.                                  |
| `prefix`              | `object`                                 | see below              | Country button visibility toggles.                          |
| `list`                | `object`                                 | see below              | Dropdown behavior/visibility.                               |

**Nested option defaults**

```ts
input: {
  clearOnCountrySelect: true,
  focusAfterCountrySelect: true,
  formatterEnabled: true,
  maxLength: undefined,     // optional cap
}

search: {
  hidden: false,
  placeholder: undefined,   // string | Record<string,string>
  locale: undefined,        // pick key from placeholder map
  clearOnSelect: true,
  autoFocus: true,
}

prefix: {
  hidden: false,
  hideCode: false,
  hideFlag: false,
  hideChevron: false,
  hideCountryName: false,
}

list: {
  hidden: false,
  hideCode: false,
  hideFlag: false,
  hideCountryName: false,
  returnToSelected: true,
  itemsPerView: 5,
}
```

> _Flag strategy notes_
>
> - `emoji`: lightweight, zero-network, varies by OS font rendering.
> - `sprite`: best for consistent visuals offline; bundle your sprite.
> - `cdn`: smallest package size; requires network & CORS-safe CDN.
> - `none`: bring your own via slots.

## v-model

The component supports `v-model`:

- `v-model="string"` → binds the **raw input value** (`model.value` internally).
- You can also listen to updates and maintain your own composite model via events.

## Events

| Event               | Payload         | When                                    |
| ------------------- | --------------- | --------------------------------------- |
| `update:modelValue` | `TelInputModel` | After formatting/typing/country change. |
| `toggle`            | `boolean`       | Dropdown open/close toggled.            |
| `focus`             | `void`          | Input focused.                          |
| `blur`              | `void`          | Input blurred.                          |

## Slots

| Slot name            | Purpose                                      |
| -------------------- | -------------------------------------------- |
| `prefix:before`      | Before everything inside the country button. |
| `prefix:flag`        | Custom flag in the button.                   |
| `prefix:code`        | Custom code text (`+421`).                   |
| `prefix:countryName` | Custom country label.                        |
| `prefix:chevron`     | Chevron / indicator icon.                    |
| `prefix:after`       | After everything inside the button.          |
| `input`              | Replace the `<input>` entirely.              |
| `body:search`        | Replace the whole search container.          |
| `search:icon`        | Magnifier icon in search.                    |
| `search:input`       | Replace search `<input>`.                    |
| `item:before`        | Before each list row.                        |
| `item:flag`          | Flag in list rows.                           |
| `item:code`          | Code in list rows.                           |
| `item:countryName`   | Country name in list rows.                   |
| `item:after`         | After each list row.                         |

## 📤 Exposed Methods & Refs (`defineExpose`)

The component exposes an API that can be accessed via `ref`.
This allows you to programmatically control the dropdown, formatting, and access internal refs.

### Type

```ts
export type VueTelNumInputExpose = {
  /** Open/close the country dropdown programmatically */
  switchDropdown: (value?: boolean) => void;

  /** Select a specific country programmatically */
  selectItem: (data: CountryConfig) => void;

  /** Force re-formatting of the current phone number value */
  formatNow: () => void;

  /** References to DOM elements */
  inputEl: HTMLInputElement | null;
  searchEl: HTMLInputElement | null;
  telNumInputEl: HTMLElement | null;

  /** Current user country (if auto-detection is enabled) */
  country: string | null;

  /** Trigger user country detection manually */
  requestUserCountry: () => Promise<string | null>;
};
```

### Example Usage

```vue
<script setup lang="ts">
import { ref, onMounted } from "vue";
import VueTelNumInput from "vue-tel-num-input";
import type { VueTelNumInputExpose } from "vue-tel-num-input";

const telRef = ref<VueTelNumInputExpose | null>(null);

onMounted(() => {
  // Open dropdown programmatically
  telRef.value?.switchDropdown(true);

  // Format the current phone number immediately
  telRef.value?.formatNow();
});

const detectCountry = async () => {
  const iso = await telRef.value?.requestUserCountry();
  console.log("Detected country:", iso);
};
</script>

<template>
  <VueTelNumInput ref="telRef" />
  <button @click="detectCountry">Detect country</button>
</template>
```

## Examples

### Control visible countries

```vue
<VueTelNumInput
  v-model="phone"
  :country-codes="['US', 'CA', 'GB', 'SK', 'PL']"
/>
```

### Use native names and CDN flags

```vue
<VueTelNumInput v-model="phone" display-name="native" :flag-source="'cdn'" />
```

### Custom button (slots)

```vue
<VueTelNumInput v-model="phone">
  <template #prefix:flag>
    <!-- Your SVG or component -->
    <MyFlag :iso="model.iso" />
  </template>

  <template #prefix:code>
    <span class="code">Dial {{ model.code }}</span>
  </template>
</VueTelNumInput>
```

### Localized placeholder

```vue
<VueTelNumInput
  v-model="phone"
  :placeholder="{ en: 'Phone number', sk: 'Telefónne číslo' }"
  locale="sk"
/>
```

### Input masking via libphonenumber-js

```ts
// prop input.formatterEnabled=true enables AsYouType internally
```

OR bring your own mask by replacing the `input` slot and binding back to `v-model`.

## Types

The library exports useful types:

```ts
import type {
  TelInputModel,
  CountryConfig,
  FlagConfig,
} from "vue-tel-num-input";

// Example TelInputModel shape:
type TelInputModel = {
  iso: string; // ISO2
  name: string; // country label (native/english)
  code: string; // '+421'
  value: string; // input value
  search: string; // dropdown search query
  expanded: boolean;
};
```

> If you’re building wrappers, re-export these types from your package so users don’t need to reach inside your internals.

## CSS Variables

| Var                                    | Default                   | Notes                                                 |
| -------------------------------------- | ------------------------- | ----------------------------------------------------- |
| `--tel-input-height`                   | `40px`                    | Overall control height                                |
| `--tel-input-border-radius`            | `6px`                     | Corner radius for head & dropdown                     |
| `--tel-input-font-size`                | `14px`                    | Base font size for component                          |
| `--tel-input-padding-x`                | `12px`                    | Horizontal padding for the input                      |
| `--tel-input-icon-size`                | `12px`                    | Size for chevrons/search/flag placeholders            |
| `--tel-scrollbar-width`                | `6px`                     | Dropdown scrollbar width                              |
| `--tel-scrollbar-thumb`                | `#bbb`                    | Dropdown scrollbar thumb color                        |
| `--tel-scrollbar-track`                | `#f9f9f9`                 | Dropdown scrollbar track color                        |
| `--tel-scrollbar-radius`               | `12px`                    | Dropdown scrollbar thumb radius                       |
| `--tel-input-prefix-padding-x`         | `12px`                    | Horizontal padding inside the country button          |
| `--tel-input-prefix-gap`               | `8px`                     | Gap between flag/code/name in the button & list items |
| `--tel-input-chevron-transition-func`  | `ease`                    | Timing function for chevron rotation                  |
| `--tel-input-transition-duration`      | `0.3s`                    | Shared transition duration                            |
| `--tel-input-chevron-transition-delay` | `0s`                      | Delay for chevron transition                          |
| `--tel-input-chevron-transition-prop`  | `transform`               | Transitioned property for chevron                     |
| `--tel-input-input-width`              | `200px`                   | Width of the text input                               |
| `--tel-input-input-bg`                 | `#fff`                    | Input background                                      |
| `--tel-input-input-color`              | `#333`                    | Input text color                                      |
| `--tel-input-body-border`              | `1px solid #ccc`          | Border around the dropdown panel                      |
| `--tel-input-body-bg`                  | `#f9f9f9`                 | Dropdown background                                   |
| `--tel-input-search-outline`           | `none`                    | Outline for the search input                          |
| `--tel-input-search-border`            | `none`                    | Border for the search input                           |
| `--tel-input-search-icon-color`        | `#333`                    | Color of the search icon                              |
| `--tel-input-search-icon-margin-x`     | `12px`                    | (Preferred) Left margin of search icon                |
| `--tel-input-search-icon-margin-x`     | `12px`                    | (Current code uses this – likely a typo)              |
| `--tel-item-padding-x`                 | `12px`                    | Horizontal padding for each country row               |
| `--tel-input-body-item-border`         | `1px solid #eee`          | Divider between country rows                          |
| `--tel-input-body-item-bg`             | `#fff`                    | Country row background                                |
| `--tel-input-body-item-color`          | `#333`                    | Country row text color                                |
| `--tel-input-transition-func`          | `ease`                    | Shared transition timing function                     |
| `--tel-input-transition-delay`         | `0s`                      | Shared transition delay                               |
| `--tel-input-transition-prop`          | `background-color, color` | Shared transitioned properties                        |
| `--tel-input-body-item-hover-bg`       | `#eee`                    | Hover background for country rows                     |
| `--tel-input-body-item-hover-color`    | `#333`                    | Hover text color for country rows                     |
| `--tel-input-body-item-hover-cursor`   | `pointer`                 | Cursor on hover for country rows                      |
| `--tel-input-body-item-selected-bg`    | `#ddd`                    | Selected row background                               |
| `--tel-input-body-item-selected-color` | `#333`                    | Selected row text color                               |

You can also disable built-in sizing with `disableSizing` and style from scratch.

## Roadmap

- Dropdown with complete slot coverage ✅
- Multiple flag strategies ✅
- Global vs national formatting toggle ✅
- Search UX polish (clear icon, keyboard nav) ⏳
- Fully documented events & accessibility pass ⏳

Contributions welcome—see below.

## Accessibility

- Keyboard navigation in dropdown (planned)
- ARIA attributes on toggle and list (planned)
- Focus management on open/close (partial; improvements planned)

> If accessibility is critical in your project, review current behavior and consider contributing improvements—happy to collaborate.

## Contributing

1. Fork & branch
2. `npm i`
3. `pnpm dev` to run playground
4. Add tests/docs where relevant
5. Open a PR with a clear description + screenshots/gifs for UI changes

Bug reports and feature requests → GitHub Issues.

## License

MIT © 2025 Mark Minerov

## Appendix: Advanced Usage

### Full control over list items

```vue
<VueTelNumInput v-model="phone">
  <template #item:countryName="{ data }">
    <div class="item-name">
      {{ data.nativeName }} <small>({{ data.name }})</small>
    </div>
  </template>
  <template #item:code="{ data }">
    <span class="item-code">+{{ data.callingCode }}</span>
  </template>
</VueTelNumInput>
```

### National vs international

```vue
<!-- international (E.164-like) -->
<VueTelNumInput v-model="phone" :international="true" />

<!-- national -->
<VueTelNumInput v-model="phone" :international="false" />
```

### Programmatic dropdown control

Listen to `toggle` and maintain your own UI state if needed.

```vue
<VueTelNumInput v-model="phone" @toggle="(open) => (isOpen = open)" />
```

### Notes & Caveats

- CDN flags require a CORS-safe provider; otherwise use `emoji` or `sprite`.
- `autoDetectCountry` is best-effort; always set `defaultCountryCode` as fallback.
- When `formatterEnabled` is `true`, manual cursor jumps can occur with some masks—test your locales and adjust strategy if needed.
