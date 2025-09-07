import { Ref, computed, watch } from "vue";

import { useWarn } from "./useWarn";

export const usePlaceholder = (
  locale: Ref<string | undefined>,
  plac: Ref<string | Record<string, string> | undefined>,
  silent: Ref<boolean>,
  defaultValue: string
) => {
  let warn = useWarn(silent.value);
  watch(silent, (newVal) => (warn = useWarn(newVal)));

  const placVal = computed(() => {
    const loc = locale ? locale.value : null;
    const ph = plac ? plac.value : null;

    if (typeof ph === "string") {
      if (typeof loc === "string")
        warn(
          `Please provide 'placeholder' as an object when 'locale' is a string to support localization. Using string 'placeholder' and ignoring 'locale'.`
        );
      return ph;
    }

    if (ph && typeof ph === "object") {
      if (!loc) {
        warn(
          `Prop 'locale' is not set while 'placeholder' is an object. First available key from 'placeholder' is used.`
        );
        const anyKey = Object.keys(ph)[0];
        return anyKey ? ph[anyKey] : defaultValue;
      }
      const val = ph[loc];
      if (!val) {
        const keys = Object.keys(ph);
        warn(
          `No placeholder found for locale '${loc}'. First available key from 'placeholder' is used.`
        );
        return keys.length ? ph[keys[0]] : defaultValue;
      }
      return val;
    }

    if (ph == undefined && typeof loc === "string")
      warn(
        `Prop 'placeholder' is not set while 'locale' is a string. Using default placeholder.`
      );

    return defaultValue;
  });

  return { placVal };
};
