/* ============================================================
   INOVA BEAUTY — Disponibilidade e duração dos serviços
   ------------------------------------------------------------
   Lógica partilhada pelo painel (onde a Thayana define os dias,
   horários e durações) e pelas páginas de marcação (onde a cliente
   escolhe só entre horários realmente livres).

   Configuração (guardada em config/agenda):
     semana  : { 0..6 : { aberto, janelas:[{de,ate}] } }   0 = domingo
     dias    : { "AAAA-MM-DD" : { aberto:false }            dia bloqueado
                              | { aberto:true, janelas } }   horário especial
     duracoes: { "Nome do serviço": minutos }
     passo, buffer, antecedenciaH, horizonte
   Ocupação (coleção ocupados): um registo por cada 15 min tomados.
   ============================================================ */
window.InovaAgenda = (function () {
  "use strict";

  var U = 15;   // unidade de ocupação (minutos)

  /* ============================================================
     CATÁLOGO DE SERVIÇOS — todos os serviços do preçário.
       v = nome guardado na marcação (único)      l = nome mostrado na lista
       d = duração por omissão, em minutos        p = preço do preçário:
           {b: valor} fixo · {f: valor} "a partir de" · {c: 1} sob consulta
     Grupos com `off: true` (ou um serviço com o 5.º valor `false`) estão
     "indisponíveis" no preçário e não aparecem na marcação — a administradora
     pode ligá-los no painel quando voltar a fazê-los.
     As durações por omissão seguem o que a Thayana guardou no painel (é ela que sabe quanto demora).
     CAT_V sobe quando o catálogo muda de forma que não chega a configurações já guardadas
     (ver `normalize`): v2 repõe o que está ligado/desligado, v3 acerta o Lifting.
     ============================================================ */
  function b_(n) { return { b: n }; }
  var CONS = { c: 1 };
  var CAT_V = 3;
  var GRUPOS = [
    { id: "thr", nome: "Threading — Depilação com Linha", itens: [
      ["Threading de Sobrancelhas", "Sobrancelhas", 30, b_(10)],
      ["Threading — Buço", "Buço", 15, b_(5)],
      ["Threading — Queixo", "Queixo", 15, b_(6)],
      ["Threading — Meio das Sobrancelhas", "Meio das Sobrancelhas", 15, b_(6)],
      ["Threading — Maçãs do Rosto", "Maçãs do Rosto", 15, b_(5.5)],
      ["Threading — Face", "Face", 30, b_(12)],
      ["Threading — Testa", "Testa", 15, b_(7.5)],
      ["Threading — Pescoço", "Pescoço", 30, b_(10.5)],
      ["Threading — Nariz", "Nariz", 15, b_(4)],
      ["Threading — Orelhas", "Orelhas", 15, b_(6.5)],
      ["Threading — Mãos", "Mãos", 30, b_(9)],
      ["Threading — Dedos", "Dedos", 15, b_(5)],
      ["Threading — Sobrancelhas + Buço", "Sobrancelhas + Buço", 30, b_(15)],
      ["Threading — Rosto Completo", "Rosto Completo", 60, b_(30)]
    ] },
    { id: "hom", nome: "Threading — Homem", itens: [
      ["Threading Homem — Sobrancelhas", "Sobrancelhas", 30, b_(10)],
      ["Threading Homem — Maçãs do Rosto / Contorno da Barba", "Maçãs do Rosto / Contorno da Barba", 15, b_(7.5)],
      ["Threading Homem — Patilhas", "Patilhas", 15, b_(9.5), false]
    ] },
    { id: "teen", nome: "Teen (até 18 anos)", off: true, itens: [
      ["Teen Brows", "Teen Brows", 30, b_(10.5)],
      ["Teen Brows + Buço", "Teen Brows + Buço", 30, b_(18.5)]
    ] },
    { id: "col", nome: "Coloração de Sobrancelhas", itens: [
      ["Coloração — Henna", "Henna", 30, b_(10)],
      ["Coloração — Tintura de Sobrancelhas", "Tintura", 30, b_(15)],
      ["Coloração — Descoloração de Sobrancelhas", "Descoloração de Sobrancelhas", 45, b_(27.5), false],
      ["Coloração — Henna + Threading", "Henna + Threading", 60, b_(15)],
      ["Coloração — Tintura + Threading", "Tintura + Threading", 30, b_(20)]
    ] },
    { id: "brow", nome: "Sobrancelhas — Tratamentos", itens: [
      ["Brow Lamination", "Brow Lamination", 45, b_(20)],
      ["Alisamento de Sobrancelhas", "Alisamento de Sobrancelhas", 45, b_(20)],
      ["Brow Care", "Brow Care", 15, b_(8.5)],
      ["Brow Lamination + Threading", "Brow Lamination + Threading", 60, b_(25)],
      ["Brow Lamination + Tintura", "Brow Lamination + Tintura", 60, b_(30)],
      ["Alisamento + Threading", "Alisamento + Threading", 60, b_(25)],
      ["Alisamento + Tintura", "Alisamento + Tintura", 60, b_(30)]
    ] },
    { id: "pest", nome: "Pestanas", itens: [
      ["Lifting de Pestanas", "Lifting de Pestanas", 90, b_(25)],
      ["Permanente de Pestanas", "Permanente de Pestanas", 60, b_(31), false],
      ["Tintura de Pestanas", "Tintura de Pestanas", 30, b_(15)],
      ["Lash Care", "Lash Care", 15, b_(8.5)],
      ["Lifting + Tintura de Pestanas", "Lifting + Tintura de Pestanas", 120, b_(30)],
      ["Permanente + Tintura de Pestanas", "Permanente + Tintura de Pestanas", 90, b_(49.5), false]
    ] },
    { id: "micro", nome: "Micropigmentação — Sobrancelhas", off: true, itens: [
      ["Micropigmentação — Consulta de Avaliação", "Consulta de Avaliação", 30, b_(35)],
      ["Micropigmentação de Sobrancelhas", "Sobrancelhas", 120, b_(225)],
      ["Micropigmentação — Retoque até 60 dias", "Retoque até 60 dias", 90, b_(75)],
      ["Micropigmentação — Retoque até 1 ano", "Retoque até 1 ano", 120, b_(179)]
    ] },
    { id: "hidra", nome: "Hidraglos — Lábios", off: true, itens: [
      ["Hidraglos com Cor", "Hidraglos com Cor", 45, CONS],
      ["Hidraglos sem Cor", "Hidraglos sem Cor", 45, b_(65)]
    ] },
    { id: "laser", nome: "Depilação a Laser", off: true, itens: [
      ["Laser — Buço", "Buço", 15, b_(8)],
      ["Laser — Axilas", "Axilas", 15, b_(15)],
      ["Laser — Virilha Normal", "Virilha Normal", 30, b_(20)],
      ["Laser — Virilha + Perianal", "Virilha + Perianal", 30, b_(30)],
      ["Laser — Meia Perna", "Meia Perna", 30, b_(25)],
      ["Laser — Perna Completa", "Perna Completa", 45, b_(30)],
      ["Laser — Patilhas", "Patilhas", 15, b_(8)],
      ["Laser — Antebraços", "Antebraços", 30, b_(15)],
      ["Laser — Braços", "Braços", 30, b_(20)],
      ["Laser — Glúteos", "Glúteos", 30, b_(20)],
      ["Laser — Queixo", "Queixo", 15, b_(15)],
      ["Laser — Nariz", "Nariz", 15, b_(8)],
      ["Laser — Orelhas", "Orelhas", 15, b_(8)],
      ["Laser — Entre Sobrancelhas", "Entre Sobrancelhas", 15, b_(7)],
      ["Laser — Maçãs do Rosto", "Maçãs do Rosto", 15, b_(8)],
      ["Laser — Lombar", "Lombar", 15, b_(10)],
      ["Laser — Costas Completas", "Costas Completas", 60, b_(35)],
      ["Laser — Pés", "Pés", 30, b_(10)],
      ["Laser — Mãos", "Mãos", 30, b_(10)],
      ["Laser — Abdómen", "Abdómen", 45, b_(35)],
      ["Laser — Axilas + Virilha", "Axilas + Virilha", 45, b_(25)],
      ["Laser — Buço + Queixo", "Buço + Queixo", 30, b_(15)],
      ["Laser — Rosto Completo", "Rosto Completo", 45, b_(25)],
      ["Laser — Pernas + Axilas + Virilha", "Pernas + Axilas + Virilha", 60, b_(35)],
      ["Depilação a Laser", "Outra zona (indico nas observações)", 30, CONS]
    ] },
    { id: "ext", nome: "Extensão de Pestanas", off: true, itens: [
      ["Extensão — Pestanas Express", "Pestanas Express", 60, b_(40)],
      ["Extensão — 1ª Aplicação", "1ª Aplicação", 105, b_(65)],
      ["Extensão — Manutenção até 4 semanas", "Manutenção até 4 semanas", 60, b_(45)],
      ["Extensão — Manutenção até 6 semanas", "Manutenção até 6 semanas", 75, b_(55)],
      ["Extensão — Remoção de Pestanas", "Remoção de Pestanas", 30, b_(16)],
      ["Extensão — Remoção (não aplicadas na clínica)", "Remoção (não aplicadas na clínica)", 45, b_(30)]
    ] },
    { id: "desp", nome: "Despigmentação", off: true, itens: [
      ["Despigmentação de Sobrancelhas — 1ª Sessão", "Despigmentação de Sobrancelhas — 1ª Sessão", 60, b_(75)],
      ["Despigmentação — Sessão de Manutenção", "Sessão de Manutenção", 60, b_(65)]
    ] },
    { id: "trat", nome: "Tratamentos", off: true, itens: [
      ["Brow Vitamin", "Brow Vitamin", 45, b_(75)],
      ["Pack 4 sessões Brow Vitamin", "Pack 4 sessões Brow Vitamin", 45, b_(280)]
    ] },
    { id: "outro", nome: "Outro", itens: [
      ["Outro (indico na mensagem)", "Outro (indico na mensagem)", 30, CONS]
    ] }
  ];
  // Nomes antigos (marcações já feitas antes do catálogo completo): continuam a ter duração e preço.
  var LEGADO = [
    ["Coloração de Sobrancelhas (Henna / Tintura / Descoloração)", 45, { f: 24 }],
    ["Hidraglos de Lábios", 45, { f: 65 }],
    ["Threading (rosto)", 30, { f: 4 }]
  ];
  GRUPOS.forEach(function (g) {
    g.itens = g.itens.map(function (i) { return { v: i[0], l: i[1], d: i[2], p: i[3], ativo: !g.off && i[4] !== false, grupo: g.nome }; });
  });
  var PRECOS = {}, DUR0 = {};
  GRUPOS.forEach(function (g) { g.itens.forEach(function (i) { PRECOS[i.v] = i.p; DUR0[i.v] = i.d; }); });
  LEGADO.forEach(function (i) { PRECOS[i[0]] = i[2]; DUR0[i[0]] = i[1]; });

  /* Preço de um serviço: { base } | { from } | { consulta:true } (aceita nomes com sufixo, ex. "(PRÉMIO…)") */
  function priceOf(serv) {
    var best = null;
    if (!serv) return { consulta: true };
    if (PRECOS[serv]) best = serv;
    else Object.keys(PRECOS).forEach(function (k) { if (serv.indexOf(k) === 0 && (!best || k.length > best.length)) best = k; });
    var p = best && PRECOS[best];
    if (!p || p.c) return { consulta: true };
    return p.b != null ? { base: p.b } : { from: p.f };
  }
  function itemOf(v) { for (var i = 0; i < GRUPOS.length; i++) for (var j = 0; j < GRUPOS[i].itens.length; j++) if (GRUPOS[i].itens[j].v === v) return GRUPOS[i].itens[j]; return null; }
  /* Está visível na marcação? (a administradora pode ligar/desligar no painel) */
  function servicoAtivo(cfg, item) {
    var a = cfg && cfg.ativos;
    if (a && Object.prototype.hasOwnProperty.call(a, item.v)) return a[item.v] !== false;
    return item.ativo;
  }
  /* Grupos só com os serviços visíveis na marcação */
  function gruposAtivos(cfg) {
    return GRUPOS.map(function (g) { return { id: g.id, nome: g.nome, itens: g.itens.filter(function (i) { return servicoAtivo(cfg, i); }) }; })
      .filter(function (g) { return g.itens.length; });
  }
  function trLabel(s, lang) {
    try {
      var l = lang || (window.InovaI18N && window.InovaI18N.atual && window.InovaI18N.atual());
      var d = l && l !== "pt" && window.INOVA_DIC && window.INOVA_DIC[l];
      return (d && d[s]) || s;
    } catch (e) { return s; }
  }
  /* Preenche a lista de serviços (agrupada por categoria). opts: todos, placeholder (false = sem), lang */
  function fillServiceSelect(sel, cfg, opts) {
    opts = opts || {};
    var keep = sel.value;
    sel.innerHTML = "";
    if (opts.placeholder !== false) sel.appendChild(new Option(trLabel("Escolha o serviço…", opts.lang), ""));
    (opts.todos ? GRUPOS : gruposAtivos(cfg)).forEach(function (g) {
      var og = document.createElement("optgroup");
      og.label = trLabel(g.nome, opts.lang);
      g.itens.forEach(function (i) { og.appendChild(new Option(trLabel(i.l, opts.lang), i.v)); });
      sel.appendChild(og);
    });
    if (keep) { for (var k = 0; k < sel.options.length; k++) if (sel.options[k].value === keep) { sel.value = keep; break; } }
  }
  var WD = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  var MO = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function toMin(h) { var a = String(h || "0:0").split(":"); return (+a[0] || 0) * 60 + (+a[1] || 0); }
  function fromMin(m) { return pad(Math.floor(m / 60)) + ":" + pad(m % 60); }
  function ymd(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function parseYmd(s) { var a = String(s || "").split("-"); return new Date(+a[0], (+a[1] || 1) - 1, +a[2] || 1); }
  function addDays(d, n) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); return x; }
  function validYmd(s) { return /^\d{4}-\d{2}-\d{2}$/.test(String(s || "")); }
  function validHm(s) { return /^\d{1,2}:\d{2}$/.test(String(s || "")); }
  function copy(o) { return JSON.parse(JSON.stringify(o)); }

  function defaultDurations() { var o = {}; Object.keys(DUR0).forEach(function (k) { o[k] = DUR0[k]; }); return o; }

  /* Ponto de partida: nenhum dia está aberto. A administradora escolhe no calendário
     os dias em que atende (ou define um horário fixo semanal, se tiver). */
  function defaults() {
    var semana = {};
    for (var i = 0; i < 7; i++) semana[i] = { aberto: false, janelas: [] };
    return { passo: 30, buffer: 0, antecedenciaH: 2, horizonte: 90, semanaOk: false, semana: semana, dias: {}, ativos: {}, duracoes: defaultDurations(), catV: CAT_V };
  }

  function cleanWins(list) {
    var out = [];
    (list || []).forEach(function (w) {
      if (!w || !validHm(w.de) || !validHm(w.ate)) return;
      if (toMin(w.ate) <= toMin(w.de)) return;
      out.push({ de: fromMin(toMin(w.de)), ate: fromMin(toMin(w.ate)) });
    });
    out.sort(function (a, b) { return toMin(a.de) - toMin(b.de); });
    return out;
  }

  /* Junta o que veio da base de dados com os valores por omissão. */
  function normalize(raw) {
    var d = defaults();
    if (!raw || typeof raw !== "object") return d;
    function num(v, ok, dflt) { v = +v; return ok.indexOf(v) >= 0 ? v : dflt; }
    d.passo = num(raw.passo, [15, 30, 60], d.passo);
    d.buffer = num(raw.buffer, [0, 15, 30, 45, 60], d.buffer);
    d.antecedenciaH = num(raw.antecedenciaH, [0, 1, 2, 3, 6, 12, 24, 48, 72], d.antecedenciaH);
    d.horizonte = num(raw.horizonte, [14, 30, 60, 90, 180, 365], d.horizonte);
    d.semanaOk = raw.semanaOk === true;
    if (raw.semana) {
      for (var i = 0; i < 7; i++) {
        var s = raw.semana[i];
        if (!s) continue;
        d.semana[i] = { aberto: s.aberto !== false, janelas: cleanWins(s.janelas) };
      }
    }
    if (raw.dias) {
      Object.keys(raw.dias).forEach(function (k) {
        if (!validYmd(k)) return;
        var e = raw.dias[k];
        if (!e) return;
        if (e.aberto === false) d.dias[k] = { aberto: false };
        else d.dias[k] = { aberto: true, janelas: cleanWins(e.janelas) };
      });
    }
    var v0 = +raw.catV || 0;   // versão do catálogo com que foi guardada
    if (v0 >= 2 && raw.ativos && typeof raw.ativos === "object") {
      Object.keys(raw.ativos).forEach(function (k) { if (DUR0[k] != null && typeof raw.ativos[k] === "boolean") d.ativos[k] = raw.ativos[k]; });
    }
    if (raw.duracoes) {
      Object.keys(raw.duracoes).forEach(function (k) {
        var v = +raw.duracoes[k];
        if (v >= U && v <= 600) d.duracoes[k] = Math.round(v / U) * U;
      });
    }
    if (v0 < 3) ["Lifting de Pestanas", "Lifting + Tintura de Pestanas"].forEach(function (k) { d.duracoes[k] = DUR0[k]; });
    return d;
  }

  /* ---------- consultas ---------- */
  function weeklyWindows(cfg, dia) {
    var s = cfg.semana[parseYmd(dia).getDay()];
    return (!s || s.aberto === false) ? [] : cleanWins(s.janelas);
  }
  /* Janelas de atendimento de um dia, em minutos: [{de, ate}] */
  function windowsFor(cfg, dia) {
    var ex = cfg.dias[dia], wins;
    if (ex) {
      if (ex.aberto === false) return [];
      wins = cleanWins(ex.janelas);
      if (!wins.length) wins = weeklyWindows(cfg, dia);
    } else wins = weeklyWindows(cfg, dia);
    return wins.map(function (w) { return { de: toMin(w.de), ate: toMin(w.ate) }; });
  }
  /* "normal" | "fechado" | "especial" */
  function dayMode(cfg, dia) {
    var ex = cfg.dias[dia];
    if (!ex) return "normal";
    return ex.aberto === false ? "fechado" : "especial";
  }

  function durationFor(cfg, serv) {
    var d = cfg.duracoes || {};
    if (!serv) return 30;
    if (d[serv]) return +d[serv];
    var best = null;
    Object.keys(d).forEach(function (k) { if (serv.indexOf(k) === 0 && (!best || k.length > best.length)) best = k; });
    return best ? +d[best] : 30;
  }
  /* Tempo que fica ocupado = duração + pausa, arredondado à unidade */
  function blockLength(cfg, serv) {
    return Math.ceil((durationFor(cfg, serv) + (cfg.buffer || 0)) / U) * U;
  }

  function slotsFor(cfg, serv, dia, startMin) {
    var out = [], len = blockLength(cfg, serv);
    for (var m = startMin; m < startMin + len; m += U) {
      out.push({ id: dia + "_" + pad(Math.floor(m / 60)) + pad(m % 60), dia: dia, min: m });
    }
    return out;
  }

  /* lista [{dia,min}] -> { dia: { min: true } } */
  function occMap(list) {
    var o = {};
    (list || []).forEach(function (s) { (o[s.dia] = o[s.dia] || {})[s.min] = true; });
    return o;
  }

  /* Horários de início livres ("HH:MM") para um serviço num dia. */
  function availableTimes(cfg, occ, dia, serv, now, opts) {
    now = now || new Date();
    opts = opts || {};
    if (!validYmd(dia)) return [];
    var day0 = parseYmd(dia), today0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (day0 < today0) return [];
    if (!opts.admin && day0 > addDays(today0, cfg.horizonte)) return [];
    var dur = durationFor(cfg, serv), len = blockLength(cfg, serv);
    var minTs = opts.admin ? now.getTime() - 3600000 : now.getTime() + (cfg.antecedenciaH || 0) * 3600000;
    var busy = (occ && occ[dia]) || {}, seen = {}, out = [];
    // a administradora pode escolher qualquer hora livre, mesmo fora do horário habitual
    var wins = opts.todasAsHoras ? [{ de: 6 * 60, ate: 23 * 60 + 30 }] : windowsFor(cfg, dia);
    wins.forEach(function (w) {
      for (var s = w.de; s + dur <= w.ate; s += cfg.passo) {
        if (seen[s]) continue;
        var ts = new Date(day0.getFullYear(), day0.getMonth(), day0.getDate(), Math.floor(s / 60), s % 60).getTime();
        if (ts < minTs) continue;
        var free = true;
        for (var m = s; m < s + len; m += U) { if (busy[m]) { free = false; break; } }
        if (free) { seen[s] = 1; out.push(s); }
      }
    });
    out.sort(function (a, b) { return a - b; });
    return out.map(fromMin);
  }

  /* Próximos dias com pelo menos um horário livre. */
  function availableDays(cfg, occ, serv, now, count) {
    now = now || new Date();
    var out = [], base = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    for (var i = 0; i <= cfg.horizonte && out.length < count; i++) {
      var d = ymd(addDays(base, i));
      if (availableTimes(cfg, occ, d, serv, now).length) out.push(d);
    }
    return out;
  }

  /* ---------- formatação ---------- */
  function fmtDur(min) {
    min = +min || 0;
    var h = Math.floor(min / 60), m = min % 60;
    if (!h) return m + " min";
    return m ? h + "h" + pad(m) : h + "h";
  }
  function fmtWins(wins) {
    return wins.length ? wins.map(function (w) { return fromMin(w.de) + "–" + fromMin(w.ate); }).join(" · ") : "";
  }
  var WD_CURTO = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  var MO_CURTO = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  /* "sáb 7 nov" */
  function fmtDiaCurto(dia) { var d = parseYmd(dia); return WD_CURTO[d.getDay()] + " " + d.getDate() + " " + MO_CURTO[d.getMonth()]; }
  /* "09:00–13:00 · 14:00–18:00" a partir de janelas em texto */
  function fmtJanelas(list) { return (list || []).map(function (w) { return w.de + "–" + w.ate; }).join(" · "); }
  function fmtDia(dia) { var a = String(dia || "").split("-"); return a.length === 3 ? a[2] + "/" + a[1] + "/" + a[0] : dia; }

  var state = { cfg: defaults(), carregada: false, lida: true, promessa: null };

  /* Espera no máximo `ms`; se a rede estiver lenta, segue com `fallback` em vez de ficar preso. */
  function withTimeout(promise, ms, fallback) {
    return new Promise(function (resolve) {
      var done = false, t = setTimeout(function () { if (!done) { done = true; resolve(fallback); } }, ms);
      Promise.resolve(promise).then(function (v) { if (!done) { done = true; clearTimeout(t); resolve(v); } },
        function () { if (!done) { done = true; clearTimeout(t); resolve(fallback); } });
    });
  }
  /* Cópia local da última configuração lida: a marcação aparece logo, antes da rede responder. */
  var LS_CACHE = "inova_agenda_cache";
  function cacheRead() { try { return JSON.parse(localStorage.getItem(LS_CACHE)); } catch (e) { return null; } }
  function cacheWrite(cfg) { try { localStorage.setItem(LS_CACHE, JSON.stringify(cfg)); } catch (e) {} }

  /* Carrega a configuração uma única vez e partilha o mesmo objeto
     entre a agenda e a aba Disponibilidade do painel. */
  function loadCfg() {
    if (state.promessa) return state.promessa;
    var AZ = window.InovaAuth;
    state.promessa = Promise.resolve(AZ && AZ.getAgendaCfg ? AZ.getAgendaCfg() : { ok: false, cfg: null }).then(function (r) {
      state.cfg = normalize(r && r.cfg);
      state.lida = !!(r && r.ok);
      state.carregada = true;
      return state;
    }).catch(function () { state.lida = false; state.carregada = true; return state; });
    return state.promessa;
  }

  /* ============================================================
     Formulário de marcação: só mostra horários livres
     ============================================================ */
  function bindBooking(o) {
    var AZ = window.InovaAuth;
    var st = { cfg: defaults(), occ: {}, occOk: false, cfgOk: false, loaded: false, fromCache: false };
    var today = function () { return ymd(new Date()); };

    function lang() {
      var l = window.InovaI18N && window.InovaI18N.atual && window.InovaI18N.atual();
      return l === "en" ? "en-GB" : (l === "es" ? "es-ES" : "pt-PT");
    }
    function chipLabel(dia) {
      try { return parseYmd(dia).toLocaleDateString(lang(), { weekday: "short", day: "2-digit", month: "2-digit" }); }
      catch (e) { return fmtDia(dia); }
    }

    function load() {
      var none = { cfg: null, ok: false }, noneO = { list: [], ok: false };
      return Promise.all([
        withTimeout(AZ.getAgendaCfg ? AZ.getAgendaCfg() : none, 9000, none),
        withTimeout(AZ.listOcupados ? AZ.listOcupados(today()) : noneO, 9000, noneO)
      ]).then(function (r) {
        if (r[0] && r[0].ok) { st.cfg = normalize(r[0].cfg); st.cfgOk = true; cacheWrite(r[0].cfg || null); }
        st.occ = occMap(r[1] && r[1].list);
        st.occOk = !!(r[1] && r[1].ok);
        state.cfg = st.cfg;
        st.loaded = true;
      }).catch(function () { st.loaded = true; });
    }
    // mostra já a última configuração conhecida (se houver) enquanto a rede responde
    (function () { var c = cacheRead(); if (c) { st.cfg = normalize(c); state.cfg = st.cfg; st.fromCache = true; } })();

    function fillServices() {
      if (o.service.disabled) return;          // prémio de fidelidade em curso: não mexer na lista
      fillServiceSelect(o.service, st.cfg, {});
    }

    function setLimits() {
      var di = o.date; if (!di) return;
      di.min = today();
      di.max = ymd(addDays(new Date(), st.cfg.horizonte));
    }

    function renderDays(serv, quiet) {
      if (!o.days) return;
      var list = availableDays(st.cfg, st.occ, serv, new Date(), 6);
      if (!list.length) {
        o.days.innerHTML = quiet ? "" : '<div class="bk-days-title">De momento não há horários disponíveis. Fale connosco no WhatsApp.</div>';
        return;
      }
      var cur = o.date.value;
      o.days.innerHTML = '<div class="bk-days-title">Próximos dias disponíveis:</div><div class="bk-days">' +
        list.map(function (d) {
          return '<button type="button" class="bk-chip' + (d === cur ? " on" : "") + '" data-dia="' + d + '">' + chipLabel(d) + '</button>';
        }).join("") + '</div>';
    }

    function refresh() {
      var serv = o.service.value, dia = o.date.value, prev = o.time.value;
      setLimits();
      if (!serv) {
        o.time.innerHTML = "";
        o.time.appendChild(new Option("Escolha primeiro o serviço", ""));
        if (o.info) o.info.innerHTML = "";
        if (o.days) o.days.innerHTML = "";
        return;
      }
      var dur = durationFor(st.cfg, serv);
      var durHtml = '<span>Duração aproximada:</span> <b>' + fmtDur(dur) + '</b>';
      o.time.innerHTML = "";
      if (!dia) {
        o.time.appendChild(new Option("Escolha primeiro o dia", ""));
        if (o.info) o.info.innerHTML = durHtml;
        renderDays(serv, false);
        return;
      }
      if (st.loaded && !st.cfgOk && !st.fromCache) {
        o.time.appendChild(new Option("Sem horários disponíveis", ""));
        if (o.info) o.info.innerHTML = '<span class="bk-warn">Não foi possível carregar os horários. Atualize a página ou fale connosco no WhatsApp.</span>';
        if (o.days) o.days.innerHTML = "";
        return;
      }
      var times = availableTimes(st.cfg, st.occ, dia, serv, new Date());
      if (!times.length) {
        o.time.appendChild(new Option("Sem horários disponíveis", ""));
        var closed = windowsFor(st.cfg, dia).length === 0;
        if (o.info) o.info.innerHTML = durHtml + '<br><span class="bk-warn">' +
          (closed ? "Neste dia não há atendimento." : "Sem horários disponíveis neste dia.") + '</span>';
        renderDays(serv, false);
        return;
      }
      times.forEach(function (t) { o.time.appendChild(new Option(t, t)); });
      if (times.indexOf(prev) >= 0) o.time.value = prev;
      if (o.info) o.info.innerHTML = durHtml;
      renderDays(serv, true);
    }

    /* Antes de gravar: volta a ler a ocupação e confirma que o horário ainda está livre. */
    function confirm(serv, dia, hora) {
      return load().then(function () {
        var times = availableTimes(st.cfg, st.occ, dia, serv, new Date());
        if (times.indexOf(hora) < 0) { refresh(); return { ok: false }; }
        return { ok: true, slots: slotsFor(st.cfg, serv, dia, toMin(hora)), duracao: durationFor(st.cfg, serv) };
      });
    }

    o.service.addEventListener("change", refresh);
    o.date.addEventListener("change", refresh);
    o.date.addEventListener("input", refresh);
    if (o.days) o.days.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("[data-dia]"); if (!b) return;
      o.date.value = b.getAttribute("data-dia");
      refresh();
    });
    // o sistema de idiomas avisa quando arranca e sempre que se muda de idioma
    document.addEventListener("inova:idioma", function () { fillServices(); refresh(); });

    fillServices();
    refresh();
    load().then(function () { fillServices(); refresh(); });
    return { refresh: refresh, confirm: confirm, reload: function () { return load().then(function () { fillServices(); refresh(); }); } };
  }

  return {
    U: U, GRUPOS: GRUPOS, priceOf: priceOf, itemOf: itemOf, servicoAtivo: servicoAtivo, gruposAtivos: gruposAtivos, fillServiceSelect: fillServiceSelect, trLabel: trLabel, WD: WD, MO: MO, state: state, loadCfg: loadCfg,
    defaults: defaults, normalize: normalize, copy: copy, cleanWins: cleanWins,
    windowsFor: windowsFor, weeklyWindows: weeklyWindows, dayMode: dayMode,
    durationFor: durationFor, blockLength: blockLength, slotsFor: slotsFor,
    occMap: occMap, availableTimes: availableTimes, availableDays: availableDays,
    fmtDur: fmtDur, fmtWins: fmtWins, fmtDia: fmtDia, fmtDiaCurto: fmtDiaCurto, fmtJanelas: fmtJanelas, WD_CURTO: WD_CURTO, MO_CURTO: MO_CURTO,
    toMin: toMin, fromMin: fromMin, ymd: ymd, parseYmd: parseYmd, addDays: addDays, pad: pad,
    bindBooking: bindBooking
  };
})();
