import config from "../data/config.json";

/**
 * Recebe uma URL "crua" de um produto na loja e devolve a URL com o
 * seu código de afiliado anexado. Se o programa estiver desativado no
 * config.json, devolve a URL original (útil enquanto você não foi aprovado).
 *
 * NUNCA invente parâmetros de afiliado: cada plataforma tem o seu formato
 * oficial. Os abaixo são os formatos publicados por Amazon e Mercado Livre.
 */
export function linkAfiliado(loja, urlCrua) {
  try {
    const url = new URL(urlCrua);
    const af = config.afiliados?.[loja];
    if (!af || af.ativo === false) return urlCrua;

    if (loja === "amazon" && af.tag) {
      url.searchParams.set("tag", af.tag);
      url.searchParams.set("linkCode", "ll1");
      url.searchParams.set("language", "pt_BR");
    }

    if (loja === "mercadolivre" && af.matt_word) {
      // Formato do programa de afiliados do Mercado Livre.
      url.searchParams.set("matt_word", af.matt_word);
      url.searchParams.set("matt_tool", "site");
    }

    // Shopee e outros: normalmente você cola o link já encurtado que a
    // plataforma gera no painel de afiliado, então não mexemos.
    return url.toString();
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
