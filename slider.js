document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('galleryTrack');
  const viewport = document.getElementById('galleryViewport') || track?.parentElement;
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('sliderDots');
  const progress = document.getElementById('sliderProgress');

  if (!track || !viewport || !prevBtn || !nextBtn) return;

  const slides = Array.from(track.querySelectorAll('.gallery-slide'));
  if (!slides.length) return;

  const isRTL = () => document.documentElement.lang === 'he' || document.documentElement.dir === 'rtl';

  let index = 0;
  let timer = null;

  function slideWidth() {
    // шаг = ширина слайда + gap
    const s = slides[0];
    const gap = parseFloat(getComputedStyle(track).gap || '0');
    return s.getBoundingClientRect().width + gap;
  }

  function clamp(i) {
    return Math.max(0, Math.min(slides.length - 1, i));
  }

  function setActive(i) {
    index = clamp(i);
    slides.forEach((el, idx) => el.classList.toggle('active', idx === index));

    // dots
    if (dotsWrap) {
      dotsWrap.querySelectorAll('button').forEach((b, idx) => b.classList.toggle('active', idx === index));
    }

    // progress
    if (progress) {
      const pct = ((index + 1) / slides.length) * 100;
      progress.style.width = `${pct}%`;
    }
  }

    function goTo(i) {
        setActive(i);

        const slide = slides[index];
        const gap = parseFloat(getComputedStyle(track).gap || '0');

        // целимся в центр
        const targetLeft =
            slide.offsetLeft - (viewport.clientWidth - slide.clientWidth) / 2 + gap / 2;

        // RTL: инвертируем координату (иначе в иврите поедет не туда)
        const left = (document.documentElement.dir === 'rtl')
            ? (track.scrollWidth - viewport.clientWidth - targetLeft)
            : targetLeft;

        track.scrollTo({ left, behavior: 'smooth' });
        }

  function next() { goTo((index + 1) % slides.length); }
  function prev() { goTo((index - 1 + slides.length) % slides.length); }

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(b);
    });
  }

  function startAuto() {
    stopAuto();
    timer = setInterval(next, 4500);
  }
  function stopAuto() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  // Buttons
  prevBtn.addEventListener('click', (e) => { e.preventDefault(); prev(); });
  nextBtn.addEventListener('click', (e) => { e.preventDefault(); next(); });

  // Pause on hover/touch
  viewport.addEventListener('mouseenter', stopAuto);
  viewport.addEventListener('mouseleave', startAuto);
  viewport.addEventListener('touchstart', stopAuto, { passive: true });
  viewport.addEventListener('touchend', startAuto, { passive: true });

  // Update index on manual scroll (user swipes)
  let scrollTick = null;
  track.addEventListener('scroll', () => {
    if (scrollTick) return;
    scrollTick = requestAnimationFrame(() => {
      scrollTick = null;
      // ищем ближайший к центру viewport
      const vp = viewport.getBoundingClientRect();
      const center = vp.left + vp.width / 2;
      let best = 0;
      let bestDist = Infinity;

      slides.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        const c = r.left + r.width / 2;
        const d = Math.abs(c - center);
        if (d < bestDist) { bestDist = d; best = i; }
      });

      setActive(best);
    });
  });

  // Init
  buildDots();
  setActive(0);
  startAuto();

  // Re-init on resize
  window.addEventListener('resize', () => {
    // после ресайза просто возвращаем к текущему
    goTo(index);
  });

  // Экспорт для твоего сменщика языка (если ты вызываешь initSlider())
  window.initSlider = () => {
    buildDots();
    goTo(index);
  };
});