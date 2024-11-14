// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// Uncomment if you wish to use the visualizer
// import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    // visualizer({ open: true }),
  ],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "./src/components"),
      "@zustand": path.resolve(__dirname, "./src/zustand"),
      react: path.resolve("./node_modules/react"),
    },
  },
  optimizeDeps: {
    include: ["wavesurfer.js", "zustand"],
  },
  build: {
    target: "es2015",
    minify: "esbuild",
    sourcemap: false,
    chunkSizeWarningLimit: 500,
    cssCodeSplit: true,
    assetsInlineLimit: 0,
  },
  // esbuild: {
  //   jsxInject: `import React from 'react'`,
  // },
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  },
});
