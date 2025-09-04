import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import path from "path";

export default defineConfig({
    plugins: [vue(), dts({ entryRoot: "src", outDir: "dist/types", include: ["src"] })],
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            name: "VueTelNumInput",
            fileName: (format) => `index.${format}.js`,
            formats: ["es", "cjs"],
        },
        rollupOptions: { external: ["vue"], plugins: [visualizer({ filename: "stats.html", gzipSize: true })] },
    },
});
