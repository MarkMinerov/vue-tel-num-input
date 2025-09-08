export type CountryConfig = {
  name: string;
  nativeName: string;
};

export type ConfigType = {
  [key: string]: CountryConfig;
};

export interface EmojiConfig {
  strategy: "emoji";
  fontSize?: string | number;
}

export interface SpriteConfig {
  strategy: "sprite";
  size?: number;
}

export interface FlagApiExt {
  strategy: "api";
  cdn: "flagapi";
  size?: "16" | "24" | "32" | "48" | "64";
  style?: "shiny" | "flat";
}

export interface Country {
  iso: string;
  name: string;
  nativeName: string;
}

export interface TelInputModel {
  iso: string;
  name: string;
  code: string;
  value: string;
  search: string;
  expanded: boolean;
}

export type TelInputInitModel = Readonly<Partial<TelInputModel>>;

type FlagCdnSize =
  | "16x12"
  | "20x15"
  | "24x18"
  | "28x21"
  | "32x24"
  | "36x27"
  | "40x30"
  | "48x36"
  | "56x42"
  | "60x45"
  | "64x48"
  | "72x54"
  | "80x60"
  | "84x63"
  | "96x72"
  | "108x81"
  | "112x84"
  | "120x90"
  | "128x96"
  | "144x108"
  | "160x120"
  | "192x144"
  | "224x168"
  | "256x192"
  | "w20"
  | "w40"
  | "w80"
  | "w160"
  | "w320"
  | "w640"
  | "w1280"
  | "w2560";

export interface FlagCdnExt {
  strategy: "api";
  cdn: "flagcdn";
  size?: FlagCdnSize;
  style?: "waving" | "original";
}

type FlagConfigBase = EmojiConfig | SpriteConfig;
//prettier-ignore
type FlagConfigApi =  ({ strategy: "api"; cdn: "flagapi" } & Omit<FlagApiExt, "strategy" | "cdn">)
                    | ({ strategy: "api"; cdn: "flagcdn" } & Omit<FlagCdnExt, "strategy" | "cdn">);

export type FlagConfig = FlagConfigBase | FlagConfigApi;
