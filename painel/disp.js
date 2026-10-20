/* ============================================================
   INOVA BEAUTY — Painel: aba "Disponibilidade"
   ------------------------------------------------------------
   Pensada para quem não tem prática com tecnologia e conhece as
   suas folgas do mês inteiro:
     1. toca nos dias em que vai atender (ficam com ✓);
     2. escolhe as horas (uma vez, valem para todos os dias);
     3. toca em "Vou atender nestes dias".
   Tudo guarda sozinho e há sempre "Desfazer".
   ============================================================ */
(function () {
  "use strict";
  var AZ = window.InovaAuth, IA = window.InovaAgenda;
  var root = document.getElementById("dispRoot");
  if (!AZ || !IA || !root) return;

  var WEEK = [1, 2, 3, 4, 5, 6, 0];
  var PRESETS = {
    dia:   { nome: "Dia todo",    wins: [{ de: "09:00", ate: "19:00" }] },
    manha: { nome: "Manhã",       wins: [{ de: "09:00", ate: "13:00" }] },
    tarde: { nome: "Tarde",       wins: [{ de: "14:00", ate: "19:00" }] },
    fim:   { nome: "Fim do dia",  wins: [{ de: "18:00", ate: "22:00" }] }
  };

  var cursor = new Date(); cursor.setDate(1); cursor.setHours(0, 0, 0, 0);
  var sel = {};                       // dias escolhidos: { "AAAA-MM-DD": true } (pode atravessar meses)
  var selWins = JSON.parse(JSON.stringify(PRESETS.dia.wins));
  var selKey = "";
  var lastWins = JSON.parse(JSON.stringify(PRESETS.dia.wins));
  var undo = null;                    // { dias: "<json>" }
  var pendingClose = false;
  var range = { from: "", to: "" };
  var bookings = [], ready = false, synced = false, timer = null;
  var status = { cls: "wait", text: "As alterações guardam-se sozinhas.", undo: false };
  var open = { ajuda: false, avancado: false, periodo: false };

  function C() { return IA.state.cfg; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function today() { return IA.ymd(new Date()); }
  function copy(o) { return JSON.parse(JSON.stringify(o)); }
  function pl(n, um, varios) { return n + " " + (n === 1 ? um : varios); }
  function winsOf(d) { return IA.windowsFor(C(), d).map(function (w) { return { de: IA.fromMin(w.de), ate: IA.fromMin(w.ate) }; }); }
  function selDays() { return Object.keys(sel).sort(); }
  function bookedOn(d) { return bookings.filter(function (m) { return m.dia === d && m.estado !== "cancelada"; }).length; }

  /* ---------- guardar (automático) ---------- */
  function statusHtml() {
    return esc(status.text) + (status.undo ? ' <button type="button" class="dp-undo" data-a="undo">↶ Desfazer</button>' : "");
  }
  function setStatus(cls, text, canUndo) {
    status = { cls: cls, text: text, undo: !!canUndo };
    var el = document.getElementById("dpStatus");
    if (el) { el.className = "dp-status " + cls; el.innerHTML = statusHtml(); }
  }
  function prune() {
    var cfg = C(), t = today(), out = copy(cfg);
    Object.keys(out.dias).forEach(function (k) { if (k < t) delete out.dias[k]; });
    for (var i = 0; i < 7; i++) out.semana[i].janelas = IA.cleanWins(out.semana[i].janelas);
    Object.keys(out.dias).forEach(function (k) {
      if (out.dias[k].aberto !== false) {
        out.dias[k].janelas = IA.cleanWins(out.dias[k].janelas);
        if (!out.dias[k].janelas.length) out.dias[k] = { aberto: false };
      }
    });
    return out;
  }
  /* note: frase que aparece depois de guardar; canUndo: mostra o botão Desfazer */
  function touch(note, canUndo) {
    setStatus("wait", "A guardar…", false);
    clearTimeout(timer);
    timer = setTimeout(function () {
      AZ.saveAgendaCfg(prune()).then(function (r) {
        if (r && r.error) {
          setStatus("err", r.permissao
            ? "⚠️ Sem permissão para guardar. Falta publicar as regras do Firestore (config e ocupados). As alterações NÃO estão a ser aplicadas."
            : "⚠️ Não foi possível guardar: " + r.error + " Tente outra vez.", false);
          return;
        }
        setStatus("ok", "✅ " + (note || "Guardado. As clientes já veem estas alterações."), canUndo);
      });
    }, 450);
  }
  function snapshot() { undo = { dias: JSON.stringify(C().dias) }; }

  /* ---------- editor de períodos (de … até …) ---------- */
  function timeOpts(sel0) {
    var vals = [], m;
    for (m = 6 * 60; m <= 23 * 60 + 30; m += 30) vals.push(IA.fromMin(m));
    if (sel0 && vals.indexOf(sel0) < 0) { vals.push(sel0); vals.sort(); }
    return vals.map(function (v) { return '<option value="' + v + '"' + (v === sel0 ? " selected" : "") + ">" + v + "</option>"; }).join("");
  }
  function winList(scope, key) { return scope === "sel" ? selWins : C().semana[key].janelas; }
  function winsHtml(list, scope, key) {
    var h = '<div class="dp-wins">';
    list.forEach(function (w, i) {
      var at = ' data-scope="' + scope + '" data-key="' + key + '" data-i="' + i + '"';
      h += '<div class="dp-win"><label>Das <select data-wf="de"' + at + '>' + timeOpts(w.de) + '</select></label>' +
        '<label>às <select data-wf="ate"' + at + '>' + timeOpts(w.ate) + '</select></label>' +
        (list.length > 1 ? '<button type="button" class="dp-x" data-a="wdel"' + at + ' aria-label="Tirar este período" title="Tirar este período">✕</button>' : '') + '</div>';
    });
    return h + '</div><button type="button" class="dp-add" data-a="wadd" data-scope="' + scope + '" data-key="' + key + '">+ adicionar outro período (ex.: manhã e tarde)</button>';
  }

  /* ---------- introdução ---------- */
  function introHtml() {
    return '<div class="form-card dp-card dp-intro"><h3>📅 A minha agenda</h3>' +
      '<p class="dp-lead">Aqui decide <b>quando atende</b>. As clientes só conseguem marcar nos dias que escolher.</p>' +
      '<ol class="dp-steps"><li><b>Toque nos dias</b> em que vai atender. Cada dia escolhido fica com um ✓.</li>' +
      '<li><b>Escolha as horas</b> (por exemplo, das 09:00 às 13:00).</li>' +
      '<li>Toque no botão verde <b>“Vou atender nestes dias”</b>. Pronto!</li></ol>' +
      '<details class="dp-help" id="dpHelp"' + (open.ajuda ? " open" : "") + '><summary>❓ Preciso de ajuda</summary><ul>' +
      '<li><b>Para ter uma folga:</b> toque no dia e depois em “Folga”.</li>' +
      '<li><b>Para mudar as horas de um dia:</b> toque nele, mude as horas e toque outra vez em “Vou atender”.</li>' +
      '<li><b>Atende de manhã e ao fim da tarde no mesmo dia?</b> Toque em “+ adicionar outro período”.</li>' +
      '<li><b>O número no canto de um dia</b> é o número de marcações já feitas nesse dia.</li>' +
      '<li><b>Enganou-se?</b> Toque em “↶ Desfazer” na barra de cima, logo a seguir a guardar.</li>' +
      '<li><b>Não precisa de carregar em “Guardar”.</b> Tudo se guarda sozinho.</li></ul></details></div>';
  }

  function weekBannerHtml() {
    var cfg = C(), abertos = WEEK.filter(function (d) { return cfg.semana[d].aberto !== false && cfg.semana[d].janelas.length; });
    if (cfg.semanaOk || !abertos.length) return "";
    var nomes = abertos.map(function (d) { return IA.WD[d].replace("-feira", ""); }).join(", ");
    return '<div class="dp-banner"><p><b>⚠️ Atenção:</b> o horário fixo da semana está a abrir sozinho em: <b>' + esc(nomes) + '</b> (' +
      esc(IA.fmtJanelas(cfg.semana[abertos[0]].janelas)) + '). Se só atende nas suas folgas, o melhor é fechar a semana e escolher os dias no calendário.</p>' +
      '<div class="dp-banner-btns"><button type="button" class="dp-big go" data-a="wk-close-all">Fechar a semana — só atendo nos dias que eu escolher</button>' +
      '<button type="button" class="dp-big plain" data-a="wk-keep">Manter o horário fixo da semana</button></div></div>';
  }

  /* ---------- passo 1: calendário ---------- */
  function shortHours(wins) {
    function f(h) { var a = h.split(":"); return (+a[0]) + (a[1] === "00" ? "h" : "h" + a[1]); }
    if (wins.length === 1) return f(wins[0].de) + "–" + f(wins[0].ate);
    return wins.length + " períodos";
  }
  function calHtml() {
    var cfg = C(), y = cursor.getFullYear(), mo = cursor.getMonth(), t = today();
    var first = new Date(y, mo, 1), lead = (first.getDay() + 6) % 7, days = new Date(y, mo + 1, 0).getDate();
    var h = '<div class="form-card dp-card"><h3>Passo 1 — Toque nos dias em que vai atender</h3>' +
      '<div class="dp-quick"><span>Escolher de uma vez:</span>' +
      '<button type="button" data-a="pick" data-v="sab">Todos os sábados</button><button type="button" data-a="pick" data-v="dom">Todos os domingos</button>' +
      '<button type="button" data-a="pick" data-v="sabdom">Sáb e dom</button><button type="button" data-a="pick" data-v="semana">Seg a sex</button>' +
      '<button type="button" data-a="pick" data-v="mes">Mês todo</button></div>' +
      '<div class="dp-cal-head"><button type="button" class="dp-nav" data-a="nav" data-v="-1" aria-label="Mês anterior">‹</button><strong>' + IA.MO[mo] + ' ' + y +
      '</strong><button type="button" class="dp-nav" data-a="nav" data-v="1" aria-label="Mês seguinte">›</button></div><div class="dp-cal">';
    ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"].forEach(function (n) { h += '<div class="dp-dow">' + n + '</div>'; });
    for (var i = 0; i < lead; i++) h += '<span class="dp-cell blank"></span>';
    for (var d = 1; d <= days; d++) {
      var ds = IA.ymd(new Date(y, mo, d)), mode = IA.dayMode(cfg, ds), wins = winsOf(ds), isOpen = wins.length > 0, n = bookedOn(ds);
      var cls = "dp-cell", sub = "", words = IA.WD[IA.parseYmd(ds).getDay()] + ", " + d + " de " + IA.MO[mo];
      if (isOpen) { cls += " open"; sub = shortHours(wins); words += " — atende das " + IA.fmtJanelas(wins).replace(/–/g, " às "); }
      else if (mode === "fechado") { cls += " blocked"; sub = "folga"; words += " — folga"; }
      else words += " — sem atendimento";
      if (ds === t) cls += " today";
      if (sel[ds]) { cls += " sel"; words += " — escolhido"; }
      if (n) words += " — " + pl(n, "marcação", "marcações");
      h += '<button type="button" class="' + cls + '" data-a="day" data-d="' + ds + '"' + (ds < t ? " disabled" : "") + ' aria-pressed="' + (sel[ds] ? "true" : "false") + '" aria-label="' + esc(words) + '">' +
        (sel[ds] ? '<span class="dp-check">✓</span>' : "") + '<span class="dp-n">' + d + '</span><span class="dp-t">' + esc(sub) + '</span>' +
        (n ? '<span class="dp-bub" title="' + pl(n, "marcação", "marcações") + '">' + n + '</span>' : "") + '</button>';
    }
    h += '</div><div class="dp-legend"><span><i class="lg open"></i>atendo</span><span><i class="lg"></i>sem atendimento</span>' +
      '<span><i class="lg blocked"></i>folga marcada</span><span><i class="lg sel">✓</i>escolhido agora</span><span><i class="lg bub">2</i>marcações feitas</span></div>';
    h += '<details class="dp-help" style="margin-top:.9rem" id="dpPeriodo"' + (open.periodo ? " open" : "") + '><summary>Escolher vários dias seguidos (de uma data até outra)</summary>' +
      '<div class="dp-range"><label>De<input type="date" data-range="from" value="' + esc(range.from) + '" min="' + t + '"></label>' +
      '<label>Até<input type="date" data-range="to" value="' + esc(range.to) + '" min="' + t + '"></label>' +
      '<button type="button" class="dp-big plain" data-a="range">Escolher estes dias</button></div>' +
      '<div class="form-msg" id="dpRangeMsg"></div></details>';
    return h + '</div>';
  }

  /* ---------- passo 2 e 3: horas e confirmar ---------- */
  function initSelWins() {
    var key = selDays().join(",");
    if (key === selKey) return;
    selKey = key;
    var days = selDays();
    if (!days.length) return;
    var first = winsOf(days[0]), same = first.length && days.every(function (d) { return IA.fmtJanelas(winsOf(d)) === IA.fmtJanelas(first); });
    selWins = copy(same ? first : lastWins);
  }
  function panelHtml() {
    var days = selDays();
    if (!days.length) {
      return '<div class="form-card dp-card dp-wait" id="dpPanel"><h3>Passo 2 — Horas</h3><p class="dp-muted">Primeiro escolha os dias no calendário acima. Depois aparecem aqui as horas.</p></div>';
    }
    var already = days.filter(function (d) { return winsOf(d).length; }).length;
    var chips = days.slice(0, 14).map(function (d) {
      return '<span class="dp-chip">' + IA.fmtDiaCurto(d) + '<button type="button" class="dp-x" data-a="unsel" data-d="' + d + '" aria-label="Tirar ' + IA.fmtDiaCurto(d) + '">✕</button></span>';
    }).join("") + (days.length > 14 ? '<span class="dp-chip">+ ' + (days.length - 14) + '</span>' : "");
    var h = '<div class="form-card dp-card dp-go" id="dpPanel"><h3>Passo 2 — Que horas atende?</h3>' +
      '<p class="dp-muted"><b>' + pl(days.length, "dia escolhido", "dias escolhidos") + ':</b></p><div class="dp-chips">' + chips + '</div>' +
      (already ? '<p class="dp-muted" style="margin-top:.6rem">' + (already === days.length ? "Todos estes dias já têm atendimento." : pl(already, "destes dias já tem", "destes dias já têm") + " atendimento.") + ' As horas abaixo vão substituir as atuais.</p>' : "") +
      '<p class="dp-label">Escolha um atalho:</p><div class="dp-presets">' +
      Object.keys(PRESETS).map(function (k) { return '<button type="button" data-a="preset" data-v="' + k + '">' + PRESETS[k].nome + '<small>' + IA.fmtJanelas(PRESETS[k].wins) + '</small></button>'; }).join("") + '</div>' +
      '<p class="dp-label">Ou escolha as horas:</p>' + winsHtml(selWins, "sel", "s");
    h += '<h3 style="margin-top:1.4rem">Passo 3 — Confirmar</h3>' +
      '<button type="button" class="dp-big go" data-a="apply">✅ Vou atender nestes dias<small>das ' + esc(IA.fmtJanelas(IA.cleanWins(selWins)).replace(/–/g, " às ") || "…") + '</small></button>' +
      '<button type="button" class="dp-big no" data-a="close">🚫 Folga — não atendo nestes dias</button>';
    if (pendingClose) {
      var aff = days.filter(bookedOn).map(function (d) { return IA.fmtDiaCurto(d) + " (" + bookedOn(d) + ")"; }).join(", ");
      h += '<div class="dp-banner"><p><b>⚠️ Já existem marcações nestes dias:</b> ' + esc(aff) + '. Marcar folga <b>não cancela</b> essas marcações — avise as clientes ou mude-as na aba Agenda.</p>' +
        '<div class="dp-banner-btns"><button type="button" class="dp-big no" data-a="close-yes">Marcar folga mesmo assim</button><button type="button" class="dp-big plain" data-a="close-no">Voltar</button></div></div>';
    }
    return h + '<button type="button" class="dp-link" data-a="clear">Limpar a escolha e recomeçar</button></div>';
  }

  /* ---------- resumo do mês ---------- */
  function summaryHtml() {
    var y = cursor.getFullYear(), mo = cursor.getMonth(), last = new Date(y, mo + 1, 0).getDate(), t = today(), rows = [], total = 0;
    for (var d = 1; d <= last; d++) {
      var ds = IA.ymd(new Date(y, mo, d)); if (ds < t) continue;
      var wins = winsOf(ds); if (!wins.length) continue;
      total++; var n = bookedOn(ds);
      rows.push('<div class="dp-row"><div class="dp-row-main"><b>' + esc(IA.fmtDiaCurto(ds)) + '</b><span>' + esc(IA.fmtJanelas(wins)) + '</span>' +
        (n ? '<em>' + pl(n, "marcação", "marcações") + '</em>' : "") + '</div><div class="dp-row-btns">' +
        '<button type="button" data-a="edit" data-d="' + ds + '">Mudar horas</button><button type="button" data-a="folga1" data-d="' + ds + '">Folga</button></div></div>');
    }
    return '<div class="form-card dp-card"><h3>Dias com atendimento em ' + IA.MO[mo] + '</h3>' +
      (rows.length ? '<p class="dp-muted">' + pl(total, "dia", "dias") + ' em que as clientes podem marcar:</p><div class="dp-rows">' + rows.join("") + '</div>'
        : '<p class="dp-muted">Ainda não escolheu nenhum dia deste mês. <b>As clientes não conseguem marcar.</b> Toque nos dias no calendário acima.</p>') + '</div>';
  }

  /* ---------- duração e regras ---------- */
  function durHtml() {
    var cfg = C(), h = '<div class="form-card dp-card"><h3>⏱️ Quanto tempo demora cada serviço</h3>' +
      '<p class="dp-muted">Serve para o site só mostrar horas em que o serviço cabe. Exemplo: um serviço de 2 horas não aparece às 18:30 se acaba de atender às 19:00. Pode mudar quando quiser.</p><div class="dp-dur">';
    IA.SERVICOS.forEach(function (s) {
      var cur = IA.durationFor(cfg, s[0]), opts = "", seen = false, m;
      for (m = 15; m <= 300; m += 15) { if (m === cur) seen = true; opts += '<option value="' + m + '"' + (m === cur ? " selected" : "") + ">" + IA.fmtDur(m) + "</option>"; }
      if (!seen) opts += '<option value="' + cur + '" selected>' + IA.fmtDur(cur) + "</option>";
      h += '<div class="dp-durrow"><span>' + esc(s[0]) + '</span><select class="dp-sel" data-dur="' + encodeURIComponent(s[0]) + '">' + opts + '</select></div>';
    });
    return h + '</div></div>';
  }
  function sel1(name, value, opts) {
    return '<select class="dp-sel" data-rule="' + name + '">' + opts.map(function (o) {
      return '<option value="' + o[0] + '"' + (+o[0] === +value ? " selected" : "") + ">" + o[1] + "</option>";
    }).join("") + '</select>';
  }
  function rulesHtml() {
    var c = C();
    return '<div class="form-card dp-card"><h3>⚙️ Regras para as marcações</h3><div class="dp-rules">' +
      '<label>Pausa entre uma cliente e a seguinte' + sel1("buffer", c.buffer, [[0, "Sem pausa"], [15, "15 minutos"], [30, "30 minutos"]]) + '<small>Tempo para arrumar e preparar.</small></label>' +
      '<label>Antecedência mínima para marcar' + sel1("antecedenciaH", c.antecedenciaH, [[0, "Sem mínimo"], [1, "1 hora"], [2, "2 horas"], [3, "3 horas"], [6, "6 horas"], [12, "12 horas"], [24, "1 dia"], [48, "2 dias"], [72, "3 dias"]]) + '<small>Evita marcações em cima da hora.</small></label>' +
      '<label>Horários mostrados de…' + sel1("passo", c.passo, [[15, "15 em 15 minutos"], [30, "30 em 30 minutos"], [60, "1 em 1 hora"]]) + '<small>De quanto em quanto tempo a cliente pode começar.</small></label>' +
      '<label>As clientes podem marcar até…' + sel1("horizonte", c.horizonte, [[14, "2 semanas à frente"], [30, "1 mês à frente"], [60, "2 meses à frente"], [90, "3 meses à frente"], [180, "6 meses à frente"], [365, "1 ano à frente"]]) + '<small>Mais longe do que isto o site não deixa marcar.</small></label>' +
      '</div></div>';
  }

  /* ---------- avançado: horário fixo da semana ---------- */
  function weekHtml() {
    var cfg = C(), h = '<details class="form-card dp-card dp-adv" id="dpAdv"' + (open.avancado ? " open" : "") + '><summary><b>🔁 Avançado: horário fixo todas as semanas</b></summary>' +
      '<p class="dp-muted" style="margin-top:.8rem">Só use isto se atende <b>sempre nos mesmos dias da semana</b>. Se as suas folgas mudam, deixe tudo desligado e use o calendário acima.</p><div class="dp-week">';
    WEEK.forEach(function (dow) {
      var s = cfg.semana[dow], on = s.aberto !== false && s.janelas.length > 0;
      h += '<div class="dp-day' + (on ? "" : " off") + '"><label class="dp-sw"><input type="checkbox" data-wkopen="' + dow + '"' + (on ? " checked" : "") + '> <span>' + IA.WD[dow] + '</span></label>';
      h += on ? '<div>' + winsHtml(s.janelas, "wk", dow) + '</div>' : '<div class="dp-closed">Não atendo sempre neste dia</div>';
      h += '</div>';
    });
    return h + '</div></details>';
  }

  /* ---------- barra de cima ---------- */
  function topHtml() {
    var n = selDays().length;
    return '<div class="dp-top"><div id="dpStatus" class="dp-status ' + status.cls + '">' + statusHtml() + '</div>' +
      (n ? '<div class="dp-selbar"><span>✓ <b>' + pl(n, "dia escolhido", "dias escolhidos") + '</b></span>' +
        '<button type="button" data-a="goto">Escolher horas ↓</button><button type="button" data-a="clear">Limpar</button></div>' : "") + '</div>';
  }

  function render() {
    initSelWins();
    var warn = IA.state.lida ? "" :
      '<p class="form-msg err" style="display:block">Não foi possível ler os horários guardados (as regras do Firestore ainda não incluem a coleção <em>config</em>). A mostrar tudo fechado.</p>';
    root.innerHTML = topHtml() + warn + introHtml() + weekBannerHtml() + calHtml() + panelHtml() + summaryHtml() + durHtml() + rulesHtml() + weekHtml();
  }

  /* ---------- ações ---------- */
  function applyOpen() {
    var days = selDays(), wins = IA.cleanWins(selWins), cfg = C();
    if (!days.length) return;
    if (!wins.length) { setStatus("err", "Escolha as horas: a hora do fim tem de ser depois da hora do início.", false); return; }
    snapshot();
    days.forEach(function (d) { cfg.dias[d] = { aberto: true, janelas: copy(wins) }; });
    lastWins = copy(wins);
    var txt = pl(days.length, "dia com atendimento", "dias com atendimento") + " das " + IA.fmtJanelas(wins).replace(/–/g, " às ");
    sel = {}; selKey = ""; pendingClose = false;
    touch(txt + ". As clientes já podem marcar.", true); render();
  }
  function applyClose(force) {
    var days = selDays(), cfg = C();
    if (!days.length) return;
    if (!force && days.some(bookedOn)) { pendingClose = true; render(); return; }
    snapshot();
    days.forEach(function (d) { if (IA.weeklyWindows(cfg, d).length) cfg.dias[d] = { aberto: false }; else delete cfg.dias[d]; });
    var n = days.length;
    sel = {}; selKey = ""; pendingClose = false;
    touch(pl(n, "dia ficou", "dias ficaram") + " de folga. As clientes não conseguem marcar " + (n === 1 ? "nele." : "neles."), true); render();
  }
  function pickDays(kind) {
    var y = cursor.getFullYear(), mo = cursor.getMonth(), last = new Date(y, mo + 1, 0).getDate(), t = today();
    sel = {};
    for (var d = 1; d <= last; d++) {
      var dt = new Date(y, mo, d), ds = IA.ymd(dt), w = dt.getDay();
      if (ds < t) continue;
      var ok = kind === "mes" || (kind === "sab" && w === 6) || (kind === "dom" && w === 0) ||
        (kind === "sabdom" && (w === 6 || w === 0)) || (kind === "semana" && w >= 1 && w <= 5);
      if (ok) sel[ds] = true;
    }
    pendingClose = false;
  }
  function fixWin(list, i, f) {
    var w = list[i];
    if (IA.toMin(w.de) >= IA.toMin(w.ate)) {
      if (f === "de") w.ate = IA.fromMin(Math.min(IA.toMin(w.de) + 30, 23 * 60 + 30));
      else w.de = IA.fromMin(Math.max(IA.toMin(w.ate) - 30, 6 * 60));
    }
  }
  function newWin(list) {
    if (!list.length) return { de: "09:00", ate: "19:00" };
    var last = list[list.length - 1], de = Math.min(IA.toMin(last.ate), 22 * 60), ate = Math.min(de + 120, 23 * 60 + 30);
    return { de: IA.fromMin(de), ate: IA.fromMin(ate) };
  }
  function scrollTo(id) { var p = document.getElementById(id); if (p && p.scrollIntoView) p.scrollIntoView({ behavior: "smooth", block: "start" }); }

  root.addEventListener("change", function (e) {
    var t = e.target, cfg = C();
    if (t.hasAttribute("data-wf")) {
      var scope = t.getAttribute("data-scope"), list = winList(scope, t.getAttribute("data-key")), i = +t.getAttribute("data-i"), f = t.getAttribute("data-wf");
      list[i][f] = t.value; fixWin(list, i, f);
      if (scope === "wk") { cfg.semanaOk = true; touch(); }
      render();
    } else if (t.hasAttribute("data-wkopen")) {
      var dow = +t.getAttribute("data-wkopen"), s = cfg.semana[dow];
      s.aberto = t.checked;
      if (t.checked && !s.janelas.length) s.janelas = [{ de: "09:00", ate: "19:00" }];
      if (!t.checked) s.janelas = [];
      cfg.semanaOk = true; touch(); render();
    } else if (t.hasAttribute("data-dur")) {
      cfg.duracoes[decodeURIComponent(t.getAttribute("data-dur"))] = +t.value; touch("Duração guardada.", false);
    } else if (t.hasAttribute("data-rule")) {
      cfg[t.getAttribute("data-rule")] = +t.value; touch("Regra guardada.", false);
    } else if (t.hasAttribute("data-range")) {
      range[t.getAttribute("data-range")] = t.value;
    }
  });
  root.addEventListener("toggle", function (e) {
    var t = e.target; if (!t || !t.id) return;
    if (t.id === "dpHelp") open.ajuda = t.open; else if (t.id === "dpAdv") open.avancado = t.open; else if (t.id === "dpPeriodo") open.periodo = t.open;
  }, true);

  root.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("[data-a]") : null; if (!b) return;
    var a = b.getAttribute("data-a"), cfg = C(), d = b.getAttribute("data-d");
    if (a === "day") { if (sel[d]) delete sel[d]; else sel[d] = true; pendingClose = false; render(); }
    else if (a === "nav") { cursor.setMonth(cursor.getMonth() + (+b.getAttribute("data-v"))); render(); }
    else if (a === "pick") { pickDays(b.getAttribute("data-v")); render(); }
    else if (a === "clear") { sel = {}; pendingClose = false; render(); }
    else if (a === "unsel") { delete sel[d]; pendingClose = false; render(); }
    else if (a === "goto") scrollTo("dpPanel");
    else if (a === "preset") { selWins = copy(PRESETS[b.getAttribute("data-v")].wins); render(); }
    else if (a === "wadd") {
      var sc0 = b.getAttribute("data-scope"), l = winList(sc0, b.getAttribute("data-key"));
      l.push(newWin(l)); if (sc0 === "wk") { cfg.semanaOk = true; touch(); } render();
    }
    else if (a === "wdel") {
      var sc = b.getAttribute("data-scope"), key = b.getAttribute("data-key"), l2 = winList(sc, key);
      l2.splice(+b.getAttribute("data-i"), 1);
      if (sc === "wk") { if (!l2.length) cfg.semana[key].aberto = false; cfg.semanaOk = true; touch(); }
      else if (!l2.length) l2.push({ de: "09:00", ate: "19:00" });
      render();
    }
    else if (a === "apply") applyOpen();
    else if (a === "close") applyClose(false);
    else if (a === "close-yes") applyClose(true);
    else if (a === "close-no") { pendingClose = false; render(); }
    else if (a === "edit") { sel = {}; sel[d] = true; selKey = ""; pendingClose = false; render(); scrollTo("dpPanel"); }
    else if (a === "folga1") { sel = {}; sel[d] = true; selKey = ""; applyClose(false); }
    else if (a === "undo") {
      if (!undo) return;
      cfg.dias = JSON.parse(undo.dias); undo = null; touch("Alteração desfeita.", false); render();
    }
    else if (a === "wk-close-all") {
      for (var i = 0; i < 7; i++) { cfg.semana[i].aberto = false; cfg.semana[i].janelas = []; }
      cfg.semanaOk = true; touch("Semana fechada. Agora só atende nos dias que escolher no calendário.", false); render();
    }
    else if (a === "wk-keep") { cfg.semanaOk = true; touch("Horário fixo mantido.", false); render(); }
    else if (a === "range") {
      var msg = document.getElementById("dpRangeMsg");
      if (!range.from || !range.to || range.to < range.from) { msg.className = "form-msg err"; msg.textContent = "Escolha o primeiro e o último dia (o último não pode ser antes do primeiro)."; return; }
      sel = {}; var t0 = today(), x = IA.parseYmd(range.from < t0 ? t0 : range.from), end = IA.parseYmd(range.to), n = 0;
      while (x <= end && n < 400) { sel[IA.ymd(x)] = true; x = IA.addDays(x, 1); n++; }
      pendingClose = false; render();
    }
  });

  /* ---------- marcações antigas: passam a ocupar as suas horas ---------- */
  function syncOld(list) {
    if (synced) return; synced = true;
    AZ.listOcupados(today()).then(function (o) {
      if (!o.ok) return;
      var have = {}; o.list.forEach(function (x) { have[x.marc] = 1; });
      var items = [];
      list.forEach(function (m) {
        if (!m.dia || !m.hora || m.dia < today() || m.estado === "cancelada" || have[m.id]) return;
        var sl = IA.slotsFor(C(), m.servico, m.dia, IA.toMin(m.hora));
        var free = sl.filter(function (s) { return !o.list.some(function (x) { return x.id === s.id; }); });
        if (free.length) items.push({ marc: m.id, slots: free });
      });
      if (items.length) AZ.syncSlots(items);
    });
  }

  /* ---------- abrir a aba ---------- */
  function openTab() {
    if (ready) { render(); return; }
    root.innerHTML = '<p class="form-hint" id="dpLoading">A carregar a configuração… na primeira vez pode demorar alguns segundos.</p>';
    var slow = setTimeout(function () {
      var el = document.getElementById("dpLoading");
      if (el) el.innerHTML = 'A ligação está lenta, a tentar ainda… <button type="button" class="dp-add" id="dpRetry">Tentar de novo</button>';
    }, 7000);
    document.addEventListener("click", function once(ev) {
      if (ev.target && ev.target.id === "dpRetry") { document.removeEventListener("click", once); clearTimeout(slow); openTab(); }
    });
    Promise.all([IA.loadCfg(), AZ.listBookings().catch(function () { return []; })]).then(function (r) {
      clearTimeout(slow);
      bookings = r[1] || []; ready = true; render(); syncOld(bookings);
    }).catch(function (e) {
      clearTimeout(slow);
      root.innerHTML = '<p class="form-msg err" style="display:block">Não foi possível abrir a disponibilidade: ' + esc(e && (e.message || e)) + '</p>';
    });
  }
  document.querySelectorAll(".panel-tab").forEach(function (t) {
    t.addEventListener("click", function () { if (t.getAttribute("data-tab") === "disp") openTab(); });
  });
  window.InovaDispOpen = openTab;
  // a agenda avisa quando as marcações mudam (nova marcação, remarcação, apagar)
  window.InovaDispRefresh = function (list) { if (list) bookings = list; if (ready) render(); };
})();
