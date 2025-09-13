# 🎯 Events

`<VueTelNumInput>` emits events for integration with forms, validation, and custom UI logic.

## List of Events

| Event               | Payload         | When it fires                                                                   |
| ------------------- | --------------- | ------------------------------------------------------------------------------- |
| `update:modelValue` | `TelInputModel` | On every input change, formatting update, or when the selected country changes. |
| `toggle`            | `boolean`       | Whenever the country list (dropdown) is opened (`true`) or closed (`false`).    |
| `focus`             | `void`          | When the text input receives focus.                                             |
| `blur`              | `void`          | When the text input loses focus.                                                |

## Details

### `update:modelValue`

- Emitted continuously while user types or selects a new country.
- Always passes the **full model object**, not just the string.
- Includes:
  - `iso`: selected country ISO2 (e.g. `"US"`)
  - `name`: country name (native/english depending on `displayName`)
  - `code`: dialing code (e.g. `+1`)
  - `value`: raw input string
  - `search`: current search query
  - `expanded`: dropdown state
  - `valid`: whether number is considered valid

Example:

```vue
<VueTelNumInput v-model="model" @update:modelValue="onChange" />

<script setup lang="ts">
function onChange(val) {
  console.log("Current model:", val);
}
</script>
```

### `toggle`

- Fires when user opens or closes the country list.
- Payload: true (opened) / false (closed).

```vue
<VueTelNumInput @toggle="(open) => console.log('Dropdown:', open)" />
```

### `focus` / `blur`

- Mirror the native input’s focus and blur events.
- Useful for forms and validation triggers.

```vue
<VueTelNumInput
  @focus="() => console.log('Focused!')"
  @blur="() => console.log('Blurred!')"
/>
```

### Notes

- If you only need to **bind the value**, `v-model` is the idiomatic way. You rarely need to listen to `update:modelValue` manually.
- `focus` and `blur` are forwarded from the internal `<input>`. If you override the `#input` slot, you’re responsible for emitting them yourself.
- `toggle` is helpful for analytics (track user interactions) or programmatic dropdown sync with other UI elements.
