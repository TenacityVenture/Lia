import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import { viteStaticCopy } from "vite-plugin-static-copy";
import manifest from "./manifest.json";

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
    viteStaticCopy({
      targets: [
        {
          src: "css/*",
          dest: "css",
        },
      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        popup: "popup/popup.html",
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
    cors: true,
  },
});
