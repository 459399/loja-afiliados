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

  // --- Lote 2 ---
  {
    arquivo: "11-air-fryer-forno",
    tema: "cozinha",
    kicker: "Guia de compra",
    linhas: ["Air fryer forno", "12L: para", "família grande"],
    rodape: "Assa frango inteiro e mais",
  },
  {
    arquivo: "12-fone-melobuds-pro",
    tema: "eletronicos",
    kicker: "Guia de compra",
    linhas: ["Fone com", "cancelamento de", "ruído de verdade"],
    rodape: "Sem pagar preço de marca grande",
  },
  {
    arquivo: "13-smart-band-9",
    tema: "fitness",
    kicker: "Fitness e bem-estar",
    linhas: ["A pulseira", "fitness que você", "esquece no pulso"],
    rodape: "Bateria de quase 2 semanas",
  },
  {
    arquivo: "14-air-fryer-qual-tamanho",
    tema: "cozinha",
    kicker: "Dúvida comum",
    linhas: ["Air fryer 4L", "ou 12L?", "Qual escolher"],
    rodape: "Guia rápido por tamanho de família",
  },
  {
    arquivo: "15-echo-dot-5-coisas",
    tema: "eletronicos",
    kicker: "Você sabia?",
    linhas: ["5 coisas que", "o Echo Dot", "faz por você"],
    rodape: "Além de tocar música",
  },
  {
    arquivo: "16-organizacao-cozinha",
    tema: "casa",
    kicker: "Casa e organização",
    linhas: ["Cozinha pequena?", "Comece pela", "gaveta"],
    rodape: "O primeiro passo mais barato",
  },
  {
    arquivo: "17-robo-aspirador-vale-a-pena",
    tema: "casa",
    kicker: "Vale a pena?",
    linhas: ["Vale gastar", "R$ 1.000 num", "robô aspirador?"],
    rodape: "A resposta honesta",
  },
  {
    arquivo: "18-gato-agua-torneira",
    tema: "pet",
    kicker: "Pet · atenção",
    linhas: ["Seu gato bebe", "água de torneira", "aberta?"],
    rodape: "Pode ser um sinal",
  },
  {
    arquivo: "19-prancha-secador-escova",
    tema: "beleza",
    kicker: "Beleza e autocuidado",
    linhas: ["Prancha, secador", "ou escova", "secadora?"],
    rodape: "Qual comprar primeiro",
  },
  {
    arquivo: "20-treino-em-casa-comecar",
    tema: "fitness",
    kicker: "Fitness em casa",
    linhas: ["Treino em casa:", "por onde", "começar"],
    rodape: "O básico que não falta",
  },

  // --- Lote 3 ---
  {
    arquivo: "21-presentes-tecnologia-200",
    tema: "eletronicos",
    kicker: "Guia de presentes",
    linhas: ["Presentes de", "tecnologia até", "R$ 200"],
    rodape: "Que não parecem baratos",
  },
  {
    arquivo: "22-air-fryer-cesto-ou-forno",
    tema: "cozinha",
    kicker: "Guia de compra",
    linhas: ["Air fryer de", "cesto ou", "forno?"],
    rodape: "Qual combina com sua cozinha",
  },
  {
    arquivo: "23-protetor-solar-pele-oleosa",
    tema: "beleza",
    kicker: "Beleza e autocuidado",
    linhas: ["Protetor solar", "para pele", "oleosa"],
    rodape: "Qual não deixa brilho",
  },
  {
    arquivo: "24-redmi-watch-vs-smart-band",
    tema: "eletronicos",
    kicker: "Comparativo direto",
    linhas: ["Redmi Watch 5", "ou Smart Band 9?", "A diferença real"],
    rodape: "Qual combina com você",
  },
  {
    arquivo: "25-organizacao-banheiro",
    tema: "casa",
    kicker: "Casa e organização",
    linhas: ["Banheiro", "pequeno e sem", "espaço?"],
    rodape: "Organizadores que cabem",
  },
  {
    arquivo: "26-fone-para-treino",
    tema: "eletronicos",
    kicker: "Eletrônicos",
    linhas: ["O fone certo", "para treinar", "na academia"],
    rodape: "Não cai e aguenta suor",
  },
  {
    arquivo: "27-presente-ate-150",
    tema: "eletronicos",
    kicker: "Guia de presentes",
    linhas: ["O que comprar", "de presente até", "R$ 150"],
    rodape: "Sem parecer sem noção",
  },
  {
    arquivo: "28-gato-hidratado-verao",
    tema: "pet",
    kicker: "Pet · verão",
    linhas: ["Gato desidratado", "no calor?", "Fique atento"],
    rodape: "Como ajudar seu pet",
  },
  {
    arquivo: "29-cabelo-liso-sem-calor",
    tema: "beleza",
    kicker: "Beleza e autocuidado",
    linhas: ["Cabelo liso", "sem estragar", "com calor"],
    rodape: "O que realmente funciona",
  },
  {
    arquivo: "30-robo-aspirador-manutencao",
    tema: "casa",
    kicker: "Casa e organização",
    linhas: ["Quanto custa", "manter um robô", "aspirador?"],
    rodape: "Filtro, pano e bateria",
  },

  // --- Lote 4 ---
  {
    arquivo: "31-echo-dot-ou-max",
    tema: "casa",
    kicker: "Comparativo direto",
    linhas: ["Echo Dot 5 ou", "Echo Dot Max?", "Qual comprar"],
    rodape: "A diferença que justifica o preço",
  },
  {
    arquivo: "32-quando-trocar-fone",
    tema: "eletronicos",
    kicker: "Eletrônicos",
    linhas: ["5 sinais de", "que é hora de", "trocar o fone"],
    rodape: "Antes que ele te deixe na mão",
  },
  {
    arquivo: "33-robo-vs-vassoura",
    tema: "casa",
    kicker: "Vale a pena?",
    linhas: ["Robô aspirador", "ou vassoura", "mesmo?"],
    rodape: "A conta que ninguém faz",
  },
  {
    arquivo: "34-skincare-verao",
    tema: "beleza",
    kicker: "Beleza · verão",
    linhas: ["Rotina de", "skincare para", "o verão"],
    rodape: "O básico que não pode faltar",
  },
  {
    arquivo: "35-presente-home-office",
    tema: "eletronicos",
    kicker: "Guia de presentes",
    linhas: ["Presente para", "quem trabalha", "em casa"],
    rodape: "Ideias que realmente se usa",
  },
  {
    arquivo: "36-pulseira-desatualizada",
    tema: "fitness",
    kicker: "Fitness e bem-estar",
    linhas: ["Sua pulseira", "fitness já era?", "3 sinais"],
    rodape: "Quando vale trocar",
  },
  {
    arquivo: "37-viajar-com-gato",
    tema: "pet",
    kicker: "Pet · viagem",
    linhas: ["Vai viajar e", "deixar o gato?", "Não esqueça isso"],
    rodape: "O essencial pra quem cuida dele",
  },
  {
    arquivo: "38-organizacao-closet",
    tema: "casa",
    kicker: "Casa e organização",
    linhas: ["Closet ou", "guarda-roupa", "pequeno?"],
    rodape: "Organize sem reformar",
  },
  {
    arquivo: "39-air-fryer-receitas-facil",
    tema: "cozinha",
    kicker: "Cozinha e air fryer",
    linhas: ["Air fryer:", "receitas fáceis", "pra começar"],
    rodape: "Do congelado ao caseiro",
  },
  {
    arquivo: "40-smartwatch-corrida",
    tema: "eletronicos",
    kicker: "Guia de compra",
    linhas: ["Corrida ou", "caminhada: qual", "smartwatch levar"],
    rodape: "GPS, bateria e o que importa",
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
