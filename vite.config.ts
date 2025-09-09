import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

const externals = ["vue", "libphonenumber-js"];

export default defineConfig({
  plugins: [
    vue(),
    dts({ entryRoot: "src", outDir: "dist/types", include: ["src"] }),
  ],
  resolve: { alias: { "~": path.resolve(__dirname, "./src") } },
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, "src/index.ts"),
        sprite: path.resolve(__dirname, "src/css.entry.ts"),
      },
      formats: ["es", "cjs"],
      fileName: (format, name) => `${name}.${format}.js`,
    },
    cssCodeSplit: true,
    rollupOptions: {
      external: (id) =>
        externals.some((p) => id === p || id.startsWith(`${p}/`)),
      output: {
        globals: { vue: "Vue" },
        entryFileNames: "[name].[format].js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: (asset) => {
          const names = asset.names ?? (asset.name ? [asset.name] : []);
          if (names.some((n) => n.endsWith(".css"))) {
            if (names.some((n) => /sprite/i.test(n))) return "css/sprite.css";
            return "css/style.css";
          }
          if (names.some((n) => /\.(png|jpe?g|svg|webp)$/i.test(n))) {
            if (names.some((n) => /sprite/i.test(n)))
              return "flags/[name][extname]";
            return "assets/[name][extname]";
          }
          return "assets/[name][extname]";
        },
      },
      plugins: [visualizer({ filename: "stats.html", open: false })],
    },
  },
});
