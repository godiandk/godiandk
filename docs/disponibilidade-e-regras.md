# Disponibilidade e duração dos serviços

No painel (`/painel/` → **🗓️ Disponibilidade**) define-se:

- os **dias do mês em que atende** e as horas (passo a passo: tocar nos dias, escolher as horas, confirmar), com folgas, vários períodos por dia e escolha de dias seguidos;
- opcionalmente, um horário fixo semanal (secção "Avançado");
- **todos os serviços do preçário** (79, por categoria; 32 ligados por omissão): para cada um, a duração e se aparece ou não na marcação;
- a pausa entre clientes, a antecedência mínima e até quando se aceitam marcações.

Por omissão **nenhum dia está aberto**: as clientes só conseguem marcar nos dias que a administradora escolher.
Na Agenda do painel há ainda "➕ Nova marcação" (pedidos por WhatsApp/telefone) e "↔ Remarcar".

A configuração fica em `config/agenda`. Cada marcação ocupa registos de 15 min em `ocupados/{AAAA-MM-DD_HHMM}`, gravados
na mesma operação que a marcação — se duas clientes escolherem o mesmo horário, só uma consegue.

### Regras do Firestore a acrescentar

Dentro de `match /databases/{database}/documents { ... }`, junto às restantes coleções:

```
    // Disponibilidade da agenda (leitura pública, escrita só da administradora)
    match /config/{doc} {
      allow read: if true;
      allow write: if request.auth != null &&
        (exists(/databases/$(database)/documents/admins/$(request.auth.uid))
         || request.auth.token.email == 'wly.vianna@gmail.com');
    }

    // Horas ocupadas: qualquer cliente pode ocupar horas livres ao marcar;
    // só a administradora altera ou liberta.
    match /ocupados/{slot} {
      allow read: if true;
      allow create: if slot.matches('^[0-9]{4}-[0-9]{2}-[0-9]{2}_[0-9]{4}$')
                    && request.resource.data.keys().hasOnly(['dia', 'min', 'marc'])
                    && request.resource.data.dia is string
                    && request.resource.data.min is int
                    && request.resource.data.marc is string
                    && slot.split('_')[0] == request.resource.data.dia
                    && existsAfter(/databases/$(database)/documents/marcacoes/$(request.resource.data.marc));
      allow update, delete: if request.auth != null &&
        (exists(/databases/$(database)/documents/admins/$(request.auth.uid))
         || request.auth.token.email == 'wly.vianna@gmail.com');
    }
```

Sem estas regras o site não consegue ler os horários (mostra "Não foi possível carregar os horários" em vez de oferecer
horas erradas) e as alterações do painel não são guardadas.

## Catálogo de serviços

Os serviços vivem num único catálogo (`disponibilidade.js`, `GRUPOS`): nome guardado na marcação, nome mostrado,
duração por omissão e preço. É ele que alimenta o formulário do site e da app, a aba Disponibilidade, a Agenda e o
Faturamento. **Se o preçário mudar, atualizar também o catálogo** — há um teste que compara os dois linha a linha.

- Os nomes antigos (ex.: "Coloração de Sobrancelhas (Henna / Tintura / Descoloração)") continuam a funcionar para as
  marcações já feitas, mas já não aparecem no formulário.
- Estão **indisponíveis** (desligados na marcação e assinalados no preçário) tudo o que a Thayana tirou da lista de preços:
  laser, micropigmentação, Hidraglos, Teen, extensão de pestanas, despigmentação, Brow Vitamin, permanente de pestanas,
  descoloração de sobrancelhas e patilhas (homem). No catálogo, `off: true` desliga uma categoria e um 5.º valor `false`
  desliga um serviço. A administradora volta a ligá-los no painel (Disponibilidade → Serviços) quando os fizer;
  a página do preçário e as páginas de serviço são estáticas e passam a ter de ser atualizadas à mão.
- As durações por omissão são exatamente as que a Thayana guardou no painel (ex.: Brow Lamination e Alisamento 45 min,
  Henna 30 min, Lifting 1h): é ela que define quanto demora cada serviço. A lista de preços que ela devolveu serve só
  para os preços, nunca para os tempos.
- `CAT_V` (em `disponibilidade.js`) sobe quando o catálogo muda de forma que não chega a configurações já guardadas:
  v2 repõe o que está ligado/desligado; v5 desfaz uma alteração indevida do Lifting feita pelas versões 3 e 4.
  As durações que ela escolheu nunca são tocadas.
- Os produtos do preçário não são serviços marcáveis e ficam de fora.
