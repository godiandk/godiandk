# Testes da revisão jurídica e de acessibilidade

Precisam de Node.js, do Playwright (com Chromium) e do `axe-core`. Na raiz do repositório:

```bash
python3 -m http.server 8260 &                      # o site em http://localhost:8260
export NODE_PATH="$(npm root -g):/caminho/para/node_modules"     # onde estão playwright e axe-core
node scripts/testes/test_privacidade.js            # minimização, avisos nos formulários, apagar conta, nada gravado à primeira visita
node scripts/testes/test_paginas.js                # 41 páginas: lang, main, h1, rodapé legal, «saltar», foco, sem ODR, sem terceiros
node scripts/testes/axe_paginas.js / /agendar/     # axe numa ou mais páginas (desktop e telemóvel)
node scripts/testes/axe_todas.js axe.json          # axe em todas as páginas
node scripts/testes/axe_estados.js                 # axe com menus abertos, chat, mensagens de erro, ecrãs da app
node scripts/testes/terceiros_ao_abrir.js          # que páginas contactam terceiros ao abrir — em computador, Android e iPhone (falha se houver pedidos inesperados)
python3 scripts/seo/aplicar_seo.py --verificar     # SEO: títulos, descrições, canonical, sitemap e dados estruturados em dia (não precisa de servidor)
```

Os testes que usam contas correm em «modo local» (sem rede): bloqueiam o SDK do Firebase.
Páginas legais: `python3 scripts/legal/build_all.py` gera-as; confirmar depois com `test_paginas.js`.

O SEO está documentado em `docs/SEO-E-CLIENTES.md`; os valores editáveis estão em `scripts/seo/site.json`.
