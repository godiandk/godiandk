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
      try { fbAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); } catch (e) {}
      backend = "firebase";
      fbAuth.onAuthStateChanged(function (user) {
        if (!user) { currentAcc = null; notify(); markReady(); return; }
        fbDb.collection("clientes").doc(user.uid).get().then(function (doc) {
          var data = doc.exists ? doc.data() : {};
          currentAcc = Object.assign({ uid: user.uid, email: user.email }, data);
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
    return fbDb.collection("clientes").doc(u.uid).get().then(function (doc) {
      currentAcc = Object.assign({ uid: u.uid, email: u.email }, doc.exists ? doc.data() : {});
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
        { stamps: acc.stamps || [], cycle: acc.cycle || 0, rewards: acc.rewards || [] }, { merge: true }
      ).then(function () { notify(); }).catch(function () {});
    }
    saveLocal(acc); notify(); return Promise.resolve();
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
    if (!acc || !acc.email) return false;
    var list = (window.INOVA_ADMIN_EMAILS || []).map(function (e) { return String(e).toLowerCase(); });
    return list.indexOf(acc.email.toLowerCase()) >= 0;
  }

  /* ---------------- Marcações ---------------- */
  var LS_BOOK = "inova_marcacoes";
  function readBookings() { try { return JSON.parse(localStorage.getItem(LS_BOOK)) || []; } catch (e) { return []; } }
  function writeBookings(l) { try { localStorage.setItem(LS_BOOK, JSON.stringify(l)); } catch (e) {} }

  function saveBooking(data) {
    var acc = current();
    var rec = {
      nome: (data.nome || (acc && acc.name) || "").trim(),
      telefone: (data.telefone || (acc && acc.phone) || "").trim(),
      email: (acc && acc.email) || "",
      servico: data.servico || "",
      dia: data.dia || "",
      hora: data.hora || "",
      observacoes: (data.observacoes || "").trim(),
      cupom: (data.cupom || "").trim(),
      clienteUid: acc ? (acc.uid || acc.phone || null) : null,
      estado: "pendente"
    };
    if (backend === "firebase") {
      if (!fbAuth.currentUser) return Promise.resolve({ error: "Inicie sessão para guardar a marcação." });
      rec.criadoEm = firebase.firestore.FieldValue.serverTimestamp();
      return fbDb.collection("marcacoes").add(rec).then(function () { return { ok: true }; })
        .catch(function (e) { return { error: fbErr(e) }; });
    }
    rec.id = "loc" + Date.now(); rec.criadoEm = new Date().toISOString();
    var l = readBookings(); l.unshift(rec); writeBookings(l);
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
    if (backend === "firebase") return fbDb.collection("marcacoes").doc(id).delete();
    writeBookings(readBookings().filter(function (m) { return m.id !== id; }));
    return Promise.resolve();
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
    saveBooking: saveBooking,
    listBookings: listBookings,
    updateBooking: updateBooking,
    deleteBooking: deleteBooking
  };
})();
