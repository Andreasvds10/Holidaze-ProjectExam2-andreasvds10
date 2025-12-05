// @ts-nocheck
/* eslint-disable */

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Minimal and stable. No alias tricks, no ESM dirname headaches.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    open: true,
  },
  preview: {
    host: true,
  },
  build: {
    target: "es2020",
    sourcemap: true,
  },
});
