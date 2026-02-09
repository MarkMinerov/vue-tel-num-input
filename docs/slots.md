# 🧩 Slots

`<VueTelNumInput>` exposes slots to customize the prefix button, the input, the search bar, and list rows.

> Important:
>
> - Prefix, input and search slots are **plain slots**.
> - List item slots (`item:*`) are **scoped slots** and expose row data (see section below).
> - You can still use your app state (e.g., `v-model` object) or global CSS if you need additional data inside slots.
> - If you replace the internal `<input>` or search `<input>`, **you must keep the model and events in sync**.

---

## Prefix button (`prefix:*`)

These slots render inside the **prefix button** (country selector trigger) at the left of the input.

| Slot name            | Purpose                                 | Notes                                                   |
| -------------------- | --------------------------------------- | ------------------------------------------------------- |
| `prefix:before`      | Content before everything in the button | Plain slot                                              |
| `prefix:flag`        | Custom flag element                     | Plain slot                                              |
| `prefix:code`        | Custom dialing code text (`+421`)       | Plain slot                                              |
| `prefix:countryName` | Custom country label                    | Plain slot                                              |
| `prefix:chevron`     | Custom chevron / indicator              | Plain slot; **not rendered** if `list.hidden` is `true` |
| `prefix:after`       | Content after everything in the button  | Plain slot                                              |

Example:

```vue
<VueTelNumInput v-model="model">
  <template #prefix:flag>
    <img :src="`/flags/${model.iso}.svg`" alt="" width="16" height="12" />
  </template>

  <template #prefix:code>
    <span class="muted">{{ model.code }}</span>
  </template>

  <template #prefix:chevron>
    <svg width="12" height="12" viewBox="0 0 16 16"><path d="..." /></svg>
  </template>
</VueTelNumInput>
```

## Input (`input`)

Replace the entire input field.

| Slot name | Purpose                        | Notes                                                                           |
| --------- | ------------------------------ | ------------------------------------------------------------------------------- |
| `input`   | Replace the internal `<input>` | You must: (1) sync `v-model` yourself, (2) forward `focus` and `blur` if needed |

Minimal example (manual sync):

```vue
<VueTelNumInput v-model="model">
  <template #input>
    <input
      :value="model.value"
      @input="e => model.value = { ...model.value, value: (e.target as HTMLInputElement).value }"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
      :placeholder="`Number for ${model.name} (${model.code})`"
    />
  </template>
</VueTelNumInput>
```

## Search area

You can replace the whole search row or just parts of it.

| Slot name       | Purpose                                 | Notes                                                |
| --------------- | --------------------------------------- | ---------------------------------------------------- |
| `body:search`   | Replace the entire search container row | Wraps icon + input + before/after; plain slot        |
| `search:before` | Content before the search icon/input    | Plain slot                                           |
| `search:icon`   | Replace the search icon                 | Plain slot                                           |
| `search:input`  | Replace the search `<input>`            | Plain slot; you must bind to `model.search` yourself |
| `search:after`  | Content after the search input          | Plain slot                                           |

Example (custom icon + input):

```vue
<VueTelNumInput v-model="model">
  <template #search:icon>
    <span style="margin-left:12px">🔎</span>
  </template>

  <template #search:input>
    <input
      v-model="model.search"
      placeholder="Type a country or code…"
    />
  </template>
</VueTelNumInput>
```

Full override:

```vue
<VueTelNumInput v-model="model">
  <template #body:search>
    <div class="my-search">
      <input v-model="model.search" placeholder="Find country…" />
      <button @click="model.search = ''">Clear</button>
    </div>
  </template>
</VueTelNumInput>
```

## List rows (`item:*`)

All `item:*` slots are **scoped slots**. They receive row data so you can fully control how each country is rendered.

Depending on the specific slot, you get some of the following props:

- `data` – raw country object
- `index` – row index in the filtered list
- `iso` – country ISO code (e.g. `US`)
- `countryName` – display name for the country
- `countryCode` – dialing code with `+` (e.g. `+421`)
- `selected` – `true` if the row is currently selected

| Slot name          | Purpose                      | Notes                 |
| ------------------ | ---------------------------- | --------------------- |
| `item:before`      | Content before row contents  | Scoped slot with data |
| `item:flag`        | Replace the row flag         | Scoped slot with data |
| `item:code`        | Replace the row dialing code | Scoped slot with data |
| `item:countryName` | Replace the row country name | Scoped slot with data |
| `item:after`       | Content after row contents   | Scoped slot with data |

Example (simple embellishments with row data):

```vue
<VueTelNumInput v-model="model">
  <template #item:before="{ selected }">
    <span v-if="selected">✔</span>
    <span v-else>•</span>
  </template>

  <template #item:flag="{ iso }">
    <img :src="`/flags/${iso}.svg`" alt="" width="16" height="12" />
  </template>

  <template #item:code="{ countryCode }">
    <span class="muted">{{ countryCode }}</span>
  </template>
</VueTelNumInput>
```

> Note: Only `item:*` slots are scoped and receive per-row data; prefix, input and search-related slots remain plain slots.

## Tips & Caveats

- If you hide the dropdown via `list.hidden = true`, `prefix:chevron` won’t render (as in the component).
- When replacing the internal `<input>` or search `<input>`:
  - Update `model.value` / `model.search` yourself.
  - Forward `@focus` / `@blur` if you rely on those events.
  - Respect `input.maxLength`, `input.required`, etc., if your UI should mimic defaults.
- For purely visual tweaks, prefer CSS (via component CSS variables) over slots to avoid re-implementing behavior.
