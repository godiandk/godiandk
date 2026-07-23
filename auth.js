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
    if (data.gender !== "M" && data.gender !== "F") return Promise.resolve({ error: "Selecione o sexo (Masculino ou Feminino)." });
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
        gender: data.gender,
        photo: data.photo || null,
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

  /* Avatar padrão (silhueta), usado quando a cliente não envia foto */
  function defaultAvatar(gender) {
    var isF = gender === "F";
    var bg = "#f3ece2", fg = "#b08d57";
    var hair = isF
      ? '<path d="M50 16C33 16 21 29 21 46v11c0 4 2 8 6 10l2-15c1-9 10-16 21-16s20 7 21 16l2 15c4-2 6-6 6-10V46C79 29 67 16 50 16z" fill="' + fg + '"/>'
      : "";
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
      '<circle cx="50" cy="50" r="50" fill="' + bg + '"/>' +
      hair +
      '<circle cx="50" cy="42" r="17" fill="' + fg + '"/>' +
      '<path d="M50 62c-19 0-32 13-32 28v10h64V90c0-15-13-28-32-28z" fill="' + fg + '"/>' +
      '</svg>';
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  }

  function avatarUrl(acc) {
    if (!acc) return defaultAvatar("M");
    return acc.photo || defaultAvatar(acc.gender || "M");
  }

  /* Lê um ficheiro de imagem escolhido pela cliente, recorta ao centro
     e reduz para um avatar quadrado leve (guardável no dispositivo). */
  function fileToAvatar(file) {
    return new Promise(function (resolve, reject) {
      if (!file) return resolve(null);
      if (!/^image\//.test(file.type)) return reject(new Error("O ficheiro tem de ser uma imagem."));
      if (file.size > 8 * 1024 * 1024) return reject(new Error("Imagem demasiado grande (máx. 8MB)."));
      var reader = new FileReader();
      reader.onerror = function () { reject(new Error("Não foi possível ler a imagem.")); };
      reader.onload = function () {
        var img = new Image();
        img.onerror = function () { reject(new Error("Ficheiro de imagem inválido.")); };
        img.onload = function () {
          var SIZE = 200;
          var canvas = document.createElement("canvas");
          canvas.width = SIZE;
          canvas.height = SIZE;
          var ctx = canvas.getContext("2d");
          var side = Math.min(img.width, img.height);
          var sx = (img.width - side) / 2;
          var sy = (img.height - side) / 2;
          ctx.drawImage(img, sx, sy, side, side, 0, 0, SIZE, SIZE);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  window.InovaAuth = {
    register: register,
    login: login,
    logout: logout,
    current: current,
    save: save,
    removeCurrent: removeCurrent,
    avatarUrl: avatarUrl,
    defaultAvatar: defaultAvatar,
    fileToAvatar: fileToAvatar
  };
})();
