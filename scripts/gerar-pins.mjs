#!/usr/bin/env node
/**
 * Gera imagens de pin do Pinterest (1000x1500 PNG) a partir de definições
 * de texto. Uso:  node scripts/gerar-pins.mjs
 * Saída em pins/*.png
 */
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const saida = join(raiz, "pins");

const W = 1000;
const H = 1500;

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function svgPin({ kicker, linhas, rodape, cor, corEscura }) {
  const startY = 560;
  const lh = 132;
  const tituloTspans = linhas
    .map(
      (l, i) =>
        `<tspan x="90" y="${startY + i * lh}">${esc(l)}</tspan>`,
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${cor}"/>
      <stop offset="1" stop-color="${corEscura}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect x="90" y="120" width="120" height="10" rx="5" fill="#ffffff"/>
  <text x="90" y="185" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" letter-spacing="3" fill="#ffffff">ACHADOS DA SEMANA</text>
  <text x="90" y="300" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="700" fill="#ffffff" opacity="0.85">${esc(kicker)}</text>
  <text font-family="Arial, Helvetica, sans-serif" font-size="108" font-weight="800" fill="#ffffff">${tituloTspans}</text>
  <rect x="90" y="${H - 260}" width="${W - 180}" height="4" fill="#ffffff" opacity="0.5"/>
  <text x="90" y="${H - 190}" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="700" fill="#ffffff">${esc(rodape)}  →</text>
  <text x="90" y="${H - 120}" font-family="Arial, Helvetica, sans-serif" font-size="32" fill="#ffffff" opacity="0.8">459399.github.io/loja-afiliados</text>
</svg>`;
}

const CORES = {
  cozinha: ["#F0632A", "#B83E12"],
  eletronicos: ["#2C6BE8", "#173F95"],
  casa: ["#1FA55E", "#127A43"],
  beleza: ["#D64B8A", "#9E2E63"],
  pet: ["#7A5CE8", "#4E38A8"],
  fitness: ["#E8A21F", "#B87A12"],
};

const pins = [
  {
    arquivo: "01-guia-air-fryer",
    tema: "cozinha",
    kicker: "Guia de compra",
    linhas: ["Qual air fryer", "comprar em", "2026?"],
    rodape: "Ver o comparativo por preço",
  },
  {
    arquivo: "02-guia-smartwatch",
    tema: "eletronicos",
    kicker: "Guia de compra",
    linhas: ["Smartwatch", "barato: relógio", "ou pulseira?"],
    rodape: "Como escolher o seu",
  },
  {
    arquivo: "03-guia-fone",
    tema: "eletronicos",
    kicker: "Guia de compra 2026",
    linhas: ["Fone Bluetooth", "bom e barato"],
    rodape: "2 opções por perfil de uso",
  },
  {
    arquivo: "04-echo-dot",
    tema: "eletronicos",
    kicker: "Análise honesta",
    linhas: ["Echo Dot 5", "vale a pena", "em 2026?"],
    rodape: "Para quem sim, para quem não",
  },
  {
    arquivo: "05-organizador-gaveta",
    tema: "casa",
    kicker: "Casa e organização",
    linhas: ["Gaveta", "bagunçada?"],
    rodape: "Os organizadores que resolvem",
  },
  {
    arquivo: "06-protetor-solar",
    tema: "beleza",
    kicker: "Beleza e autocuidado",
    linhas: ["Protetor solar", "facial: com cor", "ou sem cor?"],
    rodape: "Qual FPS usar no rosto",
  },
  {
    arquivo: "07-robo-aspirador",
    tema: "casa",
    kicker: "Vale a pena?",
    linhas: ["Robô aspirador", "para quem", "nunca teve"],
    rodape: "O que ele resolve (e o que não)",
  },
  {
    arquivo: "08-fonte-pet",
    tema: "pet",
    kicker: "Pet",
    linhas: ["Seu gato bebe", "pouca água?"],
    rodape: "A fonte que os vets recomendam",
  },
  {
    arquivo: "09-escova-secadora",
    tema: "beleza",
    kicker: "Beleza e autocuidado",
    linhas: ["Escova de salão", "em casa em", "10 minutos"],
    rodape: "Para qual cabelo funciona",
  },
  {
    arquivo: "10-faixas-resistencia",
    tema: "fitness",
    kicker: "Fitness em casa",
    linhas: ["Treino de força", "que cabe numa", "gaveta"],
    rodape: "Qual kit escolher para começar",
  },
];

await mkdir(saida, { recursive: true });

for (const p of pins) {
  const [cor, corEscura] = CORES[p.tema];
  const svg = svgPin({ ...p, cor, corEscura });
  const destino = join(saida, `${p.arquivo}.png`);
  await sharp(Buffer.from(svg)).png().toFile(destino);
  console.log("✓", `pins/${p.arquivo}.png`);
}

console.log(`\n${pins.length} pins gerados em pins/`);
