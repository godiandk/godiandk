document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  formNote.hidden = false;
  contactForm.reset();
});

/* Carrossel do hero */
(function () {
  const slider = document.querySelector('.hero-slider');
  if (!slider) return;
  const slides = Array.from(slider.querySelectorAll('.hs-slide'));
  const dotsWrap = slider.querySelector('.hs-dots');
  const prev = slider.querySelector('.hs-arrow.prev');
  const next = slider.querySelector('.hs-arrow.next');
  if (slides.length < 2) {
    if (prev) prev.style.display = 'none';
    if (next) next.style.display = 'none';
    return;
  }

  let i = 0;
  let timer = null;

  slides.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Ir para destaque ' + (idx + 1));
    dot.addEventListener('click', () => go(idx, true));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function render() {
    slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
  }

  function go(n, manual) {
    i = (n + slides.length) % slides.length;
    render();
    if (manual) restart();
  }

  function start() { timer = setInterval(() => go(i + 1), 6000); }
  function restart() { clearInterval(timer); start(); }

  if (prev) prev.addEventListener('click', () => go(i - 1, true));
  if (next) next.addEventListener('click', () => go(i + 1, true));

  let touchX = null;
  slider.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1, true);
    touchX = null;
  }, { passive: true });

  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', start);

  render();
  start();
})();
