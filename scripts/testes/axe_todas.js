const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const axeSrc = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const BASE = process.env.BASE || 'http://localhost:8260';
const OUT = process.argv[2] || 'axe_before.json';
const pages = require('child_process').execSync("cd " + require('path').resolve(__dirname, '..', '..') + " && find . -name index.html -not -path './tecnova/*' -not -path './node_modules/*' | sort").toString().trim().split('\n').map(f => f.replace('./', '/').replace('index.html', ''));
pages.push('/404.html');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const res = {};
  for (const vp of [{ n: 'desktop', w: 1280, h: 900 }, { n: 'mobile', w: 390, h: 844 }]) {
    const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, locale: 'pt-PT' });
    const p = await ctx.newPage();
    await p.route('**/*', r => { const u = r.request().url(); if (/gstatic|googleapis|googletagmanager|facebook|google\.com\/maps/.test(u)) return r.abort(); return r.continue(); });
    for (const pg of pages) {
      try {
        await p.goto(BASE + pg, { waitUntil: 'domcontentloaded' });
        await p.evaluate(() => localStorage.setItem('inova-idioma', 'pt'));
        await p.waitForTimeout(500);
        await p.evaluate(axeSrc);
        const r = await p.evaluate(async () => await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] }, resultTypes: ['violations', 'incomplete'] }));
        res[vp.n + ' ' + pg] = {
          violations: r.violations.map(v => ({ id: v.id, impact: v.impact, tags: v.tags.filter(t => /wcag|best/.test(t)).join(','), nodes: v.nodes.length, sample: v.nodes.slice(0, 3).map(n => ({ target: n.target.join(' '), html: n.html.slice(0, 160), why: (n.any[0] || n.all[0] || n.none[0] || {}).message })) })),
          incomplete: r.incomplete.map(v => ({ id: v.id, nodes: v.nodes.length }))
        };
      } catch (e) { res[vp.n + ' ' + pg] = { error: String(e).slice(0, 200) }; }
    }
    await ctx.close();
  }
  fs.writeFileSync(OUT, JSON.stringify(res, null, 1));
  await b.close(); console.log('feito', Object.keys(res).length);
})();
