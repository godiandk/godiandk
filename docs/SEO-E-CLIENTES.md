# Ser encontrado no Google e ter mais clientes — plano da Inova Beauty

Escrito a 9 de novembro de 2026, a pedido do Wesley, depois de perguntar (por outras palavras) se dá para achar o site no
Google sem pagar e se o Claude o ajuda a trazer pelo menos 10 clientes por dia para a Thayana.

Este documento é para ser lido e seguido por pessoas, não por programas. Tudo o que é técnico (e que o Claude já fez) está
na secção 2; tudo o que só o Wesley e a Thayana podem fazer está nas secções 3 a 5.

---

## 1. Resposta curta

**Hashtags e Google.** No Google as hashtags não servem para subir nos resultados: o Google trata-as como palavras
normais do texto (declarações de John Mueller, do Google, noticiadas em [SERoundtable](https://www.seroundtable.com/google-hashtags-words-in-content-34938.html)).
As hashtags funcionam no **Instagram e no TikTok**. O que faz o site aparecer no Google é: um texto claro em cada página
(com o sítio onde estão), a página rápida, o **Perfil da Empresa no Google** (o cartão do Google Maps) e as **avaliações**.
Tudo isto é grátis.

**«No mínimo 10 clientes por dia».** Não posso prometer esse número, e quem o prometer está a vender uma ilusão:
depende da agenda da Thayana, do preço, das avaliações, da concorrência e do tempo. O que posso fazer é o método:
deixar o site pronto, pôr o Perfil no Google a trabalhar, e **medir** (quantas pessoas veem, quantas clicam, quantas
marcam, quanto custou cada marcação). Só com esses números se decide se vale a pena gastar mais.
Para perceber a escala: 10 marcações por dia são cerca de 220 por mês; com uma taxa de marcação de 3 % (é só um
exemplo para fazer a conta; a taxa real mede-se) seriam precisas umas 330 visitas por dia ao site.

**Concorrência real.** Nas pesquisas que fiz a 9 de novembro por «threading Canidelo» e «brow lamination Vila Nova de Gaia», os
resultados eram sobretudo páginas do marketplace Fresha
([exemplo: threading em Canidelo](https://www.fresha.com/lp/en/tt/eyebrow-threading/in/pt-porto/canidelo)).
A ferramenta de pesquisa que usei não é o Google: confirmem pesquisando no telemóvel, na zona de Canidelo.
É por isso que o Perfil no Google e as avaliações contam tanto: são o que põe a Thayana no mapa.

---

## 1b. O vídeo que o Wesley enviou: o que já estava, o que fiz e o que falta

O vídeo é de uma agência de marketing e faz cinco perguntas a quem fez um site que «não aparece no Google». Estado de cada uma:

| O que o vídeo pergunta | Estado | O que está feito | O que falta (só vocês) |
|---|---|---|---|
| Pôr o site no Google (**Google Search Console**) | **preparado; falta a vossa conta** | o script já põe a etiqueta de verificação (campo `google_site_verification`) e o sitemap está pronto; passo a passo em 3.3 | criar a propriedade com a conta Google da empresa, dar-me o código da «Etiqueta HTML» (ou colá-lo) e enviar o sitemap |
| Ficheiro **`sitemap.xml`** | **feito** (já existia; foi refeito) | 27 endereços, só páginas que podem aparecer no Google (saíram `conta/` e `app/home/`), gerado por `aplicar_seo.py` | enviá-lo no Search Console (o `robots.txt` de um site em `github.io/godiandk/` não é lido pelo Google) |
| Ficheiro **`llms.txt`** para as IAs | **criado agora** | `llms.txt` gerado pelo script, com os serviços, a zona e as páginas, sem preços nem tempos | nada. Mas atenção: **não há prova de que as IAs o usem** (ver abaixo) e, num endereço `github.io/godiandk/`, não fica na raiz do domínio; com domínio próprio fica em `/llms.txt` |
| **Meta description** (descrição para o Google) | **feito** | uma descrição única em cada página, verificada pelo script; 19 foram reescritas (18 com a localidade) | — |
| **Palavras-chave** usadas de forma otimizada | **feito com dados reais** | secção 2b (Google Keyword Planner, Portugal): títulos, descrições e perguntas frequentes afinados | conteúdo novo que só a Thayana pode dar (3.7), sobretudo para a micropigmentação labial |

**Sobre o `llms.txt`, com honestidade.** Em junho de 2025 John Mueller (Google) escreveu que nenhum sistema de IA usa o `llms.txt`
([SERoundtable](https://www.seroundtable.com/google-ai-llms-txt-39607.html)) e comparou-o à etiqueta «keywords», que o Google ignora.
Num guia de maio de 2026 a Pesquisa Google diz que não é preciso criar ficheiros para IA para aparecer nas respostas geradas por IA
([Search Engine Land](https://searchengineland.com/google-says-normal-seo-works-for-ranking-in-ai-overviews-and-llms-txt-wont-be-used-459422),
[Search Engine Journal](https://www.searchenginejournal.com/google-says-llms-txt-is-purely-speculative-for-now/577576/)).
Por outro lado, o Lighthouse do Chrome passou a verificá-lo como opcional. Conclusão: está feito porque custa pouco e o vídeo o menciona,
mas **não é por ele que a Thayana vai ter clientes**. O que pesa é o Perfil no Google, as avaliações, uma página rápida e clara, e conteúdo útil.

---

## 2. O que já ficou feito no site (técnico)

| O quê | Porquê | Onde |
|---|---|---|
| Título e descrição reescritos em 19 páginas (18 delas com a localidade: Canidelo / Vila Nova de Gaia) | é o que o Google mostra no resultado | `scripts/seo/site.json` |
| Dados estruturados: `BeautySalon` (início), `FAQPage` (feito a partir das perguntas **visíveis**) e `BreadcrumbList` (migalhas visíveis) | o Google percebe que é um salão local | `scripts/seo/aplicar_seo.py` |
| Sitemap só com páginas que podem aparecer no Google; `conta/` e `app/home/` passam a `noindex` | não pedir ao Google para indexar páginas de utilização | `sitemap.xml`, `robots.txt` |
| `lang="pt-PT"` em todas as páginas | o Google sabe que é português de Portugal | todas |
| Página rápida: imagens WebP (a imagem principal passou de 827 KB para 81 KB), scripts que não bloqueiam o ecrã | página lenta perde clientes e posições | `img/*.webp`, `defer` |
| **Corrigido:** em telemóvel e no Safari, o Firebase pedia um ficheiro à Google (`apis.google.com`) ao abrir qualquer página | contradizia a Política de Privacidade e atrasava a página | `vendor/firebase/LEIA-ME.txt` |
| **Corrigido:** «efeito de máscara permanente» na página do lifting; promessas que estavam nas descrições para o Google («especialistas», «precisão total», «ideal para peles sensíveis») | não anunciar o que não se prova | `servicos/pestanas/lifting/`, `scripts/seo/site.json` |
| `llms.txt`: resumo do site para assistentes de IA, gerado pelo mesmo script (só factos públicos, sem preços nem tempos) | o vídeo menciona-o; custa pouco (mas ver 1b: não há prova de que ajude) | `llms.txt` |
| Duas perguntas frequentes novas na página inicial: «Onde fica a Inova Beauty?» e «Que serviços fazem?» (com tradução EN/ES; entram nos dados estruturados) | pesquisas locais e respostas diretas | `index.html` |
| Títulos e descrições afinados com o que as pessoas pesquisam em Portugal (secção 2b): «depilação à linha», «o que é a brow lamination», «preços», lábios | mais cliques de quem já pesquisa | `scripts/seo/site.json` |
| Letras principais pré-carregadas (menos «saltos» da página ao carregar) e pontos do carrossel com 24 px de área de toque | estabilidade e acessibilidade | `scripts/seo/aplicar_seo.py`, `styles.css` |
| Zona à vista na página inicial: «Marcação online · Canidelo, Vila Nova de Gaia» por cima do título | reforça a zona no texto da página | `index.html` |

<!-- LH-INICIO -->
### Velocidade, medida

Lighthouse no telemóvel (rede lenta e processador 4× mais lento, simulados), **antes → depois** do trabalho de 9 de novembro,
num servidor local sem a compressão que o GitHub Pages aplica (o peso real das páginas é menor). Os números oscilam alguns pontos de medição para medição.

| Página | Pontuação de desempenho | 1.º conteúdo visível (FCP) | Acessibilidade | Boas práticas | SEO |
|---|---|---|---|---|---|
| `/` | 40 → **76** | 5,2 s → **1,7 s** | 96 → 100 | 96 → 100 | 100 → 100 |
| `/servicos/sobrancelhas/threading/` | 62 → **78** | 5,2 s → **1,4 s** | 100 → 100 | 96 → 100 | 100 → 100 |
| `/precario/` | 63 → **78** | 5,1 s → **1,5 s** | 100 → 100 | 96 → 100 | 100 → 100 |
| `/agendar/` | 64 → **77** | 5,0 s → **1,5 s** | 100 → 100 | 96 → 100 | 100 → 100 |
| `/localizacao/` | 65 → **95** | 4,9 s → **1,4 s** | 100 → 100 | 96 → 100 | 100 → 100 |

Com a rede lenta **emulada de verdade** (1,6 Mbps, 150 ms de latência, processador 4× mais lento), em vez de simulada:

| Página | 1.º conteúdo visível (FCP) | Maior elemento (LCP) | Pontuação |
|---|---|---|---|
| `/` | 7,3 s → **3,4 s** | 11,1 s → **3,4 s** | 50 → **72** |
| `/servicos/sobrancelhas/threading/` | 6,4 s → **3,2 s** | 6,4 s → **3,2 s** | 60 → **83** |

O Google considera «bom» um maior elemento (LCP) até 2,5 s. A página inicial passou de 11,1 s para 3,4 s e a do threading de 6,4 s para 3,2 s:
melhorou muito, mas ainda não chega à marca. O que resta é sobretudo o código do Firebase (cerca de 500 KB) que as páginas públicas carregam
só para mostrar «Entrar» ou o nome de quem já tem sessão. Carregá-lo apenas quando for preciso daria o salto seguinte, mas mexe no início de sessão:
deve fazer-se à parte, com testes. Nas medições simuladas o LCP continua perto de 6 s pela mesma razão (o simulador conta o descarregamento desses ficheiros).
<!-- LH-FIM -->

## 2b. Palavras-chave: o que as pessoas pesquisam em Portugal

Dados do **Google Keyword Planner** (pesquisas médias por mês em **Portugal inteiro**, português; consultados a 9 de novembro de 2026 através da
ferramenta AdWhispr, só leitura, sem gastar nada). Escolhi as pesquisas que correspondem a serviços que a Thayana faz hoje.

| Pesquisa | Por mês | O que fiz com ela |
|---|---:|---|
| brow lamination | 4 400 | já é um serviço e tem página (serviço e «como é feito»); título e descrição |
| lifting pestanas / lifting de pestanas | 3 600 / 720 | página do lifting; título e descrição |
| micropigmentação labial (e as variantes de escrita) | 1 300 | **o site ainda não tem página para este serviço** (3.7); já aparece no início, no preçário e no `llms.txt` |
| brow lamination o que é | 1 000 | a página «como é feito» passou a chamar-se «Brow Lamination: o que é e como é feita» |
| threading sobrancelhas | 390 | título da página do threading |
| depilação a linha / à linha / com linha / em linha (várias formas) | 320 + 210 + 210 + 110… | as páginas de threading passaram a dizer «depilação à linha (threading)»: é como as pessoas procuram |
| lifting pestanas preço · micropigmentação labial preço · brow lamination preço | 210 · 210 · 40 | o título do preçário passou a «Preços de Sobrancelhas, Pestanas e Lábios em Gaia» |
| estética gaia · clínica estética gaia · esteticista vila nova de gaia | 50 · 30 · 20 | «Vila Nova de Gaia» e «Gaia» nos títulos e nas descrições |

**O que isto diz sobre «10 clientes por dia».** As pesquisas com «Gaia» no nome são poucas (dezenas por mês); as grandes são nacionais
(«brow lamination», «lifting pestanas») e disputadas por todo o país. O Keyword Planner também não conta bem as pesquisas «perto de mim»
nem as do Google Maps, que são as que mais trazem clientes a um salão local. Por isso o caminho realista é o **Perfil no Google + avaliações**
(para o mapa), o **Instagram/TikTok** e a **recomendação de quem já é cliente**; o site e a velocidade fazem com que quem chega marque.
Só com a pesquisa do Google não se chega a um número fixo por dia.

**Como manter.** Depois de mudar um título ou uma descrição, editar `scripts/seo/site.json` e correr
`python3 scripts/seo/aplicar_seo.py`. Para confirmar que está tudo certo: `python3 scripts/seo/aplicar_seo.py --verificar`
(devolve erro se algo estiver desatualizado, um título for longo demais ou aparecer «melhor», «garantido», «permanente»,
«ideal para», «100 %» ou «certificado» num título ou descrição).
As descrições **não têm preços nem tempos** de propósito: esses valores vêm do catálogo e do painel da Thayana e não se copiam para textos.

**Decisão do Wesley — a rua nos dados do Google.** Os dados estruturados do início dizem «Rua da Bélgica» e o código postal «4400-045».
Já estavam assim antes deste trabalho. A rua também aparece na página Localização (a morada exata só é enviada ao confirmar a marcação);
o código postal não aparece na página, só nos dados que o Google lê. Como é a casa da Thayana, se preferirem que o Google não veja
a rua nem o código postal, pôr `"mostrar_rua_no_google": false` em `scripts/seo/site.json` e voltar a correr o script.

---

## 3. O que só o Wesley e a Thayana podem fazer (por ordem de impacto)

### 3.1 Perfil da Empresa no Google (grátis, o mais importante)
1. Entrar em <https://business.google.com> com uma conta Google que seja da Inova Beauty (não a pessoal).
2. Criar o perfil «Inova Beauty». Categoria principal: a que o Google oferecer para salão/estúdio de beleza; como
   secundárias, as de sobrancelhas e pestanas que aparecerem.
3. **Morada.** Como é em casa, o Google tem regras próprias: se os clientes vão a casa por marcação, a morada pode ser
   mostrada; se preferirem privacidade, escolhe-se «área de serviço» (Vila Nova de Gaia e Porto) e esconde-se a morada.
   Esconder reduz a visibilidade no mapa. Ler as regras atuais do Google antes de decidir; resumo de terceiros:
   [Whitespark](https://whitespark.ca/blog/are-home-based-businesses-eligible-for-a-google-business-profile/).
4. Telefone: o WhatsApp +351 919 277 205. Site: `https://godiandk.github.io/godiandk/` (ou o domínio próprio, 3.6).
   Link de marcação: `…/agendar/`.
5. Horário: o mesmo que está no painel da Thayana (não inventar um diferente).
6. Serviços e descrições: só os que ela **faz hoje** (os escondidos não entram). Sem preços inventados: copiar do preçário do site.
7. Fotos: da Thayana a trabalhar e do espaço. Fotos de clientes só com autorização por escrito (é o rosto delas: RGPD).
8. Verificar o perfil (o Google pede um código por postal, telefone ou vídeo) — pode demorar alguns dias.

### 3.2 Avaliações (o que mais converte)
- Depois de cada atendimento, a Thayana envia a ligação de avaliação do perfil por WhatsApp. Texto sugerido:
  «Olá, [nome]! Obrigada pela visita 😊 Se gostou, ajuda-nos muito deixar uma avaliação aqui: [ligação]. Obrigada!»
- Responder a **todas** as avaliações (também às más), com calma e sem expor dados da cliente.
- **Não** oferecer descontos ou brindes em troca de avaliações: a política do Google para avaliações não o permite e pode levar à remoção
  das avaliações (confirmar na política atual, na ajuda do Perfil da Empresa).

### 3.3 Google Search Console (grátis)
1. Em <https://search.google.com/search-console> adicionar o site como «Prefixo do URL» com o endereço do site.
2. Método de verificação «Etiqueta HTML»: dar-me o código (só o valor de `content`) para o pôr em `scripts/seo/site.json`
   (campo `google_site_verification`) e correr o script; ou colá-lo vocês e correr o script.
3. Enviar o `sitemap.xml` (tem de ser feito aqui: o `robots.txt` deste projeto não está na raiz de `godiandk.github.io`, por isso o Google
   não o lê e não descobre o sitemap sozinho; com um domínio próprio já passa a funcionar). Ver depois, todas as semanas, as pesquisas que trazem pessoas ao site.

**Bing Webmaster Tools (grátis, 5 minutos).** Em <https://www.bing.com/webmasters> adicionar o site, verificar com a etiqueta `msvalidate.01`
(o código vai para o campo `bing_site_verification` de `scripts/seo/site.json`) e enviar o sitemap. O Bing alimenta o Copilot e outros assistentes.

### 3.4 Instagram e TikTok — aqui as hashtags valem
- Biografia: «Sobrancelhas e pestanas · Canidelo, Vila Nova de Gaia · Marque online ↓» e o link do site.
- 5 a 10 hashtags por publicação, misturando zona, serviço e nicho:
  - zona: `#vilanovadegaia` `#canidelo` `#gaia` `#porto` `#esteticaporto` `#sobrancelhasporto`
  - serviço: `#threading` `#browlamination` `#laminacaodesobrancelhas` `#liftingdepestanas` `#tinturadepestanas` `#designdesobrancelhas`
  - nicho: `#sobrancelhasnaturais` `#sobrancelhasperfeitas` `#antesedepois`
- Vídeos curtos (Reels/TikTok) de antes e depois **com autorização da cliente**; um por semana é melhor do que cinco numa semana e nenhum nas seguintes.
- Pôr o link do site também em «destaques» e nas respostas aos comentários.

### 3.5 WhatsApp Business
Perfil comercial (nome, horário, morada ou zona, descrição curta, catálogo com os serviços), mensagens rápidas para as perguntas
mais comuns e ligação direta no Perfil do Google e no Instagram.

### 3.6 Domínio próprio (opcional, mas ajuda a marca)
Um domínio como `inovabeauty.pt` fica mais fácil de lembrar e de pôr nos cartões. Passos:
1. Registar o domínio num registo à escolha.
2. No registo, criar os registos DNS que o GitHub indica na página oficial «Managing a custom domain for your GitHub Pages site»
   (não consegui abri-la nesta sessão: confirmar os valores atuais lá).
3. No repositório, criar o ficheiro `CNAME` com o domínio e, em Settings → Pages, ativar «Enforce HTTPS».
4. **Firebase:** em Authentication → Settings → Authorized domains, acrescentar o domínio novo; e, se a chave de API tiver restrição por domínio
   (Google Cloud → APIs e serviços → Credenciais), acrescentá-lo também. Testar o início de sessão e uma marcação no domínio novo **antes** de o dar ao Google.
5. Só quando o domínio já abrir o site com HTTPS: `python3 scripts/seo/aplicar_seo.py --base-url https://inovabeauty.pt/`
   (muda canonical, sitemap, robots e dados estruturados) e atualizar o site no Perfil do Google e no Search Console.

### 3.7 Conteúdo que só a Thayana pode dar (e que mais traz pesquisas)

A **micropigmentação labial** é o serviço com mais pesquisas (1 300 por mês em Portugal, concorrência baixa) e é um serviço que ela já faz
(está no preçário e na marcação), mas o site não tem uma página para ele. É um procedimento de saúde e de pigmentação: o texto tem de ser dela.
Quando me responder a isto, faço a página (título, texto, perguntas frequentes, tradução, dados estruturados) no mesmo dia:
1. O que inclui a sessão (consulta, desenho, pigmentação, retoque)?
2. Cuidados antes e depois, nas palavras dela.
3. Para quem **não** é indicado (saúde, gravidez, alergias…).
4. Fotos de antes e depois, **com autorização escrita** da cliente (modelo no `docs/KIT-DIVULGACAO.md`).
5. Formação e registo profissional que quer mostrar.
6. O que é a «Neutralização», em duas frases dela.
(A duração **não** se escreve na página: vem do painel dela.)

Também ajudam: uma pergunta e resposta por serviço feita por ela, e as fotos do espaço.

---

## 4. Anúncios pagos: só depois de 3.1 a 3.3, e como teste medido

**Quando.** Quando o Perfil estiver verificado, as marcações estiverem a funcionar e houver as primeiras avaliações.
Antes disso, o dinheiro compra cliques para um site que ainda não converte.

**Teste de 14 dias** (os valores são exemplos; o Wesley decide o teto):
- Google Ads (pesquisa): palavras como «sobrancelhas Vila Nova de Gaia», «threading Gaia», «lifting de pestanas Gaia», raio de uns
  10–15 km à volta de Canidelo, anúncio a levar à página do serviço (não à página inicial).
- Instagram/Facebook: Reels do trabalho, mulheres da zona, o mesmo raio.
- **Teto de gasto definido por escrito** (por exemplo: 5 a 10 € por dia durante 14 dias) e regra de paragem: se ao fim dos 14 dias o custo
  de cada marcação for maior do que a Thayana aceita, para-se e muda-se o anúncio ou a página.
- Medir: cliques, marcações (no painel), **custo por marcação**, quantas dessas pessoas voltaram.
- **Compromisso:** o Claude não lança, não altera orçamentos nem retoma campanhas sem o Wesley dizer «sim» a cada passo,
  com o valor e o período escritos.

**Capacidade.** Antes de comprar mais clientes, ver quantas marcações a Thayana consegue atender por dia com os tempos que **ela**
definiu no painel (Disponibilidade → Serviços). Se a agenda enche, mais anúncios só trazem listas de espera.

---

## 5. Antes de pôr mais gente a marcar: o salão em casa (confirmar, não assumir)

Estas questões não são de SEO mas decidem se o negócio pode crescer sem surpresas. Cada ponto deve ser confirmado com a
Câmara Municipal de Vila Nova de Gaia, o Balcão do Empreendedor, as Finanças e, se for apartamento, o título/regulamento do condomínio:
- Se o espaço em casa pode ter atividade de estética e que comunicação ou licença é precisa.
- Início de atividade nas Finanças (código de atividade), faturação e IVA, regime fiscal.
- Seguro de responsabilidade civil profissional.
- Se for apartamento: a fração pode ter uso de serviços? O condomínio tem de autorizar?
- Formação/certificação para os serviços que oferecem (os de micropigmentação e laser estão escondidos por esse motivo).
- Livro de Reclamações eletrónico: já está no site.
- Privacidade: a morada de casa só deve ser dada depois da marcação confirmada (já é assim no site).

---

## 6. Como saber se está a funcionar (sem espiar ninguém)

O site foi desenhado para respeitar a privacidade: não tem Google Analytics nem Meta Pixel ligados. Por isso:
- **Search Console:** pesquisas, cliques e posição no Google.
- **Perfil da Empresa:** chamadas, pedidos de direções, cliques no site, pesquisas que o mostraram.
- **Painel da Thayana:** número de marcações por dia e por serviço.
- **Pergunta simples:** «Como nos conheceu?» (Google, Instagram, amiga…), anotada pela Thayana.
- **Se quiserem medição automática** do que vem de cada anúncio: dá para acrescentar um campo opcional «Como nos conheceu?»
  na marcação e ligar o `analytics.js` já preparado, atrás de um aviso de consentimento. Isso obriga a atualizar a Política de
  Privacidade e a de Cookies; o Claude trata disso se o Wesley quiser.

---

## 7. Calendário realista

| Quando | O quê |
|---|---|
| Esta semana | Criar e verificar o Perfil no Google (3.1); Search Console (3.3); começar a pedir avaliações (3.2) |
| Semanas 2–4 | Publicar no Instagram/TikTok (3.4); primeiras avaliações; ver o Search Console |
| Mês 2–3 | Decidir o teste de anúncios (4) com os números reais; domínio próprio (3.6), se quiserem |
| Contínuo | Responder a avaliações, uma publicação por semana, rever o Search Console todos os meses |

O Perfil no Google pode começar a aparecer dias depois de verificado. O site em si demora semanas a ganhar posições.
Os anúncios aparecem logo, mas só valem a pena se o resto estiver pronto.

---

## 8. Fontes e limites

- Hashtags no Google: [SERoundtable — «Google: We Treat Hashtags As Words In Content»](https://www.seroundtable.com/google-hashtags-words-in-content-34938.html)
  (declarações de John Mueller; não encontrei uma página oficial do Google sobre isto).
- Perfil da Empresa em casa: [Whitespark](https://whitespark.ca/blog/are-home-based-businesses-eligible-for-a-google-business-profile/)
  é um resumo de terceiros; as regras valem as do Google, que mudam.
- Concorrência: [páginas do Fresha para Canidelo](https://www.fresha.com/lp/en/tt/eyebrow-threading/in/pt-porto/canidelo).
  Preços e tempos dos outros salões **não** se copiam para este site: vêm da lista de preços e do painel da Thayana.
- Palavras-chave: Google Keyword Planner (Portugal, português), consultado a 9 de novembro de 2026 com a ferramenta AdWhispr (só leitura).
- `llms.txt`: [SERoundtable](https://www.seroundtable.com/google-ai-llms-txt-39607.html),
  [Search Engine Land](https://searchengineland.com/google-says-normal-seo-works-for-ranking-in-ai-overviews-and-llms-txt-wont-be-used-459422),
  [Search Engine Journal](https://www.searchenginejournal.com/google-says-llms-txt-is-purely-speculative-for-now/577576/):
  notícias sobre o que o Google disse; não abri as páginas oficiais do Google.
- O que está em 5 são perguntas para confirmar com as entidades, não aconselhamento jurídico.
