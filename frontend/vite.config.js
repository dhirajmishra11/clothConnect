import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {

      "/api": "https://clothconnect-backend.onrender.com", // backendapi

    },
  },
  optimizeDeps: {
    include: ['@fontsource/inter', '@fontsource/poppins']
  },
  resolve: {
    alias: {
      '@fontsource': '/node_modules/@fontsource'
    }
  }
});
