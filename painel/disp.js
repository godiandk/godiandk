/* ============================================================
   INOVA BEAUTY — Painel: aba "Disponibilidade"
   A Thayana define aqui em que dias e horas atende, bloqueia
   dias (folgas, férias) e diz quanto tempo demora cada serviço.
   Tudo é guardado automaticamente e as clientes passam a ver
   só os horários livres no formulário de marcação.
   ============================================================ */
(function () {
  "use strict";
  var AZ = window.InovaAuth, IA = window.InovaAgenda;
  var root = document.getElementById("dispRoot");
  if (!AZ || !IA || !root) return;

  var cursor = new Date(); cursor.setDate(1); cursor.setHours(0, 0, 0, 0);
  var selDay = null, bookings = [], range = { from: "", to: "" };
  var timer = null, status = { cls: "wait", text: "" }, ready = false, synced = false;
  var WEEK = [1, 2, 3, 4, 5, 6, 0];

  function C() { return IA.state.cfg; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function today() { return IA.ymd(new Date()); }
  function dfmt(d) { var a = d.split("-"); return a[2] + "/" + a[1]; }
  function longDay(d) { var x = IA.parseYmd(d); return IA.WD[x.getDay()] + ", " + x.getDate() + " de " + IA.MO[x.getMonth()]; }
  function winStr(list) { return list.map(function (w) { return w.de + "–" + w.ate; }).join(" · "); }

  /* ---------- guardar (automático) ---------- */
  function setStatus(cls, text) {
    status = { cls: cls, text: text };
    var el = document.getElementById("dpStatus");
    if (el) { el.className = "dp-status " + cls; el.innerHTML = text; }
  }
  function prune() {
    // remove exceções de dias que já passaram e janelas inválidas
    var cfg = C(), t = today(), out = IA.copy(cfg);
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
  function touch() {
    setStatus("wait", "A guardar…");
    clearTimeout(timer);
    timer = setTimeout(function () {
      AZ.saveAgendaCfg(prune()).then(function (r) {
        if (r && r.error) {
          setStatus("err", r.permissao
            ? "⚠️ <strong>Sem permissão para guardar.</strong> Falta publicar as novas regras do Firestore (coleções <em>config</em> e <em>ocupados</em>). As alterações <strong>não</strong> estão a ser aplicadas."
            : "⚠️ Não foi possível guardar: " + esc(r.error));
          return;
        }
        setStatus("ok", "✅ Guardado — as clientes já veem estas alterações.");
      });
    }, 500);
  }

  /* ---------- editor de intervalos ---------- */
  function timeOpts(sel) {
    var vals = [], m;
    for (m = 6 * 60; m <= 23 * 60 + 30; m += 30) vals.push(IA.fromMin(m));
    if (sel && vals.indexOf(sel) < 0) { vals.push(sel); vals.sort(); }
    return vals.map(function (v) { return '<option value="' + v + '"' + (v === sel ? " selected" : "") + ">" + v + "</option>"; }).join("");
  }
  function winList(scope, key) {
    var cfg = C();
    return scope === "wk" ? cfg.semana[key].janelas : cfg.dias[key].janelas;
  }
  function winsHtml(list, scope, key) {
    var h = '<div class="dp-wins">';
    list.forEach(function (w, i) {
      var at = ' data-scope="' + scope + '" data-key="' + key + '" data-i="' + i + '"';
      h += '<div class="dp-win"><select data-wf="de"' + at + ' aria-label="Início">' + timeOpts(w.de) + '</select>' +
        '<span>até</span><select data-wf="ate"' + at + ' aria-label="Fim">' + timeOpts(w.ate) + '</select>' +
        '<button type="button" class="dp-x" data-wdel' + at + ' aria-label="Remover intervalo" title="Remover">✕</button></div>';
    });
    return h + '</div>';
  }

  /* ---------- secções ---------- */
  function weekHtml() {
    var cfg = C(), h = '<div class="form-card dp-card"><h3>Horário semanal</h3>' +
      '<p class="form-hint">Os dias e horas em que costuma atender. Pode pôr mais do que um intervalo por dia (ex.: de manhã e ao fim da tarde).</p><div class="dp-week">';
    WEEK.forEach(function (dow) {
      var s = cfg.semana[dow], open = s.aberto !== false;
      h += '<div class="dp-day' + (open ? "" : " off") + '"><label class="dp-sw"><input type="checkbox" data-wkopen="' + dow + '"' + (open ? " checked" : "") + '> <span>' + IA.WD[dow] + '</span></label>';
      if (open) {
        h += winsHtml(s.janelas, "wk", dow) + '<button type="button" class="dp-add" data-wadd data-scope="wk" data-key="' + dow + '">+ intervalo</button>';
      } else h += '<div class="dp-closed">Não atendo neste dia</div><span></span>';
      h += '</div>';
    });
    return h + '</div></div>';
  }

  function bookedOn(d) {
    return bookings.filter(function (m) { return m.dia === d && m.estado !== "cancelada"; }).length;
  }
  function calHtml() {
    var cfg = C(), y = cursor.getFullYear(), mo = cursor.getMonth(), t = today();
    var first = new Date(y, mo, 1), lead = (first.getDay() + 6) % 7, days = new Date(y, mo + 1, 0).getDate();
    var h = '<div class="form-card dp-card"><h3>Dias específicos</h3>' +
      '<p class="form-hint">Toque num dia para o bloquear (folga, compromisso) ou definir um horário diferente do habitual.</p>' +
      '<div class="dp-cal-head"><button type="button" class="ag-navbtn" data-nav="-1" aria-label="Mês anterior">‹</button><strong>' + IA.MO[mo] + ' ' + y +
      '</strong><button type="button" class="ag-navbtn" data-nav="1" aria-label="Mês seguinte">›</button></div><div class="dp-cal">';
    ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"].forEach(function (n) { h += '<div class="dp-dow">' + n + '</div>'; });
    for (var i = 0; i < lead; i++) h += '<button type="button" class="dp-cell blank" disabled tabindex="-1"></button>';
    for (var d = 1; d <= days; d++) {
      var ds = IA.ymd(new Date(y, mo, d)), mode = IA.dayMode(cfg, ds), wins = IA.windowsFor(cfg, ds);
      var cls = "dp-cell", sub = "";
      if (mode === "fechado") { cls += " blocked"; sub = "bloqueado"; }
      else if (mode === "especial") { cls += " special"; sub = wins.map(function (w) { return IA.fromMin(w.de).replace(":00", "h") + "–" + IA.fromMin(w.ate).replace(":00", "h"); }).join(" "); }
      else if (!wins.length) { cls += " closed"; sub = "fechado"; }
      if (ds === t) cls += " today";
      if (ds === selDay) cls += " sel";
      var n = bookedOn(ds);
      h += '<button type="button" class="' + cls + '" data-day="' + ds + '"' + (ds < t ? " disabled" : "") + ' aria-label="' + longDay(ds) + '">' +
        '<span class="dp-n">' + d + '</span><span class="dp-t">' + esc(sub) + '</span>' + (n ? '<span class="dp-dot" title="' + n + ' marcação(ões)"></span>' : "") + '</button>';
    }
    h += '</div><div class="dp-legend"><span><i style="background:#fff"></i>disponível</span><span><i style="background:#ece3d4"></i>sem atendimento</span>' +
      '<span><i style="background:#f6e3e3"></i>bloqueado</span><span><i style="background:#fff3da"></i>horário especial</span><span><i style="background:var(--gold)"></i>tem marcações</span></div>';
    if (selDay) h += dayEditorHtml(selDay);
    return h + '</div>';
  }

  function dayEditorHtml(d) {
    var cfg = C(), mode = IA.dayMode(cfg, d), weekly = IA.weeklyWindows(cfg, d), n = bookedOn(d);
    var normalTxt = weekly.length ? "Horário normal (" + winStr(weekly) + ")" : "Normal (sem atendimento)";
    var h = '<div class="dp-editor"><h4>' + longDay(d) + '</h4><div class="dp-seg">' +
      '<button type="button" data-mode="normal" class="' + (mode === "normal" ? "on" : "") + '">' + esc(normalTxt) + '</button>' +
      '<button type="button" data-mode="fechado" class="' + (mode === "fechado" ? "on" : "") + '">🚫 Indisponível o dia todo</button>' +
      '<button type="button" data-mode="especial" class="' + (mode === "especial" ? "on" : "") + '">🕐 Horário especial</button></div>';
    if (mode === "especial") {
      h += winsHtml(cfg.dias[d].janelas, "dy", d) + '<button type="button" class="dp-add" data-wadd data-scope="dy" data-key="' + d + '">+ intervalo</button>';
    }
    if (n && mode === "fechado") h += '<p class="dp-warn">⚠️ Já tem ' + n + (n === 1 ? " marcação" : " marcações") + ' neste dia. Bloquear não as cancela — avise as clientes se necessário.</p>';
    return h + '</div>';
  }

  function periodHtml() {
    var cfg = C(), t = today(), keys = Object.keys(cfg.dias).filter(function (k) { return k >= t; }).sort();
    var chips = [], i = 0;
    while (i < keys.length) {
      var k = keys[i], e = cfg.dias[k];
      if (e.aberto === false) {
        var j = i;
        while (j + 1 < keys.length && cfg.dias[keys[j + 1]].aberto === false &&
          IA.ymd(IA.addDays(IA.parseYmd(keys[j]), 1)) === keys[j + 1]) j++;
        var span = j - i + 1;
        chips.push('<span class="dp-chip blk">🚫 ' + (span > 1 ? dfmt(keys[i]) + " a " + dfmt(keys[j]) + " (" + span + " dias)" : dfmt(k)) +
          '<button type="button" class="dp-x" data-revert="' + keys[i] + '|' + keys[j] + '" aria-label="Voltar ao normal" title="Voltar ao normal">✕</button></span>');
        i = j + 1;
      } else {
        chips.push('<span class="dp-chip">🕐 ' + dfmt(k) + " · " + esc(winStr(e.janelas)) +
          '<button type="button" class="dp-x" data-revert="' + k + '|' + k + '" aria-label="Voltar ao normal" title="Voltar ao normal">✕</button></span>');
        i++;
      }
    }
    return '<div class="form-card dp-card"><h3>Bloquear um período</h3><p class="form-hint">Férias, viagem ou vários dias seguidos: escolha o primeiro e o último dia.</p>' +
      '<div class="dp-range"><label>De<input type="date" data-range="from" value="' + esc(range.from) + '" min="' + t + '"></label>' +
      '<label>Até<input type="date" data-range="to" value="' + esc(range.to) + '" min="' + t + '"></label>' +
      '<button type="button" class="btn btn-gold" data-period="block" style="padding:.55rem 1.2rem">🚫 Bloquear</button>' +
      '<button type="button" class="btn btn-outline" data-period="free" style="padding:.55rem 1.2rem">Desbloquear</button></div>' +
      '<div class="form-msg" id="dpPeriodMsg"></div>' +
      (chips.length ? '<p class="form-hint" style="margin:1rem 0 0">Alterações previstas:</p><div class="dp-chips">' + chips.join("") + '</div>' : '') + '</div>';
  }

  function durHtml() {
    var cfg = C(), h = '<div class="form-card dp-card"><h3>Duração dos serviços</h3>' +
      '<p class="form-hint">Quanto tempo reserva para cada serviço. É isto que decide que horários aparecem às clientes (um serviço de 2h não é oferecido às 18:30 se fecha às 19:00).</p><div class="dp-dur">';
    IA.SERVICOS.forEach(function (s) {
      var cur = IA.durationFor(cfg, s[0]), opts = "", seen = false, m;
      for (m = 15; m <= 300; m += 15) { if (m === cur) seen = true; opts += '<option value="' + m + '"' + (m === cur ? " selected" : "") + ">" + IA.fmtDur(m) + "</option>"; }
      if (!seen) opts += '<option value="' + cur + '" selected>' + IA.fmtDur(cur) + "</option>";
      h += '<div class="dp-durrow"><span>' + esc(s[0]) + '</span><select class="dp-sel" data-dur="' + encodeURIComponent(s[0]) + '">' + opts + '</select></div>';
    });
    return h + '</div></div>';
  }

  function sel(name, value, opts) {
    return '<select class="dp-sel" data-rule="' + name + '">' + opts.map(function (o) {
      return '<option value="' + o[0] + '"' + (+o[0] === +value ? " selected" : "") + ">" + o[1] + "</option>";
    }).join("") + '</select>';
  }
  function rulesHtml() {
    var c = C();
    return '<div class="form-card dp-card"><h3>Regras gerais</h3><div class="dp-rules">' +
      '<label>Horários oferecidos de…' + sel("passo", c.passo, [[15, "15 em 15 minutos"], [30, "30 em 30 minutos"], [60, "1 em 1 hora"]]) + '</label>' +
      '<label>Pausa entre clientes' + sel("buffer", c.buffer, [[0, "Sem pausa"], [15, "15 minutos"], [30, "30 minutos"]]) + '</label>' +
      '<label>Antecedência mínima para marcar' + sel("antecedenciaH", c.antecedenciaH, [[0, "Sem mínimo"], [1, "1 hora"], [2, "2 horas"], [3, "3 horas"], [6, "6 horas"], [12, "12 horas"], [24, "1 dia"], [48, "2 dias"], [72, "3 dias"]]) + '</label>' +
      '<label>Aceitar marcações até' + sel("horizonte", c.horizonte, [[14, "2 semanas à frente"], [30, "1 mês à frente"], [60, "2 meses à frente"], [90, "3 meses à frente"], [180, "6 meses à frente"], [365, "1 ano à frente"]]) + '</label>' +
      '</div></div>';
  }

  function render() {
    var warn = IA.state.lida ? "" :
      '<p class="form-msg err" style="display:block">Não foi possível ler a configuração guardada (as regras do Firestore ainda não incluem a coleção <em>config</em>). A mostrar os valores habituais.</p>';
    root.innerHTML = '<div id="dpStatus" class="dp-status ' + status.cls + '">' + (status.text || "As alterações guardam-se automaticamente.") + '</div>' + warn +
      weekHtml() + calHtml() + periodHtml() + durHtml() + rulesHtml();
  }

  /* ---------- eventos ---------- */
  function fixWin(list, i, f) {
    var w = list[i];
    if (IA.toMin(w.de) >= IA.toMin(w.ate)) {
      if (f === "de") w.ate = IA.fromMin(Math.min(IA.toMin(w.de) + 30, 23 * 60 + 30));
      else w.de = IA.fromMin(Math.max(IA.toMin(w.ate) - 30, 6 * 60));
    }
  }
  root.addEventListener("change", function (e) {
    var t = e.target, cfg = C();
    if (t.hasAttribute("data-wf")) {
      var list = winList(t.getAttribute("data-scope"), t.getAttribute("data-key")), i = +t.getAttribute("data-i"), f = t.getAttribute("data-wf");
      list[i][f] = t.value; fixWin(list, i, f); touch(); render();
    } else if (t.hasAttribute("data-wkopen")) {
      var dow = +t.getAttribute("data-wkopen"), s = cfg.semana[dow];
      s.aberto = t.checked;
      if (t.checked && !s.janelas.length) s.janelas = [{ de: "09:00", ate: "19:00" }];
      touch(); render();
    } else if (t.hasAttribute("data-dur")) {
      cfg.duracoes[decodeURIComponent(t.getAttribute("data-dur"))] = +t.value; touch();
    } else if (t.hasAttribute("data-rule")) {
      cfg[t.getAttribute("data-rule")] = +t.value; touch();
    } else if (t.hasAttribute("data-range")) {
      range[t.getAttribute("data-range")] = t.value;
    }
  });

  function newWin(list) {
    if (!list.length) return { de: "09:00", ate: "19:00" };
    var last = list[list.length - 1], de = Math.min(IA.toMin(last.ate), 22 * 60), ate = Math.min(de + 120, 23 * 60 + 30);
    return { de: IA.fromMin(de), ate: IA.fromMin(ate) };
  }
  function setMode(d, mode) {
    var cfg = C();
    if (mode === "normal") delete cfg.dias[d];
    else if (mode === "fechado") cfg.dias[d] = { aberto: false };
    else {
      var cur = IA.windowsFor(cfg, d).map(function (w) { return { de: IA.fromMin(w.de), ate: IA.fromMin(w.ate) }; });
      cfg.dias[d] = { aberto: true, janelas: cur.length ? cur : [{ de: "09:00", ate: "19:00" }] };
    }
  }
  function eachDay(from, to, fn) {
    var a = IA.parseYmd(from), b = IA.parseYmd(to), n = 0;
    while (a <= b && n < 400) { fn(IA.ymd(a)); a = IA.addDays(a, 1); n++; }
    return n;
  }

  root.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("button") : null; if (!b) return;
    var cfg = C();
    if (b.hasAttribute("data-wadd")) {
      var list = winList(b.getAttribute("data-scope"), b.getAttribute("data-key")); list.push(newWin(list)); touch(); render();
    } else if (b.hasAttribute("data-wdel")) {
      var sc = b.getAttribute("data-scope"), key = b.getAttribute("data-key"), l2 = winList(sc, key);
      l2.splice(+b.getAttribute("data-i"), 1);
      if (!l2.length) { if (sc === "wk") cfg.semana[key].aberto = false; else cfg.dias[key] = { aberto: false }; }
      touch(); render();
    } else if (b.hasAttribute("data-nav")) {
      cursor.setMonth(cursor.getMonth() + (+b.getAttribute("data-nav"))); render();
    } else if (b.hasAttribute("data-day")) {
      selDay = selDay === b.getAttribute("data-day") ? null : b.getAttribute("data-day"); render();
    } else if (b.hasAttribute("data-mode")) {
      setMode(selDay, b.getAttribute("data-mode")); touch(); render();
    } else if (b.hasAttribute("data-revert")) {
      var p = b.getAttribute("data-revert").split("|"); eachDay(p[0], p[1], function (d) { delete cfg.dias[d]; }); touch(); render();
    } else if (b.hasAttribute("data-period")) {
      var msg = document.getElementById("dpPeriodMsg");
      if (!range.from || !range.to || range.to < range.from) { msg.className = "form-msg err"; msg.textContent = "Escolha o primeiro e o último dia (o último não pode ser antes do primeiro)."; return; }
      var block = b.getAttribute("data-period") === "block", from = range.from < today() ? today() : range.from;
      var n = eachDay(from, range.to, function (d) { if (block) cfg.dias[d] = { aberto: false }; else delete cfg.dias[d]; });
      range = { from: "", to: "" }; touch(); render();
      var m2 = document.getElementById("dpPeriodMsg"); m2.className = "form-msg ok"; m2.textContent = (block ? "Bloqueados " : "Desbloqueados ") + n + (n === 1 ? " dia." : " dias.");
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
  function open() {
    if (!ready) root.innerHTML = '<p class="form-hint">A carregar…</p>';
    Promise.all([IA.loadCfg(), AZ.listBookings().catch(function () { return []; })]).then(function (r) {
      bookings = r[1] || []; ready = true; render(); syncOld(bookings);
    });
  }
  document.querySelectorAll(".panel-tab").forEach(function (t) {
    t.addEventListener("click", function () { if (t.getAttribute("data-tab") === "disp") open(); });
  });
  window.InovaDispOpen = open;
})();
