# ⭐ Examples

All examples assume Vue 3 + `<script setup>` and that you’ve installed:

```ts
import "vue-tel-num-input/css";
import "vue-tel-num-input/flags.css";
```

v-model returns a typed object (TelInputModel), not a plain string.
Initialize with {} (component will populate it).

1. **Minimal usage**

```vue
<template>
  <VueTelNumInput v-model="model" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VueTelNumInput, { type TelInputInitModel } from "vue-tel-num-input";

const model = ref<TelInputInitModel>({});
</script>
```

> Why: You get both the phone value and UI metadata (iso, code, name, etc.).
> Anti-pattern: Binding `string` directly — you lose metadata and internal state.

2. **Set default country + international format**

```vue
<template>
  <VueTelNumInput
    v-model="model"
    default-country-code="US"
    :international="true"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VueTelNumInput, { type TelInputInitModel } from "vue-tel-num-input";
const model = ref<TelInputInitModel>({});
</script>
```

3. **National format (no leading +XX)**

```vue
<template>
  <VueTelNumInput
    v-model="model"
    :international="false"
    default-country-code="GB"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VueTelNumInput, { type TelInputInitModel } from "vue-tel-num-input";
const model = ref<TelInputInitModel>({});
</script>
```

4. **Restrict visible countries**

```vue
<template>
  <VueTelNumInput
    v-model="model"
    :country-codes="['US', 'CA', 'GB', 'SK', 'PL']"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VueTelNumInput, { type TelInputInitModel } from "vue-tel-num-input";
const model = ref<TelInputInitModel>({});
</script>
```

Prefer allowlist (`country-codes`) for clarity.
Alternative: `exclude-country-codes` to hide a few.

5. **Native country names + CDN flags**

```vue
<template>
  <VueTelNumInput
    v-model="model"
    display-name="native"
    :flag="{ strategy: 'cdn', baseUrl: 'https://your-cdn.example/flags' }"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VueTelNumInput, { type TelInputInitModel } from "vue-tel-num-input";
const model = ref<TelInputInitModel>({});
</script>
```

Notes:

- CDN must be CORS-safe; otherwise use `emoji` or bundled `sprite`.

6. **Placeholders by locale**

```vue
<template>
  <VueTelNumInput
    v-model="model"
    :placeholder="{ en: 'Phone number', sk: 'Telefónne číslo' }"
    locale="sk"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VueTelNumInput, { type TelInputInitModel } from "vue-tel-num-input";
const model = ref<TelInputInitModel>({});
</script>
```

7. **Search UI localization**

```vue
<template>
  <VueTelNumInput
    v-model="model"
    :search="{ placeholder: { en: 'Search…', sk: 'Hľadať…' }, locale: 'sk' }"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VueTelNumInput, { type TelInputInitModel } from "vue-tel-num-input";
const model = ref<TelInputInitModel>({});
</script>
```

8. **Input behavior: clear/focus/lock/maxlength**

```vue
<template>
  <VueTelNumInput
    v-model="model"
    :input="{
      clearOnCountrySelect: true,
      focusAfterCountrySelect: true,
      lockCountryCode: true,
      formatterEnabled: true,
      maxLength: 18,
    }"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VueTelNumInput, { type TelInputInitModel } from "vue-tel-num-input";
const model = ref<TelInputInitModel>({});
</script>
```

> Caveat: `formatterEnabled` uses libphonenumber’s `AsYouType`.

9. **Programmatic control via ref**

```vue
<template>
  <VueTelNumInput ref="telRef" v-model="model" />
  <div class="mt-2">
    <button @click="open">Open dropdown</button>
    <button @click="format">Format now</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import VueTelNumInput, {
  type TelInputInitModel,
  type VueTelNumInputExpose,
} from "vue-tel-num-input";

const model = ref<TelInputInitModel>({});
const telRef = ref<VueTelNumInputExpose | null>(null);

const open = () => telRef.value?.switchDropdown(true);
const format = () => telRef.value?.formatNow();
</script>
```

10. **Auto-detect user country (best effort)**

```vue
<template>
  <VueTelNumInput
    v-model="model"
    :auto-detect-country="true"
    default-country-code="US"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VueTelNumInput, { type TelInputInitModel } from "vue-tel-num-input";
const model = ref<TelInputInitModel>({});
</script>
```

> Tip: Always keep default-country-code as a fallback.

11. **Validate field and show state**

```vue
<template>
  <div>
    <VueTelNumInput v-model="model" :input="{ required: true }" />
    <p :style="{ color: model.valid ? 'green' : 'crimson' }">
      {{ model.valid ? "Valid number" : "Invalid or empty" }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import VueTelNumInput, { type TelInputInitModel } from "vue-tel-num-input";

const model = ref<TelInputInitModel>({});

// Optional: react to every change
watch(
  model,
  (m) => {
    // m.value is the actual string; m.iso/m.code/m.name available
  },
  { deep: true }
);
</script>
```

12. **Customize prefix button via slots**

```vue
<template>
  <VueTelNumInput v-model="model">
    <template #prefix:flag>
      <img
        :src="`/my-flags/${model.iso}.svg`"
        alt=""
        style="width: 16px; height: 12px"
      />
    </template>

    <template #prefix:code>
      <span class="text-muted">Dial {{ model.code }}</span>
    </template>

    <template #prefix:chevron>
      <svg width="12" height="12" viewBox="0 0 16 16">
        <path d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647..." />
      </svg>
    </template>
  </VueTelNumInput>
</template>

<script setup lang="ts">
import { ref } from "vue";
import VueTelNumInput, { type TelInputInitModel } from "vue-tel-num-input";
const model = ref<TelInputInitModel>({});
</script>
```

13. **Replace the input entirely (bring your own mask)**

```vue
<template>
  <VueTelNumInput v-model="model">
    <template #input>
      <input
        :value="model.value"
        @input="onInput"
        :placeholder="`Number for ${model.name} (${model.code})`"
      />
    </template>
  </VueTelNumInput>
</template>

<script setup lang="ts">
import { ref } from "vue";
import VueTelNumInput, { type TelInputInitModel } from "vue-tel-num-input";

const model = ref<TelInputInitModel>({});

// Keep model in sync when replacing the input
function onInput(e: Event) {
  const v = (e.target as HTMLInputElement).value;
  model.value = { ...model.value, value: v };
}
</script>
```

14. **Custom search bar (icon/input slots)**

```vue
<template>
  <VueTelNumInput v-model="model" :search="{ autoFocus: true }">
    <template #search:icon>
      <span style="margin-left:12px">🔎</span>
    </template>

    <template #search:input>
      <input
        v-if="!searchHidden"
        v-model="model.search"
        placeholder="Type a country or code…"
      />
    </template>
  </VueTelNumInput>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import VueTelNumInput, { type TelInputInitModel } from "vue-tel-num-input";

const model = ref<TelInputInitModel>({});
const searchHidden = computed(() => false);
</script>
```

15. **Customize list rows (flag/code/name slots)**

```vue
<template>
  <VueTelNumInput v-model="model">
    <template #item:before>
      <span>•</span>
    </template>

    <template #item:code="{ model }">
      <span class="muted">{{ model.code }}</span>
    </template>

    <template #item:countryName="{ model }">
      <strong>{{ model.name }}</strong>
    </template>
  </VueTelNumInput>
</template>

<script setup lang="ts">
import { ref } from "vue";
import VueTelNumInput, { type TelInputInitModel } from "vue-tel-num-input";
const model = ref<TelInputInitModel>({});
</script>
```

> If your slot expects extra context (e.g. the row’s `data`), ensure your component forwards it; otherwise use `model` from `v-model` as shown.

16. **Control dropdown size**

```vue
<template>
  <VueTelNumInput
    v-model="model"
    :list="{ itemsPerView: 8 }"
    :item-height="48"
    size="xl"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VueTelNumInput, { type TelInputInitModel } from "vue-tel-num-input";
const model = ref<TelInputInitModel>({});
</script>
```

17. **Disable the list / prefix**

```vue
<template>
  <VueTelNumInput
    v-model="model"
    :list="{ hidden: true }"
    :prefix="{ hidden: true }"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VueTelNumInput, { type TelInputInitModel } from "vue-tel-num-input";
const model = ref<TelInputInitModel>({});
</script>
```

> Useful for embedding the input alone in custom forms/dialogs.

18. **Form example (required + submit guard)**

```vue
<template>
  <form @submit.prevent="submit">
    <VueTelNumInput v-model="model" :input="{ required: true }" />
    <button type="submit">Submit</button>
    <p v-if="error" style="color:crimson">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import VueTelNumInput, { type TelInputInitModel } from "vue-tel-num-input";

const model = ref<TelInputInitModel>({});
const error = ref("");

function submit() {
  if (!model.value.valid) {
    error.value = "Please enter a valid phone number.";
    return;
  }
  error.value = "";
  // send: model.value.value (string), plus metadata: iso/code/name
}
</script>
```

19. **Styling via CSS variables**

```vue
<template>
  <div
    style="
      --tel-input-height: 44px;
      --tel-input-border-radius: 10px;
      --tel-input-font-size: 15px;
      --tel-input-prefix-gap: 10px;
      --tel-input-input-width: 260px;
    "
  >
    <VueTelNumInput v-model="model" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import VueTelNumInput, { type TelInputInitModel } from "vue-tel-num-input";
const model = ref<TelInputInitModel>({});
</script>
```

20. **Detect country on demand (exposed API)**

```vue
<template>
  <VueTelNumInput ref="telRef" v-model="model" />
  <button @click="detect">Detect country</button>
</template>

<script setup lang="ts">
import { ref } from "vue";
import VueTelNumInput, {
  type TelInputInitModel,
  type VueTelNumInputExpose,
} from "vue-tel-num-input";

const model = ref<TelInputInitModel>({});
const telRef = ref<VueTelNumInputExpose | null>(null);

const detect = async () => {
  const iso = await telRef.value?.requestUserCountry();
  console.log("Detected:", iso);
};
</script>
```

21. **Disable built-in sizing and style from scratch**

```vue
<template>
  <div class="my-tel-wrap">
    <VueTelNumInput v-model="model" :disable-sizing="true" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import VueTelNumInput, { type TelInputInitModel } from "vue-tel-num-input";
const model = ref<TelInputInitModel>({});
</script>

<style scoped>
.my-tel-wrap :deep(.tel-num-input__head) {
  border: 1px solid #000;
  border-radius: 0;
  background: #fffbe6;
}
</style>
```

22. **Toggle animation**

```vue
<template>
  <VueTelNumInput v-model="model" animation-name="fade" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import VueTelNumInput, { type TelInputInitModel } from "vue-tel-num-input";
const model = ref<TelInputInitModel>({});
</script>
```

> You can also register your own `<Transition name="...">` CSS.

23. **Accessibility hints**

- The search input auto-focuses when opening the dropdown (`search.autoFocus`).
- Ensure your custom slots maintain focus order and click targets.
- Provide visible focus ring overrides with CSS variables if your design removes outlines.
