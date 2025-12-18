import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// @ts-ignore
const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
// @ts-ignore - version conflict between root and wispr-flow node_modules
export default defineConfig({
  // @ts-ignore
  plugins: [react(), tailwindcss()],

  clearScreen: false,

  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
} as any);
