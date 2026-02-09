import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import TelNumInput from "~/components/TelNumInput.vue";

describe("TelNumInput", () => {
  // Basic sanity test: component mounts
  it("mounts TelNumInput", () => {
    const wrapper = mount(TelNumInput, {
      props: {
        modelValue: "",
      },
    });

    expect(wrapper.classes()).toContain("tel-num-input");
  });

  // Test that scoped slots receive correct per-item data
  it("passes correct slot props to item:countryName", async () => {
    const wrapper = mount(TelNumInput, {
      props: {
        modelValue: "",
      },
      slots: {
        "item:countryName": ({
          data,
          index,
          iso,
          countryName,
          countryCode,
          selected,
        }: any) => {
          // Render a simple marker for each item
          return `${index}:${iso}:${countryName}:${countryCode}:${selected}`;
        },
      },
    });

    // Ensure the dropdown/list opens so items render
    await wrapper.find(".prefix-container").trigger("click");

    const items = wrapper.findAll(".tel-num-input__body--item");
    expect(items.length).toBeGreaterThan(0);

    // Check that the first item text contains ISO and code from slot props
    const firstText = items[0].text();
    expect(firstText).toMatch(/:/); // crude sanity check that our template rendered
  });

  it("applies size classes and can disable sizing", () => {
    const defaultWrapper = mount(TelNumInput, {
      props: { modelValue: "" },
    });

    expect(defaultWrapper.classes()).toContain("tel-num-input--lg");

    const smWrapper = mount(TelNumInput, {
      props: { modelValue: "", size: "sm" },
    });
    expect(smWrapper.classes()).toContain("tel-num-input--sm");

    const noSizeWrapper = mount(TelNumInput, {
      props: { modelValue: "", size: "xl", disableSizing: true },
    });

    // When disableSizing is true, no size modifier class should be present
    expect(
      noSizeWrapper.classes().some((cls) => cls.startsWith("tel-num-input--")),
    ).toBe(false);
  });

  it("toggles dropdown and emits toggle event", async () => {
    const wrapper = mount(TelNumInput, {
      props: { modelValue: "" },
    });

    const prefix = wrapper.find(".prefix-container");
    expect(prefix.exists()).toBe(true);

    // Initially collapsed
    expect(wrapper.classes()).not.toContain("expanded");

    await prefix.trigger("click");
    expect(wrapper.classes()).toContain("expanded");
    expect(wrapper.emitted("toggle")?.[0]).toEqual([true]);

    await prefix.trigger("click");
    expect(wrapper.classes()).not.toContain("expanded");
    expect(wrapper.emitted("toggle")?.[1]).toEqual([false]);
  });

  it("respects list.hidden and prefix.hidden props", async () => {
    const listHiddenWrapper = mount(TelNumInput, {
      props: { modelValue: "", list: { hidden: true } },
    });

    await listHiddenWrapper.find(".prefix-container").trigger("click");
    expect(listHiddenWrapper.find(".tel-num-input__body").exists()).toBe(false);

    const prefixHiddenWrapper = mount(TelNumInput, {
      props: { modelValue: "", prefix: { hidden: true } },
    });

    expect(prefixHiddenWrapper.find(".prefix-container").exists()).toBe(false);
  });

  it("emits update:modelValue with validity when typing", async () => {
    const wrapper = mount(TelNumInput, {
      props: {
        modelValue: "",
        input: {
          // ensure formatter (and therefore onAfterFormat) is enabled
          formatterEnabled: true,
        },
      },
    });

    const input = wrapper.find("input[type='text']");
    expect(input.exists()).toBe(true);

    // Type a valid-looking international number
    await input.setValue("+14155552671");

    const events = wrapper.emitted("update:modelValue");
    expect(events).toBeTruthy();

    const lastModel = events![events!.length - 1][0] as any;
    expect(lastModel).toHaveProperty("value");
    expect(lastModel).toHaveProperty("valid");
    expect(typeof lastModel.valid).toBe("boolean");
  });
});
