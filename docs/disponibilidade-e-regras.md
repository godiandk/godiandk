# Disponibilidade e duração dos serviços

No painel (`/painel/` → **🗓️ Disponibilidade**) define-se:

- o horário semanal (vários intervalos por dia), dias bloqueados, horários especiais e períodos de férias;
- a duração de cada serviço, a pausa entre clientes, a antecedência mínima e até quando se aceitam marcações.

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

Sem estas regras o site continua a funcionar (usa o horário habitual 09h–19h, segunda a sábado), mas as alterações do
painel não são guardadas e não há proteção contra marcações no mesmo horário.
