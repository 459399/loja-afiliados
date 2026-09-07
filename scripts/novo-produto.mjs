#!/usr/bin/env node
/**
 * Adiciona um novo produto ao catálogo (src/data/produtos.json).
 * Uso:  npm run novo-produto
 * Ele faz perguntas no terminal e gera um esqueleto pronto para você editar.
 */
import { readFile, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const arquivoProdutos = join(raiz, "src", "data", "produtos.json");
const arquivoCategorias = join(raiz, "src", "data", "categorias.json");

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const rl = createInterface({ input, output });

const categorias = JSON.parse(await readFile(arquivoCategorias, "utf8"));
const produtos = JSON.parse(await readFile(arquivoProdutos, "utf8"));

console.log("\nCategorias:", categorias.map((c) => c.slug).join(", "), "\n");

const titulo = await rl.question("Título do produto: ");
const categoria =
  (await rl.question(`Categoria [${categorias[0].slug}]: `)) || categorias[0].slug;
const nota = Number((await rl.question("Nota de 0 a 5 [4.5]: ")) || "4.5");
const preco = (await rl.question('Preço aproximado [ex: "R$ 100 a R$ 200"]: ')) || "";
const resumo = await rl.question("Resumo em uma frase: ");
const urlAmazon = await rl.question("URL na Amazon (enter para pular): ");
const urlML = await rl.question("URL no Mercado Livre (enter para pular): ");

await rl.close();

const lojas = [];
if (urlAmazon.trim()) lojas.push({ loja: "amazon", url: urlAmazon.trim(), preco: "" });
if (urlML.trim()) lojas.push({ loja: "mercadolivre", url: urlML.trim(), preco: "" });

let slug = slugify(titulo);
if (produtos.some((p) => p.slug === slug)) slug = `${slug}-${Date.now().toString().slice(-4)}`;

const novo = {
  slug,
  titulo,
  categoria,
  imagem: "/img/placeholder.svg",
  nota,
  preco_aprox: preco,
  destaque: false,
  resumo,
  pros: ["EDITE: ponto forte 1", "EDITE: ponto forte 2"],
  contras: ["EDITE: ponto fraco 1"],
  analise:
    "EDITE: escreva uma análise real, específica e honesta. Diga para quem serve, para quem não serve, e compare com 1-2 concorrentes.",
  specs: { "EDITE especificação": "valor" },
  lojas,
  atualizado_em: new Date().toISOString().slice(0, 10),
};

produtos.push(novo);
await writeFile(arquivoProdutos, JSON.stringify(produtos, null, 2) + "\n");

console.log(`\n✓ Produto adicionado: /produto/${slug}/`);
console.log("  Agora edite src/data/produtos.json e troque os campos com 'EDITE'.");
console.log("  Rode 'npm run dev' para ver.\n");
