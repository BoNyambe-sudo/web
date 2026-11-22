// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

// This deployment is redirect-only. The canonical site now lives at
// https://www.bonyambe.com (deployed separately on Vercel). Every page built here
// redirects to the same path on the new domain so legacy GitHub Pages links keep
// working. No sitemap is generated because these URLs should not be indexed.
export default defineConfig({
  site: "https://bonyambe-sudo.github.io",
  base: "/web",
  trailingSlash: "always",

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
  },
});