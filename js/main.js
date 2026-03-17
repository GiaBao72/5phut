// Enhanced modern interactions
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reveal on scroll (stagger)
const revealTargets = document.querySelectorAll('.section, .feature, .price-card, .card, .hero-copy, .hero-visual');
revealTargets.forEach(el => el.classList.add('reveal'));

// Ensure hero is visible immediately
const heroImmediate = document.querySelectorAll('.hero-copy, .hero-visual');
heroImmediate.forEach(el => el.classList.add('show'));

if (!prefersReduced) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        entry.target.style.transitionDelay = `${delay}ms`;
        entry.target.classList.add('show');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach((el, i) => {
    el.dataset.delay = Math.min(i * 40, 240);
    io.observe(el);
  });
}

// Parallax + floating (desktop only)
const hero = document.querySelector('.hero');
const cover = document.querySelector('.cover');
const isMobile = window.innerWidth < 900;

if (hero && cover && !prefersReduced && !isMobile) {
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    cover.style.transform = `rotate(${x / 4}deg) translateY(${y / 4}px)`;
  });
  hero.addEventListener('mouseleave', () => {
    cover.style.transform = 'rotate(0deg) translateY(0)';
  });

  let t = 0;
  const float = () => {
    t += 0.018;
    const y = Math.sin(t) * 6;
    const r = Math.sin(t / 2) * 1.2;
    cover.style.transform = `translateY(${y}px) rotate(${r}deg)`;
    requestAnimationFrame(float);
  };
  float();
}

