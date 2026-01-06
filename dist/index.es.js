import { watch as j, computed as x, ref as Q, nextTick as ce, onMounted as ke, onBeforeUnmount as Ve, defineComponent as qe, toRefs as Me, createElementBlock as L, createCommentVNode as T, openBlock as U, normalizeStyle as G, normalizeClass as fe, toDisplayString as $, toRef as Se, useTemplateRef as X, createElementVNode as B, createVNode as Ge, renderSlot as A, createBlock as _e, withDirectives as Ee, vModelText as Ie, Transition as Ke, withCtx as He, Fragment as $e, renderList as Ye } from "vue";
import { getCountries as Ze, parsePhoneNumberWithError as we, getCountryCallingCode as Je, parsePhoneNumberFromString as Xe } from "libphonenumber-js";
import { AsYouType as Qe, getCountryCallingCode as se } from "libphonenumber-js/core";
import Y from "libphonenumber-js/metadata.min.json";
const z = (e = !1) => (...o) => !e && console.warn(...o), Oe = () => ({ getNames: (o) => {
  const r = new Intl.DisplayNames(["en"], { type: "region" }), t = new Intl.DisplayNames([o.toLowerCase()], {
    type: "region"
  });
  return { name: r.of(o), nativeName: t.of(o) };
} }), et = (e, o, r, t) => {
  let l = z(t.value);
  j(t, (c) => l = z(c));
  const a = Ze(), { getNames: s } = Oe(), f = x(() => {
    const c = Array.from(
      new Set(e.value.map((n) => n.toUpperCase()))
    );
    let E;
    if (!c?.length)
      E = a;
    else {
      const n = c.filter(
        (u) => a.includes(u)
      ), i = c.filter(
        (u) => !a.includes(u)
      );
      i.length > 0 && l(
        `[TelNumInput] Country codes not found: ${i.join(", ")}`
      ), E = n;
    }
    const C = o.value.map(
      (n) => n.toUpperCase()
    );
    return E = E.filter(
      (n) => !C.includes(n)
    ), E;
  }), d = x(
    () => f.value.map((c) => {
      const { name: E, nativeName: C } = s(c);
      return {
        iso: c,
        name: E,
        nativeName: C
      };
    })
  ), h = x(() => {
    const c = r.value?.toUpperCase();
    return !c || !a.includes(c) ? "US" : c;
  });
  return { isoCodes: a, validCountries: d, defaultIso: h };
}, Fe = (e, o, r, t) => {
  let l = z(r.value);
  return j(r, (s) => l = z(s)), { placVal: x(() => {
    const s = e ? e.value : null, f = o ? o.value : null;
    if (typeof f == "string")
      return typeof s == "string" && l(
        "Please provide 'placeholder' as an object when 'locale' is a string to support localization. Using string 'placeholder' and ignoring 'locale'."
      ), f;
    if (f && typeof f == "object") {
      if (!s) {
        l(
          "Prop 'locale' is not set while 'placeholder' is an object. First available key from 'placeholder' is used."
        );
        const h = Object.keys(f)[0];
        return h ? f[h] : t;
      }
      const d = f[s];
      if (!d) {
        const h = Object.keys(f);
        return l(
          `No placeholder found for locale '${s}'. First available key from 'placeholder' is used.`
        ), h.length ? f[h[0]] : t;
      }
      return d;
    }
    return f == null && typeof s == "string" && l(
      "Prop 'placeholder' is not set while 'locale' is a string. Using default placeholder."
    ), t;
  }) };
}, tt = {
  1: ["US", "CA", "PR", "SX", "TT", "JM", "BS", "BB", "AG", "AI", "DM", "GD", "KN", "LC", "VC", "VG", "VI", "KY", "MS"],
  7: ["RU", "KZ"],
  39: ["IT", "VA"],
  44: ["GB", "GG", "IM", "JE"],
  47: ["NO", "SJ"],
  61: ["AU", "CX", "CC"],
  262: ["RE", "YT"],
  358: ["FI", "AX"],
  500: ["FK", "GS"],
  590: ["GP", "BL", "MF"],
  599: ["CW", "BQ"]
};
function nt(e, o) {
  const r = tt[e];
  if (!r || r.length === 0) return null;
  const t = new Set(o.map((l) => l.toUpperCase()));
  for (const l of r)
    if (t.has(l)) return l;
  return null;
}
const ot = (() => {
  const e = /* @__PURE__ */ new Map(), o = Y.countries;
  for (const r of Object.keys(o)) {
    const t = String(o[r][0]), l = e.get(t) || [];
    l.push(r.toUpperCase()), e.set(t, l);
  }
  return e;
})();
function lt(e) {
  const o = Q(!1), r = Q(!1), t = (n) => Array.isArray(e.excludeCountryCodes.value) && e.excludeCountryCodes.value.some(
    (i) => i.toUpperCase() === n.toUpperCase()
  ), l = (n) => r.value = n, a = (n) => new Qe(void 0, Y).input(n), s = () => (e.iso.value || "").toUpperCase(), f = /^\+\d{1,3}[\s\u00A0\u202F\-\)]*/, d = (n) => {
    if (!n) return { cc: "", prefix: "", formattedPrefix: "" };
    const i = se(n, Y), u = `+${i}`, g = a(u);
    return { cc: i, prefix: u, formattedPrefix: g };
  }, h = (n) => {
    if (!e.international.value) return;
    const i = n.match(/^\+(\d{1,3})/);
    if (!i) return;
    const u = i[1];
    for (const g of [3, 2, 1]) {
      const y = u.slice(0, g);
      if (!y) continue;
      const S = ot.get(y);
      if (!S || S.length === 0) continue;
      const I = S.filter((v) => !t(v));
      if (I.length === 0) return;
      if (I.length === 1) {
        const v = I[0];
        v && v !== (e.iso.value || "").toUpperCase() && (e.iso.value = v);
        return;
      }
      const p = nt(y, I);
      if (p && p !== (e.iso.value || "").toUpperCase()) {
        e.iso.value = p;
        return;
      }
      return;
    }
  }, c = () => {
    if (!e.international.value) return !1;
    const n = s();
    if (!n) return !1;
    const i = e.value.value || "";
    if (i.startsWith("+")) return !1;
    const { formattedPrefix: u } = d(n);
    return i === "" || !i.startsWith(u) ? (o.value = !0, e.value.value = u, ce(() => {
      const g = e.inputEl.value;
      if (g) {
        const y = g.value.length;
        try {
          g.setSelectionRange(y, y);
        } catch {
        }
      }
      e.onAfterFormat?.(e.value.value);
    }), !0) : !1;
  }, E = (n, i, u) => {
    if (e.international.value) {
      if (n.startsWith("+")) {
        const R = a(n);
        let O = a(n.slice(0, i)).length, K = O;
        if (u !== i) {
          const Z = a(n.slice(0, u)).length;
          K = Math.max(Z, O);
        }
        return { formattedAll: R, newStart: O, newEnd: K };
      }
      const g = s();
      if (!g)
        return { formattedAll: n, newStart: i, newEnd: u };
      const { prefix: y, formattedPrefix: S } = d(g), I = n.replace(f, ""), p = n.length - I.length, v = Math.max(0, i - Math.min(p, i)), N = Math.max(0, u - Math.min(p, u)), w = y + I, F = I ? a(w) : S, b = a(
        w.slice(0, y.length + v)
      ).length, P = a(
        w.slice(0, y.length + N)
      ).length, q = S.length;
      let k = Math.max(q, b), M = Math.max(k, P);
      return { formattedAll: F, newStart: k, newEnd: M };
    } else {
      const g = s();
      if (!g)
        return { formattedAll: n, newStart: i, newEnd: u };
      const y = se(g, Y), S = `+${y}`, I = new RegExp(`^\\+?${y}[\\s\\u00A0\\u202F\\-\\)]*`), p = I.exec(n)?.[0]?.length ?? 0, v = n.replace(I, ""), N = Math.max(
        0,
        i - Math.min(p, i)
      ), w = Math.max(0, u - Math.min(p, u)), F = S + v, b = a(F), P = a(S), q = b.slice(P.length).trimStart(), k = a(
        F.slice(0, S.length + N)
      ).length;
      let M = Math.max(0, k - P.length), R = M;
      if (w !== N) {
        const D = a(
          F.slice(0, S.length + w)
        ).length;
        R = Math.max(M, D - P.length);
      }
      return { formattedAll: q, newStart: M, newEnd: R };
    }
  }, C = (n) => {
    const i = e.inputEl.value, u = n ?? e.value.value;
    if (!i)
      if (e.international.value)
        if (u.startsWith("+")) {
          const v = a(u);
          v !== u && (e.value.value = v), h(e.value.value), e.onAfterFormat?.(e.value.value);
          return;
        } else {
          const v = s();
          if (!v) return;
          const { prefix: N, formattedPrefix: w } = d(v), F = u.replace(f, ""), b = N + F, P = F ? a(b) : w;
          P !== u && (e.value.value = P), e.onAfterFormat?.(e.value.value);
          return;
        }
      else {
        const v = s();
        if (!v) return;
        const { prefix: N } = d(v), w = new RegExp(
          `^\\+?${se(
            v,
            Y
          )}[\\s\\u00A0\\u202F\\-\\)]*`
        ), F = u.replace(w, ""), b = N + F, P = a(b), q = a(N), k = P.slice(q.length).trimStart();
        k !== u && (e.value.value = k), e.onAfterFormat?.(e.value.value);
        return;
      }
    const g = i.selectionStart ?? u.length, y = i.selectionEnd ?? g, { formattedAll: S, newStart: I, newEnd: p } = E(u, g, y);
    S !== u && (o.value = !0, e.value.value = S, ce(() => {
      const v = e.inputEl.value;
      if (!v) return;
      const N = v.value.length;
      let w = Math.min(I, N), F = Math.min(p, N);
      if (e.international.value)
        if (v.value.startsWith("+"))
          h(v.value);
        else {
          const b = s();
          if (b) {
            const { formattedPrefix: P } = d(b), q = P.length;
            w = Math.max(w, q), F = Math.max(F, q);
          }
        }
      try {
        v.setSelectionRange(w, F);
      } catch {
      }
      e.onAfterFormat?.(v.value);
    }));
  };
  return j(
    () => e.value.value,
    (n, i) => {
      if (e.needFormat.value && !r.value) {
        if (o.value) {
          o.value = !1;
          return;
        }
        n == null || n === i || e.international.value && !String(n).startsWith("+") && c() || C(n);
      }
    }
  ), j(
    () => e.needFormat.value,
    (n) => {
      n && (e.international.value && c(), C());
    },
    { immediate: !0 }
  ), j(
    () => e.international.value,
    (n) => {
      e.needFormat.value && (n && c(), C());
    },
    { immediate: !0 }
  ), j(
    () => e.iso.value,
    () => {
      e.needFormat.value && (e.international.value && c(), C());
    },
    { immediate: !0 }
  ), e.needFormat.value && e.international.value && c(), { isComposing: r, setComposing: l, formatNow: C };
}
const ie = (e, o = !0) => {
  const r = (e ?? "").toLowerCase();
  return o ? r.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : r;
};
function rt(e) {
  const {
    countries: o,
    query: r,
    codeGetter: t,
    limit: l = null,
    normalizeDiacritics: a = !0
  } = e;
  return { results: x(() => {
    const f = Array.isArray(o) ? o : o.value, d = (r.value ?? "").trim();
    if (!d) return f;
    const h = d.startsWith("+"), c = ie(d, a), E = [];
    for (const n of f) {
      const i = ie(n.name, a), u = ie(n.nativeName, a), g = n.iso.toLowerCase(), y = t(n.iso).toLowerCase(), S = i.split(/\s+/), I = u.split(/\s+/);
      let p = 0;
      h && (y.startsWith(d.toLowerCase()) ? p = 1e3 : y.includes(c) && (p = 600)), p === 0 && (i.startsWith(c) || u.startsWith(c) ? p = 900 : S.some((v) => v.startsWith(c)) || I.some((v) => v.startsWith(c)) ? p = 850 : (i.includes(c) || u.includes(c)) && (p = 800)), p === 0 && (!h && y.includes(c) ? p = 500 : g.startsWith(c) ? p = 400 : g.includes(c) && (p = 300)), p > 0 && E.push({ c: n, score: p, sortKey: i || u || g });
    }
    E.sort((n, i) => i.score !== n.score ? i.score - n.score : n.sortKey.localeCompare(i.sortKey));
    const C = E.map((n) => n.c);
    return typeof l == "number" && l > 0 ? C.slice(0, l) : C;
  }) };
}
const st = (e, o) => {
  const r = (t) => {
    const l = e.value;
    l && (l === t.target || l.contains(t.target) || o(t));
  };
  ke(() => {
    document.addEventListener("click", r, !0);
  }), Ve(() => {
    document.removeEventListener("click", r, !0);
  });
}, it = ({
  enabled: e,
  validCountries: o,
  isoRef: r,
  silent: t
}) => {
  let l = z(t.value);
  j(t, (d) => l = z(d));
  const a = "https://ipapi.co/country/", s = Q(null), f = async () => {
    try {
      const h = await (await fetch(a)).text();
      o.value.find((c) => c.iso === h) && (s.value = h, r && (r.value = h));
    } catch (d) {
      return l("Error fetching user country:", d), null;
    }
    return s.value;
  };
  return j(e, (d) => {
    d && f();
  }), e.value && f(), { country: s, requestUserCountry: f };
}, at = (e, o, r, t) => {
  let l = z(t.value);
  j(t, (s) => l = z(s));
  let a = null;
  if (o.length)
    if (r) {
      e.value && l(
        "Prop 'country-code' is ignored when 'initial-value' is set and 'international' is true."
      );
      try {
        a = we(o);
      } catch {
        l(`Initial value '${o}' is not a valid phone number.`);
      }
    } else if (!e.value)
      l(
        "Prop 'country-code' should be set when 'initial-value' is provided and 'international' is false."
      );
    else
      try {
        a = we(o, {
          defaultCountry: e.value
        });
      } catch {
        l(
          `Initial value '${o}' is not a valid phone number when 'country-code' is set as ${e.value}.`
        );
      }
  return { initialData: a };
}, ut = '"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif';
function ct() {
  const e = document.createElement("canvas");
  e.width = e.height = 1;
  const o = e.getContext("2d", { willReadFrequently: !0 });
  return o.textBaseline = "top", o.font = `100px ${ut}`, o.scale(0.01, 0.01), o;
}
function Ae(e, o, r) {
  return e.clearRect(0, 0, 100, 100), e.fillStyle = r, e.fillText(o, 0, 0), e.getImageData(0, 0, 1, 1).data.join(",");
}
function be(e) {
  const o = ct(), r = Ae(o, e, "#fff"), t = Ae(o, e, "#000");
  return t === r && !t.startsWith("0,0,0,");
}
function ft(e = "Twemoji Country Flags", o = "https://cdn.jsdelivr.net/npm/country-flag-emoji-polyfill@0.1/dist/TwemojiCountryFlags.woff2") {
  if (typeof window < "u" && be("😊") && !be("🇨🇭")) {
    const r = document.createElement("style");
    return r.textContent = `@font-face {
      font-family: "${e}";
      unicode-range: U+1F1E6-1F1FF, U+1F3F4, U+E0062-E0063, U+E0065, U+E0067,
        U+E006C, U+E006E, U+E0073-E0074, U+E0077, U+E007F;
      src: url('${o}') format('woff2');
      font-display: swap;
    }`, document.head.appendChild(r), !0;
  }
  return !1;
}
const Ue = "flagsapi.com", Ne = "flagcdn.com", Pe = "sprite", ae = 24, Le = "w20", je = "flat", Te = 44 / 30, dt = /* @__PURE__ */ qe({
  __name: "FlagIcon",
  props: {
    flag: { type: Object, required: !1 },
    value: { type: String, required: !0 }
  },
  setup(e, { expose: o }) {
    o(), ft();
    const r = e, t = Me(r), l = x(
      () => t.flag.value || { strategy: Pe, size: ae }
    ), a = x(() => l.value.strategy === "sprite"), s = x(() => l.value.strategy === "emoji"), f = x(() => l.value.strategy === "api"), d = x(() => t.value.value.toLowerCase()), h = x(() => {
      if (a.value) {
        const n = l.value;
        return {
          width: n.size && `${n.size}px`,
          height: n.size && `${n.size / Te}px`
        };
      }
      if (s.value) {
        const n = l.value;
        return {
          fontSize: n.fontSize && (typeof n.fontSize == "string" ? n.fontSize : `${n.fontSize}px`)
        };
      }
      return {};
    }), c = x(() => s.value ? d.value.toUpperCase().split("").map((n) => String.fromCodePoint(n.charCodeAt(0) + 127397)).join("") : ""), E = x(() => {
      if (!f.value) return "";
      let n = l.value;
      if (n.cdn == "flagapi")
        return n = l.value, `https://${Ue}/${d.value.toUpperCase()}/${n.style || je}/${n.size || ae}.png`;
      if (n.cdn == "flagcdn")
        return n = l.value, `https://${Ne}/${n.size || Le}/${d.value}.png`;
    }), C = { FLAG_API_URL: Ue, FLAG_CDN_URL: Ne, DEFAULT_STRATEGY: Pe, DEFAULT_SIZE: ae, DEFAULT_SIZE_FLAG_CDN: Le, DEFAULT_STYLE_FLAG_API: je, SPRITE_RATIO: Te, props: r, refProps: t, flagConfig: l, isSpriteStrategy: a, isEmojiStrategy: s, isApiStrategy: f, isoCode: d, styles: h, emojiValue: c, apiUrl: E };
    return Object.defineProperty(C, "__isScriptSetup", { enumerable: !1, value: !0 }), C;
  }
}), Re = (e, o) => {
  const r = e.__vccOpts || e;
  for (const [t, l] of o)
    r[t] = l;
  return r;
}, vt = ["src"];
function mt(e, o, r, t, l, a) {
  return t.isSpriteStrategy ? (U(), L(
    "span",
    {
      key: 0,
      class: fe(["flag", `flag-${t.isoCode}`]),
      style: G(t.styles)
    },
    null,
    6
    /* CLASS, STYLE */
  )) : t.isEmojiStrategy ? (U(), L(
    "span",
    {
      key: 1,
      class: "emoji",
      style: G(t.styles)
    },
    $(t.emojiValue),
    5
    /* TEXT, STYLE */
  )) : t.isApiStrategy ? (U(), L("img", {
    key: 2,
    src: t.apiUrl,
    style: G(t.styles),
    loading: "lazy",
    decoding: "async",
    fetchpriority: "low",
    alt: ""
  }, null, 12, vt)) : T("v-if", !0);
}
const pt = /* @__PURE__ */ Re(dt, [["render", mt], ["__scopeId", "data-v-723d95c9"], ["__file", "/Users/shell/projects/vue-tel-num-input/src/components/FlagIcon.vue"]]), ue = 5, ht = /* @__PURE__ */ qe({
  __name: "TelNumInput",
  props: {
    size: { type: String, required: !1, default: "lg" },
    disableSizing: { type: Boolean, required: !1, default: !1 },
    countryCodes: { type: Array, required: !1, default: () => [] },
    excludeCountryCodes: { type: Array, required: !1, default: () => [] },
    defaultCountryCode: { type: String, required: !1, default: "US" },
    placeholder: { type: [Object, String], required: !1 },
    locale: { type: String, required: !1 },
    itemHeight: { type: Number, required: !1 },
    disabled: { type: Boolean, required: !1, default: !1 },
    silent: { type: Boolean, required: !1, default: !1 },
    flag: { type: Object, required: !1 },
    animationName: { type: String, required: !1, default: "fade" },
    initialValue: { type: String, required: !1, default: "" },
    international: { type: Boolean, required: !1, default: !0 },
    displayName: { type: String, required: !1, default: "english" },
    autoDetectCountry: { type: Boolean, required: !1, default: !1 },
    input: { type: Object, required: !1, default: () => ({
      required: !1,
      clearOnCountrySelect: !0,
      focusAfterCountrySelect: !0,
      formatterEnabled: !0
    }) },
    search: { type: Object, required: !1, default: () => ({
      hidden: !1,
      clearOnSelect: !0,
      autoFocus: !0
    }) },
    prefix: { type: Object, required: !1, default: () => ({
      hidden: !1,
      hideCode: !1,
      hideFlag: !1,
      hideCountryName: !1,
      hideChevron: !1
    }) },
    list: { type: Object, required: !1, default: () => ({
      hidden: !1,
      hideCode: !1,
      hideFlag: !1,
      hideCountryName: !1,
      returnToSelected: !0,
      itemsPerView: ue
    }) }
  },
  emits: ["update:modelValue", "toggle", "focus", "blur"],
  setup(e, { expose: o, emit: r }) {
    const t = r, l = e, a = {
      sm: 32,
      md: 36,
      lg: 40,
      xl: 48,
      xxl: 56
    }, {
      countryCodes: s,
      excludeCountryCodes: f,
      international: d,
      input: h,
      displayName: c,
      defaultCountryCode: E,
      silent: C,
      locale: n,
      placeholder: i,
      search: u,
      disableSizing: g,
      size: y,
      list: S,
      prefix: I,
      itemHeight: p,
      animationName: v,
      autoDetectCountry: N
    } = Me(l), w = Se(() => l.search.locale), F = Se(() => l.search.placeholder), b = (_) => `+${Je(_)}`, P = x(
      () => g.value ? "" : `tel-num-input--${y.value ?? "lg"}`
    ), q = x(
      () => (S.value.itemsPerView || ue) * k.value
    ), k = x(
      () => p.value || a[y.value || "lg"]
    ), M = x(
      () => Z.value.findIndex(
        (_) => b(_.iso) === m.value.code
      )
    ), R = x(() => !!h.value?.formatterEnabled), { validCountries: D, defaultIso: O } = et(
      s,
      f,
      E,
      C
    ), K = x(() => m.value.search), { results: Z } = rt({
      countries: D,
      query: K,
      codeGetter: b,
      limit: null
    }), { initialData: W } = at(
      O,
      l.initialValue,
      d.value,
      C
    ), { placVal: ze } = Fe(
      n,
      i,
      C,
      "Enter phone number"
    ), { placVal: De } = Fe(
      w,
      F,
      C,
      "Search..."
    ), ee = x(
      () => c.value == "english" ? "name" : "nativeName"
    ), { getNames: de } = Oe(), { name: ve, nativeName: me } = de(
      W?.country || O.value
    ), m = Q({
      iso: W?.country.toString() || O.value,
      name: (ee.value == "name" ? ve : me) || "",
      code: W?.countryCallingCode ? `+${W?.countryCallingCode}` : b(O.value),
      value: W ? l.initialValue : "",
      search: "",
      expanded: !1,
      valid: !1
    }), pe = x({
      get: () => m.value.value,
      set: (_) => m.value.value = _
    }), te = x({
      get: () => m.value.iso,
      set: (_) => m.value.iso = _
    }), ne = X("telNumInput"), oe = X("scrollList"), J = X("inputEl"), H = X("searchEl");
    st(ne, () => {
      le(!1);
    }), ke(() => {
      R.value && m.value.value && re();
    });
    const le = (_) => {
      _ == null ? m.value.expanded = !m.value.expanded : m.value.expanded = _, S.value.returnToSelected && m.value.expanded && M.value >= 0 && ce(
        () => oe.value?.scrollTo({
          top: M.value * k.value
        })
      ), t("toggle", m.value.expanded);
    }, he = (_) => {
      m.value = {
        ...m.value,
        ..._,
        expanded: !1
      }, u.value.clearOnSelect && (m.value.search = ""), h.value.clearOnCountrySelect && (m.value.value = ""), h.value.focusAfterCountrySelect && J.value?.focus();
    }, { setComposing: Be, formatNow: re } = lt({
      value: pe,
      iso: te,
      needFormat: R,
      inputEl: J,
      international: d,
      excludeCountryCodes: f,
      onAfterFormat: () => {
        t("update:modelValue", m.value);
      }
    }), { country: ge, requestUserCountry: ye } = it({
      enabled: N,
      validCountries: D,
      isoRef: te,
      silent: C
    });
    j(
      () => m.value.search,
      () => oe.value?.scrollTo({ top: 0 })
    ), j(
      () => m.value.iso,
      (_) => {
        if (!_) return;
        const V = _.toUpperCase(), xe = D.value.find((We) => We.iso === V);
        xe && (m.value = {
          ...m.value,
          iso: V,
          name: xe[ee.value] || "",
          code: b(V)
        });
      }
    ), j(H, () => {
      u.value.autoFocus && H.value && H.value.focus();
    }), j(
      () => m.value.value,
      (_) => {
        if (!_ || _.trim() === m.value.code) {
          m.value.valid = !h.value.required;
          return;
        }
        try {
          const V = Xe(
            _,
            m.value.iso
          );
          V && V.isValid() ? m.value.valid = !0 : m.value.valid = !1;
        } catch {
          m.value.valid = !1;
        }
      },
      { immediate: !0 }
    ), o({
      switchDropdown: le,
      selectItem: he,
      formatNow: re,
      inputEl: J,
      searchEl: H,
      telNumInputEl: ne,
      country: ge,
      requestUserCountry: ye
    });
    const Ce = { DEFAULT_ITEMS_PER_VIEW: ue, emit: t, props: l, rowSizes: a, countryCodes: s, excludeCountryCodes: f, international: d, input: h, displayName: c, defaultCountryCode: E, silent: C, locale: n, placeholder: i, search: u, disableSizing: g, size: y, list: S, prefix: I, itemHeight: p, animationName: v, autoDetectCountry: N, searchLocale: w, searchPlaceholder: F, getCountryCodeByIso: b, sizeClass: P, listHeight: q, itemHeightComp: k, selectedCountryIdx: M, needFormat: R, validCountries: D, defaultIso: O, searchQuery: K, filteredCountries: Z, initialData: W, placVal: ze, searchPlacVal: De, dispNameKey: ee, getNames: de, name: ve, nativeName: me, model: m, valueRef: pe, isoRef: te, telNumInputEl: ne, scrollListEl: oe, inputEl: J, searchEl: H, switchDropdown: le, selectItem: he, setComposing: Be, formatNow: re, country: ge, requestUserCountry: ye, FlagIcon: pt };
    return Object.defineProperty(Ce, "__isScriptSetup", { enumerable: !1, value: !0 }), Ce;
  }
}), gt = { class: "tel-num-input__head" }, yt = {
  key: 0,
  class: "prefix-container__code"
}, Ct = {
  key: 0,
  class: "prefix-container__country-name"
}, xt = {
  key: 0,
  class: "prefix-container__chevron",
  viewBox: "0 0 16 16"
}, St = ["maxLength", "placeholder", "disabled", "required"], _t = {
  key: 0,
  class: "tel-num-input__body"
}, Et = ["placeholder"], It = ["tabindex", "onClick"], wt = {
  key: 0,
  class: "tel-num-input__body--item__code"
}, Ft = {
  key: 0,
  class: "tel-num-input__body--item__country-name"
};
function At(e, o, r, t, l, a) {
  return U(), L(
    "div",
    {
      class: fe(["tel-num-input", [
        t.sizeClass,
        {
          expanded: t.model.expanded,
          empty: !t.filteredCountries.length,
          listHidden: t.list.hidden
        }
      ]]),
      ref: "telNumInput"
    },
    [
      B("div", gt, [
        t.prefix.hidden ? T("v-if", !0) : (U(), L("div", {
          key: 0,
          class: "prefix-container",
          onClick: o[0] || (o[0] = (s) => t.switchDropdown())
        }, [
          A(e.$slots, "prefix:before", {}, void 0, !0),
          A(e.$slots, "prefix:flag", {}, () => [
            t.prefix.hideFlag ? T("v-if", !0) : (U(), _e(t.FlagIcon, {
              key: 0,
              flag: r.flag,
              value: t.model.iso,
              class: "prefix-container__flag"
            }, null, 8, ["flag", "value"]))
          ], !0),
          A(e.$slots, "prefix:code", {}, () => [
            t.prefix.hideCode ? T("v-if", !0) : (U(), L(
              "span",
              yt,
              $(t.model.code),
              1
              /* TEXT */
            ))
          ], !0),
          A(e.$slots, "prefix:countryName", {}, () => [
            t.prefix.hideCountryName ? T("v-if", !0) : (U(), L(
              "span",
              Ct,
              $(t.model.name),
              1
              /* TEXT */
            ))
          ], !0),
          t.list.hidden ? T("v-if", !0) : A(e.$slots, "prefix:chevron", { key: 0 }, () => [
            t.prefix.hideChevron ? T("v-if", !0) : (U(), L("svg", xt, [...o[7] || (o[7] = [
              B(
                "path",
                { d: "M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708" },
                null,
                -1
                /* CACHED */
              )
            ])]))
          ], !0),
          A(e.$slots, "prefix:after", {}, void 0, !0)
        ])),
        A(e.$slots, "input", {}, () => [
          Ee(B("input", {
            type: "text",
            ref: "inputEl",
            maxLength: t.input.maxLength,
            onCompositionstart: o[1] || (o[1] = (s) => t.setComposing(!0)),
            onCompositionend: o[2] || (o[2] = (s) => t.setComposing(!1)),
            "onUpdate:modelValue": o[3] || (o[3] = (s) => t.model.value = s),
            onFocus: o[4] || (o[4] = (s) => t.emit("focus")),
            onBlur: o[5] || (o[5] = (s) => t.emit("blur")),
            placeholder: t.placVal,
            disabled: r.disabled,
            required: t.input.required
          }, null, 40, St), [
            [Ie, t.model.value]
          ])
        ], !0)
      ]),
      Ge(Ke, { name: t.animationName }, {
        default: He(() => [
          t.model.expanded && !t.list.hidden ? (U(), L("div", _t, [
            A(e.$slots, "body:search", {}, () => [
              B(
                "div",
                {
                  class: "search-container",
                  style: G({ height: `${t.itemHeightComp}px` })
                },
                [
                  A(e.$slots, "search:before", {}, void 0, !0),
                  A(e.$slots, "search:icon", {}, () => [
                    o[8] || (o[8] = B(
                      "svg",
                      {
                        width: "50",
                        height: "50",
                        viewBox: "0 0 50 50"
                      },
                      [
                        B("path", { d: "M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z" })
                      ],
                      -1
                      /* CACHED */
                    ))
                  ], !0),
                  A(e.$slots, "search:input", {}, () => [
                    t.search.hidden ? T("v-if", !0) : Ee((U(), L("input", {
                      key: 0,
                      ref: "searchEl",
                      type: "text",
                      "onUpdate:modelValue": o[6] || (o[6] = (s) => t.model.search = s),
                      placeholder: t.searchPlacVal
                    }, null, 8, Et)), [
                      [Ie, t.model.search]
                    ])
                  ], !0),
                  A(e.$slots, "search:after", {}, void 0, !0)
                ],
                4
                /* STYLE */
              )
            ], !0),
            B(
              "div",
              {
                class: "list-container",
                ref: "scrollList",
                style: G({ maxHeight: `${t.listHeight}px` })
              },
              [
                (U(!0), L(
                  $e,
                  null,
                  Ye(t.filteredCountries, (s, f) => (U(), L("div", {
                    tabindex: f,
                    onClick: (d) => t.selectItem(s),
                    class: fe([{ selected: t.model.iso == s.iso }, "tel-num-input__body--item"]),
                    key: f,
                    style: G({ height: `${t.itemHeightComp}px` })
                  }, [
                    A(e.$slots, "item:before", {}, void 0, !0),
                    A(e.$slots, "item:flag", {}, () => [
                      t.list.hideFlag ? T("v-if", !0) : (U(), _e(t.FlagIcon, {
                        key: 0,
                        flag: r.flag,
                        value: s.iso,
                        class: "tel-num-input__body--item__flag"
                      }, null, 8, ["flag", "value"]))
                    ], !0),
                    A(e.$slots, "item:code", {}, () => [
                      t.list.hideCode ? T("v-if", !0) : (U(), L(
                        "span",
                        wt,
                        $(t.getCountryCodeByIso(s.iso)),
                        1
                        /* TEXT */
                      ))
                    ], !0),
                    A(e.$slots, "item:countryName", {}, () => [
                      t.list.hideCountryName ? T("v-if", !0) : (U(), L(
                        "span",
                        Ft,
                        $(s[t.dispNameKey]),
                        1
                        /* TEXT */
                      ))
                    ], !0),
                    A(e.$slots, "item:after", {}, void 0, !0)
                  ], 14, It))),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ],
              4
              /* STYLE */
            )
          ])) : T("v-if", !0)
        ]),
        _: 3
        /* FORWARDED */
      }, 8, ["name"])
    ],
    2
    /* CLASS */
  );
}
const Lt = /* @__PURE__ */ Re(ht, [["render", At], ["__scopeId", "data-v-b4a819a6"], ["__file", "/Users/shell/projects/vue-tel-num-input/src/components/TelNumInput.vue"]]);
export {
  Lt as default
};
