import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/Bont-on-fitness/" : "/",
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: [".manus.computer"],
  },
  optimizeDeps: {
    exclude: [],
  },
}));
