/* =====================================================
   HERO CON MOTION GRAPHICS
   Secuencia: Intro cinética (1) → Cintas de seda (8)
   → Hero con nombre, frase y terminal
   → Zoom por la "o" de Camilo al hacer scroll (9)
   ===================================================== */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = document.getElementById('inicio');
  const intro = document.getElementById('intro');
  const introWord = document.getElementById('introWord');
  const silk = document.getElementById('silk');

  /* ---------- 1. Intro de tipografía cinética ---------- */
  const INTRO_WORDS = [
    { text: 'DATOS', color: '#2f5bff' },
    { text: 'LÓGICA', color: '#8cc4ff' },
    { text: 'INTERFAZ', color: '#eaf1fa' },
  ];
  const WORD_MS = 780;
  let introTimers = [];

  function introAlreadySeen() {
    try { return sessionStorage.getItem('introSeen') === '1'; } catch { return false; }
  }
  function markIntroSeen() {
    try { sessionStorage.setItem('introSeen', '1'); } catch { /* sin storage */ }
  }

  function playIntro() {
    document.body.classList.add('intro-lock');
    INTRO_WORDS.forEach((w, i) => {
      introTimers.push(setTimeout(() => {
        introWord.textContent = w.text;
        introWord.style.color = w.color;
        introWord.animate(
          [
            { transform: 'scale(2.4)', opacity: 0, filter: 'blur(14px)' },
            { transform: 'scale(1)', opacity: 1, filter: 'blur(0)', offset: 0.35 },
            { transform: 'scale(.93)', opacity: 1, offset: 0.8 },
            { transform: 'scale(.6)', opacity: 0 },
          ],
          { duration: WORD_MS + 120, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }
        );
      }, i * WORD_MS));
    });
    introTimers.push(setTimeout(endIntro, INTRO_WORDS.length * WORD_MS + 150));
  }

  function endIntro() {
    introTimers.forEach(clearTimeout);
    intro.classList.add('done');
    document.body.classList.remove('intro-lock');
    markIntroSeen();
    startHero();
  }

  document.getElementById('introSkip').addEventListener('click', endIntro);

  /* ---------- Arranque del hero ---------- */
  let heroStarted = false;
  function startHero() {
    if (heroStarted) return;
    heroStarted = true;
    silk.classList.add('on');                       // 8: entran las cintas
    setTimeout(() => {
      hero.classList.add('ready');                  // nombre y textos suben
    }, reduceMotion ? 0 : 450);
  }

  /* ---------- Pausar animaciones cuando el hero no se ve ---------- */
  let heroVisible = true;
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }).observe(hero);

  /* ---------- 8. Cintas de seda ---------- */
  const ctx = silk.getContext('2d');
  let W = 0, H = 0, tSilk = 0;
  function resizeSilk() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = silk.clientWidth; H = silk.clientHeight;
    silk.width = W * dpr; silk.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function drawSilk() {
    if (heroVisible) {
      tSilk += 0.006;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      const strands = W < 720 ? 18 : 28;
      for (let k = 0; k < strands; k++) {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 10) {
          const y = H * 0.62
            + Math.sin(x * 0.0045 + tSilk * 2 + k * 0.09) * H * 0.12
            + Math.sin(x * 0.011 - tSilk * 1.4 + k * 0.05) * H * 0.05
            + k * 2.4;
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        const a = 0.045 + 0.04 * Math.sin(k * 0.4 + tSilk);
        ctx.strokeStyle = k < strands / 2 ? `rgba(140,196,255,${a})` : `rgba(47,91,255,${a + 0.035})`;
        ctx.lineWidth = 12;
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    if (!reduceMotion) requestAnimationFrame(drawSilk);
  }

  /* ---------- 9. Salida suave desde la "o" de Camilo ---------- */
  const wrap = document.getElementById('heroWrap');
  const name = document.getElementById('heroName');
  const zoomO = document.getElementById('zoomO');
  const veil = document.getElementById('heroVeil');
  const fadeEls = hero.querySelectorAll('.hero-in');
  const MAX_SCALE = 2.4;            // zoom suave: crece un poco y se desvanece
  let originX = 0, originY = 0;   // centro del hueco de la "o" dentro del contenedor

  // Posición de la "o" dentro del nombre, medida con offsets de layout
  // (no les afectan los transform de la animación de entrada ni del zoom)
  function offsetWithin(el, ancestor) {
    let x = 0, y = 0;
    for (let n = el; n && n !== ancestor; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; }
    return { x, y };
  }
  function setZoomOrigin() {
    const base = name.offsetParent;
    const o = offsetWithin(zoomO, base);
    const n = offsetWithin(name, base);
    // Centro del hueco de la "o" (un poco por debajo de la mitad por la altura de x)
    const ox = o.x - n.x + zoomO.offsetWidth / 2;
    const oy = o.y - n.y + zoomO.offsetHeight * 0.56;
    name.style.transformOrigin = `${ox}px ${oy}px`;
    originX = n.x + ox;
    originY = n.y + oy;
  }

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  function onScroll() {
    const total = wrap.offsetHeight - window.innerHeight;
    const p = clamp(-wrap.getBoundingClientRect().top / total, 0, 1);
    if (p > 0) {
      const z = easeOut(clamp(p / 0.7, 0, 1));
      name.style.transform = `scale(${1 + (MAX_SCALE - 1) * z})`;
      name.style.opacity = clamp(1 - p / 0.6, 0, 1);
      name.style.filter = `blur(${Math.round(z * 8)}px)`;
    } else {
      name.style.transform = name.style.opacity = name.style.filter = '';
    }
    const fade = clamp(1 - p * 2.5, 0, 1);
    fadeEls.forEach(el => { el.style.opacity = hero.classList.contains('ready') ? fade : ''; });
    veil.style.opacity = clamp((p - 0.55) / 0.45, 0, 1);
  }

  /* ---------- Init ---------- */
  if (reduceMotion) {
    intro.classList.add('done');
    hero.classList.add('ready');
    silk.classList.add('on');
    resizeSilk(); drawSilk();                      // un cuadro estático
    return;
  }

  resizeSilk();
  drawSilk();
  window.addEventListener('resize', () => { resizeSilk(); setZoomOrigin(); onScroll(); });
  window.addEventListener('scroll', onScroll, { passive: true });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(setZoomOrigin);

  if (introAlreadySeen() || window.scrollY > 10) {
    intro.classList.add('done');
    startHero();
  } else {
    playIntro();
  }
  onScroll();
})();
