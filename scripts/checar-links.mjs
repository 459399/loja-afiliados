#!/usr/bin/env node
/**
 * Verificação rápida antes de publicar:
 *  - avisa se ainda há valores de exemplo no config.json / produtos.json
 *  - faz uma requisição em cada URL de loja e mostra o status HTTP
 * Uso:  npm run checar-links
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(await readFile(join(raiz, "src/data/config.json"), "utf8"));
const produtos = JSON.parse(await readFile(join(raiz, "src/data/produtos.json"), "utf8"));

let problemas = 0;

if (config.url.includes("SEU-DOMINIO")) {
  console.warn("⚠  config.json: troque 'url' pelo seu domínio real.");
  problemas++;
}
for (const [rede, dados] of Object.entries(config.afiliados)) {
  if (dados.ativo && JSON.stringify(dados).includes("SEU-")) {
    console.warn(`⚠  config.json: afiliado '${rede}' está ativo mas ainda tem código de exemplo.`);
    problemas++;
  }
}

console.log(`\nVerificando ${produtos.length} produtos...\n`);

for (const p of produtos) {
  if (JSON.stringify(p).includes("EXEMPLO") || p.analise.includes("EDITE")) {
    console.warn(`⚠  ${p.slug}: ainda contém texto/URL de exemplo.`);
    problemas++;
  }
  for (const loja of p.lojas) {
    try {
      const r = await fetch(loja.url, { method: "GET", redirect: "follow" });
      const ok = r.status < 400;
      console.log(`${ok ? "✓" : "✗"} [${r.status}] ${p.slug} → ${loja.loja}`);
      if (!ok) problemas++;
    } catch (e) {
      console.log(`✗ [erro] ${p.slug} → ${loja.loja}: ${e.message}`);
      problemas++;
    }
  }
}

console.log(
  problemas === 0
    ? "\n✓ Tudo certo para publicar.\n"
    : `\n${problemas} ponto(s) de atenção acima.\n`,
);
process.exit(problemas === 0 ? 0 : 1);
