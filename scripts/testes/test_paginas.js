// Estrutura legal e de acessibilidade de TODAS as páginas: idioma, «saltar para o conteúdo», rodapé com identificação,
// Livro de Reclamações, ausência de ODR, imagens com alt, nada de terceiros nos <head>, foco visível
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const BASE = 'http://localhost:8260', ROOT = require('path').resolve(__dirname, '..', '..');
let fails = 0;
const check = (c, m, x) => { if (!c) { fails++; console.log('FAIL ' + m, x === undefined ? '' : JSON.stringify(x)); } };
const SKIP = ['node_modules', 'vendor', 'scripts', 'docs', 'fonts', 'img', 'idiomas', 'tecnova'];
function pages(dir, acc) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    if (f.name.startsWith('.') || SKIP.includes(f.name)) continue;
    const p = path.join(dir, f.name);
    if (f.isDirectory()) pages(p, acc);
    else if (f.name === 'index.html') acc.push(path.relative(ROOT, dir).split(path.sep).join('/'));
  }
  return acc;
}
(async () => {
  const list = pages(ROOT, []).sort().map(p => (p ? '/' + p + '/' : '/')); list.push('/404.html');
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await b.newContext({ viewport: { width: 1200, height: 900 }, locale: 'pt-PT' });
  let n = 0;
  for (const u of list) {
    const file = path.join(ROOT, u === '/404.html' ? '404.html' : u + 'index.html');
    const html = fs.readFileSync(file, 'utf8');
    // --- análise do código-fonte ---
    check(!/ec\.europa\.eu\/consumers\/odr|webgate\.ec\.europa\.eu\/odr/i.test(html), `${u}: sem ligação à plataforma ODR (encerrada)`);
    check(!/fonts\.googleapis\.com|fonts\.gstatic\.com|www\.gstatic\.com|googletagmanager\.com\/gtag|connect\.facebook\.net/i.test(html), `${u}: sem recursos de terceiros no código da página`);
    check(/<html[^>]*\slang="[a-zA-Z-]+"/.test(html), `${u}: <html lang>`);
    const imgs = html.match(/<img\b[^>]*>/gi) || [];
    check(imgs.every(t => /\salt=/.test(t)), `${u}: todas as <img> têm alt`, imgs.filter(t => !/\salt=/.test(t)).slice(0, 2));
    // --- no navegador ---
    const p = await ctx.newPage();
    await p.route('**/*', r => (/gstatic|googleapis|vendor\/firebase/.test(r.request().url()) ? r.abort() : r.continue()));
    await p.goto(BASE + u, { waitUntil: 'load' }); await p.waitForTimeout(250);
    const r = await p.evaluate(() => {
      const txt = (document.querySelector('.footer-legal, .app-legal, footer') || {}).innerText || '';
      const links = [...document.querySelectorAll('footer a, .app-legal a')].map(a => a.getAttribute('href') || '');
      const vis = e => !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
      const h1 = [...document.querySelectorAll('h1')].filter(vis).length;
      const main = document.querySelector('main#conteudo') || document.querySelector('main.app-screen.active');
      return { txt, links, h1, main: !!main, lang: document.documentElement.lang, hasPrest: /Prestador de servi[cç]os/.test(txt), nif: /NIF/.test(txt), morada: /Morada/.test(txt), mail: /Email/.test(txt), tel: /Telem[oó]vel/.test(txt), pre: document.querySelectorAll('.footer-legal .a-preencher, .app-legal .a-preencher, footer .a-preencher').length };
    });
    check(!!r.lang, `${u}: lang`, r.lang);
    check(r.main, `${u}: <main> (marco principal)`);
    check(r.h1 === 1 || (u === '/app/home/' && r.h1 === 1), `${u}: um só <h1> visível`, r.h1);
    check(r.hasPrest && r.nif && r.morada && r.mail && r.tel, `${u}: rodapé com prestador, NIF, morada, email e telemóvel`, { p: r.hasPrest, n: r.nif, m: r.morada, e: r.mail, t: r.tel });
    check(r.pre >= 4, `${u}: campos «A PREENCHER» visíveis no rodapé (4: nome, NIF, morada, email)`, r.pre);
    for (const need of ['privacidade/', 'termos/', 'cookies/', 'cancelamento/', 'livroreclamacoes.pt']) check(r.links.some(h => h.includes(need)), `${u}: rodapé liga a ${need}`);
    // «saltar para o conteúdo»: 1.º elemento focável
    if (u !== '/404.html') {
      await p.keyboard.press('Tab');
      const sk = await p.evaluate(() => { const a = document.activeElement; const cs = a ? getComputedStyle(a) : null; const rc = a ? a.getBoundingClientRect() : null; return { cls: a && a.className, txt: a && a.textContent.trim(), onscreen: rc && rc.top >= -1 && rc.left >= -1 && rc.width > 0, outline: cs && cs.outlineStyle, ow: cs && cs.outlineWidth, sh: cs && cs.boxShadow }; });
      check(/skip-link/.test(sk.cls || '') && /Saltar para o conte/.test(sk.txt || ''), `${u}: 1.º Tab = «Saltar para o conteúdo»`, sk);
      check(sk.onscreen, `${u}: a ligação «Saltar…» aparece no ecrã quando tem foco`, sk);
      // foco visível nos 8 elementos seguintes
      for (let i = 0; i < 8; i++) {
        await p.keyboard.press('Tab');
        const f = await p.evaluate(() => { const a = document.activeElement; if (!a || a === document.body) return null; const cs = getComputedStyle(a); return { tag: a.tagName + '.' + (a.className || '').toString().split(' ')[0], os: cs.outlineStyle, ow: parseFloat(cs.outlineWidth), sh: cs.boxShadow, bg: cs.backgroundColor }; });
        if (f) check((f.os !== 'none' && f.ow > 0) || (f.sh && f.sh !== 'none'), `${u}: foco visível em ${f.tag}`, f);
      }
    }
    await p.close(); n++;
  }
  await b.close();
  console.log(fails ? `\n${fails} FALHAS em ${n} páginas` : `\nTODOS OK (${n} páginas)`);
})();
