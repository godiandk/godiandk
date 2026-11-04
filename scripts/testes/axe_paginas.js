const { chromium } = require('playwright');
const fs = require('fs');
const axeSrc = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
(async () => {
  const urls = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const u of urls) for (const [w, h] of [[1280, 900], [390, 844]]) {
    const c = await b.newContext({ viewport: { width: w, height: h }, locale: 'pt-PT' });
    const p = await c.newPage();
    await p.route('**/*', r => (/gstatic|googleapis|vendor\/firebase/.test(r.request().url()) ? r.abort() : r.continue()));
    await p.goto('http://localhost:8260' + u, { waitUntil: 'load' }); await p.waitForTimeout(500);
    await p.evaluate(axeSrc);
    const r = await p.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } })).violations.map(v => v.id + ' x' + v.nodes.length + ' ' + v.nodes[0].target.join(' ').slice(0, 50)));
    console.log(u, w, r.length ? r.join(' | ') : 'sem violações');
    await c.close();
  }
  await b.close();
})();
