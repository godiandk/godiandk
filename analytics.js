/* ============================================================
   INOVA BEAUTY — Medição para anúncios (Google Ads + Meta/Facebook)
   ------------------------------------------------------------
   COMO ATIVAR (2 passos, demora 1 minuto):

   1) Google Analytics 4 (grátis) → analytics.google.com
      Crie uma propriedade, copie o "ID de medição" (começa por G-)
      e cole-o abaixo em GA4_ID.

   2) Meta Pixel (grátis) → business.facebook.com → Gestor de Eventos
      Crie um Pixel, copie o número (15-16 dígitos)
      e cole-o abaixo em META_PIXEL_ID.

   Enquanto estiverem com os valores de exemplo ("G-XXXX..." / "000..."),
   NADA é carregado — o site continua igual e sem scripts a mais.
   Assim que colar IDs reais, começa a medir automaticamente:
     • visitas a cada página
     • cliques no WhatsApp e no telefone
     • marcações concluídas  (conversão "Marcação")
   ============================================================ */

var GA4_ID = "G-XXXXXXXXXX";          // ← cole aqui o ID do Google Analytics
var META_PIXEL_ID = "000000000000000"; // ← cole aqui o número do Meta Pixel

(function () {
  "use strict";

  var gaOn = GA4_ID && GA4_ID.indexOf("XXXX") === -1;
  var pxOn = META_PIXEL_ID && !/^0+$/.test(META_PIXEL_ID);

  // ---- Google Analytics 4 -------------------------------------------------
  if (gaOn) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA4_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA4_ID);
  }

  // ---- Meta / Facebook Pixel ---------------------------------------------
  if (pxOn) {
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

  // ---- API única para o resto do site ------------------------------------
  // Uso: InovaTrack.event("Marcacao");  InovaTrack.event("WhatsApp");
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
