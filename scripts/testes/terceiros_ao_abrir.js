// Que páginas contactam servidores que não são os nossos, ao carregar (sem clicar em nada)?
// Corre em computador, Android e iPhone: em telemóvel e no Safari o SDK do Firebase chegou a pedir
// apis.google.com/js/api.js logo ao abrir qualquer página (corrigido em vendor/firebase/LEIA-ME.txt).
// Resultado esperado: nenhum pedido a terceiros, exceto firestore.googleapis.com em /agendar/ e /app/home/ (ler a agenda é a função dessas páginas).
// Termina com código 1 se houver algum pedido inesperado.
const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path');
const BASE = process.env.BASE || 'http://localhost:8260';
const HOST_LOCAL = new URL(BASE).host;
const ROOT = require('path').resolve(__dirname, '..', '..');
const ESPERADOS = { '/agendar/': ['firestore.googleapis.com'], '/app/home/': ['firestore.googleapis.com'] };
const PERFIS = {
  'computador': { viewport: { width: 1280, height: 900 } },
  'android (Pixel 5)': devices['Pixel 5'],
  'iphone (iPhone 13)': devices['iPhone 13']
};
function pages(dir, acc) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    if (f.name.startsWith('.') || ['node_modules', 'vendor', 'scripts', 'docs', 'fonts', 'img', 'idiomas'].includes(f.name)) continue;
    const p = path.join(dir, f.name);
    if (f.isDirectory()) pages(p, acc);
    else if (f.name === 'index.html') acc.push('/' + path.relative(ROOT, dir).replace(/\\/g, '/') + (dir === ROOT ? '' : '/'));
  }
  return acc;
}
(async () => {
  const list = pages(ROOT, []).filter(u => !u.startsWith('/tecnova')).sort();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  let inesperados = 0;
  for (const [perfil, opc] of Object.entries(PERFIS)) {
    const out = {};
    for (const u of list) {
      const ctx = await b.newContext({ ...opc, locale: 'pt-PT' });
      const p = await ctx.newPage();
      const hosts = {};
      p.on('request', r => { try { const x = new URL(r.url()); if (x.host !== HOST_LOCAL && x.protocol.startsWith('http')) hosts[x.host] = (hosts[x.host] || 0) + 1; } catch (e) {} });
      try { await p.goto(BASE + u, { waitUntil: 'load', timeout: 20000 }); await p.waitForTimeout(2500); } catch (e) { hosts['ERRO'] = e.message.slice(0, 60); }
      const st = await p.evaluate(() => ({ ls: Object.keys(localStorage), cookie: document.cookie })).catch(() => ({}));
      out[u] = { hosts, ls: st.ls, cookie: st.cookie };
      await ctx.close();
    }
    const com = Object.entries(out).filter(([, v]) => Object.keys(v.hosts).length);
    console.log(`\n== ${perfil} == Páginas: ${list.length} | com pedidos a terceiros: ${com.length}`);
    for (const [u, v] of Object.entries(out)) {
      const esperados = ESPERADOS[u] || [];
      const fora = Object.keys(v.hosts).filter(h => !esperados.includes(h));
      if (fora.length || v.cookie) { inesperados++; console.log('FAIL', u.padEnd(42), 'inesperado:', fora.join(', '), v.cookie ? 'COOKIE:' + v.cookie : ''); }
      else if (Object.keys(v.hosts).length) console.log('ok  ', u.padEnd(42), JSON.stringify(v.hosts), '(esperado: ler a agenda)');
    }
    if (!com.length) console.log('ok   nenhuma página contacta terceiros ao abrir');
  }
  await b.close();
  console.log('\n' + (inesperados ? `FALHAS: ${inesperados}` : 'Sem pedidos inesperados a terceiros ao abrir (computador, Android e iPhone).'));
  process.exit(inesperados ? 1 : 0);
})();
