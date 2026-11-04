# Vistoria jurídica ao site da Inova Beauty — 4 de novembro de 2026

Pedido do Wesley: percorrer 23 pontos, dizer se cada um **existe**, **existe mal** ou **não existe**, e só depois corrigir.
Lei aplicável: **RGPD (Regulamento (UE) 2016/679) e Lei n.º 58/2019**; autoridade de controlo: **CNPD**. Não se aplicam a LGPD nem a CCPA.
Tudo em português de Portugal.

> **Avisos importantes**
> - Não sou advogado. Isto é um trabalho técnico de conformidade. Os textos legais são uma base séria, mas **devem ser lidos por um advogado ou por um consultor de proteção de dados** antes de se publicarem como definitivos.
> - Não consegui abrir os sítios oficiais (Diário da República, CNPD). Os números de artigo vêm de pesquisa e de conhecimento geral: **confirme-os** antes de os citar a terceiros.
> - **Não foi nada publicado.** Tudo está num pedido de alterações (PR) por aceitar. Só entra no site quando o Wesley fizer *merge*.
> - Onde faltam dados que só o Wesley ou a Thayana sabem, está **«A PREENCHER»** a amarelo, bem visível. Não inventei NIF, morada, nome, email nem regras do estúdio.

## 1. Quadro dos 23 pontos

«À partida» é o que encontrei antes de mexer: **existia**, **existia mal** ou **não existia**.

| # | Ponto | À partida | JÁ TINHA | CORRIGI AGORA | FALTA (e porquê) |
|---|---|---|---|---|---|
| 1 | Política de Privacidade | existia mal | 8 secções curtas; direitos; CNPD | Reescrita (12 secções): responsável, dados campo a campo com fundamento (arts. 6.º e 9.º), destinatários, transferências, prazos, direitos, menores (13 anos), CNPD; PT/EN/ES. Retiradas frases falsas («SHA-256», «servidores na UE») | Nome, NIF, morada, email e região da base de dados (A PREENCHER). Os prazos (24 meses, 5 anos) são propostas minhas: confirmar. Revisão por advogado |
| 2 | Termos e Condições | existia mal | 7 secções curtas | Reescritos (15 secções): quem presta, marcação (contrato na confirmação), preços e pagamento, fidelidade, conta, comunidade, saúde, garantia, responsabilidade, reclamações, lei e foro | Regime de IVA, meios de pagamento e entidade de RAL (A PREENCHER). Foro e limitação de responsabilidade: validar com advogado |
| 3 | Página de Cookies | não existia | um parágrafo na Privacidade | Criada: lista real medida nas 41 páginas (0 cookies; cada item de localStorage, IndexedDB e cache, com finalidade, quando e duração). O idioma deixou de ser gravado sem a pessoa escolher | Confirmar, no site publicado, que o GitHub Pages não põe cookies (daqui a rede bloqueia o domínio) |
| 4 | Cancelamento e reembolso (livre resolução 14 dias) | não existia | uma frase nos Termos | Criada: como cancelar, regras do estúdio, livre resolução (DL 24/2014: prazo, como se exerce, custos, reembolso em 14 dias), **quando não se aplica**, reembolsos, modelo de formulário | Aviso prévio e encargo por falta (A PREENCHER: só a Thayana decide). Recolher por escrito o pedido expresso de início do serviço (mensagem-modelo no fim) |
| 5 | Linha junto ao botão de envio de cada formulário | existia mal | linha minúscula e pálida; no registo, uma frase falsa | Aviso legível (art. 13.º) em: marcação (site e app), início de sessão, registo, configurações, publicação na comunidade e chat | Nada de crítico. O painel de administração é interno |
| 6 | Minimização campo a campo | existia mal | pedia sexo e data de nascimento completa (obrigatórios); gravava o email em cada marcação | **Removido o «Sexo»**. «Data de nascimento» passou a «Aniversário (opcional)», só dia e mês. Email deixou de ir para as marcações. Contas antigas limpam-se ao abrir sessão. Aviso «não escreva dados de saúde» | Marcações já gravadas ainda têm email até serem apagadas (novo botão no painel apaga as de mais de 24 meses) |
| 7 | Google Analytics, pixel Meta e outros só com consentimento | existia mal | `analytics.js` inativo, mas carregaria sem pedir consentimento | **Confirmado por escrito: hoje não há GA, Pixel nem outras ferramentas.** `analytics.js` refeito (só depois de «Aceitar», botões com o mesmo destaque); removido o `measurementId` do Firebase | Se quiserem anúncios: preencher os IDs e rever a Política de Cookies (já tem o texto) |
| 8 | Letras, mapas, vídeos e ícones de terceiros | existia mal | Google Fonts, SDK da Google e mapa a carregar sempre | Letras e SDK alojados no site; mapa só ao clicar; service worker só na app; sem vídeos nem redes sociais. Medido: 0 pedidos a terceiros ao abrir as páginas, exceto à Firebase na marcação e na app | A Firebase (Google) fica: é preciso para marcações e contas e está declarada. Símbolo do WhatsApp: origem a confirmar |
| 9 | Auditoria de acessibilidade | não existia | — | axe-core em 41 páginas × 2 ecrãs + medição de contraste real + teclado: **9 tipos de falha → 0**; 15 estados interativos sem falhas. `docs/ACESSIBILIDADE.md` | Leitor de ecrã real e pessoas: não testado. `/tecnova/` não auditado |
| 10 | Texto alternativo nas imagens | existia | todas com `alt`, mas 148 redundantes | Decorativas com `alt=""`; teste em todas as páginas | — |
| 11 | Contraste de cada par de cores | existia mal | 698 falhas axe; 578 textos medidos abaixo do mínimo (o dourado dava 2,87:1) | Cores novas (`--gold-text`, `--on-gold`); estado «indisponível» sem opacidade. A conta de cada par está em `docs/ACESSIBILIDADE.md` | — |
| 12 | Foco visível | existia mal | `outline: none` com substituto fraco | Anel duplo global em `:focus-visible`; teste de teclado em 41 páginas | — |
| 13 | Ligação «Saltar para o conteúdo» | não existia | — | Primeira ligação de todas as páginas (também painel e app) | — |
| 14 | Títulos, `lang`, rótulos, nomes de botões | existia mal | `lang` e rótulos existiam | Sem saltos de título (h3 → h2), `<main>` em todas, h1 na app, nomes certos nos cartões e botões | — |
| 15 | Testemunhos, avaliações e estrelas | não existia | nenhum testemunho, estrela ou avaliação | Nada a apagar (pesquisa em todo o site e nos dados estruturados) | A Comunidade da app não é um sistema de avaliações. Se um dia mostrarem avaliações ao público, é preciso dizer como se garante que são de clientes reais (DL 57/2008, alterado pelo DL 109-G/2021) |
| 16 | Promessas não provadas | existia mal | frases de promessa espalhadas pelo site | **35 alterações de texto** (tabela antes → depois): «certificadas», «garantindo», «ideal para peles sensíveis… em tratamento dermatológico», «praticamente indolor», «sempre perfeito», «máscara permanente», «clínica», «não cedemos a terceiros»…; imagem de partilha (anunciava laser e micropigmentação) refeita | Confirmar duas afirmações de facto: «material esterilizado e descartável» e «especialistas». As durações da FAQ são estimativas antigas |
| 17 | Descontos (preço anterior) | não existia | só cupões pessoais e prémio de fidelidade | Verificado: **nenhum preço riscado nem «de X por Y»**, logo a regra dos 30 dias não se aplica hoje. Clarifiquei o prémio (Threading de Sobrancelhas) e a condição do cupão de aniversário | Se anunciarem reduções, o preço anterior é o mais baixo dos 30 dias anteriores (DL 70/2007, alterado pelo DL 109-G/2021). O «DL 70/2021» que indicou não o encontrei |
| 18 | Imagens e origem; CREDITOS.md | não existia | — | `CREDITOS.md`: 15 imagens, letras, SDK, ícones e marcas, com «origem desconhecida — confirmar» onde não há prova | **Origem de todas as imagens e do logótipo** (só quem as fez ou pediu sabe) |
| 19 | Logótipos, marcas e textos de terceiros | não existia | — | Levantamento em `CREDITOS.md` §5. Aviso «indisponível» posto nas 4 páginas de serviços escondidos que não o tinham | Pesquisa de marca no INPI/EUIPO; símbolo oficial do WhatsApp; «Padaria Mirassol»; nomes como «Hidraglos» |
| 20 | Identificação do prestador em todas as páginas | não existia | slogan no rodapé | Bloco em **todas as 41 páginas** (incluindo app e 404): prestador, NIF, morada, email, telemóvel; «A PREENCHER» visível (DL 7/2004, art. 10.º) | **Nome, NIF, morada e email.** Se a morada for a residência, pensem num domicílio profissional |
| 21 | Livro de Reclamações eletrónico | existia mal | texto nos Termos, sem ligação | **A atividade está abrangida** (DL 156/2005: «salões de cabeleireiro, institutos de beleza ou outros de natureza similar»). Ligação a `livroreclamacoes.pt` no rodapé de todas as páginas, nos Termos e no Cancelamento | Registo do estabelecimento na plataforma e livro/aviso no estúdio: não consigo verificar |
| 22 | Ligação ODR | não existia | nenhuma | Confirmado por teste: **nenhuma das 41 páginas tem ligação ODR** (a plataforma fechou a 20/07/2025, Reg. (UE) 2024/3228) | — |
| 23 | Outros riscos | — | — | Ver secção 4 | Ver secção 4 |

## 2. O que muda para o dia a dia

1. **Preencher os dados** (ver secção 3). Enquanto não forem preenchidos, as páginas mostram «A PREENCHER» a amarelo.
2. **Apagar marcações antigas**: Painel → Marcações → «Apagar marcações com mais de 24 meses» (a Política promete 24 meses; antes não havia como cumprir).
3. **Ao confirmar uma marcação** por WhatsApp, usar a mensagem-modelo da secção 5.
4. **Contas antigas**: ao abrirem sessão, perdem o campo «Sexo» e o ano de nascimento (só ficam dia e mês).

## 3. Como preencher os «A PREENCHER»

```bash
python3 scripts/preencher_dados_legais.py --listar            # mostra o que falta
python3 scripts/preencher_dados_legais.py \
  --nome "…" --nif "…" --morada "…" --email "…" \
  --iva "…" --meios-pagamento "…" \
  --prazo-cancelamento "…" --encargos-cancelamento "…" \
  --entidade-ral "…" --regiao-firestore "…"
```

O NIF é validado (dígito de controlo). Os valores ficam em `scripts/legal/dados_legais.json` e substituem os «A PREENCHER» em todas as páginas.
Se as páginas legais forem geradas de novo (`python3 scripts/legal/build_all.py`), os valores mantêm-se.

| Campo | Quem sabe | Onde aparece |
|---|---|---|
| `nome`, `nif`, `morada`, `email` | titular da atividade (quem emite as faturas: o Wesley ou a Thayana) | rodapé de todas as páginas, Privacidade, Termos, Cancelamento |
| `iva` | contabilista | Termos |
| `meios_pagamento` | Thayana | Termos |
| `prazo_cancelamento`, `encargos_cancelamento` | Thayana | Cancelamento |
| `entidade_ral` | titular (aderir ou não a uma entidade de RAL) | Termos |
| `regiao_firestore` | consola do Firebase → Firestore → Definições | Privacidade |

## 4. Ponto 23 — outros riscos (por ordem de importância)

1. **Dados de saúde (anamnese).** É recolhida em papel e é dado de categoria especial (art. 9.º RGPD): consentimento explícito, guardar em local fechado, prazo definido (propus 5 anos), só quem atende tem acesso. A ficha e o termo estão a ser refeitos à parte.
2. **Segurança técnica (cupões e regras da base de dados).** Há dois pontos a rever com calma. Como este repositório e o site são públicos, **não os descrevo aqui**: seguiram só na conversa com o Wesley. Pedir-me o resumo quando quiserem tratar disto.
3. **Horas ocupadas**: a lista pública de horas ocupadas só guarda dia, hora e um código interno, sem nome nem telemóvel. Convém manter assim.
4. **Prazos sem rotina automática.** Contas inativas há mais de 24 meses e marcações antigas só se apagam à mão (há agora o botão no painel para as marcações).
5. **Comentários de outras pessoas** nas publicações de alguém que apaga a conta ficam até a Thayana (administradora) os apagar: as regras só deixam apagar ao autor e à administradora. A Política diz «peça-nos a remoção».
6. **Direitos de acesso e portabilidade**: não há ferramenta automática; atende-se por pedido ao email do prestador (1 mês, art. 12.º RGPD). Convém combinar como se faz.
7. **Marca «Inova Beauty» e logótipo**: pesquisar no INPI e no EUIPO; ver `CREDITOS.md`.
8. **Imagens geradas por IA** (se for o caso): ver `CREDITOS.md` (termos da ferramenta, direitos de autor, transparência).
9. **Assistente (chat)**: já se identifica como automático e diz que não envia nada ao estúdio (transparência, AI Act art. 50.º). Se um dia passar a usar um modelo de IA a sério, rever a Política.
10. **Fotografias das clientes** na Comunidade (sobre elas ou sobre terceiros): regras nos Termos; o estúdio não deve repostar sem autorização separada.
11. **Cabeçalhos de segurança** (CSP, etc.): o GitHub Pages não os deixa configurar; um domínio próprio atrás de um serviço como a Cloudflare permitiria.
12. **Obrigações fora do site**: registo de atividade, faturação certificada, aviso do Livro de Reclamações no estúdio, normas de higiene (ASAE/DGS) para pigmentação — não verificadas aqui.
13. **Acessibilidade**: a isenção das microempresas (DL 82/2022) pode aplicar-se; mantém-se o nível AA por boa prática.

## 5. Mensagem-modelo para confirmar uma marcação (pedido expresso do início do serviço)

Serve para ficar **por escrito** (no WhatsApp) o pedido que a lei exige para o serviço começar dentro dos 14 dias de livre resolução (DL 24/2014, art. 17.º). Um advogado deve rever o texto.

> Olá, [nome]! A sua marcação de [serviço] está confirmada para [dia] às [hora]. Valor: [preço].
> Como marcou à distância, tem **14 dias para desistir sem dar razões** (as regras estão em https://godiandk.github.io/godiandk/cancelamento/).
> Se quer que o serviço comece na data marcada, **responda «SIM»**. Ao responder, pede que o serviço comece antes de passarem os 14 dias e fica a saber que **perde o direito de desistir depois de o serviço estar totalmente prestado**.
> Para cancelar ou remarcar, avise com [prazo]. Obrigada! — Inova Beauty

Guardar a resposta da cliente (captura ou exportação da conversa).

## 6. Escolhas que fiz e que pode querer mudar

- **Prazos de conservação** (Privacidade, secção 6): marcações 24 meses; anamnese 5 anos; contas inativas 24 meses; documentos fiscais 10 anos (lei). Os dois primeiros e o terceiro são propostas minhas.
- **Telemóvel na conta**: mantive-o obrigatório (identifica a cliente no cartão de selos e serve para o contacto). Se quiserem, pode passar a opcional.
- **Idade mínima 13 anos** para criar conta (Lei n.º 58/2019, art. 16.º).
- **Sem encarregado de proteção de dados**: o art. 37.º do RGPD não o exige para esta atividade.
- **Os documentos legais estão em português, com tradução para inglês e espanhol**: em caso de dúvida, prevalece o português.
- **Cartão de fidelidade**: o prémio é sempre o Threading de Sobrancelhas, como já estava nos Termos antigos.
- **Foro**: tribunais portugueses, área de Vila Nova de Gaia, sem prejuízo do foro do domicílio do consumidor (Reg. 1215/2012).
- **Chat**: mantido como assistente automático com respostas pré-definidas; não grava nem envia o que se escreve.
- **Tecnova** (`/tecnova/`): é outro projeto; não foi tocado.
- **README.md**: não foi alterado.

## 7. Testes feitos

| Teste | Resultado |
|---|---|
| Testes de lógica e do catálogo (`test_logic`, `test_catalog`) | todos OK |
| Testes de ponta a ponta (marcações, painel, Firebase simulado, app) | todos OK (adaptados ao SDK agora alojado no site) |
| **Novo:** privacidade e minimização (sem sexo, aniversário só dia/mês, contas antigas limpas, sem email nas marcações, apagar conta apaga publicações, avisos nos formulários) | 32 verificações OK |
| **Novo:** estrutura e rodapé em 41 páginas (lang, `main`, um `h1`, rodapé com os 5 dados e ligações, sem ODR, sem recursos de terceiros, imagens com `alt`, «saltar» em 1.º, foco visível) | OK |
| **Novo:** páginas legais em PT/EN/ES (traduções completas, âncoras, sem rolagem horizontal) | OK |
| axe-core (WCAG 2.0/2.1 A e AA e boas práticas), 41 páginas × 2 ecrãs | 0 violações; 15 estados interativos: 0 |
| Contraste real (7 042 textos medidos) | 0 falhas reais |
| Primeira visita: o que fica no dispositivo | nada (sem cookies, sem localStorage, sem pedidos a terceiros, exceto Firebase na marcação e na app) |

## 8. Anexos

- `docs/auditoria-juridica/alteracoes-antes-depois.md` — **tudo o que foi apagado ou reescrito**, antes → depois.
- `docs/auditoria-juridica/texto-antigo-privacidade.md` e `texto-antigo-termos.md` — os textos que foram substituídos.
- `docs/ACESSIBILIDADE.md` — falhas, correções e a conta de cada par de cores.
- `CREDITOS.md` — origem de imagens, letras e código de terceiros.
- `scripts/legal/` — gerador das 4 páginas legais (`build_all.py`); `scripts/preencher_dados_legais.py` — preenchimento dos dados.
