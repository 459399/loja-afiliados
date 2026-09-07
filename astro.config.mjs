import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import site from "./src/data/config.json" with { type: "json" };

// https://astro.build/config
export default defineConfig({
  // `url` é a origem (ex: https://459399.github.io).
  // `base` é o subcaminho no GitHub Pages (ex: /loja-afiliados).
  // Com domínio próprio depois, troque `url` pelo domínio e `base` por "/".
  site: site.url,
  base: site.base || "/",
  trailingSlash: "ignore",
  integrations: [sitemap()],
  build: {
    format: "directory",
  },
});
