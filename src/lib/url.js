/**
 * Monta um link interno respeitando o `base` do site.
 * No GitHub Pages o site fica em /loja-afiliados/, então um link "/produto/x/"
 * precisa virar "/loja-afiliados/produto/x/". Use sempre esta função em href
 * de páginas internas.
 *
 *   import { rota } from "../lib/url.js";
 *   <a href={rota("/produto/abc/")}>...</a>
 */
const BASE = import.meta.env.BASE_URL || "/";

export function rota(caminho = "/") {
  return `${BASE}/${caminho}`.replace(/\/{2,}/g, "/");
}
