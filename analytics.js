/* ============================================================
   INOVA BEAUTY — Medição para anúncios (Google Ads + Meta/Facebook)
   ------------------------------------------------------------
   ESTADO ATUAL: DESLIGADO. Enquanto os IDs abaixo tiverem os valores de
   exemplo ("G-XXXX..." / "000..."), este ficheiro não carrega nada, não
   guarda nada no dispositivo e não mostra nenhum aviso.

   COMO ATIVAR (2 passos, demora 1 minuto):

   1) Google Analytics 4 (grátis) → analytics.google.com
      Crie uma propriedade, copie o "ID de medição" (começa por G-)
      e cole-o abaixo em GA4_ID.

   2) Meta Pixel (grátis) → business.facebook.com → Gestor de Eventos
      Crie um Pixel, copie o número (15-16 dígitos)
      e cole-o abaixo em META_PIXEL_ID.

   RGPD / Lei 41/2004: assim que um dos IDs for real, o site passa a mostrar
   um aviso com os botões "Aceitar" e "Recusar" (com o mesmo destaque) e
   NENHUM script de medição é carregado antes de a pessoa aceitar.
   A escolha fica guardada neste navegador (chave "inova-consent") e pode
   ser mudada a qualquer momento em "Preferências de cookies", no rodapé.
   Ao ativar, atualize também a Política de Cookies e a de Privacidade.
   ============================================================ */

var GA4_ID = "G-XXXXXXXXXX";          // ← cole aqui o ID do Google Analytics
var META_PIXEL_ID = "000000000000000"; // ← cole aqui o número do Meta Pixel

(function () {
  "use strict";

  var gaCfg = !!GA4_ID && GA4_ID.indexOf("XXXX") === -1;
  var pxCfg = !!META_PIXEL_ID && !/^0+$/.test(META_PIXEL_ID);
  var KEY = "inova-consent";
  var gaOn = false, pxOn = false;

  function readChoice() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY));
      return v && v.v === 1 ? v : null;
    } catch (e) { return null; }
  }
  function writeChoice(accepted) {
    try { localStorage.setItem(KEY, JSON.stringify({ v: 1, medicao: !!accepted, ts: new Date().toISOString() })); } catch (e) {}
  }

  // ---- Carregamento das ferramentas (só depois de aceitar) ----------------
  function loadTools() {
    if (gaCfg && !gaOn) {
      gaOn = true;
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("consent", "default", {
        ad_storage: "granted", analytics_storage: "granted", ad_user_data: "granted", ad_personalization: "granted"
      });
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA4_ID);
      document.head.appendChild(s);
      window.gtag("js", new Date());
      window.gtag("config", GA4_ID);
    }
    if (pxCfg && !pxOn) {
      pxOn = true;
      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0";
        n.queue = []; t = b.createElement(e); t.async = !0; t.src = v;
        s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
      })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      window.fbq("init", META_PIXEL_ID);
      window.fbq("track", "PageView");
    }
  }

  // Retirar a autorização: apaga os identificadores e recarrega a página sem as ferramentas
  function stopTools() {
    try {
      document.cookie.split(";").forEach(function (c) {
        var name = c.split("=")[0].trim();
        if (/^(_ga|_gid|_gat|_fbp|_fbc)/.test(name)) {
          var host = location.hostname.split(".");
          for (var i = 0; i < host.length - 1; i++) {
            var d = host.slice(i).join(".");
            document.cookie = name + "=; Max-Age=0; path=/; domain=" + d;
          }
          document.cookie = name + "=; Max-Age=0; path=/";
        }
      });
    } catch (e) {}
    if (gaOn || pxOn) location.reload();
  }

  // ---- Aviso de consentimento ---------------------------------------------
  function removeBanner() {
    var b = document.getElementById("consentBanner");
    if (b && b.parentNode) b.parentNode.removeChild(b);
  }

  function nomes() {
    var l = [];
    if (gaCfg) l.push("Google Analytics");
    if (pxCfg) l.push("Meta Pixel");
    return l.join(" / ");
  }

  function pathPrefix() { return window.INOVA_PREFIX || ""; }

  function showBanner() {
    removeBanner();
    var box = document.createElement("div");
    box.id = "consentBanner";
    box.className = "consent-banner";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "false");
    box.setAttribute("aria-labelledby", "consentTitle");
    box.innerHTML =
      '<h2 id="consentTitle">Cookies e medição</h2>' +
      '<p>Queremos perceber como o site é usado e medir os nossos anúncios, com ferramentas da Google e da Meta. ' +
      'Estas ferramentas guardam identificadores no seu dispositivo e enviam dados para essas empresas, que os podem tratar fora da União Europeia. ' +
      'Só as ativamos se aceitar. O site funciona na mesma se recusar.</p>' +
      '<p><a href="' + pathPrefix() + 'cookies/">Política de Cookies</a></p>' +
      '<div class="consent-actions">' +
      '<button type="button" class="btn btn-gold" data-consent="yes">Aceitar</button>' +
      '<button type="button" class="btn btn-gold" data-consent="no">Recusar</button>' +
      '</div>';
    document.body.appendChild(box);
    box.querySelector('[data-consent="yes"]').addEventListener("click", function () {
      writeChoice(true); removeBanner(); loadTools();
    });
    box.querySelector('[data-consent="no"]').addEventListener("click", function () {
      var had = readChoice() && readChoice().medicao;
      writeChoice(false); removeBanner();
      if (had) stopTools();
    });
    var first = box.querySelector("button"); if (first) { try { first.focus({ preventScroll: true }); } catch (e) {} }
  }

  function addFooterLink() {
    var fb = document.querySelector(".footer-bottom");
    if (!fb || fb.querySelector("[data-consent-open]")) return;
    var sep = document.createTextNode(" · ");
    var b = document.createElement("button");
    b.type = "button"; b.className = "link-btn"; b.setAttribute("data-consent-open", "");
    b.textContent = "Preferências de cookies";
    b.addEventListener("click", showBanner);
    fb.appendChild(sep); fb.appendChild(b);
  }

  window.InovaConsent = {
    configured: gaCfg || pxCfg,
    open: function () { if (gaCfg || pxCfg) showBanner(); },
    accepted: function () { var c = readChoice(); return !!(c && c.medicao); }
  };

  if (gaCfg || pxCfg) {
    var c = readChoice();
    if (c && c.medicao) loadTools();
    document.addEventListener("DOMContentLoaded", function () {
      addFooterLink();
      if (!c) showBanner();
    });
  }

  // ---- API única para o resto do site ------------------------------------
  // Uso: InovaTrack.event("Marcacao");  InovaTrack.event("WhatsApp");
  // Só envia alguma coisa depois de a pessoa ter aceitado.
  var META_STD = { Marcacao: "Schedule", Contacto: "Contact", WhatsApp: "Contact", Telefone: "Contact" };
  window.InovaTrack = {
    event: function (name, params) {
      params = params || {};
      try { if (gaOn) window.gtag("event", name, params); } catch (e) {}
      try {
        if (pxOn) {
          if (META_STD[name]) window.fbq("track", META_STD[name], params);
          else window.fbq("trackCustom", name, params);
        }
      } catch (e) {}
    }
  };

  // ---- Auto-tracking do funil (sem tocar nas páginas) ---------------------
  document.addEventListener("click", function (ev) {
    if (!gaOn && !pxOn) return;
    var a = ev.target.closest && ev.target.closest("a");
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (href.indexOf("wa.me") !== -1 || href.indexOf("whatsapp") !== -1) {
      window.InovaTrack.event("WhatsApp");
    } else if (href.indexOf("tel:") === 0) {
      window.InovaTrack.event("Telefone");
    } else if (href.indexOf("/agendar") !== -1 || href.indexOf("agendar/") !== -1) {
      window.InovaTrack.event("AbriuAgendamento");
    }
  }, true);
})();
