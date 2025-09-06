import { ref, watch, nextTick, type Ref } from "vue";
import { AsYouType } from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js/core";

type InputEl = HTMLInputElement | null | undefined;

export function usePhoneFormat(params: { value: Ref<string>; iso: Ref<string>; needFormat: Ref<boolean>; inputEl: Ref<InputEl>; onAfterFormat?: (formatted: string) => void }) {
    const isFormatting = ref(false);
    const isComposing = ref(false);

    const setComposing = (v: boolean) => (isComposing.value = v);

    const mapAndFormat = (raw: string, caretStart: number, caretEnd: number) => {
        const country: CountryCode | undefined = raw.startsWith("+") ? undefined : (params.iso.value as CountryCode | undefined);
        const formattedAll = new AsYouType(country).input(raw);
        const toStartLen = new AsYouType(country).input(raw.slice(0, caretStart)).length;
        let newStart = toStartLen;
        let newEnd = newStart;

        if (caretEnd !== caretStart) {
            const toEndLen = new AsYouType(country).input(raw.slice(0, caretEnd)).length;
            newEnd = Math.max(toEndLen, newStart);
        }

        return { formattedAll, newStart, newEnd };
    };

    const applyFormattingWithCaret = (raw?: string) => {
        const el = params.inputEl.value as HTMLInputElement | null;
        const curr = raw ?? params.value.value;

        if (!el) {
            const country: CountryCode | undefined = curr.startsWith("+") ? undefined : (params.iso.value as CountryCode | undefined);
            const formatted = new AsYouType(country).input(curr);
            if (formatted !== curr) params.value.value = formatted;
            params.onAfterFormat?.(params.value.value);
            return;
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
            const s = Math.min(newStart, max);
            const f = Math.min(newEnd, max);
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

    return {
        isComposing,
        setComposing,
        formatNow: applyFormattingWithCaret,
    };
}
