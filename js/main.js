// ============================================
// REKI - JavaScript principal
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Navbar scroll ---
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Menú hamburguesa ---
  const toggle = document.querySelector('.navbar__toggle');
  const links  = document.querySelector('.navbar__links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = toggle.classList.toggle('open');
      links.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
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

  // --- Formulario de contacto (Formspree) ---
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      const original = btn.textContent;
      btn.textContent = 'Enviando...';
      btn.disabled = true;

      fetch('https://formspree.io/f/mvzldylq', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
        .then((res) => {
          if (!res.ok) throw new Error('bad response');
          form.style.display = 'none';
          const ok = document.getElementById('formSuccess');
          if (ok) ok.style.display = 'block';
        })
        .catch(() => {
          btn.textContent = 'Error al enviar · Llámanos al 673 950 478';
          btn.disabled = false;
          setTimeout(() => { btn.textContent = original; }, 4000);
        });
    });
  }

  // --- Revelado escalonado al hacer scroll ---
  const revealTargets = document.querySelectorAll(
    '.dif-card, .servicio-card, .sector-item, .paso, .galeria-item, ' +
    '.section-header, .servicio-detalle, .contacto-dato, .faq-item'
  );

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(el => el.classList.add('visible'));
  } else {
    revealTargets.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // Escalonado según la posición entre sus hermanos del mismo contenedor
        const siblings = Array.from(el.parentElement.children)
          .filter(c => c.classList.contains('reveal'));
        const index = Math.max(0, siblings.indexOf(el));
        el.style.transitionDelay = Math.min(index * 90, 540) + 'ms';
        el.classList.add('visible');
        obs.unobserve(el);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(el => observer.observe(el));
  }

  // --- Parallax sutil en la tarjeta del hero (solo puntero fino) ---
  const heroCard = document.querySelector('.hero__card');
  const heroVisual = document.querySelector('.hero__visual');
  if (heroCard && heroVisual && !reduceMotion &&
      window.matchMedia('(pointer: fine)').matches) {
    heroVisual.addEventListener('mousemove', (e) => {
      const r = heroVisual.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      heroCard.style.transform =
        `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });
    heroVisual.addEventListener('mouseleave', () => {
      heroCard.style.transform = '';
    });
  }

});
