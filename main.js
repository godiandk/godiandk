/* INOVA BEAUTY — interações globais */
(function () {
  "use strict";

  var WA = "https://wa.me/351919277205?text=Ol%C3%A1%20Inova%20beauty.%20Desejo%20marcar%20um%20hor%C3%A1rio%20para%20micropigmenta%C3%A7%C3%A3o%2C%20pode%20ajudar%3F";
  var P = window.INOVA_PREFIX || "./";

  /* ---------- Menu mobile (hamburger) ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      document.body.classList.toggle("nav-locked", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- Dropdown "Serviços" no mobile ---------- */
  document.querySelectorAll(".has-dropdown > a.nav-link").forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (window.matchMedia("(max-width: 900px)").matches) {
        e.preventDefault();
        link.parentElement.classList.toggle("open");
      }
    });
  });

  /* ---------- Cards de serviços: clicar na imagem expande sub-serviços ---------- */
  document.querySelectorAll("[data-card-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var card = btn.closest(".service-card");
      var panel = card && card.querySelector(".sub-panel");
      if (!panel) return;
      var isOpen = panel.style.maxHeight && panel.style.maxHeight !== "0px";
      panel.style.maxHeight = isOpen ? "0px" : panel.scrollHeight + "px";
      btn.setAttribute("aria-expanded", isOpen ? "false" : "true");
    });
  });

  /* ---------- Chat online ---------- */
  var REPLIES = {
    precos: 'Os nossos preços estão todos no <a href="' + P + 'precario/">preçário online</a> 💛 Por exemplo: Threading de sobrancelhas 14,00€, Brow Lamination 35,00€, Lifting de pestanas 31,00€, Micropigmentação de sobrancelhas 225,00€.',
    horario: "Funcionamos de segunda a sábado, das 09h00 às 19h00. Atendemos por marcação para não ter esperas 😊",
    servicos: 'Fazemos threading (depilação com linha), tratamentos de sobrancelhas, pestanas, extensões, micropigmentação e depilação a laser. Veja tudo em <a href="' + P + 'servicos/">Serviços</a>.',
    local: 'Envie-nos mensagem no WhatsApp e partilhamos logo a localização exata 📍 <a href="' + WA + '" target="_blank" rel="noopener">Pedir localização</a>',
    marcar: 'Perfeito! Pode marcar já: <a href="' + WA + '" target="_blank" rel="noopener">clique aqui para agendar no WhatsApp</a> ou use a nossa <a href="' + P + 'agendar/">marcação online</a> 💛',
    fallback: 'Obrigada pela sua mensagem! 💛 Para uma resposta rápida e personalizada, fale connosco no <a href="' + WA + '" target="_blank" rel="noopener">WhatsApp</a> — respondemos em minutos.'
  };

  function buildChat() {
    var fab = document.createElement("button");
    fab.className = "chat-fab";
    fab.type = "button";
    fab.setAttribute("aria-label", "Abrir chat online");
    fab.innerHTML = '💬 <span class="fab-label">Chat online</span>';

    var panel = document.createElement("div");
    panel.className = "chat-panel";
    panel.innerHTML =
      '<div class="chat-head">' +
      '  <div class="ch-id"><img class="ch-avatar" src="' + P + 'img/thayana-avatar.jpg" alt="Thayana — Inova Beauty">' +
      '  <div><div class="ch-title">Inova Beauty</div><div class="ch-status">● Online — respondemos já</div></div></div>' +
      '  <button type="button" aria-label="Fechar chat">✕</button>' +
      '</div>' +
      '<div class="chat-body"></div>' +
      '<div class="chat-quick">' +
      '  <button data-q="precos">💶 Preços</button>' +
      '  <button data-q="horario">🕐 Horário</button>' +
      '  <button data-q="servicos">✨ Serviços</button>' +
      '  <button data-q="local">📍 Localização</button>' +
      '  <button data-q="marcar">📅 Marcar horário</button>' +
      '</div>' +
      '<div class="chat-input">' +
      '  <input type="text" placeholder="Escreva a sua mensagem…" aria-label="Mensagem">' +
      '  <button type="button" aria-label="Enviar">➤</button>' +
      '</div>';

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    var body = panel.querySelector(".chat-body");

    function addMsg(text, who) {
      var div = document.createElement("div");
      div.className = "chat-msg " + who;
      if (who === "bot") { div.innerHTML = text; } else { div.textContent = text; }
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    }

    function botReply(key, delay) {
      setTimeout(function () { addMsg(REPLIES[key] || REPLIES.fallback, "bot"); }, delay || 500);
    }

    fab.addEventListener("click", function () {
      var open = panel.classList.toggle("open");
      if (open && !body.hasChildNodes()) {
        addMsg("Olá! 👋 Bem-vinda à Inova Beauty. Em que posso ajudar? Escolha uma opção abaixo ou escreva a sua pergunta.", "bot");
      }
    });
    panel.querySelector(".chat-head button").addEventListener("click", function () {
      panel.classList.remove("open");
    });

    panel.querySelectorAll(".chat-quick button").forEach(function (b) {
      b.addEventListener("click", function () {
        addMsg(b.textContent.trim(), "user");
        botReply(b.getAttribute("data-q"));
      });
    });

    var input = panel.querySelector(".chat-input input");
    var send = panel.querySelector(".chat-input button");
    function submitText() {
      var v = input.value.trim();
      if (!v) return;
      addMsg(v, "user");
      input.value = "";
      var low = v.toLowerCase();
      var key = "fallback";
      if (/(pre[cç]o|valor|quanto|custa|pre[cç][aá]rio)/.test(low)) key = "precos";
      else if (/(hor[aá]rio|hora|abre|fecha|funciona)/.test(low)) key = "horario";
      else if (/(servi[cç]o|fazem|threading|sobrancelha|pestana|micro|laser|henna)/.test(low)) key = "servicos";
      else if (/(onde|morada|local|endere[cç]o|mapa)/.test(low)) key = "local";
      else if (/(marcar|agendar|marca[cç][aã]o|vaga|dispon)/.test(low)) key = "marcar";
      botReply(key, 600);
    }
    send.addEventListener("click", submitText);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") submitText(); });
  }

  if (!document.body.hasAttribute("data-no-chat")) buildChat();

  /* ---------- Carrossel do hero (home) ---------- */
  var slider = document.querySelector(".hero-slider");
  if (slider) {
    var slides = slider.querySelectorAll(".hs-slide");
    var dotsWrap = slider.querySelector(".hs-dots");
    var idx = 0, timer = null, DELAY = 5500;

    slides.forEach(function (_, i) {
      var d = document.createElement("button");
      d.type = "button";
      d.setAttribute("aria-label", "Ir para o slide " + (i + 1));
      if (i === 0) d.classList.add("active");
      d.addEventListener("click", function () { go(i); restart(); });
      dotsWrap.appendChild(d);
    });
    var dots = dotsWrap.querySelectorAll("button");

    function go(i) {
      idx = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle("active", n === idx); });
      dots.forEach(function (d, n) { d.classList.toggle("active", n === idx); });
    }
    function next() { go(idx + 1); }
    function restart() {
      clearInterval(timer);
      timer = setInterval(next, DELAY);
    }

    slider.querySelector(".hs-arrow.prev").addEventListener("click", function () { go(idx - 1); restart(); });
    slider.querySelector(".hs-arrow.next").addEventListener("click", function () { go(idx + 1); restart(); });
    slider.addEventListener("mouseenter", function () { clearInterval(timer); });
    slider.addEventListener("mouseleave", restart);

    var touchX = null;
    slider.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener("touchend", function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 45) { go(idx + (dx < 0 ? 1 : -1)); }
      touchX = null;
      restart();
    }, { passive: true });

    restart();
  }
})();
