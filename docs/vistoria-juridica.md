# Vistoria jurídica — as 17 verificações do vídeo

Vídeo analisado: *"17 coisas pro seu site feito com IA não ser processado"* (31 s, PT-BR).
Data da vistoria: 4 de novembro de 2026.

## Correção importante antes de tudo

O vídeo é **brasileiro** e fala em **LGPD** (Lei Geral de Proteção de Dados, Lei 13.709/2018).
Isso **não se aplica em Portugal**. Aqui vale o **RGPD** (Regulamento UE 2016/679) + a
**Lei 58/2019**, fiscalizados pela **CNPD**. Copiar o pedido tal como está faria a IA escrever
páginas legais com a lei errada — o que é pior do que não ter nenhuma.

Há ainda quatro obrigações portuguesas que o vídeo **não menciona** e que são as que
realmente dão multa cá:

| Obrigação | Base legal | Estado |
|---|---|---|
| Livro de Reclamações eletrónico visível no site | DL 156/2005 + DL 74/2017 e Portaria 201-A/2017 | TECNOVA: só 1 de 17 páginas · Inova: ausente |
| Identificação do prestador (nome, NIF, morada, contacto) | DL 7/2004, art. 10.º | TECNOVA: NIF e morada "a preencher" · Inova: ausente |
| Registo de atividade de tatuagem/micropigmentação | DL 63/2019 | Inova: a confirmar com a autoridade de saúde |

**Duas ressalvas, para não exagerar o problema:**

*RAL (resolução alternativa de litígios).* O artigo 18.º da Lei 144/2015 foi **alterado pelo
DL 102/2017**, que **dispensou** deste dever de informação quem não esteja vinculado a nenhuma
entidade RAL, por adesão ou por arbitragem necessária. Se o Wesley não aderiu a nenhum centro
de arbitragem, **não é obrigado** a listar entidades. A Direção-Geral do Consumidor já
defendeu entendimento mais lato, mas esse é anterior à alteração de 2017. O que `reembolso.html`
tem hoje — mencionar a existência de RAL sem se vincular — é prudente e suficiente.

*Livro de Reclamações.* A obrigação cobre os fornecedores dos setores listados no DL 156/2005.
Um profissional independente que só vende online, sem estabelecimento aberto ao público, é um
caso de fronteira. O texto que já está em `reembolso.html` ("confirmar na abertura de atividade
se esta atividade está abrangida") está correto — é mesmo isso que tem de ser confirmado nas
Finanças, não presumido num sentido nem no outro.

---

## Projeto 1 — TECNOVA Digital (`godiandk/tecnova-digital`, tecnovadigital.pt)

| # | Ponto do vídeo | Estado | Evidência |
|---|---|---|---|
| 1 | Política de privacidade | **Tem** | `privacidade.html`, 10 secções, 25 KB |
| 2 | Termos de serviço | **Tem** | `termos.html`, 12 secções, 23 KB |
| 3 | Aviso/consentimento de cookies | **Tem (e não precisa de banner)** | `cookies.html`; sem cookies de terceiros |
| 4 | Política de reembolso | **Tem** | `reembolso.html`, 7 secções |
| 5 | Formulários conformes | **FALTA** | aviso RGPD só no rodapé, não junto ao botão |
| 6 | Só dados necessários | **Tem** | nome, negócio, telefone, email, notas |
| 7 | Scripts de tracking | **Tem** | `medir.js`: sessionStorage, sem cookies; GA e pixel Meta desligados |
| 8 | Auditoria de acessibilidade | **Parcial** | sem link "saltar para o conteúdo" |
| 9 | Alt nas imagens | **Tem** | 191 imagens, 0 sem atributo alt |
| 10 | Contraste corrigido | **Tem** | creme/tinta 16,50:1 · dourado/tinta 9,47:1 |
| 11 | Navegação por teclado | **Parcial** | 1 só regra `:focus` em todo o CSS, e remove o contorno |
| 12 | Sem avaliações falsas | **Tem** | modelos dizem "Exemplo ilustrativo" e "Cliente exemplo" |
| 13 | Sem promessas falsas | **Quase** | "★ MAIS ESCOLHIDO" em `pacotes.html` não é comprovável |
| 14 | Copyright das imagens | **RISCO** | 96 fotografias nos modelos, EXIF apagado, sem ficheiro de licenças |
| 15 | Dados legais da empresa | **FALTA** | NIF e morada "a preencher" em todas as páginas |
| 16 | Conformidade RGPD | **Boa base** | falta Livro de Reclamações no rodapé global |
| 17 | Outros riscos jurídicos | **2 a tratar** | Google Fonts carregadas do servidor da Google; link ODR desatualizado |

### Detalhe dos pontos que falham

**5 — Aviso no formulário.** O RGPD, artigo 13.º, obriga a informar **no momento em que
os dados são recolhidos**. Em `orcamento.html`, `contacto.html` e `conta.html` o link para
a política só existe no rodapé. Falta uma linha junto ao botão de envio.

**11 — Teclado.** `estilo.css` tem uma única ocorrência de `:focus`, na linha 299, e essa
faz `outline:none`. Quem navega só com Tab fica dependente do anel do navegador, que num
fundo `#16100b` quase não se vê.

**14 — Imagens.** 96 fotografias em `img/modelos/`, nos tamanhos 1000×667 e 800×533, que são
os formatos de descarga típicos do Pexels e do Unsplash. Todo o EXIF foi removido, por isso
não é possível provar a origem a partir dos ficheiros. É preciso registar de onde vieram.

**17a — Google Fonts.** O site carrega Playfair Display e Manrope de `fonts.googleapis.com`.
Isso envia o IP do visitante para a Google. O tribunal de Munique (LG München I, 20-01-2022,
proc. 3 O 17493/20) condenou um site por exatamente isto. A página de cookies **assume-o
honestamente**, o que ajuda, mas alojar as fontes no próprio site elimina o problema.

**17b — Link ODR (confirmado).** A plataforma europeia de resolução de litígios em linha
(`ec.europa.eu/consumers/odr`) **encerrou a 20 de julho de 2025**, por força do
Regulamento (UE) 2024/3228, que revogou o Regulamento 524/2013. Deixou de aceitar queixas
novas em março de 2025 e a obrigação de a referenciar foi eliminada.
`reembolso.html` ainda remete para lá — o link tem de sair.

---

## Projeto 2 — Inova Beauty (`godiandk/godiandk`, raiz)

| # | Ponto do vídeo | Estado |
|---|---|---|
| 1 | Política de privacidade | **NÃO EXISTE** |
| 2 | Termos de serviço | **NÃO EXISTE** |
| 3 | Aviso de cookies / armazenamento | **NÃO EXISTE** |
| 4 | Política de cancelamento | **NÃO EXISTE** |
| 5 | Formulários conformes | **FALTA** — recolhe nome, telemóvel, email e data de nascimento sem informar |
| 6 | Só dados necessários | **Tem** |
| 7 | Scripts de tracking | **Tem** — nenhum. Mapa Google está comentado |
| 8 | Acessibilidade | **Parcial** — sem link de salto |
| 9 | Alt nas imagens | **Tem** — 6 imagens, todas com alt |
| 10 | Contraste | **FALHA** — ver abaixo |
| 11 | Navegação por teclado | **FALHA** — 2 campos sem indicador de foco |
| 12 | Sem avaliações falsas | **Tem** — não há testemunhos |
| 13 | Sem promessas falsas | **Tem** — linguagem correta ("semi-permanente", "duradouro") |
| 14 | Copyright das imagens | **Tem** — 5 ficheiros, fotos da própria profissional |
| 15 | Dados legais | **NÃO EXISTE** — sem NIF, morada, Livro de Reclamações ou RAL |
| 16 | Conformidade RGPD | **NÃO EXISTE** |
| 17 | Outros riscos | **3** — ver abaixo |

### Contraste reprovado (WCAG 2.1 AA exige 4,5:1 para texto normal)

| Combinação | Rácio | Veredito |
|---|---|---|
| `--gold #b08d57` sobre `--cream #faf6f0` | **2,87:1** | reprova |
| `--white` sobre `--gold` (botões) | **3,04:1** | só texto grande |
| `--white` sobre `--wa #25d366` | **1,95:1** | reprova |

O dourado é usado como cor de texto em 20 sítios do `styles.css`: marca, links do menu,
setas, títulos de cartão. É o problema de acessibilidade mais extenso dos três projetos.

### Teclado

`styles.css` tem `outline:none` em três sítios. Na linha 871 há substituto (`box-shadow`),
mas nas linhas **1048** (campo do chat) e **1117** (campo do selo) não há nada.

### Outros riscos

- **Dados pessoais sem informação.** As contas de cliente guardam nome, telemóvel, email e
  **data de nascimento** no `localStorage`. As senhas estão bem protegidas (SHA-256 com salt
  via WebCrypto), mas guardar informação no equipamento do utilizador está abrangido pelo
  artigo 5.º, n.º 3 da Diretiva ePrivacy — exige informar, mesmo não sendo cookie.
- **Área reservada fraca.** `/painel/` protege-se com um PIN cujo valor inicial é `1234`,
  guardado em `localStorage`. Qualquer pessoa com o endereço entra.
- **Atividade regulada.** Micropigmentação e depilação a laser estão sujeitas ao DL 63/2019
  (registo junto da autoridade de saúde) e a regras próprias de publicidade a atos de saúde.

---

## Projeto 3 — `/tecnova` dentro do repo `godiandk/godiandk`

Página única antiga da Tecnova, independente do site em tecnovadigital.pt.

- **Nenhuma página legal.** Nem privacidade, nem termos, nem cookies.
- **Formulário de contacto** recolhe nome, email e mensagem sem qualquer aviso.
- **Rodapé vazio** — só "© Tecnova Digital. Todos os direitos reservados."
- **Risco de SEO:** é conteúdo duplicado a competir com o site principal.

Recomendação: ou apagar, ou redirecionar para tecnovadigital.pt. Manter duas Tecnovas
no ar prejudica as duas.

---

## Ordem de resolução sugerida

**Primeiro (bloqueia faturação legal):**
1. NIF e morada reais em TECNOVA — já estão à espera desde a abertura de atividade.
2. Confirmar nas Finanças se a atividade exige Livro de Reclamações. Se exigir, pôr o link
   no rodapé de **todas** as páginas, nos dois sites.
3. Quatro páginas legais de raiz para a Inova Beauty.

**Segundo (exposição real, custo baixo):**
4. Linha de aviso RGPD junto de cada botão de envio, nos três projetos.
5. Corrigir o link ODR encerrado em `reembolso.html`.
6. Registar a origem e a licença das 96 fotografias dos modelos.

**Terceiro (acessibilidade):**
7. Escurecer o dourado da Inova de `#b08d57` para cerca de `#8a6c38` quando é texto.
8. Indicador de foco visível nos dois sites.
9. Link "saltar para o conteúdo" nos dois sites.

**Quarto:**
10. Alojar as Google Fonts no próprio site.
11. Decidir o destino do `/tecnova` duplicado.
12. Trocar "★ MAIS ESCOLHIDO" por algo comprovável.
