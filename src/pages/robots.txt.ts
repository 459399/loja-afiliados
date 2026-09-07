import type { APIRoute } from "astro";
import config from "../data/config.json";

const sitemap = new URL(
  `${config.base}/sitemap-index.xml`.replace(/\/{2,}/g, "/"),
  config.url,
).toString();

export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { "Content-Type": "text/plain" },
  });
