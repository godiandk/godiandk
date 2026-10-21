# Serviços escondidos (ainda não disponíveis)

A Thayana ainda não faz estes serviços. **Estão escondidos do site público** (preçário, cartões, menus, página inicial,
sitemap), mas **nada foi apagado**: continuam no catálogo de marcações (`disponibilidade.js`, desligados) e no painel
(Disponibilidade → Serviços), e as páginas de serviço existem com `noindex`.

Quando ela começar a fazer algum, é só dizer **"vamos voltar a incluir X"** e o serviço é religado.

## Como voltar a incluir um serviço

1. **Marcação online:** painel → Disponibilidade → Serviços → ligar o serviço (ou, no catálogo, tirar `off: true` do grupo /
   o `false` do serviço). Se mexer no catálogo, subir `CAT_V`.
2. **Preçário e páginas:** repor as linhas no `precario/index.html`, nos cartões e nos menus. A última versão com tudo
   visível (com o aviso "Temporariamente indisponível") é a do commit `e0aa7e0`:
   `git show e0aa7e0:precario/index.html`, `git show e0aa7e0:servicos/index.html`, etc.
3. Tirar o `noindex` da página do serviço e voltar a pô-la no `sitemap.xml`.
4. Atualizar o texto de apresentação (rodapé, página inicial, FAQ) se o serviço for um dos principais.

Os **tempos** são os que a Thayana guardou no painel; os **preços** são os últimos que estavam no preçário
(antes de ela devolver a lista nova, que só tinha os serviços que já faz).

## Lista completa (57 itens)

### THREADING — HOMEM

| Serviço | Preço | Tempo (painel) | Nota |
|---|---|---|---|
| Patilhas | 9,50€ | 15 min |  |

### TEEN (ATÉ 18 ANOS)

| Serviço | Preço | Tempo (painel) | Nota |
|---|---|---|---|
| Teen Brows | 10,50€ | 30 min |  |
| Teen Brows + Buço | 18,50€ | 30 min |  |

### COLORAÇÃO DE SOBRANCELHAS

| Serviço | Preço | Tempo (painel) | Nota |
|---|---|---|---|
| Descoloração de Sobrancelhas | 27,50€ | 45 min | já inclui a tintura para fechar a cutícula do pelo |

### PESTANAS

| Serviço | Preço | Tempo (painel) | Nota |
|---|---|---|---|
| Permanente de Pestanas | 31,00€ | 1h |  |
| Permanente + Tintura de Pestanas | 49,50€ | 1h30 |  |

### EXTENSÃO DE PESTANAS

| Serviço | Preço | Tempo (painel) | Nota |
|---|---|---|---|
| Pestanas Express | 40,00€ | 1h |  |
| 1ª Aplicação | 65,00€ | 1h45 |  |
| Manutenção até 4 semanas | 45,00€ | 1h |  |
| Manutenção até 6 semanas | 55,00€ | 1h15 |  |
| Remoção de Pestanas | 16,00€ | 30 min |  |
| Remoção (não aplicadas na clínica) | 30,00€ | 45 min |  |

### MICROPIGMENTAÇÃO — SOBRANCELHAS

| Serviço | Preço | Tempo (painel) | Nota |
|---|---|---|---|
| Consulta de Avaliação | 35,00€ | 30 min | deduz no valor total do procedimento |
| Sobrancelhas | 225,00€ | 2h |  |
| Retoque até 60 dias | 75,00€ | 1h30 |  |
| Retoque até 1 ano | 179,00€ | 2h |  |

### HIDRAGLOS — LÁBIOS

| Serviço | Preço | Tempo (painel) | Nota |
|---|---|---|---|
| Hidraglos com Cor | sob consulta | 45 min | confirmar valor |
| Hidraglos sem Cor | 65,00€ | 45 min | antigo Lip Vitamin |

### DESPIGMENTAÇÃO

| Serviço | Preço | Tempo (painel) | Nota |
|---|---|---|---|
| Despigmentação de Sobrancelhas — 1ª Sessão | 75,00€ | 1h |  |
| Sessão de Manutenção | 65,00€ | 1h |  |

### TRATAMENTOS (BROW VITAMIN)

| Serviço | Preço | Tempo (painel) | Nota |
|---|---|---|---|
| Brow Vitamin | 75,00€ | 45 min |  |
| Pack 4 sessões Brow Vitamin | 280,00€ | 45 min |  |

### PRODUTOS (VENDEM-SE, NÃO SE MARCAM)

| Serviço | Preço | Tempo (painel) | Nota |
|---|---|---|---|
| Lápis de Sobrancelhas | 11,00€ | — |  |
| Lápis Lift & Draw | 16,50€ | — |  |
| Caneta de Sobrancelhas | 12,50€ | — |  |
| Máscara de Sobrancelhas | 22,50€ | — |  |
| Fixante | 14,50€ | — |  |
| Fortificante de Sobrancelhas | 25,00€ | — |  |
| Fortificante de Pestanas | 25,00€ | — |  |
| Afia | 4,00€ | — |  |
| Escova Spoolie | 5,50€ | — |  |
| Saco Inova Beauty | 0,70€ | — |  |
| Lápis Lift & Draw + Afia | 19,00€ | — |  |

### DEPILAÇÃO A LASER

| Serviço | Preço | Tempo (painel) | Nota |
|---|---|---|---|
| Buço | 8,00€ | 15 min |  |
| Axilas | 15,00€ | 15 min |  |
| Virilha Normal | 20,00€ | 30 min |  |
| Virilha + Perianal | 30,00€ | 30 min |  |
| Meia Perna | 25,00€ | 30 min |  |
| Perna Completa | 30,00€ | 45 min |  |
| Patilhas | 8,00€ | 15 min |  |
| Antebraços | 15,00€ | 30 min |  |
| Braços | 20,00€ | 30 min |  |
| Glúteos | 20,00€ | 30 min |  |
| Queixo | 15,00€ | 15 min |  |
| Nariz | 8,00€ | 15 min |  |
| Orelhas | 8,00€ | 15 min |  |
| Entre Sobrancelhas | 7,00€ | 15 min |  |
| Maçãs do Rosto | 8,00€ | 15 min |  |
| Lombar | 10,00€ | 15 min |  |
| Costas Completas | 35,00€ | 1h |  |
| Pés | 10,00€ | 30 min |  |
| Mãos | 10,00€ | 30 min |  |
| Abdómen | 35,00€ | 45 min |  |
| Axilas + Virilha | 25,00€ | 45 min |  |
| Buço + Queixo | 15,00€ | 30 min |  |
| Rosto Completo | 25,00€ | 45 min |  |
| Pernas + Axilas + Virilha | 35,00€ | 1h |  |
