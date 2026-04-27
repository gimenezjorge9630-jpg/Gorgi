// ============================================
// REKI - JavaScript principal
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Navbar scroll ---
  const navbar = document.querySelector('.navbar');
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Menú hamburguesa ---
  const toggle = document.querySelector('.navbar__toggle');
  const links  = document.querySelector('.navbar__links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        links.classList.remove('open');
      })
    );
  }

  // --- Marcar enlace activo ---
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // --- Formulario de contacto ---
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      btn.textContent = 'Enviando...';
      btn.disabled = true;

      // Simula envío (aquí conectarías tu backend / EmailJS / Formspree)
      setTimeout(() => {
        form.style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
      }, 1200);
    });
  }

  // --- Animación de entrada con IntersectionObserver ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  // Group siblings so each group staggers independently
  const animGroups = new Map();
  document.querySelectorAll('.dif-card, .servicio-card, .sector-item, .paso, .galeria-item')
    .forEach(el => {
      const parent = el.parentElement;
      if (!animGroups.has(parent)) animGroups.set(parent, []);
      animGroups.get(parent).push(el);
    });

  animGroups.forEach(els => {
    els.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `opacity .5s ease ${i * 0.1}s, transform .5s ease ${i * 0.1}s`;
      observer.observe(el);
    });
  });

  // Cuando se hace visible
  const style = document.createElement('style');
  style.textContent = '.visible { opacity: 1 !important; transform: none !important; }';
  document.head.appendChild(style);

});
