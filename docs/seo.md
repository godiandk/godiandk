# SEO — o que está feito e o que falta

Última revisão: 9 de novembro de 2026.

## Primeiro: hashtags não existem no Google

Hashtags são do Instagram e do TikTok. O Google não as lê.

A etiqueta `<meta name="keywords">` — o que as pessoas imaginam serem
"hashtags no código" — **é ignorada pelo Google desde 2009**. Nenhum dos dois
sites a usa, e não deve passar a usar.

O que faz esse trabalho no Google são três coisas diferentes:

| Peça | Função |
|---|---|
| `<title>` e `<meta description>` | O texto azul e o cinzento do resultado |
| Dados estruturados (JSON-LD) | Dizem ao Google *o que você é* |
| Perfil de Empresa no Google | A ficha no mapa. Fora do site |

## Os 5 pontos do vídeo

| # | Pedido | TECNOVA | Inova Beauty |
|---|---|---|---|
| 1 | Google Search Console | falta (ação do Wesley) | falta (ação do Wesley) |
| 2 | `sitemap.xml` | já tinha, 13 URLs | **criado, 35 URLs** |
| 3 | `llms.txt` | **criado** | **criado** |
| 4 | `meta description` | já tinha; faltava em 2, **corrigido** | já tinha; faltava no 404, **corrigido** |
| 5 | Palavras-chave otimizadas | títulos e descrições já trabalhados | idem |

## O que foi feito além do vídeo

### Inova Beauty

- `robots.txt` — não existia. Bloqueia `/painel/`, `/conta/` e `/app/home/`.
- `sitemap.xml` — 35 URLs, gerado por script.
- `llms.txt` — serviços, preços reais e notas para sistemas automáticos.
- **Canonical** em 35 páginas. Não existia nenhuma.
- **Open Graph + Twitter Card** em 39 páginas. Links partilhados no WhatsApp
  deixam de sair secos.
- **JSON-LD** em 35 páginas, onde antes havia zero:
  `BeautySalon` (com telefone e horário real: seg–sáb, 09h00–19h00),
  `WebSite`, 34 `BreadcrumbList`, 26 `Service`.
- `noindex` em `/conta/`, `/painel/`, `/app/home/` e no 404.
- Descrição da página inicial encurtada de 169 para 119 caracteres
  (o Google corta por volta dos 155).

### TECNOVA Digital

- `llms.txt`, com um aviso explícito de que as páginas `/modelo-*` são
  demonstrações e os negócios nelas são fictícios.
- `FAQPage` em `pacotes.html`, construído a partir das 4 perguntas que já
  estavam na página. É isto que faz o Google abrir perguntas no resultado.
- `BreadcrumbList` em 12 páginas, `Service` em 3.
- `noindex` em `conta.html` e `folheto.html`, que estavam indexáveis sem
  razão; `robots.txt` atualizado.
- Descrições em falta em `folheto.html` e `admin.html`.

## Três defeitos encontrados pelo caminho

Nenhum destes foi causado por este trabalho. Todos foram confirmados nas
versões anteriores antes de serem corrigidos.

**1. A página inicial do TECNOVA estava sem `<h1>` desde 1 de outubro.**
O `<h1>` estava dentro do destaque da campanha de lançamento. O `campanha.js`
remove esse destaque quando a campanha acaba — e acabou a 30 de setembro.
A partir daí o destaque saía, e o único `<h1>` da página saía com ele.
Medido: com JavaScript desligado havia 1 `<h1>`; com JavaScript ligado, zero.
O Google executa JavaScript, por isso via a home sem título nenhum.
Corrigido: o `<h1>` passou para dentro de `.hero-slider`, fora de qualquer
destaque, e sobrevive ao fim de qualquer campanha.

**2. Erro de JavaScript em 4 páginas legais do TECNOVA.**
`privacidade.html`, `termos.html`, `cookies.html` e `reembolso.html` carregam
o script do formulário de contacto, mas não têm o formulário. A primeira
procura de elemento devolvia `null` e rebentava, e tudo o que vinha a seguir
nesse bloco deixava de correr. Corrigido com uma guarda no início.

**3. Menu do Inova cortado entre 901px e 1400px.**
O hambúrguer só aparecia abaixo de 900px. Acima disso, os 7 links mais o botão
não cabiam no contentor de 1140px e o menu era cortado — a 1280px, uma largura
de portátil muito comum, ficavam 90px de fora. Corrigido: hambúrguer até
1080px, e entre 1081px e 1500px o espaçamento aperta-se para caber.
Verificado em 13 larguras, de 360px a 1920px, sem overflow.

## O que falta, e é o Wesley que tem de fazer

**1. Pôr o site da Inova no ar.** Hoje não está: `godiandk.github.io`
devolve 404, o GitHub Pages não está ligado para este repositório. Enquanto
isso não acontecer, nada disto produz efeito — não há site para indexar.
Em Settings → Pages do repositório, escolher o branch.

**2. Perfil de Empresa no Google para a Inova.** É a peça mais forte para um
negócio local e é grátis. Precisa de morada real e de validação por carta.
Não crio contas em nome de ninguém.

**3. Google Search Console**, nos dois sites. Submeter o sitemap e ver em que
pesquisas o site aparece. Grátis.

**4. Morada da Inova.** O `BeautySalon` está sem `address`. Inventar uma
morada é pior do que não ter nenhuma, por isso ficou de fora. Com a morada
real, acrescenta-se `address` e `geo` e o peso em pesquisas locais sobe muito.

## Quando o domínio mudar

Os endereços absolutos (canonical, Open Graph, JSON-LD, sitemap) vêm todos de
uma variável. Para trocar de domínio:

    INOVA_BASE=https://www.oseudominio.pt python3 -I scripts/seo.py

e depois acertar a linha `Sitemap:` do `robots.txt` e o `BASE` dentro do
script que gera o `sitemap.xml`.

Os scripts são idempotentes: podem correr as vezes que quiserem. Tudo o que
escrevem fica entre `<!-- seo:inicio -->` e `<!-- seo:fim -->`.

## Expectativa honesta sobre o tempo

SEO orgânico demora tipicamente **3 a 6 meses** a mexer no ranking. Quem
prometer a primeira posição em duas semanas está a vender fumo.

O que dá resultado depressa e é grátis é o Perfil de Empresa no Google para a
Inova: pesquisas locais com "perto de mim" respondem em semanas.
