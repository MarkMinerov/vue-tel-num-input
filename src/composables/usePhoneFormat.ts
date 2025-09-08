import { ref, watch, nextTick, type Ref } from "vue";
import { AsYouType, getCountryCallingCode } from "libphonenumber-js/core";
import metadata from "libphonenumber-js/metadata.min.json";
import type { CountryCode } from "libphonenumber-js/core";

import CC_PRIORITY from "~/assets/configs/priority.json";

type InputEl = HTMLInputElement | null | undefined;

function pickPreferredIso(cc: string, candidates: string[]): string | null {
  const prefs = CC_PRIORITY[cc as keyof typeof CC_PRIORITY];
  if (!prefs || prefs.length === 0) return null;
  const set = new Set(candidates.map((s) => s.toUpperCase()));
  for (const iso of prefs) {
    if (set.has(iso)) return iso;
  }
  return null;
}

const ccToIso = (() => {
  const map = new Map<string, string[]>();
  const countries = (metadata as any).countries as Record<string, any[]>;
  for (const iso of Object.keys(countries)) {
    const cc = String(countries[iso][0]);
    const arr = map.get(cc) || [];
    arr.push(iso.toUpperCase());
    map.set(cc, arr);
  }
  return map;
})();

export function usePhoneFormat(params: {
  value: Ref<string>;
  iso: Ref<string>;
  international: Ref<boolean>;
  needFormat: Ref<boolean>;
  inputEl: Ref<InputEl>;
  excludeCountryCodes: Ref<string[]>;
  onAfterFormat?: (formatted: string) => void;
}) {
  const isFormatting = ref(false);
  const isComposing = ref(false);

  const isExcluded = (iso: string) =>
    Array.isArray(params.excludeCountryCodes.value) &&
    params.excludeCountryCodes.value.some(
      (c) => c.toUpperCase() === iso.toUpperCase()
    );

  const setComposing = (v: boolean) => (isComposing.value = v);

  const fmtIntl = (s: string) =>
    new AsYouType(undefined, metadata as any).input(s);

  const getISO = () =>
    (params.iso.value || "").toUpperCase() as CountryCode | undefined;

  const cutAnyPlusPrefixRe = /^\+\d{1,3}[\s\u00A0\u202F\-\)]*/;

  const getPrefixParts = (iso?: CountryCode) => {
    if (!iso) return { cc: "", prefix: "", formattedPrefix: "" };
    const cc = getCountryCallingCode(iso, metadata as any);
    const prefix = `+${cc}`;
    const formattedPrefix = fmtIntl(prefix);
    return { cc, prefix, formattedPrefix };
  };

  const tryAutoSelectIsoByPlus = (input: string) => {
    if (!params.international.value) return;
    const m = input.match(/^\+(\d{1,3})/);
    if (!m) return;
    const digits = m[1];

    for (const len of [3, 2, 1]) {
      const cc = digits.slice(0, len);
      if (!cc) continue;

      const list = ccToIso.get(cc);
      if (!list || list.length === 0) continue;

      const candidates = list.filter((iso) => !isExcluded(iso));
      if (candidates.length === 0) return;

      if (candidates.length === 1) {
        const iso = candidates[0];
        if (iso && iso !== (params.iso.value || "").toUpperCase()) {
          params.iso.value = iso as any;
        }
        return;
      }

      const preferred = pickPreferredIso(cc, candidates);
      if (preferred && preferred !== (params.iso.value || "").toUpperCase()) {
        params.iso.value = preferred as any;
        return;
      }

      return;
    }
  };

  const ensurePrefixPresent = (): boolean => {
    if (!params.international.value) return false;
    const ISO = getISO();
    if (!ISO) return false;
    const v = params.value.value || "";
    if (v.startsWith("+")) return false;

    const { formattedPrefix } = getPrefixParts(ISO);
    if (v === "" || !v.startsWith(formattedPrefix)) {
      isFormatting.value = true;
      params.value.value = formattedPrefix;
      nextTick(() => {
        const e = params.inputEl.value as HTMLInputElement | null;
        if (e) {
          const p = e.value.length;
          try {
            e.setSelectionRange(p, p);
          } catch {}
        }
        params.onAfterFormat?.(params.value.value);
      });
      return true;
    }
    return false;
  };

  const mapAndFormat = (raw: string, caretStart: number, caretEnd: number) => {
    if (params.international.value) {
      if (raw.startsWith("+")) {
        const formattedAll = fmtIntl(raw);
        const toStartLen = fmtIntl(raw.slice(0, caretStart)).length;
        let newStart = toStartLen;
        let newEnd = newStart;
        if (caretEnd !== caretStart) {
          const toEndLen = fmtIntl(raw.slice(0, caretEnd)).length;
          newEnd = Math.max(toEndLen, newStart);
        }
        return { formattedAll, newStart, newEnd };
      }

      const ISO = getISO();
      if (!ISO)
        return { formattedAll: raw, newStart: caretStart, newEnd: caretEnd };

      const { prefix, formattedPrefix } = getPrefixParts(ISO);
      const base = raw.replace(cutAnyPlusPrefixRe, "");
      const removed = raw.length - base.length;

      const adjStart = Math.max(0, caretStart - Math.min(removed, caretStart));
      const adjEnd = Math.max(0, caretEnd - Math.min(removed, caretEnd));

      const intlRaw = prefix + base;
      const formattedAllIntl = base ? fmtIntl(intlRaw) : formattedPrefix;

      const toStartIntlLen = fmtIntl(
        intlRaw.slice(0, prefix.length + adjStart)
      ).length;
      const toEndIntlLen = fmtIntl(
        intlRaw.slice(0, prefix.length + adjEnd)
      ).length;

      const minPos = formattedPrefix.length;
      let newStart = Math.max(minPos, toStartIntlLen);
      let newEnd = Math.max(newStart, toEndIntlLen);

      return { formattedAll: formattedAllIntl, newStart, newEnd };
    } else {
      const ISO = getISO();
      if (!ISO)
        return { formattedAll: raw, newStart: caretStart, newEnd: caretEnd };

      const cc = getCountryCallingCode(ISO, metadata as any);
      const prefix = `+${cc}`;
      const cutRe = new RegExp(`^\\+?${cc}[\\s\\u00A0\\u202F\\-\\)]*`);
      const hadPrefixLen = cutRe.exec(raw)?.[0]?.length ?? 0;
      const base = raw.replace(cutRe, "");
      const adjStart = Math.max(
        0,
        caretStart - Math.min(hadPrefixLen, caretStart)
      );
      const adjEnd = Math.max(0, caretEnd - Math.min(hadPrefixLen, caretEnd));

      const intlRaw = prefix + base;
      const formattedAllIntl = fmtIntl(intlRaw);
      const formattedPrefix = fmtIntl(prefix);
      const formattedNational = formattedAllIntl
        .slice(formattedPrefix.length)
        .trimStart();

      const toStartIntlLen = fmtIntl(
        intlRaw.slice(0, prefix.length + adjStart)
      ).length;
      let newStart = Math.max(0, toStartIntlLen - formattedPrefix.length);
      let newEnd = newStart;
      if (adjEnd !== adjStart) {
        const toEndIntlLen = fmtIntl(
          intlRaw.slice(0, prefix.length + adjEnd)
        ).length;
        newEnd = Math.max(newStart, toEndIntlLen - formattedPrefix.length);
      }

      return { formattedAll: formattedNational, newStart, newEnd };
    }
  };

  const applyFormattingWithCaret = (raw?: string) => {
    const el = params.inputEl.value as HTMLInputElement | null;
    const curr = raw ?? params.value.value;

    if (!el) {
      if (params.international.value) {
        if (curr.startsWith("+")) {
          const formatted = fmtIntl(curr);
          if (formatted !== curr) params.value.value = formatted;
          tryAutoSelectIsoByPlus(params.value.value);
          params.onAfterFormat?.(params.value.value);
          return;
        } else {
          const ISO = getISO();
          if (!ISO) return;
          const { prefix, formattedPrefix } = getPrefixParts(ISO);
          const base = curr.replace(cutAnyPlusPrefixRe, "");
          const intlRaw = prefix + base;
          const formattedAllIntl = base ? fmtIntl(intlRaw) : formattedPrefix;
          if (formattedAllIntl !== curr) params.value.value = formattedAllIntl;
          params.onAfterFormat?.(params.value.value);
          return;
        }
      } else {
        const ISO = getISO();
        if (!ISO) return;
        const { prefix } = getPrefixParts(ISO);
        const cutRe = new RegExp(
          `^\\+?${getCountryCallingCode(
            ISO,
            metadata as any
          )}[\\s\\u00A0\\u202F\\-\\)]*`
        );
        const base = curr.replace(cutRe, "");
        const intlRaw = prefix + base;
        const formattedAllIntl = fmtIntl(intlRaw);
        const formattedPrefix = fmtIntl(prefix);
        const formattedNational = formattedAllIntl
          .slice(formattedPrefix.length)
          .trimStart();
        if (formattedNational !== curr) params.value.value = formattedNational;
        params.onAfterFormat?.(params.value.value);
        return;
      }
    }

    const start = el.selectionStart ?? curr.length;
    const end = el.selectionEnd ?? start;
    const { formattedAll, newStart, newEnd } = mapAndFormat(curr, start, end);

    if (formattedAll === curr) return;

    isFormatting.value = true;
    params.value.value = formattedAll;

    nextTick(() => {
      const e = params.inputEl.value as HTMLInputElement | null;
      if (!e) return;
      const max = e.value.length;
      let s = Math.min(newStart, max);
      let f = Math.min(newEnd, max);

      if (params.international.value) {
        if (e.value.startsWith("+")) {
          tryAutoSelectIsoByPlus(e.value);
        } else {
          const ISO = getISO();
          if (ISO) {
            const { formattedPrefix } = getPrefixParts(ISO);
            const minPos = formattedPrefix.length;
            s = Math.max(s, minPos);
            f = Math.max(f, minPos);
          }
        }
      }

      try {
        e.setSelectionRange(s, f);
      } catch {}
      params.onAfterFormat?.(e.value);
    });
  };

  watch(
    () => params.value.value,
    (nv, ov) => {
      if (!params.needFormat.value) return;
      if (isComposing.value) return;
      if (isFormatting.value) {
        isFormatting.value = false;
        return;
      }
      if (nv == null || nv === ov) return;

      if (params.international.value && !String(nv).startsWith("+")) {
        if (ensurePrefixPresent()) return;
      }
      applyFormattingWithCaret(nv);
    }
  );

  watch(
    () => params.needFormat.value,
    (on) => {
      if (!on) return;
      if (params.international.value) ensurePrefixPresent();
      applyFormattingWithCaret();
    },
    { immediate: true }
  );

  watch(
    () => params.international.value,
    (intl) => {
      if (!params.needFormat.value) return;
      if (intl) ensurePrefixPresent();
      applyFormattingWithCaret();
    },
    { immediate: true }
  );

  watch(
    () => params.iso.value,
    () => {
      if (!params.needFormat.value) return;
      if (params.international.value) ensurePrefixPresent();
      applyFormattingWithCaret();
    },
    { immediate: true }
  );

  if (params.needFormat.value && params.international.value) {
    ensurePrefixPresent();
  }

  return { isComposing, setComposing, formatNow: applyFormattingWithCaret };
}
