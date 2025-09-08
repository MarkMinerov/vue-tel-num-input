import { computed, type ComputedRef, type Ref } from "vue";

export type CountryLike = {
  iso: string;
  name: string;
  nativeName: string;
};

type Options<T extends CountryLike> = {
  countries: ComputedRef<T[]> | Ref<T[]> | T[];
  query: Ref<string>;
  codeGetter: (iso: string) => string;
  limit?: number | null;
  normalizeDiacritics?: boolean;
};

const normalize = (s: string, strip = true) => {
  const v = (s ?? "").toLowerCase();
  return strip ? v.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : v;
};

export function useCountrySearch<T extends CountryLike>(opts: Options<T>) {
  const {
    countries,
    query,
    codeGetter,
    limit = null,
    normalizeDiacritics = true,
  } = opts;

  const results = computed<T[]>(() => {
    const list = Array.isArray(countries)
      ? countries
      : (countries as any).value;
    const raw = (query.value ?? "").trim();
    if (!raw) return list;

    const startsWithPlus = raw.startsWith("+");
    const q = normalize(raw, normalizeDiacritics);

    type Scored = { c: T; score: number; sortKey: string };

    const scored: Scored[] = [];
    for (const c of list) {
      const eng = normalize(c.name, normalizeDiacritics);
      const nat = normalize(c.nativeName, normalizeDiacritics);
      const iso = c.iso.toLowerCase();
      const code = codeGetter(c.iso).toLowerCase();

      const engWords = eng.split(/\s+/);
      const natWords = nat.split(/\s+/);

      let score = 0;

      if (startsWithPlus) {
        if (code.startsWith(raw.toLowerCase())) score = 1000;
        else if (code.includes(q)) score = 600;
      }

      if (score === 0) {
        if (eng.startsWith(q) || nat.startsWith(q)) score = 900;
        else if (
          engWords.some((w) => w.startsWith(q)) ||
          natWords.some((w) => w.startsWith(q))
        )
          score = 850;
        else if (eng.includes(q) || nat.includes(q)) score = 800;
      }

      if (score === 0) {
        if (!startsWithPlus && code.includes(q)) score = 500;
        else if (iso.startsWith(q)) score = 400;
        else if (iso.includes(q)) score = 300;
      }

      if (score > 0) {
        scored.push({ c, score, sortKey: eng || nat || iso });
      }
    }

    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.sortKey.localeCompare(b.sortKey);
    });

    const out = scored.map((x) => x.c);
    return typeof limit === "number" && limit > 0 ? out.slice(0, limit) : out;
  });

  return { results };
}
