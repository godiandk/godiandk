/* INOVA BEAUTY — Configuração Firebase
   Estas chaves são públicas por design (o próprio Google confirma):
   a segurança real está nas Regras de Segurança do Firestore. */
window.INOVA_FIREBASE_CONFIG = {
  apiKey: "AIzaSyBwvMUUtyIqzFo0VOQ4OsTRHHP_kWR_cgI",
  authDomain: "inova-beauty.firebaseapp.com",
  projectId: "inova-beauty",
  storageBucket: "inova-beauty.firebasestorage.app",
  messagingSenderId: "296094956902",
  appId: "1:296094956902:web:d2cb6529edb0cf6fbc1ca7"
  // measurementId (Google Analytics) retirado de propósito: o site não usa o Analytics do Firebase.
  // Se um dia for ativado, tem de ficar atrás do consentimento (ver analytics.js).
};

/* Email(s) com acesso ao painel de administração. */
window.INOVA_ADMIN_EMAILS = ["wly.vianna@gmail.com"];
