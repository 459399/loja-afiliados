import config from "../data/config.json";

/**
 * Recebe uma URL de um produto na loja e devolve a URL com o seu código de
 * afiliado. Se o programa estiver desativado no config.json, ou se a URL já
 * for um link de afiliado pronto (ex: meli.la/xxx, amzn.to/xxx), devolve como
 * está.
 *
 * NUNCA invente parâmetros de afiliado: cada plataforma tem o seu formato
 * oficial e mexer no link errado faz perder a comissão.
 */

// Domínios que já são links de afiliado encurtados — não mexer.
const JA_PRONTOS = ["meli.la", "amzn.to", "s.shopee.com.br", "shope.ee"];

export function linkAfiliado(loja, urlCrua) {
  try {
    const url = new URL(urlCrua);

    if (JA_PRONTOS.includes(url.hostname)) return urlCrua;

    const af = config.afiliados?.[loja];
    if (!af || af.ativo === false) return urlCrua;

    if (loja === "amazon" && af.tag) {
      url.searchParams.set("tag", af.tag);
      url.searchParams.set("linkCode", "ll1");
      url.searchParams.set("language", "pt_BR");
      return url.toString();
    }

    if (loja === "mercadolivre" && af.matt_word) {
      // Só usado se você colar uma URL "crua" do Mercado Livre em vez do
      // link meli.la gerado no painel. O ideal é sempre usar o meli.la.
      url.searchParams.set("matt_word", af.matt_word);
      url.searchParams.set("matt_tool", "88344338");
      return url.toString();
    }

    return urlCrua;
  } catch {
    return urlCrua;
  }
}

export function nomeLoja(loja) {
  return (
    {
      amazon: "Amazon",
      mercadolivre: "Mercado Livre",
      shopee: "Shopee",
    }[loja] || loja
  );
}

/** Existe pelo menos um programa de afiliado ligado? */
export function algumAfiliadoAtivo() {
  return Object.values(config.afiliados || {}).some((a) => a && a.ativo);
}
