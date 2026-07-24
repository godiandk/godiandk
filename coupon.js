/* INOVA BEAUTY — Sistema de cupons (client-side)
   Formato do código: INOVA-<T><PCT>-<RAND>-<EXP AAMMDD>-<CHK>
   Ex.: INOVA-D15-8KQ2-261231-A3F9
   T = D (desconto) | A (aniversário)
   O código carrega um dígito verificador: só códigos gerados aqui validam.
   O controlo de "usado 1 vez" é registado no dispositivo que valida
   (o telemóvel/computador do estúdio, através do Painel). */
(function () {
  "use strict";

  if (window.InovaCoupon) return; // evita dupla inicialização

  var SALT = "INOVA-BEAUTY-SEGREDO-2026";
  var LS_USED = "inova_used_coupons";
  var LS_GEN = "inova_generated_coupons";

  function djb2(str) {
    var h = 5381;
    for (var i = 0; i < str.length; i++) {
      h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
    }
    return h;
  }

  function checksum(body) {
    var s = djb2(SALT + "|" + body).toString(36).toUpperCase();
    while (s.length < 4) s = "0" + s;
    return s.slice(-4);
  }

  function randToken(seed) {
    var chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    var out = "";
    if (seed !== undefined) {
      var h = djb2(SALT + "|SEED|" + seed);
      for (var i = 0; i < 4; i++) {
        out += chars[h % chars.length];
        h = Math.floor(h / chars.length) + djb2(out);
      }
    } else {
      for (var j = 0; j < 4; j++) {
        out += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    return out;
  }

  function toExp(dateStr) {
    // "2026-12-31" -> "261231"
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr || "");
    if (!m) return null;
    return m[1].slice(2) + m[2] + m[3];
  }

  function expToDate(exp) {
    var y = 2000 + parseInt(exp.slice(0, 2), 10);
    var mo = parseInt(exp.slice(2, 4), 10) - 1;
    var d = parseInt(exp.slice(4, 6), 10);
    return new Date(y, mo, d, 23, 59, 59);
  }

  function build(type, pct, expStr, seed) {
    var t = type === "aniversario" ? "A" : (type === "selo" ? "S" : "D");
    var body = t + pct + "-" + randToken(seed) + "-" + expStr;
    return "INOVA-" + body + "-" + checksum(body);
  }

  function generate(type, pct, expiryDateStr) {
    pct = parseInt(pct, 10);
    if (!(pct >= 1 && pct <= 100)) return { error: "Percentagem inválida (1–100)." };
    var exp = toExp(expiryDateStr);
    if (!exp) return { error: "Data de validade inválida." };
    var code = build(type, pct, exp);
    var gen = readList(LS_GEN);
    gen.unshift({ code: code, type: type, pct: pct, expiry: expiryDateStr, created: new Date().toISOString() });
    writeList(LS_GEN, gen.slice(0, 200));
    return { code: code, type: type, pct: pct, expiry: expiryDateStr };
  }

  /* Cupom de aniversário determinístico: mesmo telemóvel + mesmo mês
     => mesmo código (não dá para "gerar de novo" outro cupom). */
  function fmtDate(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  /* Cupom de aniversário: aparece no DIA do aniversário e dura 1 SEMANA.
     birthdate: "AAAA-MM-DD" da conta. Devolve também a janela de validade. */
  function birthdayCoupon(phone, birthdate) {
    var now = new Date(); var year = now.getFullYear();
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthdate || "");
    var bMonth = m ? parseInt(m[2], 10) - 1 : now.getMonth();
    var bDay = m ? parseInt(m[3], 10) : now.getDate();
    var bday = new Date(year, bMonth, bDay);
    var end = new Date(year, bMonth, bDay + 7); // 1 semana
    var expStr = fmtDate(end);
    var seed = "BDAY|" + String(phone).replace(/\D/g, "") + "|" + year;
    return {
      code: build("aniversario", 10, toExp(expStr), seed),
      pct: 10, expiry: expStr,
      startStr: fmtDate(bday), start: bday, endDate: end
    };
  }

  /* A janela do aniversário está ativa? (do dia do aniversário +7 dias) */
  function birthdayActive(birthdate) {
    var now = new Date(); now.setHours(0, 0, 0, 0);
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthdate || "");
    if (!m) return false;
    var bMonth = parseInt(m[2], 10) - 1, bDay = parseInt(m[3], 10);
    var bday = new Date(now.getFullYear(), bMonth, bDay); bday.setHours(0, 0, 0, 0);
    var end = new Date(now.getFullYear(), bMonth, bDay + 7); end.setHours(23, 59, 59, 0);
    return now >= bday && now <= end;
  }

  function parse(code) {
    code = String(code || "").trim().toUpperCase().replace(/\s+/g, "");
    var m = /^INOVA-([ADS])(\d{1,3})-([A-Z0-9]{4})-(\d{6})-([A-Z0-9]{4})$/.exec(code);
    if (!m) return { valid: false, reason: "Formato de código inválido." };
    var body = m[1] + m[2] + "-" + m[3] + "-" + m[4];
    if (checksum(body) !== m[5]) return { valid: false, reason: "Código inválido (verificação não confere)." };
    var pct = parseInt(m[2], 10);
    var expDate = expToDate(m[4]);
    var expired = new Date() > expDate;
    return {
      valid: true,
      code: code,
      type: m[1] === "A" ? "aniversario" : (m[1] === "S" ? "selo" : "desconto"),
      pct: pct,
      expiry: expDate,
      expired: expired,
      used: isUsed(code)
    };
  }

  /* Selo de fidelidade: código assinado que a Thayana entrega após
     cada procedimento. A cliente insere na conta e ganha 1 selo. */
  function generateStamp(expiryDateStr) {
    var exp = toExp(expiryDateStr);
    if (!exp) return { error: "Data de validade inválida." };
    var code = build("selo", 1, exp);
    var gen = readList(LS_GEN);
    gen.unshift({ code: code, type: "selo", pct: 1, expiry: expiryDateStr, created: new Date().toISOString() });
    writeList(LS_GEN, gen.slice(0, 300));
    return { code: code, expiry: expiryDateStr };
  }

  /* Prémio dos 10 selos: cupom 100% determinístico por telefone+ciclo
     (não é possível "gerar de novo" outro código para o mesmo ciclo). */
  function rewardCoupon(phone, cycle) {
    var d = new Date();
    d.setDate(d.getDate() + 60);
    var expStr = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    var seed = "REWARD|" + String(phone).replace(/\D/g, "") + "|" + cycle;
    return { code: build("desconto", 100, toExp(expStr), seed), pct: 100, expiry: expStr };
  }

  function readList(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch (e) { return []; }
  }
  function writeList(key, list) {
    try { localStorage.setItem(key, JSON.stringify(list)); } catch (e) { /* sem storage */ }
  }

  function isUsed(code) {
    return readList(LS_USED).some(function (u) { return u.code === code; });
  }

  function markUsed(code) {
    if (isUsed(code)) return false;
    var used = readList(LS_USED);
    used.unshift({ code: code, at: new Date().toISOString() });
    writeList(LS_USED, used);
    return true;
  }

  function usedList() { return readList(LS_USED); }
  function generatedList() { return readList(LS_GEN); }

  window.InovaCoupon = {
    generate: generate,
    generateStamp: generateStamp,
    rewardCoupon: rewardCoupon,
    birthdayCoupon: birthdayCoupon,
    birthdayActive: birthdayActive,
    parse: parse,
    isUsed: isUsed,
    markUsed: markUsed,
    usedList: usedList,
    generatedList: generatedList
  };
})();
