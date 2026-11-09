# Créditos e origem dos materiais do site

Este ficheiro diz, para cada imagem, tipo de letra e peça de código de terceiros usados no site da Inova Beauty,
**de onde veio** e **com que direitos pode ser usado**. Foi feito na revisão jurídica de 4 de novembro de 2026.

**Regra seguida:** onde não há prova da origem, está escrito **«origem desconhecida — confirmar»**. Nada foi adivinhado.
Quem sabe a resposta (o Wesley, a Thayana, o designer do logótipo…) deve preencher a coluna «Origem» e guardar a prova
(fatura, contrato, mensagem, captura do pedido à ferramenta de IA, termos de uso) numa pasta fora deste repositório.

> Não sou advogado. Isto é um levantamento técnico dos ficheiros, para quem decide poder tratar do que falta.

## 1. Imagens (pasta `img/`)

O site não tem fotografias de pessoas reais. As imagens abaixo são logótipo, ícones e ilustrações.

| Ficheiro | Tamanho | Onde aparece | Registo no Git (primeira vez) | Origem | Direitos / licença | Estado |
|---|---|---|---|---|---|---|
| `img/logo.png` | 512×512 | página 404 | `44a117d`, 2026-09-02, conta `godiandk`: «Add the Inova Beauty logo across the site (#38)» | **origem desconhecida — confirmar** (quem desenhou o logótipo: designer, ferramenta de IA, outro?) | **a confirmar** | CONFIRMAR |
| `img/mark.png` | 512×512 | cabeçalho e rodapé de todas as páginas, balão do chat | `740412b`, 2026-09-02, conta `godiandk`: «Use the B emblem + "Inova Beauty" wordmark…» (#39) | recorte do emblema «B» do logótipo acima — **origem desconhecida — confirmar** | **a confirmar** | CONFIRMAR |
| `img/favicon.png` | 256×256 | ícone do separador do navegador (todas as páginas) | `44a117d`, 2026-09-02 | derivado do logótipo — **origem desconhecida — confirmar** | **a confirmar** | CONFIRMAR |
| `img/icon-192.png`, `img/icon-512.png` | 192×192, 512×512 | ícone da app instalável e `manifest.webmanifest` | `95f6a2c`, 2026-07-21, autor «Claude»: «Fidelização com selos… app instalável (PWA)…» | **origem desconhecida — confirmar** | **a confirmar** | CONFIRMAR |
| `img/og-image.jpg` | 1200×630 | pré-visualização ao partilhar o site (redes sociais, WhatsApp) | refeita nesta revisão (a versão anterior, `03d2253`, 2026-08-20, anunciava «Micropigmentação» e «Laser», serviços que ainda não se fazem) | composição de texto sobre o logótipo (letra Cormorant Garamond, licença OFL) | o logótipo: ver `img/logo.png` | CONFIRMAR (por causa do logótipo) |
| `img/thayana-cutout.png` | 692×820 | página inicial, «Sobre», ecrã inicial da app | `95f6a2c`, 2026-07-21, autor «Claude»: «…recorte da personagem» | ilustração em estilo de desenho animado 3D de uma mulher de cabelo encaracolado (a «personagem» da Thayana). **origem desconhecida — confirmar** | **a confirmar** | CONFIRMAR |
| `img/thayana-cutout.webp`, `img/thayana-cutout-480.webp` | 692×820, 480×569 | as mesmas páginas (substituem o PNG para a página abrir mais depressa) | criadas a 9 de novembro de 2026 a partir de `img/thayana-cutout.png` (só conversão e redução de tamanho; o desenho não foi alterado) | **a mesma do original — origem desconhecida — confirmar** | **a confirmar** | CONFIRMAR |
| `img/mark-96.webp` | 96×96 | cabeçalho e rodapé de todas as páginas, balão do chat (substitui `img/mark.png`, que tem 151 KB, para mostrar 42 px) | criada a 9 de novembro de 2026 a partir de `img/mark.png` (só conversão e redução) | **a mesma do original — origem desconhecida — confirmar** | **a confirmar** | CONFIRMAR |
| `img/thayana-avatar.jpg` | 240×240 | avatar da barra superior da app | `ace5254`, 2026-07-21, autor «Claude»: «Adicionar carrossel na home e personagem da Thayana» | a mesma personagem — **origem desconhecida — confirmar** | **a confirmar** | CONFIRMAR |
| `img/thayana.jpg` | 800×800 | **não é usada em nenhuma página** | `ace5254`, 2026-07-21 | a mesma personagem — **origem desconhecida — confirmar** | **a confirmar** | NÃO USADA (pode apagar-se) |
| `img/avatares/av1.jpg` … `av8.jpg` | 240×240 cada | escolha de «personagem» ao criar conta ou editar o perfil (carregadas por JavaScript) | `a817845`, 2026-07-24, autor «Claude»: «Adicionar 8 avatares/personagens ilustrados para as clientes escolherem» | 8 ilustrações em estilo de desenho animado 3D (6 mulheres, 2 homens). **origem desconhecida — confirmar** | **a confirmar** | CONFIRMAR |

**O que se vê, e o que não se sabe.** O aspeto de todas as ilustrações (desenho animado 3D, rostos muito semelhantes entre si)
sugere que foram geradas por uma ferramenta de inteligência artificial. **É uma suposição visual, não um facto confirmado.**
O repositório não guarda o pedido feito à ferramenta, nem os termos de uso. Se vieram de uma ferramenta de IA:

- veja os termos dessa ferramenta sobre uso comercial das imagens (em geral permitem, com condições);
- em direito de autor europeu, o resultado de uma IA sem intervenção criativa humana pode não ter proteção: outra pessoa
  poderia copiá-las;
- pode haver semelhança com personagens ou estilos de terceiros: convém olhar com atenção;
- se algum dia as imagens passarem a representar pessoas reais de forma realista, o Regulamento (UE) 2024/1689 (art. 50.º)
  obriga a dizer que são geradas por IA. Para ilustrações evidentemente artísticas, a regra é mais leve.

Se a «personagem» da Thayana foi feita a partir de fotografias dela, deve existir o consentimento dela por escrito
(é direito de imagem e dado pessoal). Tratando-se da titular do estúdio, basta uma declaração simples e datada.

## 2. Tipos de letra (pasta `fonts/`)

| Letra | Licença | Origem |
|---|---|---|
| Cormorant Garamond (normal e itálico) | SIL Open Font License 1.1 (OFL) | Google Fonts; autores: The Cormorant Project Authors |
| Jost | SIL Open Font License 1.1 (OFL) | Google Fonts; autores: The Jost Project Authors |

Os ficheiros `.woff2` estão alojados no próprio site (já não se pede nada à Google ao abrir uma página).
O texto da licença e os direitos de autor estão em `fonts/LICENCAS.txt` (a confirmar na página de cada família em fonts.google.com).
A licença OFL permite o uso comercial e a redistribuição, desde que a licença acompanhe os ficheiros.

## 3. Código de terceiros

| Peça | Licença | Origem | Onde |
|---|---|---|---|
| Firebase JavaScript SDK 10.12.2 («compat»: app, auth, firestore) | Apache-2.0 | Google LLC; pacote npm `firebase@10.12.2`; **1 alteração** em `firebase-auth-compat.js` (não contactar a Google ao abrir a página em telemóvel/Safari; ver `vendor/firebase/LEIA-ME.txt`) | `vendor/firebase/10.12.2/` e `vendor/firebase/LICENSE-Apache-2.0.txt` |

O restante código (HTML, CSS e JavaScript) foi escrito para a Inova Beauty, a pedido do Wesley, com apoio do assistente de IA
Claude (Anthropic). Não há ficheiro de licença no repositório: por omissão, os direitos ficam reservados ao titular.

## 4. Ícones e símbolos

| Elemento | Origem | Nota |
|---|---|---|
| Ilustrações dos cartões de serviço (sobrancelha, olho, linha…) | desenhos SVG escritos no próprio código das páginas | sem ficheiros de terceiros |
| Símbolo do WhatsApp no botão flutuante | desenho SVG no código das páginas; **origem desconhecida — confirmar** | o símbolo é marca do WhatsApp (Meta). Usa-se só para indicar o contacto. Convém trocar pelo recurso oficial da página de marcas da Meta e não o alterar |
| Emojis (📱 💬 ✨ 🎁 …) | caracteres Unicode desenhados pelo sistema do visitante | não são ficheiros do site |

## 5. Marcas, nomes e textos de terceiros mencionados

| O quê | Onde | Observação |
|---|---|---|
| WhatsApp (Meta Platforms Ireland Ltd.) | ligações e botão de contacto | marca de terceiro; uso para indicar o canal de contacto |
| Google Maps | página «Localização», só quando se clica em «Mostrar o mapa» | serviço de terceiro; ver Política de Cookies |
| Google Firebase | contas e marcações | serviço de terceiro; ver Política de Privacidade |
| GitHub Pages | alojamento | serviço de terceiro; ver Política de Privacidade |
| «Padaria Mirassol» | página «Localização», como ponto de referência | nome comercial de terceiro, sem logótipo; convém garantir que o dono não se opõe, ou usar só o nome da rua |
| «Hidraglos», «Brow Lamination», «Lash Lifting», «Henna», «Lip Vitamin» | páginas de serviços e preçário | nomes de técnicas ou produtos. **Confirmar que nenhum é marca registada de um fabricante** (não foi possível verificar) |
| Textos das páginas «Serviços» e «Processos» | todo o site | escritos para este site; **não foi possível verificar** se há frases copiadas de outros sítios |

## 6. Lista do que falta confirmar (por ordem de importância)

1. **Quem criou o logótipo** e em que condições (contrato de cessão ou fatura de designer; ou ferramenta de IA e seus termos).
2. **Se o nome e o logótipo «Inova Beauty» podem ser usados**: fazer uma pesquisa de marcas no INPI e no EUIPO antes de investir mais.
3. **Origem das ilustrações** (personagem da Thayana e 8 avatares): guardar o pedido e os termos da ferramenta, se foram geradas por IA.
4. **Consentimento da Thayana** para o uso da sua imagem/personagem, por escrito e datado.
5. **Símbolo do WhatsApp**: usar o recurso oficial.
6. **«Padaria Mirassol»**: aceitar o uso do nome como referência ou retirá-lo.
7. **Nomes das técnicas** (Hidraglos e outros): confirmar que não são marca registada de terceiros.
8. Apagar `img/thayana.jpg` se não for precisa (não está em uso).
