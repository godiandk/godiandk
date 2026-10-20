/* INOVA BEAUTY — Contas de cliente
   Backend: Firebase (Authentication + Firestore) quando disponível;
   caso contrário, guarda no próprio dispositivo (localStorage).
   As senhas nunca ficam no nosso código — o Firebase trata disso;
   no modo local, guardamos apenas um hash SHA-256 com salt. */
(function () {
  "use strict";

  if (window.InovaAuth) return; // evita dupla inicialização

  var LS_ACC = "inova_accounts_v2";
  var LS_SES = "inova_session";

  var backend = "local";
  var fbAuth = null, fbDb = null;
  var currentAcc = null;
  var changeCbs = [];
  var readyResolve;
  var readyPromise = new Promise(function (res) { readyResolve = res; });
  var readyDone = false;
  function markReady() { if (!readyDone) { readyDone = true; readyResolve(currentAcc); } }

  function digits(phone) { return String(phone || "").replace(/\D/g, ""); }
  function notify() { changeCbs.forEach(function (cb) { try { cb(currentAcc); } catch (e) {} }); }

  /* ---------------- Avatar ---------------- */
  var CHARS = ["av1", "av2", "av3", "av4", "av5", "av6", "av7", "av8"];
  function charPath(id) { return "img/avatares/" + id + ".jpg"; }
  function withPrefix(path) { return (window.INOVA_PREFIX || "") + path; }
  function charList() {
    return CHARS.map(function (id) { return { id: id, path: charPath(id), url: withPrefix(charPath(id)) }; });
  }

  function defaultAvatar(gender, name) {
    var isF = gender === "F";
    var bg = "#f3ece2", fg = "#b08d57";
    if (!gender && name) {
      var letter = (name.trim()[0] || "?").toUpperCase();
      var svgL =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
        '<circle cx="50" cy="50" r="50" fill="' + fg + '"/>' +
        '<text x="50" y="50" dy=".35em" text-anchor="middle" font-family="Georgia,serif" font-size="46" fill="#fffdfa">' + letter + '</text>' +
        '</svg>';
      return "data:image/svg+xml;utf8," + encodeURIComponent(svgL);
    }
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
    if (acc.photo) return acc.photo;
    if (acc.avatarChar) return withPrefix(acc.avatarChar);
    return defaultAvatar(acc.gender || "", acc.name || "");
  }

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
          canvas.width = SIZE; canvas.height = SIZE;
          var ctx = canvas.getContext("2d");
          var side = Math.min(img.width, img.height);
          var sx = (img.width - side) / 2, sy = (img.height - side) / 2;
          ctx.drawImage(img, sx, sy, side, side, 0, 0, SIZE, SIZE);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  /* ---------------- localStorage (fallback) ---------------- */
  function readAccounts() { try { return JSON.parse(localStorage.getItem(LS_ACC)) || {}; } catch (e) { return {}; } }
  function writeAccounts(a) { try { localStorage.setItem(LS_ACC, JSON.stringify(a)); } catch (e) {} }
  function randomSalt() {
    var arr = new Uint8Array(16);
    (window.crypto && crypto.getRandomValues) ? crypto.getRandomValues(arr)
      : arr.forEach(function (_, i) { arr[i] = Math.floor(Math.random() * 256); });
    return Array.prototype.map.call(arr, function (b) { return b.toString(16).padStart(2, "0"); }).join("");
  }
  function sha256(text) {
    if (window.crypto && crypto.subtle && crypto.subtle.digest) {
      return crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)).then(function (buf) {
        return Array.prototype.map.call(new Uint8Array(buf), function (b) { return b.toString(16).padStart(2, "0"); }).join("");
      });
    }
    var h = 5381;
    for (var i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
    return Promise.resolve("fb-" + h.toString(16));
  }
  function findLocalByEmail(email) {
    var accs = readAccounts();
    for (var k in accs) if (accs[k].email && accs[k].email.toLowerCase() === String(email).toLowerCase()) return accs[k];
    return null;
  }
  function saveLocal(acc) { var accs = readAccounts(); accs[acc.phone] = acc; writeAccounts(accs); }

  /* ---------------- Firebase ---------------- */
  function initFirebase() {
    if (!window.INOVA_FIREBASE_CONFIG || !window.firebase || !firebase.auth || !firebase.firestore) return false;
    try {
      if (!firebase.apps || !firebase.apps.length) firebase.initializeApp(window.INOVA_FIREBASE_CONFIG);
      fbAuth = firebase.auth();
      fbDb = firebase.firestore();
      // No Safari/iPhone a ligação por streaming pode demorar vários segundos a falhar;
      // com isto o Firestore passa sozinho para long-polling e responde logo.
      try { if (fbDb.settings) fbDb.settings({ experimentalAutoDetectLongPolling: true, merge: true }); } catch (e) {}
      try { fbAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); } catch (e) {}
      backend = "firebase";
      fbAuth.onAuthStateChanged(function (user) {
        if (!user) { currentAcc = null; notify(); markReady(); return; }
        Promise.all([
          fbDb.collection("clientes").doc(user.uid).get(),
          fbDb.collection("admins").doc(user.uid).get().catch(function () { return { exists: false }; })
        ]).then(function (res) {
          var data = res[0].exists ? res[0].data() : {};
          currentAcc = Object.assign({ uid: user.uid, email: user.email }, data);
          currentAcc._admin = !!(res[1] && res[1].exists);
          notify(); markReady();
        }).catch(function () {
          currentAcc = { uid: user.uid, email: user.email, name: user.displayName || "" };
          notify(); markReady();
        });
      });
      return true;
    } catch (e) { return false; }
  }

  function reloadCurrent() {
    if (backend !== "firebase" || !fbAuth.currentUser) return Promise.resolve();
    var u = fbAuth.currentUser;
    var wasAdmin = currentAcc && currentAcc._admin;
    return fbDb.collection("clientes").doc(u.uid).get().then(function (doc) {
      currentAcc = Object.assign({ uid: u.uid, email: u.email }, doc.exists ? doc.data() : {});
      currentAcc._admin = wasAdmin;
      notify();
    });
  }

  function fbErr(e) {
    var c = (e && e.code) || "";
    var map = {
      "auth/email-already-in-use": "Este email já está registado. Faça login.",
      "auth/invalid-email": "Email inválido.",
      "auth/weak-password": "A senha é demasiado fraca (mínimo 6 caracteres).",
      "auth/user-not-found": "Não existe conta com este email.",
      "auth/wrong-password": "Senha incorreta.",
      "auth/invalid-credential": "Email ou senha incorretos.",
      "auth/too-many-requests": "Demasiadas tentativas. Tente novamente mais tarde.",
      "auth/network-request-failed": "Sem ligação à internet. Tente novamente.",
      "auth/configuration-not-found": "Falta ativar o login por Email/Senha no Firebase (Authentication → Sign-in method → Email/Password).",
      "auth/operation-not-allowed": "O login por Email/Senha ainda não está ativado no Firebase (Authentication → Sign-in method).",
      "auth/admin-restricted-operation": "Operação restrita. Verifique as definições de Authentication no Firebase."
    };
    return map[c] || (e && e.message) || "Ocorreu um erro. Tente novamente.";
  }

  /* ---------------- API pública ---------------- */
  function validate(data) {
    if (!data.name || !data.name.trim()) return "Indique o seu nome.";
    if (digits(data.phone).length < 9) return "Número de telemóvel inválido (mínimo 9 dígitos).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || "")) return "Indique um email válido.";
    if (!data.birth) return "Indique a sua data de nascimento.";
    if (data.gender !== "M" && data.gender !== "F") return "Selecione o sexo (Masculino ou Feminino).";
    if (!data.pass || data.pass.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
    if (data.pass !== data.pass2) return "As senhas não coincidem — verifique a confirmação.";
    return null;
  }

  function register(data) {
    var err = validate(data);
    if (err) return Promise.resolve({ error: err });

    if (backend === "firebase") {
      return fbAuth.createUserWithEmailAndPassword(data.email.trim(), data.pass).then(function (cred) {
        var acc = {
          name: data.name.trim(), email: data.email.trim(), phone: digits(data.phone),
          birth: data.birth, gender: data.gender, photo: data.photo || null,
          avatarChar: data.avatarChar || null,
          stamps: [], cycle: 0, rewards: [],
          criadoEm: firebase.firestore.FieldValue.serverTimestamp()
        };
        return cred.user.updateProfile({ displayName: acc.name }).catch(function () {}).then(function () {
          return fbDb.collection("clientes").doc(cred.user.uid).set(acc);
        }).then(function () { return reloadCurrent(); }).then(function () { return { ok: true }; });
      }).catch(function (e) { return { error: fbErr(e) }; });
    }

    // fallback local (por telemóvel)
    var phone = digits(data.phone);
    var accs = readAccounts();
    if (accs[phone]) return Promise.resolve({ error: "Este número já está a ser utilizado neste dispositivo." });
    if (findLocalByEmail(data.email)) return Promise.resolve({ error: "Este email já está associado a outra conta." });
    var salt = randomSalt();
    return sha256(salt + "|" + data.pass).then(function (hash) {
      accs[phone] = {
        name: data.name.trim(), phone: phone, email: data.email.trim(), birth: data.birth,
        gender: data.gender, photo: data.photo || null, avatarChar: data.avatarChar || null,
        salt: salt, passHash: hash,
        created: new Date().toISOString(), stamps: [], cycle: 0, rewards: []
      };
      writeAccounts(accs);
      try { localStorage.setItem(LS_SES, phone); } catch (e) {}
      currentAcc = accs[phone]; notify();
      return { ok: true };
    });
  }

  function login(email, pass) {
    if (backend === "firebase") {
      return fbAuth.signInWithEmailAndPassword(String(email).trim(), pass)
        .then(function () { return { ok: true }; })
        .catch(function (e) { return { error: fbErr(e) }; });
    }
    var acc = findLocalByEmail(email);
    if (!acc) return Promise.resolve({ error: "Não existe conta com este email neste dispositivo." });
    return sha256(acc.salt + "|" + (pass || "")).then(function (hash) {
      if (hash !== acc.passHash) return { error: "Senha incorreta." };
      try { localStorage.setItem(LS_SES, acc.phone); } catch (e) {}
      currentAcc = acc; notify();
      return { ok: true };
    });
  }

  function logout() {
    if (backend === "firebase") return fbAuth.signOut();
    try { localStorage.removeItem(LS_SES); } catch (e) {}
    currentAcc = null; notify();
    return Promise.resolve();
  }

  function current() {
    if (backend === "firebase") return currentAcc;
    // local: recuperar da sessão guardada
    if (currentAcc) return currentAcc;
    var p = null; try { p = localStorage.getItem(LS_SES); } catch (e) {}
    if (p) { currentAcc = readAccounts()[p] || null; }
    return currentAcc;
  }

  function save(acc) {
    currentAcc = acc;
    if (backend === "firebase") {
      return fbDb.collection("clientes").doc(acc.uid).set(
        { stamps: acc.stamps || [], cycle: acc.cycle || 0, rewards: acc.rewards || [], stampYear: acc.stampYear || currentYear() }, { merge: true }
      ).then(function () { notify(); }).catch(function () {});
    }
    saveLocal(acc); notify(); return Promise.resolve();
  }

  /* ---------------- Caderneta de selos (validade anual) ---------------- */
  function currentYear() { return new Date().getFullYear(); }

  // A caderneta é válida de janeiro a dezembro. Os selos não completados
  // expiram a 31/12 — no ano seguinte, recomeça do zero.
  function checkStampReset(acc) {
    if (!acc) return false;
    var y = currentYear();
    if (acc.stampYear && acc.stampYear !== y && (acc.stamps || []).length > 0) {
      acc.stamps = []; acc.stampYear = y; return true;
    }
    if (!acc.stampYear) acc.stampYear = y;
    return false;
  }

  function addStamp(code) {
    var acc = current();
    if (!acc) return Promise.resolve({ error: "Inicie sessão para juntar selos." });
    if (!window.InovaCoupon) return Promise.resolve({ error: "Sistema de selos indisponível." });
    var r = window.InovaCoupon.parse(code);
    if (!r.valid) return Promise.resolve({ error: r.reason });
    if (r.type !== "selo") return Promise.resolve({ error: "Este código não é um selo de fidelidade." });
    if (r.expired) return Promise.resolve({ error: "Este selo já expirou." });
    if (r.used || (acc.stamps || []).indexOf(r.code) >= 0) return Promise.resolve({ error: "Este selo já foi utilizado." });
    checkStampReset(acc);
    window.InovaCoupon.markUsed(r.code);
    acc.stamps = acc.stamps || [];
    acc.stamps.push(r.code);
    acc.stampYear = currentYear();
    var completed = false, reward = null;
    if (acc.stamps.length >= 10) {
      acc.cycle = (acc.cycle || 0) + 1;
      acc.stamps = [];
      var rc = window.InovaCoupon.rewardCoupon(acc.uid || acc.phone, acc.cycle);
      reward = {
        code: rc.code, expiry: rc.expiry, earned: new Date().toISOString(),
        status: "por_ativar", tipo: "Threading de Sobrancelhas GRÁTIS", cycle: acc.cycle
      };
      acc.rewards = acc.rewards || [];
      acc.rewards.push(reward);
      completed = true;
    }
    return save(acc).then(function () { return { ok: true, completed: completed, reward: reward, count: acc.stamps.length }; });
  }

  function activateReward(code) {
    var acc = current();
    if (!acc) return Promise.resolve({ error: "Sessão não iniciada." });
    var found = false;
    (acc.rewards || []).forEach(function (rw) { if (rw.code === code && rw.status === "por_ativar") { rw.status = "ativo"; found = true; } });
    if (!found) return Promise.resolve({ error: "Prémio não encontrado ou já ativado." });
    return save(acc).then(function () { return { ok: true }; });
  }

  function activeReward() {
    var acc = current();
    if (!acc) return null;
    var list = (acc.rewards || []).filter(function (rw) { return rw.status === "ativo"; });
    return list.length ? list[0] : null;
  }

  function consumeReward(code, marcacaoInfo) {
    var acc = current();
    if (!acc) return Promise.resolve({ error: "Sessão não iniciada." });
    var done = false;
    (acc.rewards || []).forEach(function (rw) {
      if (rw.code === code && rw.status === "ativo") { rw.status = "usado"; rw.usadoEm = new Date().toISOString(); rw.marcacao = marcacaoInfo || null; done = true; }
    });
    if (!done) return Promise.resolve({ error: "Prémio não disponível." });
    return save(acc).then(function () { return { ok: true }; });
  }

  function update(changes) {
    var acc = current();
    if (!acc) return Promise.resolve({ error: "Sessão não iniciada." });
    Object.assign(acc, changes);
    if (backend === "firebase") {
      var p = Promise.resolve();
      if (changes.name && fbAuth.currentUser) p = fbAuth.currentUser.updateProfile({ displayName: changes.name }).catch(function () {});
      return p.then(function () { return fbDb.collection("clientes").doc(acc.uid).set(changes, { merge: true }); })
        .then(function () { currentAcc = acc; notify(); return { ok: true }; })
        .catch(function (e) { return { error: fbErr(e) }; });
    }
    saveLocal(acc); notify(); return Promise.resolve({ ok: true });
  }

  function resetPassword(email) {
    if (backend === "firebase") {
      return fbAuth.sendPasswordResetEmail(String(email).trim())
        .then(function () { return { ok: true }; })
        .catch(function (e) { return { error: fbErr(e) }; });
    }
    return Promise.resolve({ error: "A alteração de senha por email só funciona com a base de dados online." });
  }

  function removeCurrent() {
    if (backend === "firebase") {
      var u = fbAuth.currentUser;
      if (!u) return Promise.resolve();
      var uid = u.uid;
      return fbDb.collection("clientes").doc(uid).delete().catch(function () {})
        .then(function () { return u.delete().catch(function () { return logout(); }); });
    }
    var p = null; try { p = localStorage.getItem(LS_SES); } catch (e) {}
    if (p) { var accs = readAccounts(); delete accs[p]; writeAccounts(accs); }
    logout(); return Promise.resolve();
  }

  function isAdmin(acc) {
    acc = acc || current();
    if (!acc) return false;
    if (acc._admin) return true;
    if (!acc.email) return false;
    var list = (window.INOVA_ADMIN_EMAILS || []).map(function (e) { return String(e).toLowerCase(); });
    return list.indexOf(acc.email.toLowerCase()) >= 0;
  }
  function isBootstrapAdmin(email) {
    if (!email) return false;
    var list = (window.INOVA_ADMIN_EMAILS || []).map(function (e) { return String(e).toLowerCase(); });
    return list.indexOf(String(email).toLowerCase()) >= 0;
  }

  /* ---------------- Gestão de administradores ---------------- */
  var LS_ADMINS = "inova_admins_local";
  function localAdmins() { try { return JSON.parse(localStorage.getItem(LS_ADMINS)) || []; } catch (e) { return []; } }

  function listUsers() {
    if (backend === "firebase") {
      return Promise.all([
        fbDb.collection("clientes").get(),
        fbDb.collection("admins").get().catch(function () { return { forEach: function () {} }; })
      ]).then(function (res) {
        var adm = {}; res[1].forEach(function (d) { adm[d.id] = true; });
        var arr = [];
        res[0].forEach(function (d) {
          var u = d.data();
          arr.push({
            uid: d.id, name: u.name || "", email: u.email || "", phone: u.phone || "",
            admin: !!adm[d.id] || isBootstrapAdmin(u.email),
            bootstrap: isBootstrapAdmin(u.email)
          });
        });
        arr.sort(function (a, b) { return (a.name || "").localeCompare(b.name || ""); });
        return arr;
      });
    }
    // local
    var accs = readAccounts(); var la = localAdmins(); var arr = [];
    for (var k in accs) {
      var u = accs[k];
      arr.push({ uid: u.phone, name: u.name, email: u.email, phone: u.phone,
        admin: la.indexOf((u.email || "").toLowerCase()) >= 0 || isBootstrapAdmin(u.email),
        bootstrap: isBootstrapAdmin(u.email) });
    }
    return Promise.resolve(arr);
  }

  function grantAdmin(uid, email) {
    if (backend === "firebase") {
      return fbDb.collection("admins").doc(uid).set({ email: email || "", grantedAt: firebase.firestore.FieldValue.serverTimestamp() })
        .then(function () { return { ok: true }; }).catch(function (e) { return { error: fbErr(e) }; });
    }
    var la = localAdmins(); if (la.indexOf((email || "").toLowerCase()) < 0) la.push((email || "").toLowerCase());
    try { localStorage.setItem(LS_ADMINS, JSON.stringify(la)); } catch (e) {}
    return Promise.resolve({ ok: true });
  }

  function revokeAdmin(uid, email) {
    if (backend === "firebase") {
      return fbDb.collection("admins").doc(uid).delete()
        .then(function () { return { ok: true }; }).catch(function (e) { return { error: fbErr(e) }; });
    }
    var la = localAdmins().filter(function (e) { return e !== (email || "").toLowerCase(); });
    try { localStorage.setItem(LS_ADMINS, JSON.stringify(la)); } catch (e) {}
    return Promise.resolve({ ok: true });
  }

  /* ---------------- Marcações ---------------- */
  var LS_BOOK = "inova_marcacoes";
  function readBookings() { try { return JSON.parse(localStorage.getItem(LS_BOOK)) || []; } catch (e) { return []; } }
  function writeBookings(l) { try { localStorage.setItem(LS_BOOK, JSON.stringify(l)); } catch (e) {} }

  function saveBooking(data) {
    var acc = current();
    var slots = (data.slots || []).filter(function (x) { return x && x.id && x.dia; });
    var rec = {
      nome: (data.nome || (acc && acc.name) || "").trim(),
      telefone: (data.telefone || (acc && acc.phone) || "").trim(),
      email: (acc && acc.email) || "",
      servico: data.servico || "",
      dia: data.dia || "",
      hora: data.hora || "",
      observacoes: (data.observacoes || "").trim(),
      cupom: (data.cupom || "").trim(),
      gratuito: !!data.gratuito,
      motivo: data.motivo || "",
      voucher: data.voucher || "",
      clienteUid: acc ? (acc.uid || acc.phone || null) : null,
      estado: "pendente"
    };
    if (data.manual) {            // feita pela administradora a pedido da cliente (WhatsApp, telefone…)
      rec.clienteUid = null; rec.email = ""; rec.origem = "manual"; rec.nome = (data.nome || "").trim();
    }
    if (backend === "firebase") {
      // guarda mesmo sem sessão (a regra do Firestore permite criar marcações)
      rec.criadoEm = firebase.firestore.FieldValue.serverTimestamp();
      var mref = fbDb.collection("marcacoes").doc();
      var batch = fbDb.batch();
      batch.set(mref, rec);
      // cada 15 min tomados vira um registo próprio: se alguém o ocupar primeiro,
      // a gravação inteira falha e ninguém fica com o mesmo horário
      slots.forEach(function (sl) {
        batch.set(fbDb.collection("ocupados").doc(sl.id), { dia: sl.dia, min: sl.min, marc: mref.id });
      });
      return batch.commit().then(function () { return { ok: true }; }).catch(function (e) {
        if (!slots.length || !e || e.code !== "permission-denied") return { error: fbErr(e) };
        // ou o horário foi ocupado entretanto, ou as regras ainda não têm a coleção "ocupados"
        return listOcupados(slots[0].dia).then(function (r) {
          var tomado = r.ok && r.list.some(function (o) { return slots.some(function (sl) { return sl.id === o.id; }); });
          if (tomado) return { conflito: true };
          return fbDb.collection("marcacoes").add(rec).then(function () { return { ok: true }; })
            .catch(function (e2) { return { error: fbErr(e2) }; });
        });
      });
    }
    rec.id = "loc" + Date.now(); rec.criadoEm = new Date().toISOString();
    var l = readBookings();
    var busy = {};
    l.forEach(function (m) { (m.slots || []).forEach(function (sl) { busy[sl.id] = 1; }); });
    if (slots.some(function (sl) { return busy[sl.id]; })) return Promise.resolve({ conflito: true });
    rec.slots = slots;
    l.unshift(rec); writeBookings(l);
    return Promise.resolve({ ok: true });
  }

  function listBookings() {
    if (backend === "firebase") {
      return fbDb.collection("marcacoes").get().then(function (snap) {
        var arr = []; snap.forEach(function (doc) { arr.push(Object.assign({ id: doc.id }, doc.data())); });
        arr.sort(function (a, b) { return String(a.dia + a.hora).localeCompare(String(b.dia + b.hora)); });
        return arr;
      });
    }
    var l = readBookings();
    l.sort(function (a, b) { return String(a.dia + a.hora).localeCompare(String(b.dia + b.hora)); });
    return Promise.resolve(l);
  }

  function updateBooking(id, changes) {
    if (backend === "firebase") return fbDb.collection("marcacoes").doc(id).set(changes, { merge: true });
    var l = readBookings().map(function (m) { return m.id === id ? Object.assign(m, changes) : m; });
    writeBookings(l); return Promise.resolve();
  }

  function deleteBooking(id) {
    if (backend === "firebase") {
      // liberta também as horas que esta marcação ocupava
      return fbDb.collection("ocupados").where("marc", "==", id).get()
        .catch(function () { return { forEach: function () {} }; })
        .then(function (snap) {
          var b = fbDb.batch();
          b.delete(fbDb.collection("marcacoes").doc(id));
          snap.forEach(function (d) { b.delete(d.ref); });
          return b.commit();
        });
    }
    writeBookings(readBookings().filter(function (m) { return m.id !== id; }));
    return Promise.resolve();
  }

  /* Remarcar: muda dia/hora, liberta as horas antigas e ocupa as novas (tudo numa operação) */
  function rescheduleBooking(id, data) {
    var slots = data.slots || [];
    if (backend === "firebase") {
      return fbDb.collection("ocupados").where("marc", "==", id).get()
        .catch(function () { return { forEach: function () {} }; })
        .then(function (snap) {
          var b = fbDb.batch();
          b.set(fbDb.collection("marcacoes").doc(id), { dia: data.dia, hora: data.hora }, { merge: true });
          snap.forEach(function (d) { b.delete(d.ref); });
          slots.forEach(function (sl) { b.set(fbDb.collection("ocupados").doc(sl.id), { dia: sl.dia, min: sl.min, marc: id }); });
          return b.commit();
        }).then(function () { return { ok: true }; })
        .catch(function (e) { return { error: fbErr(e) }; });
    }
    var l = readBookings().map(function (m) { if (m.id === id) { m.dia = data.dia; m.hora = data.hora; m.slots = slots; } return m; });
    writeBookings(l);
    return Promise.resolve({ ok: true });
  }

  /* ---------------- Disponibilidade (dias, horários, durações) ---------------- */
  var LS_AGENDA = "inova_agenda_cfg";

  // Leitura pública: as clientes precisam de a ver para escolher horário.
  function getAgendaCfg() {
    if (backend === "firebase") {
      return fbDb.collection("config").doc("agenda").get()
        .then(function (d) { return { ok: true, cfg: d.exists ? d.data() : null }; })
        .catch(function () { return { ok: false, cfg: null }; });
    }
    try { return Promise.resolve({ ok: true, cfg: JSON.parse(localStorage.getItem(LS_AGENDA)) || null }); }
    catch (e) { return Promise.resolve({ ok: true, cfg: null }); }
  }

  function saveAgendaCfg(cfg) {
    if (backend === "firebase") {
      return fbDb.collection("config").doc("agenda").set(cfg)
        .then(function () { return { ok: true }; })
        .catch(function (e) { return { error: fbErr(e), permissao: !!(e && e.code === "permission-denied") }; });
    }
    try { localStorage.setItem(LS_AGENDA, JSON.stringify(cfg)); } catch (e) {}
    return Promise.resolve({ ok: true });
  }

  // Horas ocupadas a partir de um dia: [{ id, dia, min, marc }]
  function listOcupados(fromDia) {
    if (backend === "firebase") {
      return fbDb.collection("ocupados").where("dia", ">=", fromDia).get().then(function (snap) {
        var arr = [];
        snap.forEach(function (d) { var x = d.data(); arr.push({ id: d.id, dia: x.dia, min: x.min, marc: x.marc }); });
        return { ok: true, list: arr };
      }).catch(function () { return { ok: false, list: [] }; });
    }
    var out = [];
    readBookings().forEach(function (m) {
      (m.slots || []).forEach(function (sl) { if (sl.dia >= fromDia) out.push({ id: sl.id, dia: sl.dia, min: sl.min, marc: m.id }); });
    });
    return Promise.resolve({ ok: true, list: out });
  }

  // Administradora: regista as horas de marcações antigas que ainda não as tinham.
  // items: [{ marc, slots:[{id,dia,min}] }]
  function syncSlots(items) {
    if (!items || !items.length) return Promise.resolve({ ok: true, n: 0 });
    if (backend === "firebase") {
      var all = [];
      items.forEach(function (it) { it.slots.forEach(function (sl) { all.push({ marc: it.marc, sl: sl }); }); });
      var chunks = [];
      for (var i = 0; i < all.length; i += 400) chunks.push(all.slice(i, i + 400));
      return chunks.reduce(function (p, ch) {
        return p.then(function () {
          var b = fbDb.batch();
          ch.forEach(function (x) { b.set(fbDb.collection("ocupados").doc(x.sl.id), { dia: x.sl.dia, min: x.sl.min, marc: x.marc }); });
          return b.commit();
        });
      }, Promise.resolve()).then(function () { return { ok: true, n: items.length }; })
        .catch(function (e) { return { error: fbErr(e) }; });
    }
    var l = readBookings().map(function (m) {
      var it = items.filter(function (x) { return x.marc === m.id; })[0];
      if (it) m.slots = it.slots;
      return m;
    });
    writeBookings(l);
    return Promise.resolve({ ok: true, n: items.length });
  }

  /* ---------------- Comunidade (feed social) ---------------- */
  var LS_POSTS = "inova_posts_local";
  function readPosts() { try { return JSON.parse(localStorage.getItem(LS_POSTS)) || []; } catch (e) { return []; } }
  function writePosts(l) { try { localStorage.setItem(LS_POSTS, JSON.stringify(l)); } catch (e) {} }

  function fileToPhoto(file) {
    return new Promise(function (resolve, reject) {
      if (!file) return reject(new Error("Sem ficheiro."));
      if (!/^image\//.test(file.type)) return reject(new Error("O ficheiro tem de ser uma imagem."));
      if (file.size > 12 * 1024 * 1024) return reject(new Error("Imagem demasiado grande (máx. 12MB)."));
      var reader = new FileReader();
      reader.onerror = function () { reject(new Error("Não foi possível ler a imagem.")); };
      reader.onload = function () {
        var img = new Image();
        img.onerror = function () { reject(new Error("Ficheiro de imagem inválido.")); };
        img.onload = function () {
          var MAX = 720;
          var w = img.width, h = img.height;
          if (w > h && w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
          else if (h >= w && h > MAX) { w = Math.round(w * MAX / h); h = MAX; }
          var canvas = document.createElement("canvas");
          canvas.width = w; canvas.height = h;
          canvas.getContext("2d").drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.68));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function createPost(data) {
    var acc = current();
    if (!acc) return Promise.resolve({ error: "Inicie sessão para publicar." });
    if (!data.foto) return Promise.resolve({ error: "Escolha uma foto para publicar." });
    var post = {
      autorUid: acc.uid || acc.phone, autorNome: acc.name || "Cliente",
      autorAvatar: avatarUrl(acc), foto: data.foto,
      descricao: (data.descricao || "").trim(), servico: data.servico || "",
      likes: []
    };
    if (backend === "firebase") {
      post.criadoEm = firebase.firestore.FieldValue.serverTimestamp();
      return fbDb.collection("publicacoes").add(post).then(function () { return { ok: true }; })
        .catch(function (e) { return { error: fbErr(e) }; });
    }
    post.id = "p" + Date.now(); post.criadoEm = new Date().toISOString();
    var l = readPosts(); l.unshift(post); writePosts(l);
    return Promise.resolve({ ok: true });
  }

  function listPosts() {
    if (backend === "firebase") {
      return fbDb.collection("publicacoes").orderBy("criadoEm", "desc").limit(60).get().then(function (snap) {
        var arr = []; snap.forEach(function (d) { arr.push(Object.assign({ id: d.id }, d.data())); });
        return arr;
      });
    }
    return Promise.resolve(readPosts());
  }

  function toggleLike(postId) {
    var acc = current(); if (!acc) return Promise.resolve({ error: "Inicie sessão." });
    var uid = acc.uid || acc.phone;
    if (backend === "firebase") {
      var ref = fbDb.collection("publicacoes").doc(postId);
      return ref.get().then(function (doc) {
        var likes = (doc.data() && doc.data().likes) || [];
        var op = likes.indexOf(uid) >= 0
          ? firebase.firestore.FieldValue.arrayRemove(uid)
          : firebase.firestore.FieldValue.arrayUnion(uid);
        return ref.update({ likes: op });
      }).then(function () { return { ok: true }; }).catch(function (e) { return { error: fbErr(e) }; });
    }
    var l = readPosts().map(function (p) {
      if (p.id === postId) { p.likes = p.likes || []; var i = p.likes.indexOf(uid); if (i >= 0) p.likes.splice(i, 1); else p.likes.push(uid); }
      return p;
    });
    writePosts(l); return Promise.resolve({ ok: true });
  }

  function deletePost(postId) {
    if (backend === "firebase") return fbDb.collection("publicacoes").doc(postId).delete();
    writePosts(readPosts().filter(function (p) { return p.id !== postId; }));
    return Promise.resolve();
  }

  function addComment(postId, texto) {
    var acc = current(); if (!acc) return Promise.resolve({ error: "Inicie sessão." });
    texto = (texto || "").trim(); if (!texto) return Promise.resolve({ error: "Escreva um comentário." });
    var c = { autorUid: acc.uid || acc.phone, autorNome: acc.name || "Cliente", texto: texto };
    if (backend === "firebase") {
      c.criadoEm = firebase.firestore.FieldValue.serverTimestamp();
      return fbDb.collection("publicacoes").doc(postId).collection("comentarios").add(c)
        .then(function () { return { ok: true }; }).catch(function (e) { return { error: fbErr(e) }; });
    }
    c.id = "c" + Date.now(); c.criadoEm = new Date().toISOString();
    var l = readPosts().map(function (p) { if (p.id === postId) { p.comentarios = p.comentarios || []; p.comentarios.push(c); } return p; });
    writePosts(l); return Promise.resolve({ ok: true });
  }

  function listComments(postId) {
    if (backend === "firebase") {
      return fbDb.collection("publicacoes").doc(postId).collection("comentarios").orderBy("criadoEm", "asc").get().then(function (snap) {
        var arr = []; snap.forEach(function (d) { arr.push(Object.assign({ id: d.id }, d.data())); });
        return arr;
      });
    }
    var p = readPosts().filter(function (x) { return x.id === postId; })[0];
    return Promise.resolve((p && p.comentarios) || []);
  }

  function onChange(cb) {
    changeCbs.push(cb);
    // dispara já com o estado atual (após ready)
    readyPromise.then(function () { try { cb(currentAcc); } catch (e) {} });
    return function () { changeCbs = changeCbs.filter(function (f) { return f !== cb; }); };
  }

  // arranque
  if (!initFirebase()) {
    backend = "local";
    current();
    markReady();
  }

  window.InovaAuth = {
    backend: function () { return backend; },
    ready: readyPromise,
    onChange: onChange,
    register: register,
    login: login,
    logout: logout,
    current: current,
    save: save,
    update: update,
    resetPassword: resetPassword,
    removeCurrent: removeCurrent,
    isAdmin: isAdmin,
    avatarUrl: avatarUrl,
    defaultAvatar: defaultAvatar,
    fileToAvatar: fileToAvatar,
    charList: charList,
    checkStampReset: checkStampReset,
    addStamp: addStamp,
    activateReward: activateReward,
    activeReward: activeReward,
    consumeReward: consumeReward,
    saveBooking: saveBooking,
    listBookings: listBookings,
    updateBooking: updateBooking,
    deleteBooking: deleteBooking,
    rescheduleBooking: rescheduleBooking,
    getAgendaCfg: getAgendaCfg,
    saveAgendaCfg: saveAgendaCfg,
    listOcupados: listOcupados,
    syncSlots: syncSlots,
    listUsers: listUsers,
    grantAdmin: grantAdmin,
    revokeAdmin: revokeAdmin,
    fileToPhoto: fileToPhoto,
    createPost: createPost,
    listPosts: listPosts,
    toggleLike: toggleLike,
    deletePost: deletePost,
    addComment: addComment,
    listComments: listComments
  };
})();
