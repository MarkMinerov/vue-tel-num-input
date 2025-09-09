# 🧩 Slots

`<VueTelNumInput>` exposes slots to customize the prefix button, the input, the search bar, and list rows.

> Important:
>
> - **All slots are plain slots (not scoped)** in the current implementation.
> - Use your app state (e.g., `v-model` object) or global CSS if you need data inside slots.
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

List rows (`item:*`)

| Slot name          | Purpose                      | Notes      |
| ------------------ | ---------------------------- | ---------- |
| `item:before`      | Content before row contents  | Plain slot |
| `item:flag`        | Replace the row flag         | Plain slot |
| `item:code`        | Replace the row dialing code | Plain slot |
| `item:countryName` | Replace the row country name | Plain slot |
| `item:after`       | Content after row contents   | Plain slot |

Example (simple embellishments):

```vue
<VueTelNumInput v-model="model">
  <template #item:before>
    <span>•</span>
  </template>

    <template #item:flag>
        <!-- You don't have row data here; keep visuals generic or use CSS -->
        <span class="flag-placeholder" />
    </template>

    <template #item:code>
        <span class="muted">(code)</span>
    </template>
</VueTelNumInput>
```

> Note: The current version does not provide per-row scoped data (like `data.iso`) to `item:*` slots. If you need fully custom row rendering with access to each row’s `iso/code/name`, consider opening a feature request for scoped item slots.

## Tips & Caveats

- If you hide the dropdown via `list.hidden = true`, `prefix:chevron` won’t render (as in the component).
- When replacing the internal `<input>` or search `<input>`:
  - Update `model.value` / `model.search` yourself.
  - Forward `@focus` / `@blur` if you rely on those events.
  - Respect `input.maxLength`, `input.required`, etc., if your UI should mimic defaults.
- For purely visual tweaks, prefer CSS (via component CSS variables) over slots to avoid re-implementing behavior.
