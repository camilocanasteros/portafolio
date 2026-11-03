// Header: fondo sólido al hacer scroll
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Menú móvil
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
nav.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  })
);

// Animaciones de entrada con IntersectionObserver
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  // pequeño escalonado entre elementos hermanos
  const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
  el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 80}ms`;
  revealObserver.observe(el);
});

// Enlace activo en el menú según la sección visible
const sections = document.querySelectorAll('main section[id]');
const navLinks = nav.querySelectorAll('a[href^="#"]');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => sectionObserver.observe(s));

// Copiar correo
const copyBtn = document.getElementById('copyBtn');
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(copyBtn.dataset.email);
    copyBtn.textContent = '¡Copiado!';
  } catch {
    copyBtn.textContent = copyBtn.dataset.email;
  }
  setTimeout(() => (copyBtn.textContent = 'Copiar correo'), 2000);
});

// Año del footer
document.getElementById('year').textContent = new Date().getFullYear();

// Sobre mí: el texto se ilumina palabra por palabra con el scroll
const litText = document.getElementById('litText');
if (litText) {
  // Partir el párrafo en palabras, respetando las <em> (palabras en azul)
  const words = [];
  litText.childNodes.forEach(node => {
    const accent = node.nodeName === 'EM';
    node.textContent.split(/\s+/).filter(Boolean).forEach(w => words.push({ w, accent }));
  });
  litText.innerHTML = words
    .map(({ w, accent }) => `<span class="lit-word${accent ? ' accent-word' : ''}">${w}</span>`)
    .join(' ');
  const spans = litText.querySelectorAll('.lit-word');

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const updateLit = () => {
    const r = litText.getBoundingClientRect();
    const vh = window.innerHeight;
    // Empieza cuando el párrafo entra por abajo (85% de la pantalla)
    // y termina cuando su final llega al 45%
    const start = vh * 0.85, end = vh * 0.45;
    const p = Math.min(1, Math.max(0, (start - r.top) / (start - end + r.height)));
    const lit = reduce ? spans.length : Math.round(p * spans.length);
    spans.forEach((s, i) => s.classList.toggle('on', i < lit));
  };
  window.addEventListener('scroll', updateLit, { passive: true });
  window.addEventListener('resize', updateLit);
  updateLit();
}

// Proyectos: vitrina que cambia de escena con el scroll
const showcase = document.getElementById('showcase');
if (showcase) {
  const scenes = showcase.querySelectorAll('.scene');
  const dots = showcase.querySelectorAll('.dot-btn');
  const pinned = () => window.matchMedia('(min-width: 961px)').matches;
  let current = 0;

  const setScene = i => {
    if (i === current) return;
    current = i;
    scenes.forEach((s, k) => s.classList.toggle('is-active', k === i));
    dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
  };

  const updateShowcase = () => {
    if (!pinned()) return;
    const total = showcase.offsetHeight - window.innerHeight;
    const p = Math.min(1, Math.max(0, -showcase.getBoundingClientRect().top / total));
    setScene(Math.min(scenes.length - 1, Math.floor(p * scenes.length)));
  };

  // Clic en un punto: desplaza hasta el tramo de ese proyecto
  dots.forEach(d => d.addEventListener('click', () => {
    const i = Number(d.dataset.go);
    const total = showcase.offsetHeight - window.innerHeight;
    const top = showcase.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + total * ((i + 0.5) / scenes.length), behavior: 'smooth' });
  }));

  window.addEventListener('scroll', updateShowcase, { passive: true });
  window.addEventListener('resize', updateShowcase);
  updateShowcase();
}

// Header: cambia a vidrio claro con letras oscuras sobre las secciones claras
const lightSections = document.querySelectorAll('.about-light, .exp-light');
const headerEl = document.getElementById('header');
const updateHeaderTone = () => {
  const y = headerEl.offsetHeight / 2;
  const onLight = [...lightSections].some(s => {
    const r = s.getBoundingClientRect();
    return r.top <= y && r.bottom >= y;
  });
  headerEl.classList.toggle('on-light', onLight);
};
window.addEventListener('scroll', updateHeaderTone, { passive: true });
window.addEventListener('resize', updateHeaderTone);
updateHeaderTone();

// Stack: cintas de seda tenues detrás de las columnas (versión suave de las del hero)
const stackSilk = document.getElementById('stackSilk');
if (stackSilk) {
  const sctx = stackSilk.getContext('2d');
  const stillMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let sw = 0, sh = 0, st = 0, stackVisible = false;
  const sizeSilk = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    sw = stackSilk.clientWidth; sh = stackSilk.clientHeight;
    stackSilk.width = sw * dpr; stackSilk.height = sh * dpr;
    sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const drawStackSilk = () => {
    sctx.clearRect(0, 0, sw, sh);
    sctx.globalCompositeOperation = 'lighter';
    const strands = sw < 720 ? 10 : 14;
    for (let k = 0; k < strands; k++) {
      sctx.beginPath();
      for (let x = 0; x <= sw; x += 10) {
        const y = sh * 0.55
          + Math.sin(x * 0.004 + st * 1.4 + k * 0.08) * sh * 0.14
          + Math.sin(x * 0.01 - st * 0.9 + k * 0.05) * sh * 0.05
          + k * 2;
        x ? sctx.lineTo(x, y) : sctx.moveTo(x, y);
      }
      const a = 0.03 * (0.6 + 0.4 * Math.sin(k * 0.4 + st));
      sctx.strokeStyle = k < strands / 2 ? `rgba(140,196,255,${a})` : `rgba(47,91,255,${a + 0.012})`;
      sctx.lineWidth = 10;
      sctx.stroke();
    }
    sctx.globalCompositeOperation = 'source-over';
  };
  const loopStackSilk = () => {
    if (stackVisible) { st += 0.004; drawStackSilk(); }     // más lento que el hero
    if (!stillMotion) requestAnimationFrame(loopStackSilk);
  };
  new IntersectionObserver(([e]) => { stackVisible = e.isIntersecting; }).observe(stackSilk);
  window.addEventListener('resize', () => { sizeSilk(); drawStackSilk(); });
  sizeSilk(); drawStackSilk(); loopStackSilk();
}

// Proyectos en celular: puntos que siguen el carrusel
const mDots = document.getElementById('mDots');
const stageEl = document.querySelector('.showcase .stage');
if (mDots && stageEl) {
  const slides = stageEl.querySelectorAll('.scene');
  mDots.innerHTML = [...slides].map(() => '<span></span>').join('');
  const dotsEls = mDots.querySelectorAll('span');
  const updateDots = () => {
    const w = slides[0].getBoundingClientRect().width + 14;
    const i = Math.min(slides.length - 1, Math.round(stageEl.scrollLeft / w));
    dotsEls.forEach((d, k) => d.classList.toggle('on', k === i));
  };
  stageEl.addEventListener('scroll', updateDots, { passive: true });
  updateDots();
}
