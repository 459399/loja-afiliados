# Achados da Semana — site de afiliados

Site estático de recomendação de produtos. Você publica análises dos produtos
mais procurados da internet, com links de afiliado para Amazon, Mercado Livre e
Shopee. **Quem vende, cobra, entrega, emite nota e dá suporte é a loja.** Você
recebe comissão pelas compras feitas a partir dos seus links.

Feito com [Astro](https://astro.build) (gera HTML puro, ótimo para Google) e
publicado de graça no GitHub Pages.

---

## A verdade antes de começar

Você pediu "a loja faz tudo sozinha e eu só recebo". O modelo de afiliados é o
que mais chega perto disso — **mas ele só dá dinheiro se tiver gente entrando no
site.** Não existe versão em que você não faz nada e o dinheiro aparece.

O trabalho real deste modelo **não é técnico, é de conteúdo e audiência:**

| O que dá para automatizar | O que depende de você |
| --- | --- |
| Build e publicação do site (já configurado) | Escrever análises boas e honestas |
| Geração das páginas de produto a partir de um arquivo | Escolher produtos que as pessoas procuram |
| Sitemap, SEO técnico, rebuild diário | Trazer visitantes (SEO, redes sociais, YouTube) |
| Anexar seu código de afiliado nos links | Manter preços e links atualizados |

Sem tráfego, comissão = R$ 0. Com 10 a 20 análises boas e alguns meses de
divulgação, começa a pingar. É um projeto de médio prazo, não um caça-níquel.

### O que NÃO funciona (e por quê)

- **Copiar descrições e fotos da Amazon/Mercado Livre** → violação de direito
  autoral e das regras dos programas. Conta banida. Escreva texto próprio.
- **Fazer pedidos automáticos no marketplace no lugar do cliente** → proibido
  pelos termos da Amazon e do Mercado Livre. Não é o que este projeto faz.
- **Gerar 500 páginas com texto de IA sem revisão** → o Google trata como spam
  (política de "conteúdo feito para mecanismo de busca") e não rankeia.

---

## Como rodar no seu computador

Pré-requisito: [Node.js](https://nodejs.org) 20 ou superior.

```bash
cd loja-afiliados
npm install
npm run dev
```

Abra `http://localhost:4321`. O site recarrega sozinho quando você edita.

Para gerar a versão final (pasta `dist/`):

```bash
npm run build
```

---

## Passo a passo para colocar no ar

### 1. Personalize o site

Edite `src/data/config.json`:

- `nome`, `descricao`, `autor`, `email`
- `url` → deixe como está por enquanto; você troca pelo domínio real no passo 4
- `afiliados.*.ativo` → deixe `false` até ser aprovado em cada programa

### 2. Publique uma primeira versão (ainda sem afiliado)

Os programas de afiliado exigem um site no ar para aprovar seu cadastro.

1. Crie uma conta no [GitHub](https://github.com).
2. Crie um repositório novo (ex: `meu-site-afiliados`).
3. Suba esta pasta:
   ```bash
   git init
   git add .
   git commit -m "Site inicial"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/meu-site-afiliados.git
   git push -u origin main
   ```
4. No repositório: **Settings → Pages → Source: GitHub Actions**.
   O arquivo `.github/workflows/deploy.yml` já está pronto; a cada push ele
   publica, e ele também refaz o build 1x por dia.
5. Seu site fica em `https://SEU-USUARIO.github.io/meu-site-afiliados/`.

### 3. Catálogo inicial (já feito) e o que ajustar

O site **já vem com 11 análises escritas**, baseadas em pesquisa de preço,
ficha técnica e avaliações reais de produtos que hoje estão entre os mais
procurados no Brasil (fone QCY T13, Echo Dot 5, air fryer Mondial, robô
aspirador KaBuM!, Redmi Watch 5, Smart Band 9, escova secadora, protetor solar
facial, fonte para pet, organizadores, faixas de resistência).

O que **você** precisa ajustar em `src/data/produtos.json`:

- **Links das lojas:** hoje cada produto aponta para a *busca* daquele produto
  na Amazon / Mercado Livre (ex: `amazon.com.br/s?k=fone+qcy+t13`). Isso já
  funciona e converte. Quando quiser, troque pela URL da *página específica* do
  produto que você escolheu promover — é só colar a URL normal, o código de
  afiliado é anexado sozinho por `src/lib/afiliado.js`.
- **Preço:** o campo `preco` de cada loja está vazio (para não ficar
  desatualizado). Preencha se quiser mostrar, e revise a cada 2-4 semanas — ou
  deixe vazio e confie no `preco_aprox`.
- **Imagem:** todos usam um placeholder. Tire sua própria foto ou use a imagem
  oficial **só onde o programa de afiliado permitir** (a Amazon permite via as
  ferramentas dela). Salve em `public/img/` e aponte o campo `imagem`.
- **Texto:** revise cada análise com a sua voz e, se testou o produto, acrescente
  a sua experiência real — isso é o que diferencia no Google.

Para adicionar mais produtos: `npm run novo-produto`. Foque em procura real —
Google Trends, autocompletar do Google, "Mais vendidos" da Amazon, tendências
do Mercado Livre.

### 4. Domínio próprio (opcional, ~R$ 40/ano)

1. Registre um `.com.br` no [Registro.br](https://registro.br) ou um `.com`
   em qualquer registrador.
2. Aponte o DNS para o GitHub Pages
   ([guia oficial](https://docs.github.com/pt/pages/configuring-a-custom-domain-for-your-github-pages-site)).
3. Atualize `url` em `src/data/config.json` e o campo `cname` no repositório.

### 5. Cadastre-se nos programas de afiliado

Faça isso só depois de ter o site no ar com conteúdo real.

| Programa | Onde se cadastrar | Observações |
| --- | --- | --- |
| Amazon Associados | `associados.amazon.com.br` | Precisa gerar 3 vendas em 180 dias para a conta ser confirmada. A API de preços (PA-API) libera só depois dessas 3 vendas. |
| Mercado Livre Afiliados | Painel do Mercado Livre → "Afiliados" | Comissão varia por categoria. |
| Shopee Afiliados | `affiliate.shopee.com.br` | Aprovação costuma ser rápida. |

Ao ser aprovado, abra `src/data/config.json` e para cada rede aprovada:

- coloque `"ativo": true`
- preencha o código (`tag` da Amazon, `matt_word` do Mercado Livre)

Rode `npm run checar-links` antes de publicar para conferir se não sobrou nada
de exemplo e se os links respondem.

### 6. Traga visitantes

Escolha 1 ou 2 canais e seja consistente:

- **SEO / Google:** o caminho mais "automático" a longo prazo. Escreva para
  perguntas reais ("melhor air fryer até 400 reais", "vale a pena smartwatch
  barato"). Resultado leva de 3 a 6 meses.
- **Pinterest:** manda bem para produto de casa, beleza, decoração.
- **YouTube / Shorts / Reels:** review rápido + link na descrição.
- **Grupos e comunidades:** só onde recomendação for bem-vinda; spam queima o site.

---

## Estrutura do projeto

```
loja-afiliados/
├── src/
│   ├── data/
│   │   ├── config.json      → nome do site, e-mail, códigos de afiliado
│   │   ├── categorias.json  → lista de categorias
│   │   └── produtos.json    → CATÁLOGO: cada produto é um objeto aqui
│   ├── lib/afiliado.js      → anexa seu código de afiliado nas URLs
│   ├── layouts/Base.astro   → cabeçalho, rodapé, SEO, aviso de afiliado
│   ├── components/           → cartão de produto, botões das lojas
│   └── pages/
│       ├── index.astro                 → home
│       ├── categoria/[slug].astro      → uma página por categoria
│       ├── produto/[slug].astro        → uma página por produto
│       ├── sobre.astro
│       ├── politica-de-divulgacao.astro → exigida pelos programas de afiliado
│       └── politica-de-privacidade.astro
├── scripts/
│   ├── novo-produto.mjs     → npm run novo-produto
│   └── checar-links.mjs     → npm run checar-links
├── .github/workflows/deploy.yml  → publica no GitHub Pages + rebuild diário
└── public/                  → imagens e arquivos estáticos
```

Para adicionar produto: `npm run novo-produto` **ou** edite `produtos.json` na
mão copiando um bloco existente. O site cria a página, o link no menu e o
sitemap sozinho.

---

## Automação já incluída

- **Publicação automática:** todo `git push` republica o site.
- **Rebuild diário:** o workflow roda todo dia às 6h (horário de Brasília) para
  manter o site "fresco" para o Google.
- **Links de afiliado automáticos:** você cola a URL normal, o código é anexado.
- **SEO técnico:** sitemap, `robots.txt`, dados estruturados (nota/preço),
  Open Graph — tudo gerado no build.

### Próximo nível (quando tiver volume)

- Atualizar preços sozinho pela **API pública do Mercado Livre** (só leitura de
  preço — ela **não** faz pedido) e pela **PA-API da Amazon** (após as 3 vendas).
  Dá para rodar num GitHub Action agendado que reescreve os preços em
  `produtos.json` e faz commit. Peça para eu implementar quando chegar lá.
- Newsletter simples (ex: Buttondown) para reengajar quem já visitou.

---

## Aspecto legal (Brasil)

- **Divulgação de afiliado é obrigatória.** Já está no topo de toda página e na
  `/politica-de-divulgacao/`. Não remova.
- **Você não é o vendedor.** O site deixa isso claro no rodapé e na página
  "Sobre". Reclamação de produto/entrega é da loja.
- **LGPD:** o site é estático e não coleta cadastro. Se adicionar analytics com
  cookies ou newsletter, ajuste a política de privacidade (de preferência com um
  contador/advogado).
- **Imposto:** comissão de afiliado é rendimento tributável. Se virar valor
  relevante, fale com um contador sobre MEI ou carnê-leão.

---

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor local com recarga automática |
| `npm run build` | Gera o site final em `dist/` |
| `npm run preview` | Serve o `dist/` para conferência |
| `npm run novo-produto` | Adiciona um produto ao catálogo |
| `npm run checar-links` | Confere links e valores de exemplo antes de publicar |
