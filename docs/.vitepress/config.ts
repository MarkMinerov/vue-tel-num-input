import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vue Tel Input",
  description: "A VitePress Site",
  base: "/vue-tel-num-input/",
  themeConfig: {
    search: {
      provider: "local",
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Getting Started", link: "/getting-started" },
      { text: "Examples", link: "/examples" },
    ],
    logo: {
      light: "/logo.svg",
      dark: "/logo.svg",
    },

    sidebar: [
      {
        text: "Introduction",
        collapsed: false,
        items: [
          { text: "Getting Started", link: "/getting-started" },
          { text: "Examples", link: "/examples" },
        ],
      },
      {
        text: "Usage",
        collapsed: false,
        items: [
          { text: "Props", link: "/props" },
          { text: "Events", link: "/events" },
          { text: "Slots", link: "/slots" },
        ],
      },
    ],

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/MarkMinerov/vue-tel-num-input",
      },
    ],
  },
});
