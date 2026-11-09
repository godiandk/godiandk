# Inova Beauty — notas para quem mexe neste site

Site estático (GitHub Pages, `godiandk/godiandk`; publicar = fazer merge de um PR em `main`). Dono: Wesley; quem atende e
define preços e tempos: Thayana (mulher do Wesley). Falar em português de Portugal.

## Regras que o Wesley definiu
- **Tempos (durações) só vêm do painel da Thayana** (Disponibilidade → Serviços, guardado em `config/agenda`). Nunca
  copiar tempos de textos, tabelas ou listas de preços. Ela é que define quanto demora cada serviço.
- **Preços** vêm da lista de preços que ela devolve; o catálogo (`disponibilidade.js`, `GRUPOS`) e o `precario/` têm de bater
  (há um teste que compara os dois).
- **Serviços que ela ainda não faz ficam escondidos do público**, mas guardados. A lista completa, com preços e tempos,
  está em `docs/servicos-indisponiveis.md` — se o Wesley perguntar "quais eram os serviços indisponíveis?" ou "vamos voltar a
  incluir…", é aí que está (e como os repor).
- Não editar o `README.md` (é o perfil do GitHub). Documentação em `docs/`.

Detalhes das regras de disponibilidade e do catálogo: `docs/disponibilidade-e-regras.md`.

## Revisão jurídica (4 de novembro de 2026) — o que não se pode desfazer sem querer
- As páginas **`privacidade/`, `termos/`, `cookies/`, `cancelamento/`** e `idiomas/legal-*.js` são **geradas**: editar `scripts/legal/*.py` e correr
  `python3 scripts/legal/build_all.py` (no fim volta a correr o `aplicar_seo.py`). Não editar o HTML à mão (a próxima geração apagava a alteração).
- O que só o titular sabe aparece como **«A PREENCHER»** (nome, NIF, morada, email, IVA, meios de pagamento, prazos de cancelamento, RAL, região do Firestore).
  Preenche-se com `python3 scripts/preencher_dados_legais.py`. **Nunca inventar** NIF, morada, nome ou regras do estúdio.
- **Nada de terceiros ao abrir uma página** (em computador **e em telemóvel/Safari**): letras em `fonts/`, SDK Firebase em `vendor/`; o mapa da Google só a pedido; `analytics.js` só com consentimento.
  Confirmar com `node scripts/testes/terceiros_ao_abrir.js` (corre em computador, Android e iPhone). Só `firestore.googleapis.com` em `/agendar/` e `/app/home/` é esperado.
- **Minimização**: não se pede sexo; aniversário é opcional e só dia/mês; a marcação não guarda o email.
- Textos de publicidade: sem «melhor», «garantido», «permanente», «ideal para…», «100 %». O que foi reescrito e porquê está em
  `docs/auditoria-juridica/alteracoes-antes-depois.md`. Origem de imagens e letras: `CREDITOS.md`. Acessibilidade: `docs/ACESSIBILIDADE.md`.
- Visão geral dos 23 pontos, riscos e decisões: `docs/AUDITORIA_JURIDICA.md`.

## SEO e velocidade (9 de novembro de 2026)
- Títulos, descrições, `canonical`, `robots`, `sitemap.xml`, `llms.txt` e dados estruturados (BeautySalon, FAQPage, BreadcrumbList) são **gerados**:
  editar `scripts/seo/site.json` e correr `python3 scripts/seo/aplicar_seo.py` (`--verificar` confirma). Não editar essas etiquetas à mão.
  Nas descrições, **sem preços nem tempos** (vêm do catálogo e do painel da Thayana) e sem «melhor», «garantido», «permanente», «ideal para», «100 %», «certificado».
- As perguntas frequentes da página inicial (`<details class="faq-item">`) e as migalhas (`<ol class="breadcrumb">`) alimentam os dados estruturados: o que se muda no
  texto visível passa sozinho para o Google ao correr o script. Os serviços **ativos** são os do catálogo (`disponibilidade.js`, sem `off`): hoje inclui «Lábios» (Micropigmentação Labial e Neutralização);
  só Hidraglos, micropigmentação das sobrancelhas, laser, extensões, despigmentação, Teen e «Tratamentos» estão escondidos.
- O endereço do site está só em `scripts/seo/site.json` (`base_url`). Domínio próprio: `--base-url` (passos, incluindo o Firebase, em `docs/SEO-E-CLIENTES.md`).
- `vendor/firebase/10.12.2/firebase-auth-compat.js` tem **1 alteração** (não contactar a Google ao abrir a página em telemóvel/Safari; ver `vendor/firebase/LEIA-ME.txt`).
  Se o SDK for atualizado, reaplicá-la e voltar a correr `terceiros_ao_abrir.js`.
- Imagens novas: WebP com `width` e `height` (e `height: auto` no CSS se só se fixar a largura). Páginas públicas: `<script defer>`
  (exceto `conta/`, `app/home/` e `painel/`, que têm scripts na própria página; em `agendar/` o script da página espera pelo `DOMContentLoaded`,
  porque os `defer` só correm depois de a página estar lida).
- Plano para ser encontrado no Google e ter clientes, e para o teste de anúncios: `docs/SEO-E-CLIENTES.md`; textos prontos (Perfil no Google, redes, WhatsApp): `docs/KIT-DIVULGACAO.md`. **Nunca lançar nem alterar campanhas
  pagas sem o Wesley aprovar o valor e o período.**
