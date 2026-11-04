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
  `python3 scripts/legal/build_all.py`. Não editar o HTML à mão (a próxima geração apagava a alteração).
- O que só o titular sabe aparece como **«A PREENCHER»** (nome, NIF, morada, email, IVA, meios de pagamento, prazos de cancelamento, RAL, região do Firestore).
  Preenche-se com `python3 scripts/preencher_dados_legais.py`. **Nunca inventar** NIF, morada, nome ou regras do estúdio.
- **Nada de terceiros ao abrir uma página**: letras em `fonts/`, SDK Firebase em `vendor/`; o mapa da Google só a pedido; `analytics.js` só com consentimento.
- **Minimização**: não se pede sexo; aniversário é opcional e só dia/mês; a marcação não guarda o email.
- Textos de publicidade: sem «melhor», «garantido», «permanente», «ideal para…», «100 %». O que foi reescrito e porquê está em
  `docs/auditoria-juridica/alteracoes-antes-depois.md`. Origem de imagens e letras: `CREDITOS.md`. Acessibilidade: `docs/ACESSIBILIDADE.md`.
- Visão geral dos 23 pontos, riscos e decisões: `docs/AUDITORIA_JURIDICA.md`.
