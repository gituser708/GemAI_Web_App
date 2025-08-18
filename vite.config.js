import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const isProd = process.env.NODE_ENV === "production";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "localhost",
    port: 3000,
    proxy: {
      "/api": {
        target: "https://gemai-server.onrender.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    outDir: "dist",
  },
  define: {
    "process.env": {
      API_BASE_URL: isProd
        ? "https://gemai-server.onrender.com" // prod backend
        : "", // dev → Vite proxy handles /api
    },
  },
});
