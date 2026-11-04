// Que páginas contactam servidores que não são os nossos, ao carregar (sem clicar em nada)?
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const BASE = 'http://localhost:8260';
const ROOT = require('path').resolve(__dirname, '..', '..');
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
  const list = pages(ROOT, []).sort();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const out = {};
  for (const u of list) {
    if (u.startsWith('/tecnova')) continue;
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, locale: 'pt-PT' });
    const p = await ctx.newPage();
    const hosts = {};
    p.on('request', r => { try { const x = new URL(r.url()); if (x.host !== 'localhost:8260' && x.protocol.startsWith('http')) hosts[x.host] = (hosts[x.host] || 0) + 1; } catch (e) {} });
    try { await p.goto(BASE + u, { waitUntil: 'load', timeout: 20000 }); await p.waitForTimeout(2500); } catch (e) { hosts['ERRO'] = e.message.slice(0, 60); }
    const st = await p.evaluate(() => ({ ls: Object.keys(localStorage), cookie: document.cookie })).catch(() => ({}));
    out[u] = { hosts, ls: st.ls, cookie: st.cookie };
    await ctx.close();
  }
  await b.close();
  const com = Object.entries(out).filter(([, v]) => Object.keys(v.hosts).length);
  console.log('Páginas:', list.length, '| com pedidos a terceiros:', com.length);
  for (const [u, v] of Object.entries(out)) console.log(u.padEnd(46), JSON.stringify(v.hosts), JSON.stringify(v.ls), v.cookie ? 'COOKIE:' + v.cookie : '');
})();
