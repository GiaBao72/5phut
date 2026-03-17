// Enhanced modern interactions
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reveal on scroll (stagger)
const revealTargets = document.querySelectorAll('.section, .feature, .price-card, .card, .hero-copy, .hero-visual');
revealTargets.forEach(el => el.classList.add('reveal'));

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

// Parallax glow + tilt on hero
const glow = document.querySelector('.glow');
const hero = document.querySelector('.hero');
const cover = document.querySelector('.cover');
if (hero && !prefersReduced) {
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    if (glow) glow.style.transform = `translate(${x}px, ${y}px)`;
    if (cover) cover.style.transform = `rotate(${x / 4}deg) translateY(${y / 4}px)`;
  });
  hero.addEventListener('mouseleave', () => {
    if (cover) cover.style.transform = 'rotate(0deg) translateY(0)';
  });
}

// Floating cover for life-like motion
if (cover && !prefersReduced) {
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

// Count-up stats
const trustNumbers = document.querySelectorAll('.trust-item strong');
if (!prefersReduced) {
  const countUp = (el, target, suffix = '') => {
    let start = 0;
    const duration = 1000;
    const startTime = performance.now();
    const step = (now) => {
      const p = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(start + (target - start) * p);
      el.textContent = `${value}${suffix}`;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const statMap = [
    { value: 200, suffix: '' },
    { value: 2, suffix: '' },
    { value: 0, suffix: '' }
  ];

  trustNumbers.forEach((el, idx) => {
    const text = el.textContent.trim();
    if (text.includes('FREESHIP')) return; // leave text as-is
    const m = text.match(/\d+/);
    if (m) {
      const target = statMap[idx]?.value || parseInt(m[0], 10);
      countUp(el, target);
    }
  });
}
