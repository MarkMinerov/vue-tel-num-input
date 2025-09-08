import { onMounted, onBeforeUnmount, Ref } from "vue";

export const onClickOutside = (
  target: Ref<HTMLElement | null | undefined>,
  handler: (evt: MouseEvent) => void
) => {
  const listener = (evt: MouseEvent) => {
    const el = target.value;
    if (!el) return;
    if (el === evt.target || el.contains(evt.target as Node)) return;
    handler(evt);
  };

  onMounted(() => {
    document.addEventListener("click", listener, true);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("click", listener, true);
  });
};
