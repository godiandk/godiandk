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
