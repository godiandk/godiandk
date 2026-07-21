/* INOVA BEAUTY — Contas de cliente (armazenadas neste dispositivo)
   Segurança: a senha nunca é guardada — apenas o hash SHA-256 com
   salt aleatório (criptografia do navegador, WebCrypto). */
(function () {
  "use strict";

  var LS_ACC = "inova_accounts_v2";
  var LS_SES = "inova_session";

  function readAccounts() {
    try { return JSON.parse(localStorage.getItem(LS_ACC)) || {}; } catch (e) { return {}; }
  }
  function writeAccounts(a) {
    try { localStorage.setItem(LS_ACC, JSON.stringify(a)); } catch (e) {}
  }
  function digits(phone) { return String(phone || "").replace(/\D/g, ""); }

  function randomSalt() {
    var arr = new Uint8Array(16);
    (window.crypto || {}).getRandomValues ? crypto.getRandomValues(arr) : arr.forEach(function (_, i) { arr[i] = Math.floor(Math.random() * 256); });
    return Array.prototype.map.call(arr, function (b) { return b.toString(16).padStart(2, "0"); }).join("");
  }

  function sha256(text) {
    if (window.crypto && crypto.subtle && crypto.subtle.digest) {
      return crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)).then(function (buf) {
        return Array.prototype.map.call(new Uint8Array(buf), function (b) { return b.toString(16).padStart(2, "0"); }).join("");
      });
    }
    // reserva (ambientes sem WebCrypto)
    var h = 5381;
    for (var i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
    return Promise.resolve("fb-" + h.toString(16));
  }

  function maskEmail(email) {
    if (!email || email.indexOf("@") < 0) return "—";
    var p = email.split("@");
    var u = p[0];
    return (u.length <= 2 ? u[0] + "*" : u.slice(0, 2) + "***") + "@" + p[1];
  }

  function register(data) {
    var phone = digits(data.phone);
    if (!data.name || !data.name.trim()) return Promise.resolve({ error: "Indique o seu nome." });
    if (phone.length < 9) return Promise.resolve({ error: "Número de telemóvel inválido (mínimo 9 dígitos)." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || "")) return Promise.resolve({ error: "Indique um email válido." });
    if (!data.birth) return Promise.resolve({ error: "Indique a sua data de nascimento." });
    if (!data.pass || data.pass.length < 6) return Promise.resolve({ error: "A senha deve ter pelo menos 6 caracteres." });
    if (data.pass !== data.pass2) return Promise.resolve({ error: "As senhas não coincidem — verifique a confirmação." });

    var accs = readAccounts();
    if (accs[phone]) {
      return Promise.resolve({ error: "Este número de telemóvel já está a ser utilizado na conta com o email " + maskEmail(accs[phone].email) + ". Faça login ou use outro número." });
    }
    for (var k in accs) {
      if (accs[k].email && accs[k].email.toLowerCase() === data.email.toLowerCase()) {
        return Promise.resolve({ error: "Este email já está associado a outra conta." });
      }
    }
    var salt = randomSalt();
    return sha256(salt + "|" + data.pass).then(function (hash) {
      accs[phone] = {
        name: data.name.trim(),
        phone: phone,
        email: data.email.trim(),
        birth: data.birth,
        salt: salt,
        passHash: hash,
        created: new Date().toISOString(),
        stamps: [],
        cycle: 0,
        rewards: []
      };
      writeAccounts(accs);
      try { localStorage.setItem(LS_SES, phone); } catch (e) {}
      return { ok: true, account: accs[phone] };
    });
  }

  function login(phone, pass) {
    var p = digits(phone);
    var accs = readAccounts();
    var acc = accs[p];
    if (!acc) return Promise.resolve({ error: "Não existe conta com este número neste dispositivo. Crie a sua conta." });
    return sha256(acc.salt + "|" + (pass || "")).then(function (hash) {
      if (hash !== acc.passHash) return { error: "Senha incorreta." };
      try { localStorage.setItem(LS_SES, p); } catch (e) {}
      return { ok: true, account: acc };
    });
  }

  function logout() { try { localStorage.removeItem(LS_SES); } catch (e) {} }

  function current() {
    var p = null;
    try { p = localStorage.getItem(LS_SES); } catch (e) {}
    if (!p) return null;
    return readAccounts()[p] || null;
  }

  function save(acc) {
    var accs = readAccounts();
    accs[acc.phone] = acc;
    writeAccounts(accs);
  }

  function removeCurrent() {
    var p = null;
    try { p = localStorage.getItem(LS_SES); } catch (e) {}
    if (!p) return;
    var accs = readAccounts();
    delete accs[p];
    writeAccounts(accs);
    logout();
  }

  window.InovaAuth = {
    register: register,
    login: login,
    logout: logout,
    current: current,
    save: save,
    removeCurrent: removeCurrent
  };
})();
