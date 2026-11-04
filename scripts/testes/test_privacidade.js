// Testes da revisão jurídica: minimização de dados, avisos nos formulários, idioma só gravado por escolha, apagar a conta
const { chromium } = require('playwright');
const BASE = 'http://localhost:8260';
let fails = 0;
const check = (c, m, x) => { if (!c) { fails++; console.log('FAIL ' + m, x === undefined ? '' : JSON.stringify(x)); } else console.log('ok   ' + m); };
const abort = r => (/gstatic|googleapis|googletagmanager|facebook|google\.com\/maps|\/vendor\/firebase\//.test(r.request().url()) ? r.abort() : r.continue());

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await b.newContext({ viewport: { width: 1100, height: 900 }, locale: 'pt-PT' });
  const p = await ctx.newPage(); await p.route('**/*', abort);
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const hosts = new Set();
  p.on('request', r => { try { const u = new URL(r.url()); if (u.host !== 'localhost:8260' && u.protocol.startsWith('http')) hosts.add(u.host); } catch (e) {} });

  // 1) primeira visita: nada gravado, nenhum pedido a terceiros
  await p.goto(BASE + '/', { waitUntil: 'load' }); await p.waitForTimeout(600);
  const st = await p.evaluate(() => ({ ls: Object.keys(localStorage), ss: Object.keys(sessionStorage), ck: document.cookie }));
  check(st.ls.length === 0 && st.ss.length === 0 && st.ck === '', 'primeira visita: sem localStorage, sessionStorage nem cookies', st);
  check([...hosts].filter(h => !/gstatic|googleapis/.test(h)).length === 0, 'primeira visita: nenhum pedido a servidores de terceiros', [...hosts]);

  // 2) o idioma só se grava quando a pessoa escolhe
  await p.click('#langAtual'); await p.click('.lang-btn[data-lang="en"]'); await p.waitForTimeout(300);
  check((await p.evaluate(() => localStorage.getItem('inova-idioma'))) === 'en', 'escolher idioma grava inova-idioma');
  await p.evaluate(() => localStorage.clear());

  // 3) conta: formulário de registo sem sexo, com aniversário opcional (dia/mês) e aviso do art. 13.º
  await p.goto(BASE + '/conta/?tab=signup', { waitUntil: 'load' }); await p.waitForTimeout(500);
  const f = await p.evaluate(() => ({
    gender: document.querySelectorAll('input[name="sGender"], input[name="setGender"]').length,
    bd: !!document.getElementById('sBirthDay'), bm: !!document.getElementById('sBirthMonth'),
    legalSignup: !!document.querySelector('#signupForm .form-legal'), legalLogin: !!document.querySelector('#loginForm .form-legal'),
    legalSet: !!document.querySelector('#profileArea .form-legal'),
    txt: document.body.innerText, req: document.getElementById('sBirthDay').required,
    legalText: (document.querySelector('#signupForm .form-legal') || {}).innerText || ''
  }));
  check(f.gender === 0, 'sem campo «Sexo» (registo e configurações)');
  check(f.bd && f.bm && !f.req, 'aniversário: dia e mês, não obrigatórios');
  check(f.legalSignup && f.legalLogin, 'avisos junto do registo e do início de sessão');
  check(f.legalSet, 'aviso junto das configurações da conta');
  check(!/SHA-256|criptografia|nunca são enviados para terceiros/i.test(f.txt), 'removida a frase falsa «SHA-256… só neste dispositivo»');
  check(/Inova Beauty/.test(f.legalText) && /RGPD/.test(f.legalText) && /Pol[ií]tica de Privacidade/.test(f.legalText), 'aviso do registo: responsável, RGPD e ligação à Política', f.legalText.slice(0, 120));
  check(/palavra-passe/i.test(f.txt) && !/\bsenha\b/i.test(f.txt), 'português de Portugal: «palavra-passe» e sem «senha»');

  // 4) registo sem aniversário; depois com aniversário (dia/mês)
  const r1 = await p.evaluate(async () => window.InovaAuth.register({ name: 'Ana Silva', phone: '912000001', email: 'ana@exemplo.pt', pass: 'abc123', pass2: 'abc123' }));
  check(r1.ok, 'registo sem sexo nem aniversário funciona', r1);
  let acc = await p.evaluate(() => window.InovaAuth.current());
  check(acc && acc.gender === undefined && (acc.birth === null || acc.birth === undefined), 'conta guardada sem sexo e sem aniversário', acc && { g: acc.gender, b: acc.birth });
  const bad = await p.evaluate(async () => window.InovaAuth.register({ name: 'Bia', phone: '912000002', email: 'bia@exemplo.pt', birth: '02-30', pass: 'abc123', pass2: 'abc123' }));
  check(!!bad.error, 'aniversário inválido (30 de fevereiro) é recusado', bad);
  await p.evaluate(() => window.InovaAuth.logout());
  const r2 = await p.evaluate(async () => window.InovaAuth.register({ name: 'Carla Dias', phone: '912000003', email: 'carla@exemplo.pt', birth: '1990-11-05', gender: 'F', pass: 'abc123', pass2: 'abc123' }));
  acc = await p.evaluate(() => window.InovaAuth.current());
  check(r2.ok && acc.birth === '11-05' && acc.gender === undefined, 'aniversário guarda-se só como dia e mês; o sexo é ignorado', acc && { b: acc.birth, g: acc.gender });
  check(await p.evaluate(() => window.InovaAuth.birthLabel('11-05') === '05/11' && window.InovaAuth.birthLabel('1990-11-05') === '05/11'), 'etiqueta do aniversário DD/MM (novo e antigo)');

  // 5) contas antigas são limpas (sexo apagado, ano removido) quando a sessão abre
  await p.evaluate(() => {
    const accs = JSON.parse(localStorage.getItem('inova_accounts_v2'));
    accs['912000003'].gender = 'F'; accs['912000003'].birth = '1990-11-05';
    localStorage.setItem('inova_accounts_v2', JSON.stringify(accs));
  });
  await p.goto(BASE + '/conta/', { waitUntil: 'load' }); await p.waitForTimeout(500);
  const slim = await p.evaluate(() => JSON.parse(localStorage.getItem('inova_accounts_v2'))['912000003']);
  check(slim.gender === undefined && slim.birth === '11-05', 'conta antiga: sexo apagado e ano de nascimento removido', { g: slim.gender, b: slim.birth });
  const info = await p.evaluate(() => document.getElementById('profileInfo').textContent);
  check(/Aniversário: 05\/11/.test(info) && !/NaN/.test(info), 'perfil mostra o aniversário DD/MM sem NaN', info);

  // 6) cupão de aniversário com «MM-DD»
  const cp = await p.evaluate(() => {
    const t = new Date(), pad = n => String(n).padStart(2, '0'), md = pad(t.getMonth() + 1) + '-' + pad(t.getDate());
    return { hoje: window.InovaCoupon.birthdayActive(md), antigo: window.InovaCoupon.birthdayActive('1990-' + md), outro: window.InovaCoupon.birthdayActive('01-01') === (t.getMonth() === 0 && t.getDate() <= 8), code: window.InovaCoupon.birthdayCoupon('912000003', md).code };
  });
  check(cp.hoje && cp.antigo && cp.outro && /^INOVA-A10-/.test(cp.code), 'cupão de aniversário aceita MM-DD e AAAA-MM-DD', cp);

  // 7) marcação não guarda o email
  await p.evaluate(async () => { await window.InovaAuth.saveBooking({ nome: 'Carla Dias', telefone: '912000003', servico: 'Threading', dia: '2030-01-10', hora: '10:00', slots: [] }); });
  const bk = await p.evaluate(() => JSON.parse(localStorage.getItem('inova_marcacoes'))[0]);
  check(bk && bk.email === undefined && bk.nome === 'Carla Dias', 'a marcação deixou de guardar o email', bk && Object.keys(bk));

  // 8) apagar a conta apaga também publicações, comentários e gostos
  await p.evaluate(async () => {
    const me = window.InovaAuth.current();
    localStorage.setItem('inova_posts_local', JSON.stringify([
      { id: 'p1', autorUid: me.phone, autorNome: 'Carla', foto: 'x', likes: [], comentarios: [] },
      { id: 'p2', autorUid: '999', autorNome: 'Outra', foto: 'y', likes: [me.phone, '5'], comentarios: [{ id: 'c1', autorUid: me.phone, texto: 'olá' }, { id: 'c2', autorUid: '999', texto: 'oi' }] }
    ]));
  });
  const del = await p.evaluate(async () => window.InovaAuth.removeCurrent());
  const posts = await p.evaluate(() => JSON.parse(localStorage.getItem('inova_posts_local')));
  const accs = await p.evaluate(() => JSON.parse(localStorage.getItem('inova_accounts_v2')));
  check(del.ok && !accs['912000003'], 'apagar conta remove a conta');
  check(posts.length === 1 && posts[0].id === 'p2' && posts[0].likes.join() === '5' && posts[0].comentarios.length === 1 && posts[0].comentarios[0].id === 'c2', 'apagar conta remove as publicações, os comentários e os gostos da pessoa', posts);

  // 9) avisos junto dos formulários da marcação e da app
  for (const [u, sels] of [['/agendar/', ['#bookForm .form-legal']], ['/app/home/', ['#bookForm .form-legal', '#loginForm .form-legal', '#signupForm .form-legal', '#settingsCard .form-legal', '#feedArea .form-legal']]]) {
    await p.goto(BASE + u, { waitUntil: 'load' }); await p.waitForTimeout(500);
    for (const s of sels) check(!!(await p.$(s)), `${u}: aviso ${s}`);
    const t = await p.evaluate(() => document.body.innerText);
    check(!/\bsenha\b|\bcupom\b|SHA-256/i.test(t.replace(/desenha/gi, '')), `${u}: sem «senha», «cupom» nem «SHA-256»`);
  }
  await p.goto(BASE + '/agendar/', { waitUntil: 'load' }); await p.waitForTimeout(400);
  const bkLegal = await p.evaluate(() => document.querySelector('#bookForm .form-legal').innerText);
  check(/n[aã]o escreva dados de sa[uú]de/i.test(bkLegal) && /14 dias/.test(bkLegal) && /Pre[cç][aá]rio/.test(bkLegal), 'aviso da marcação: dados de saúde, 14 dias e preçário', bkLegal.slice(0, 160));

  // 10) chat
  await p.goto(BASE + '/', { waitUntil: 'load' }); await p.waitForTimeout(400);
  await p.click('.chat-fab'); await p.waitForTimeout(300);
  check(/não é guardado nem enviado/.test(await p.evaluate(() => document.querySelector('.chat-note').innerText)), 'chat: aviso de que o texto não é guardado nem enviado');

  check(errs.length === 0, 'sem erros de JS', errs);
  await b.close();
  console.log(fails ? `\n${fails} FALHAS` : '\nTODOS OK');
})();
