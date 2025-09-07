import { ref, watch, nextTick, type Ref } from "vue";
import { AsYouType, getCountryCallingCode } from "libphonenumber-js/core";
import metadata from "libphonenumber-js/metadata.full.json";
import type { CountryCode } from "libphonenumber-js/core";

type InputEl = HTMLInputElement | null | undefined;

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

export function usePhoneFormat(params: { value: Ref<string>; iso: Ref<string>; international: Ref<boolean>; needFormat: Ref<boolean>; inputEl: Ref<InputEl>; onAfterFormat?: (formatted: string) => void }) {
    const isFormatting = ref(false);
    const isComposing = ref(false);

    const setComposing = (v: boolean) => (isComposing.value = v);

    const fmtIntl = (s: string) => new AsYouType(undefined, metadata as any).input(s);
    const fmtWithCountry = (s: string, c?: CountryCode) => new AsYouType(c, metadata as any).input(s);

    const getISO = () => (params.iso.value || "").toUpperCase() as CountryCode | undefined;

    const getPrefixParts = (iso?: CountryCode) => {
        if (!iso) return { cc: "", prefix: "", formattedPrefix: "" };
        const cc = getCountryCallingCode(iso, metadata as any);
        const prefix = `+${cc}`;
        const formattedPrefix = fmtIntl(prefix); // учтёт пробел после кода там, где это нужно
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

            if (!list || list.length !== 1) continue;
            const iso = list[0];
            if (iso && iso !== (params.iso.value || "").toUpperCase()) params.iso.value = iso as any;
            break;
        }
    };

    const mapAndFormat = (raw: string, caretStart: number, caretEnd: number) => {
        const ISO = getISO();

        if (params.international.value) {
            // ————— International: фиксируем префикс выбранной страны и не даём его стирать
            if (!ISO) return { formattedAll: raw, newStart: caretStart, newEnd: caretEnd };

            const { cc, prefix, formattedPrefix } = getPrefixParts(ISO);

            // Срезаем любой введённый префикс (любой +<digits>...) и оставляем «базу»
            const cutAnyPrefix = /^\+\d{1,3}[\s\-\)]*/;
            const hadPrefixAnyLen = cutAnyPrefix.exec(raw)?.[0]?.length ?? 0;
            const base = raw.replace(cutAnyPrefix, "");

            // Привязываем каретку к базе (не даём уйти в префикс)
            const adjStart = Math.max(0, caretStart - Math.min(hadPrefixAnyLen, caretStart));
            const adjEnd = Math.max(0, caretEnd - Math.min(hadPrefixAnyLen, caretEnd));

            // Пересобираем «международное» сырьё и форматируем целиком
            const intlRaw = prefix + base;
            const formattedAllIntl = fmtIntl(intlRaw);

            // Длина форматированного префикса — минимум позиции каретки
            const toStartIntlLen = fmtIntl(intlRaw.slice(0, prefix.length + adjStart)).length;
            let newStart = Math.max(fmtIntl(prefix).length, toStartIntlLen);
            let newEnd = newStart;

            if (adjEnd !== adjStart) {
                const toEndIntlLen = fmtIntl(intlRaw.slice(0, prefix.length + adjEnd)).length;
                newEnd = Math.max(newStart, toEndIntlLen);
            }

            // Защита: каретка не левее форматированного префикса
            const minPos = formattedPrefix.length;
            newStart = Math.max(newStart, minPos);
            newEnd = Math.max(newEnd, minPos);

            return { formattedAll: formattedAllIntl, newStart, newEnd };
        } else {
            // ————— National: как у тебя было — без префикса, но на основе ISO
            const ISO = getISO();
            if (!ISO) return { formattedAll: raw, newStart: caretStart, newEnd: caretEnd };

            const cc = getCountryCallingCode(ISO, metadata as any);
            const prefix = `+${cc}`;
            const cutRe = new RegExp(`^\\+?${cc}[\\s\\-\\)]*`);
            const hadPrefixLen = cutRe.exec(raw)?.[0]?.length ?? 0;
            const base = raw.replace(cutRe, "");
            const adjStart = Math.max(0, caretStart - Math.min(hadPrefixLen, caretStart));
            const adjEnd = Math.max(0, caretEnd - Math.min(hadPrefixLen, caretEnd));

            const intlRaw = prefix + base;

            const formattedAllIntl = fmtIntl(intlRaw);
            const formattedPrefix = fmtIntl(prefix);
            const formattedNational = formattedAllIntl.slice(formattedPrefix.length).trimStart();

            const toStartIntlLen = fmtIntl(intlRaw.slice(0, prefix.length + adjStart)).length;
            let newStart = Math.max(0, toStartIntlLen - formattedPrefix.length);
            let newEnd = newStart;
            if (adjEnd !== adjStart) {
                const toEndIntlLen = fmtIntl(intlRaw.slice(0, prefix.length + adjEnd)).length;
                newEnd = Math.max(newStart, toEndIntlLen - formattedPrefix.length);
            }

            return { formattedAll: formattedNational, newStart, newEnd };
        }
    };

    const applyFormattingWithCaret = (raw?: string) => {
        const el = params.inputEl.value as HTMLInputElement | null;
        const curr = raw ?? params.value.value;
        const ISO = getISO();

        if (!el) {
            // Без поля ввода — просто форсируем текст
            if (params.international.value) {
                if (!ISO) return;
                const { cc, prefix } = getPrefixParts(ISO);
                const base = curr.replace(/^\+\d{1,3}[\s\-\)]*/, "");
                const intlRaw = prefix + base;

                const formattedAllIntl = fmtIntl(intlRaw);
                if (formattedAllIntl !== curr) params.value.value = formattedAllIntl;

                // (Опционально) авто-ISO по вставленному номеру — если ISO не задан
                // но у нас ISO есть — поэтому не меняем ISO здесь

                params.onAfterFormat?.(params.value.value);
                return;
            } else {
                if (!ISO) return;
                const { cc, prefix } = getPrefixParts(ISO);
                const base = curr.replace(new RegExp(`^\\+?${cc}[\\s\\-\\)]*`), "");
                const intlRaw = prefix + base;

                const formattedAllIntl = fmtIntl(intlRaw);
                const formattedPrefix = fmtIntl(prefix);
                const formattedNational = formattedAllIntl.slice(formattedPrefix.length).trimStart();

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

            // В international — не позволяем каретке заходить в префикс
            if (params.international.value) {
                const ISO = getISO();
                if (ISO) {
                    const { formattedPrefix } = getPrefixParts(ISO);
                    const minPos = formattedPrefix.length;
                    s = Math.max(s, minPos);
                    f = Math.max(f, minPos);
                }
            }

            try {
                e.setSelectionRange(s, f);
            } catch {}

            if (params.international.value) {
                // В принудительном режиме префикс фиксируем — авто-определение ISO по + не выполняем,
                // чтобы не «перепрыгивать» страну случайно. Если хочешь — можно вернуть tryAutoSelectIsoByPlus(e.value)
                // но это будет менять ISO при вставке другого кода.
            }

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
            applyFormattingWithCaret(nv);
        }
    );

    watch(
        () => params.needFormat.value,
        (on) => {
            if (!on) return;
            applyFormattingWithCaret();
        }
    );

    watch(
        () => params.international.value,
        () => {
            if (!params.needFormat.value) return;
            applyFormattingWithCaret();
        }
    );

    watch(
        () => params.iso.value,
        () => {
            if (!params.needFormat.value) return;
            applyFormattingWithCaret();
        }
    );

    return { isComposing, setComposing, formatNow: applyFormattingWithCaret };
}
