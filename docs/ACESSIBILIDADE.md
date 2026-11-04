# Acessibilidade — auditoria e correções (WCAG 2.1 AA / EN 301 549)

Feita em 4 de novembro de 2026 (revisão jurídica, pontos 9 a 14). Este ficheiro reúne os números, as contas e o que ficou por fazer.

> **Enquadramento.** A EN 301 549 (v3.2.1) incorpora o WCAG 2.1 nível AA. O Ato Europeu da Acessibilidade (Diretiva (UE) 2019/882, transposta em Portugal pelo DL 82/2022) dispensa as microempresas prestadoras de serviços de parte das obrigações; **se a Inova Beauty é microempresa e se a isenção se aplica é uma questão a confirmar**. Mesmo assim, o Wesley pediu o nível AA, que é também boa prática e ajuda toda a gente.

## 1. Como se testou

- **axe-core 4.14.0** em todas as páginas do site (41 páginas × 2 tamanhos de ecrã: 1280 px e 390 px), com as regras WCAG 2.0/2.1 A e AA e as «boas práticas».
- **Medição de contraste real**: cada página é desenhada sem texto, os píxeis do fundo por baixo de cada texto são lidos (inclui fotografias e gradientes) e o rácio é calculado com a fórmula do WCAG.
- **Teclado**: em todas as páginas, o 1.º `Tab` tem de ir para «Saltar para o conteúdo», que tem de aparecer no ecrã, e os 8 elementos seguintes têm de mostrar foco visível.
- **Estrutura**: `lang` no `<html>`, `<main>`, um só `<h1>`, `alt` em todas as `<img>`, rodapé e identificação do prestador.
- Os testes estão em `scripts/testes/` (ver `LEIA-ME.md`) e podem repetir-se. Não foi feito teste com leitor de ecrã real (NVDA, VoiceOver) nem com pessoas.

## 2. Falhas encontradas e corrigidas (axe)

| Regra axe | Critério | Gravidade | Nós antes | Nós depois | Correção |
|---|---|---|---|---|---|
| `color-contrast` | 1.4.3 Contraste mínimo | serious | 698 | 0 | tokens de cor novos (`--gold-text`, `--on-gold`), texto dourado só com a cor escura sobre claro; estado «indisponível» sem `opacity` |
| `region` | (boa prática) marcos | moderate | 392 | 2 | atalhos flutuantes dentro de `<nav aria-label>`; `<main>`/rodapé em todas as páginas |
| `image-redundant-alt` | (boa prática) alt redundante | minor | 148 | 0 | imagens decorativas com `alt=""` |
| `heading-order` | (boa prática) ordem dos títulos / 1.3.1 | moderate | 106 | 0 | h3 → h2 onde não havia h2 (CSS mantém o aspeto) |
| `landmark-one-main` | (boa prática) um marco principal | moderate | 76 | 0 | `<main id="conteudo">` em todas as páginas |
| `label-content-name-mismatch` | 2.5.3 Rótulo no nome | serious | 71 | 0 | `aria-labelledby` (dica visível + título) nos botões dos cartões; imagens redundantes fora da tabulação |
| `link-in-text-block` | 1.4.1 Utilização da cor | serious | 4 | 0 | ligações no texto com sublinhado |
| `page-has-heading-one` | (boa prática) título de nível 1 | moderate | 2 | 0 | app: título do ecrã inicial passou a `<h1>` |
| `aria-required-children` | 1.3.1 Informação e relações | critical | 2 | 0 | lista de ícones corrigida (papéis ARIA) |

Antes: 1499 nós com falha em 78 execuções. Depois: 2. Os 2 nós que sobravam na última execução geral eram a ligação «Saltar para o conteúdo» da app (`href="#"`); passou a apontar para um destino real e uma nova execução do axe (com as «boas práticas») em 7 páginas-chave deu **0 violações**.

## 3. Contraste: a conta de cada par

**Fórmula (WCAG 2.1, 1.4.3).** Luminância relativa `L = 0,2126·R + 0,7152·G + 0,0722·B`, com cada canal `c = C/255` passado por `c ≤ 0,03928 ? c/12,92 : ((c+0,055)/1,055)^2,4`. Rácio = `(L1 + 0,05) / (L2 + 0,05)`, com L1 a luminância maior. Mínimos: **4,5:1** para texto normal; **3:1** para texto grande (≥ 24 px, ou ≥ 18,66 px a negrito).

### 3.1 Pares que reprovavam (antes)

| Texto | Fundo | Onde | L(texto) | L(fundo) | Rácio = (L1+0,05)/(L2+0,05) | Mínimo | Resultado |
|---|---|---|---|---|---|---|---|
| `--gold` #B08D57 | `--cream` #FAF6F0 | texto dourado (ANTES) | 0,2897 | 0,9253 | **2,87:1** | 4,5:1 | REPROVA |
| `--gold` #B08D57 | `--white` #FFFDFA | texto dourado em cartões (ANTES) | 0,2897 | 0,9841 | **3,04:1** | 4,5:1 | REPROVA |
| `--white` #FFFDFA | `--gold` #B08D57 | texto branco em botões dourados (ANTES) | 0,9841 | 0,2897 | **3,04:1** | 4,5:1 | REPROVA |

### 3.2 Pares de cores do site (depois)

| Texto | Fundo | Onde | L(texto) | L(fundo) | Rácio = (L1+0,05)/(L2+0,05) | Mínimo | Resultado |
|---|---|---|---|---|---|---|---|
| `--ink` #211A14 | `--cream` #FAF6F0 | texto principal | 0,0111 | 0,9253 | **15,95:1** | 4,5:1 | passa |
| `--ink` #211A14 | `--cream-2` #F3ECE2 | texto em caixas e tabelas | 0,0111 | 0,8454 | **14,65:1** | 4,5:1 | passa |
| `--ink` #211A14 | `--white` #FFFDFA | texto em cartões e formulários | 0,0111 | 0,9841 | **16,92:1** | 4,5:1 | passa |
| `--ink-soft` #4A4038 | `--cream` #FAF6F0 | texto secundário | 0,0541 | 0,9253 | **9,37:1** | 4,5:1 | passa |
| `--ink-soft` #4A4038 | `--cream-2` #F3ECE2 | texto secundário em caixas | 0,0541 | 0,8454 | **8,60:1** | 4,5:1 | passa |
| `--ink-soft` #4A4038 | `--white` #FFFDFA | texto secundário em cartões | 0,0541 | 0,9841 | **9,94:1** | 4,5:1 | passa |
| `--gold-text` #7A5A2B | `--cream` #FAF6F0 | ligações, rótulos e títulos dourados | 0,1162 | 0,9253 | **5,87:1** | 4,5:1 | passa |
| `--gold-text` #7A5A2B | `--cream-2` #F3ECE2 | ligações em caixas | 0,1162 | 0,8454 | **5,39:1** | 4,5:1 | passa |
| `--gold-text` #7A5A2B | `--white` #FFFDFA | ligações em cartões | 0,1162 | 0,9841 | **6,22:1** | 4,5:1 | passa |
| `--on-gold` #211A14 | `--gold` #B08D57 | texto de botões dourados | 0,0111 | 0,2897 | **5,56:1** | 4,5:1 | passa |
| `--on-gold` #211A14 | `--gold-soft` #C9AB7C | texto de botões dourados (realce) | 0,0111 | 0,4300 | **7,85:1** | 4,5:1 | passa |
| `--white` #FFFDFA | `--dark` #191411 | texto claro em fundos escuros | 0,9841 | 0,0075 | **17,99:1** | 4,5:1 | passa |
| `--white` #FFFDFA | `--dark-2` #241D18 | texto claro em cartões escuros | 0,9841 | 0,0132 | **16,36:1** | 4,5:1 | passa |
| `--gold-soft` #C9AB7C | `--dark` #191411 | títulos e ligações douradas em fundos escuros | 0,4300 | 0,0075 | **8,35:1** | 4,5:1 | passa |
| `--gold-soft` #C9AB7C | `--dark-2` #241D18 | idem, em cartões escuros | 0,4300 | 0,0132 | **7,60:1** | 4,5:1 | passa |

Texto claro com transparência no rodapé (sobre `--dark` #191411): opacidade 0.62 → #A8A4A1 = **7,39:1**; opacidade 0.72 → #BFBCB9 = **9,66:1**; opacidade 0.88 → #E3E1DE = **14,00:1**.

### 3.3 Medição real em todas as páginas

- **Antes:** 2319 textos medidos, **578 abaixo do mínimo**. Os pares que mais repetiam: #817D7A sobre #191411 = 4,46:1 (×136); #B08D57 sobre #FAF6F0 = 2,87:1 (×45); #B08D57 sobre #FFFDFA = 3,04:1 (×44); #FFFDFA sobre #BD9C6A = 2,54:1 (×37); #B08D57 sobre #ECE9E3 = 2,55:1 (×34); #B08D57 sobre #FAF7F0 = 2,89:1 (×28).

- **Depois:** 7042 textos medidos; a ferramenta assinala 158 abaixo do mínimo, **todos são artefactos da medição e não falhas reais**: (a) `span.val` «Inova Beauty —» no rodapé (78): o texto claro está ao lado do selo amarelo «A PREENCHER» e a amostra de píxeis apanha o amarelo; o par real é texto claro (#FFFDFA a 88 %) sobre #191411 = 14,0:1; (b) a ligação «Saltar para o conteúdo» (77): fica fora do ecrã até receber o foco e, com foco, é #FFFDFA sobre #211A14 = 16,9:1; (c) `span.tap-hint` (3): a dica «Ver detalhes» sobrepõe-se ao botão verde do WhatsApp na captura. Fora disso, **0 textos abaixo do mínimo**. Além da página carregada, testaram-se 15 estados (menus abertos, chat, mensagens de erro, ecrãs da app, painel) com o axe: **0 falhas**.

As cores douradas passaram a ter duas funções: `--gold` (#B08D57) só para linhas, bordas e fundos; `--gold-text` (#7A5A2B) para texto sobre fundos claros; e `--on-gold` (#211A14) para texto sobre fundos dourados. Em fundos escuros usa-se `--gold-soft` (#C9AB7C).

## 4. Foco visível, teclado e estrutura

- **Foco visível:** há um anel duplo global em `:focus-visible` (claro por fora, escuro por dentro), que se vê sobre fundos claros e escuros. Nenhum `outline: none` fica sem substituto; o teste carregou em `Tab` 8 vezes em cada página e todos os elementos mostraram contorno ou sombra.
- **Saltar para o conteúdo:** primeira ligação de todas as páginas (incluindo painel e app), só aparece quando recebe o foco e leva ao `<main id="conteudo">` (na app, ao ecrã aberto).
- **Idioma:** `<html lang>` em todas as páginas; muda para `pt-PT`, `en` ou `es` com o seletor.
- **Títulos:** um `<h1>` por página; sem saltos de nível (h1 → h2 → h3). Os títulos dos cartões, dos passos e das caixas de informação subiram de h3 para h2 onde não havia h2.
- **Campos:** todos os campos têm `<label>`; os grupos (aniversário) têm nome; os botões só com ícone têm `aria-label`; o seletor de idioma tem nome que começa pelo texto visível.
- **Carrossel da página inicial:** botão de pausa (WCAG 2.2.2); não arranca se a pessoa pediu menos movimento no sistema.
- **Chat:** área `role="log"` com anúncio educado das respostas; botões e campo com nome.

## 5. Imagens e texto alternativo (ponto 10)

Há 94 imagens `<img>` nas páginas: **81 decorativas** (`alt=""`, o leitor de ecrã ignora-as) e **13 informativas** com texto alternativo. Nenhuma `<img>` fica sem atributo `alt` (teste automático em todas as páginas). As ilustrações dos cartões são SVG com `aria-hidden="true"`. Textos alternativos informativos em uso: «Pré-visualização do avatar» (×2); «Avatar» (×2); «Inova Beauty» (×1); «Thayana — a especialista da Inova Beauty» (×1); «Thayana — Inova Beauty» (×1); «Ícone da app Inova Beauty» (×1); «A minha conta» (×1); «Thayana» (×1); «Pré-visualização» (×1); «publicação» (×1); «Thayana — a profissional por trás da Inova Beauty» (×1).

## 6. O que falta ou não foi possível verificar

- Teste com leitores de ecrã reais (NVDA/JAWS no Windows, VoiceOver no iPhone/Mac) e com pessoas com deficiência: não feito.
- Ampliação a 200 % e *reflow* a 320 px: verificado só por captura de ecrã a 390 px (sem rolagem horizontal nas páginas legais).
- A página «Tecnova» (`/tecnova/`) é outro projeto no mesmo repositório e **não foi auditada**.
- O painel de administração foi corrigido (contraste, salto, títulos), mas não foi testado com utilizadores.
- Os resultados «incompletos» do axe (texto sobre fotografias ou gradientes) foram tratados pela medição real de píxeis da secção 3.3.
- Vídeos, áudio e documentos para descarregar: o site não tem.
