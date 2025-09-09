# 🔧 Props

`<VueTelNumInput>` accepts a large set of props to control behavior, appearance, and data sources.
All props are optional — sensible defaults are provided.

## Quick reference

| Prop                  | Type                              | Default                | Notes                                                |
| --------------------- | --------------------------------- | ---------------------- | ---------------------------------------------------- |
| `v-model`             | `TelInputModel`                   | —                      | Typed object (value, iso, code, name, valid, etc.).  |
| `defaultCountryCode`  | `string`                          | `"US"`                 | Initial ISO2. Keep as fallback even with autodetect. |
| `international`       | `boolean`                         | `true`                 | `true` → `+421 …`, `false` → national `(0xx) …`.     |
| `displayName`         | `"english" \| "native"`           | `"english"`            | Country label language.                              |
| `countryCodes`        | `string[]`                        | `[]`                   | Allowlist of ISO2 codes.                             |
| `excludeCountryCodes` | `string[]`                        | `[]`                   | Blocklist of ISO2 codes.                             |
| `placeholder`         | `string \| Record<string,string>` | `"Enter phone number"` | Per-locale placeholders supported.                   |

---

## Core

| Prop            | Type                                    | Default                | Description                                           |
| --------------- | --------------------------------------- | ---------------------- | ----------------------------------------------------- |
| `size`          | `"sm" \| "md" \| "lg" \| "xl" \| "xxl"` | `"lg"`                 | Preset sizing. Affects row height, paddings.          |
| `disableSizing` | `boolean`                               | `false`                | Turns off built-in size classes (style from scratch). |
| `itemHeight`    | `number`                                | _derived_              | Row height in px; if unset, derives from `size`.      |
| `disabled`      | `boolean`                               | `false`                | Disables the text input.                              |
| `silent`        | `boolean`                               | `false`                | Suppresses internal warnings.                         |
| `animationName` | `string`                                | `"fade"`               | `<Transition :name>` used for the dropdown.           |
| `initialValue`  | `string`                                | `""`                   | Initial raw input; useful for controlled hydration.   |
| `international` | `boolean`                               | `true`                 | Format as international (`+XX …`) vs national.        |
| `displayName`   | `"native" \| "english"`                 | `"english"`            | Country label locale.                                 |
| `placeholder`   | `string \| Record<string,string>`       | `"Enter phone number"` | Input placeholder, single string or locale map.       |
| `locale`        | `string`                                | `undefined`            | Locale key when `placeholder` is an object.           |

---

## Countries

| Prop                  | Type       | Default | Description                                                     |
| --------------------- | ---------- | ------- | --------------------------------------------------------------- |
| `countryCodes`        | `string[]` | `[]`    | Allowlist of ISO2 codes to show.                                |
| `excludeCountryCodes` | `string[]` | `[]`    | Blocklist of ISO2 codes to hide.                                |
| `defaultCountryCode`  | `string`   | `"US"`  | Initial ISO2.                                                   |
| `autoDetectCountry`   | `boolean`  | `false` | Best-effort detection on mount; still set `defaultCountryCode`. |

---

## Flags

| Prop   | Type         | Default | Description                                                                                                                                                               |
| ------ | ------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `flag` | `FlagConfig` | `{}`    | Configure flag rendering strategy. Common fields: `strategy: 'emoji' \| 'sprite' \| 'cdn'`, plus source options (e.g. `baseUrl` for CDN). See exported `FlagConfig` type. |

Notes:

- `emoji`: zero network, OS-dependent rendering.
- `sprite`: consistent offline visuals; bundle your sprite.
- `cdn`: tiny package, requires CORS-safe CDN.

---

## Input options (`input`)

`input` is a nested object. Unspecified keys fall back to defaults below.

| Key                       | Type                  | Default     | Description                                               |
| ------------------------- | --------------------- | ----------- | --------------------------------------------------------- |
| `required`                | `boolean`             | `false`     | Adds HTML `required`. Also drives `model.valid` on empty. |
| `clearOnCountrySelect`    | `boolean`             | `true`      | Clears input when user selects a different country.       |
| `focusAfterCountrySelect` | `boolean`             | `true`      | Focuses the text input after selection.                   |
| `lockCountryCode`         | `boolean`             | `false`     | Prevents user from deleting/altering the prefix code.     |
| `formatterEnabled`        | `boolean`             | `true`      | Enables `AsYouType` masking via `libphonenumber-js`.      |
| `maxLength`               | `number \| undefined` | `undefined` | Optional character cap.                                   |

Example:

```vue
<VueTelNumInput
  :input="{ required: true, lockCountryCode: true, maxLength: 18 }"
/>
```

## Search options (`search`)

| Key             | Type                              | Default     | Description                                 |
| --------------- | --------------------------------- | ----------- | ------------------------------------------- |
| `hidden`        | `boolean`                         | `false`     | Hides the search bar.                       |
| `placeholder`   | `string \| Record<string,string>` | `undefined` | Placeholder for search (supports locales).  |
| `locale`        | `string`                          | `undefined` | Locale key when `placeholder` is an object. |
| `clearOnSelect` | `boolean`                         | `true`      | Clears query after selecting a country.     |
| `autoFocus`     | `boolean`                         | `true`      | Focus the search input when dropdown opens. |

## Prefix button (`prefix`)

| Key               | Type      | Default | Description                          |
| ----------------- | --------- | ------- | ------------------------------------ |
| `hidden`          | `boolean` | `false` | Hide the entire prefix button.       |
| `hideCode`        | `boolean` | `false` | Hide dialing code within the button. |
| `hideFlag`        | `boolean` | `false` | Hide flag within the button.         |
| `hideChevron`     | `boolean` | `false` | Hide chevron icon.                   |
| `hideCountryName` | `boolean` | `false` | Hide country name label.             |

## List / dropdown (`list`)

| Key                | Type      | Default | Description                                                             |
| ------------------ | --------- | ------- | ----------------------------------------------------------------------- |
| `hidden`           | `boolean` | `false` | Hide the dropdown entirely.                                             |
| `hideCode`         | `boolean` | `false` | Hide dialing code in rows.                                              |
| `hideFlag`         | `boolean` | `false` | Hide flags in rows.                                                     |
| `hideCountryName`  | `boolean` | `false` | Hide country names in rows.                                             |
| `itemsPerView`     | `number`  | `5`     | Max visible rows before scroll (derived from `DEFAULT_ITEMS_PER_VIEW`). |
| `returnToSelected` | `boolean` | `true`  | Scroll back to currently selected country when reopening.               |

## Notes / caveats

- Always set `defaultCountryCode` even with `autoDetectCountry`; detection is best-effort.
- When `input.required` is `true`, empty value sets `model.valid = false`.
- If you replace internal inputs via `slots`, keep `v-model` in sync (update `model.value` yourself).
- `itemHeight` should match your visual density; otherwise use size presets.
