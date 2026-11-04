// axe (contraste + todas as regras A/AA) em ESTADOS que a carga normal da página não mostra
const { chromium } = require('playwright');
const fs = require('fs');
const axeSrc = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const BASE = 'http://localhost:8260';
const ST = [
  { n: 'menu aberto (telemóvel)', url: '/', vp: [390, 844], act: async p => { await p.click('.nav-toggle'); await p.waitForTimeout(400); } },
  { n: 'menu Serviços aberto (telemóvel)', url: '/', vp: [390, 844], act: async p => { await p.click('.nav-toggle'); await p.waitForTimeout(300); await p.click('.has-dropdown > a.nav-link'); await p.waitForTimeout(400); } },
  { n: 'chat aberto com respostas', url: '/', vp: [1280, 900], act: async p => { await p.click('.chat-fab'); await p.waitForTimeout(300); for (const q of await p.$$('.chat-quick button')) { await q.click(); await p.waitForTimeout(700); } } },
  { n: 'chat aberto (telemóvel)', url: '/', vp: [390, 844], act: async p => { await p.click('.chat-fab'); await p.waitForTimeout(400); } },
  { n: 'seletor de idioma aberto', url: '/', vp: [1280, 900], act: async p => { await p.click('#langAtual'); await p.waitForTimeout(300); } },
  { n: 'ligação «Saltar» com foco', url: '/', vp: [1280, 900], act: async p => { await p.keyboard.press('Tab'); await p.waitForTimeout(200); } },
  { n: 'marcação com erro de validação', url: '/agendar/', vp: [1280, 900], act: async p => { await p.click('#bookForm button[type=submit]'); await p.waitForTimeout(400); } },
  { n: 'registo com erro', url: '/conta/', vp: [1280, 900], act: async p => { await p.click('#showSignupBtn'); await p.click('#signupForm button[type=submit]'); await p.waitForTimeout(400); } },
  { n: 'início de sessão com erro', url: '/conta/', vp: [1280, 900], act: async p => { await p.fill('#lEmail', 'x@y.pt'); await p.fill('#lPass', 'abc'); await p.click('#loginForm button[type=submit]'); await p.waitForTimeout(600); } },
  { n: 'mapa: aviso de consentimento', url: '/localizacao/', vp: [1280, 900], act: async p => { await p.waitForTimeout(200); } },
  { n: 'app: ecrã Marcar', url: '/app/home/', vp: [390, 844], act: async p => { await p.click('[data-tab="marcar"]'); await p.waitForTimeout(400); } },
  { n: 'app: ecrã Conta (registo)', url: '/app/home/', vp: [390, 844], act: async p => { await p.click('[data-tab="conta"]'); await p.click('#showSignupBtn'); await p.waitForTimeout(400); } },
  { n: 'app: ecrã Feed', url: '/app/home/', vp: [390, 844], act: async p => { await p.click('[data-tab="comunidade"]'); await p.waitForTimeout(400); } },
  { n: 'painel: entrada de administrador', url: '/painel/', vp: [1280, 900], act: async p => { await p.waitForTimeout(300); } },
  { n: 'cookies (tabelas)', url: '/cookies/', vp: [390, 844], act: async p => { await p.waitForTimeout(200); } },
];
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  let bad = 0;
  for (const s of ST) {
    const c = await b.newContext({ viewport: { width: s.vp[0], height: s.vp[1] }, locale: 'pt-PT' });
    const p = await c.newPage();
    await p.route('**/*', r => (/gstatic|googleapis|vendor\/firebase/.test(r.request().url()) ? r.abort() : r.continue()));
    await p.goto(BASE + s.url, { waitUntil: 'load' }); await p.waitForTimeout(500);
    try { await s.act(p); } catch (e) { console.log('AVISO ação:', s.n, String(e).slice(0, 80)); }
    await p.evaluate(axeSrc);
    const r = await p.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } })).violations.map(v => ({ id: v.id, n: v.nodes.length, ex: v.nodes[0].target.join(' ').slice(0, 70), why: ((v.nodes[0].any[0] || v.nodes[0].all[0] || {}).message || '').slice(0, 110) })));
    console.log((r.length ? 'FALHA ' : 'ok    ') + s.n + (r.length ? ' ' + JSON.stringify(r) : ''));
    bad += r.length; await c.close();
  }
  await b.close(); console.log(bad ? '\nCOM FALHAS: ' + bad : '\nTODOS OK');
})();
