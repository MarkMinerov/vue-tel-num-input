<template>
  <span
    v-if="isSpriteStrategy"
    class="flag"
    :style="styles"
    :class="`flag-${isoCode}`"
  />
  <span v-else-if="isEmojiStrategy" class="emoji" :style="styles">{{
    emojiValue
  }}</span>
  <img
    v-else-if="isApiStrategy"
    :src="apiUrl"
    :style="styles"
    loading="lazy"
    decoding="async"
    fetchpriority="low"
    alt=""
  />
</template>

<script setup lang="ts">
import { toRefs, computed } from "vue";
import type {
  FlagConfig,
  SpriteConfig,
  EmojiConfig,
  FlagCdnExt,
  FlagApiExt,
} from "~/types";

const FLAG_API_URL = "flagsapi.com";
const FLAG_CDN_URL = "flagcdn.com";

const DEFAULT_STRATEGY = "sprite";
const DEFAULT_SIZE = 24;
const DEFAULT_SIZE_FLAG_CDN = "w20";
const DEFAULT_STYLE_FLAG_API = "flat";
const SPRITE_RATIO = 44 / 30;

const props = defineProps<{
  flag?: FlagConfig;
  value: string;
}>();

const refProps = toRefs(props);
const flagConfig = computed<FlagConfig>(
  () =>
    refProps.flag.value || { strategy: DEFAULT_STRATEGY, size: DEFAULT_SIZE }
);

const isSpriteStrategy = computed(() => flagConfig.value.strategy === "sprite");
const isEmojiStrategy = computed(() => flagConfig.value.strategy === "emoji");
const isApiStrategy = computed(() => flagConfig.value.strategy === "api");

const isoCode = computed(() => refProps.value.value.toLowerCase());

const styles = computed(() => {
  if (isSpriteStrategy.value) {
    const cfg = flagConfig.value as SpriteConfig;
    return {
      width: cfg.size && `${cfg.size}px`,
      height: cfg.size && `${cfg.size / SPRITE_RATIO}px`,
    };
  }

  if (isEmojiStrategy.value) {
    const cfg = flagConfig.value as EmojiConfig;
    return {
      fontSize:
        cfg.fontSize &&
        (typeof cfg.fontSize == "string" ? cfg.fontSize : `${cfg.fontSize}px`),
    };
  }

  return {};
});

const emojiValue = computed(() => {
  if (!isEmojiStrategy.value) return "";
  return isoCode.value
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    .join("");
});

const apiUrl = computed(() => {
  if (!isApiStrategy.value) return "";
  let cfg = flagConfig.value as FlagCdnExt | FlagApiExt;

  if (cfg.cdn == "flagapi") {
    cfg = flagConfig.value as FlagApiExt;
    return `https://${FLAG_API_URL}/${isoCode.value.toUpperCase()}/${
      cfg.style || DEFAULT_STYLE_FLAG_API
    }/${cfg.size || DEFAULT_SIZE}.png`;
  }

  if (cfg.cdn == "flagcdn") {
    cfg = flagConfig.value as FlagCdnExt;
    return `https://${FLAG_CDN_URL}/${cfg.size || DEFAULT_SIZE_FLAG_CDN}/${
      isoCode.value
    }.png`;
  }
});
</script>

<style lang="scss" scoped></style>
