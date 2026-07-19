// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://bonyambe-sudo.github.io",
  base: "/portfolio-dev/",
  trailingSlash: "always",

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:3000",
          changeOrigin: true,
        },
      },
    },
  },
});
