// Menu mobile
const btn = document.querySelector('.menu-btn');
const nav = document.getElementById('nav');
if (btn && nav) {
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
}

// Planète de points en rotation (page d'accueil)
const cv = document.getElementById('planet');
if (cv) {
  const ctx = cv.getContext('2d');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const N = 1100, ga = Math.PI * (3 - Math.sqrt(5)), pts = [];
  for (let i = 0; i < N; i++) {
    const y = 1 - 2 * (i + 0.5) / N, r = Math.sqrt(1 - y * y), t = ga * i, d = 0.9 + Math.random() * 0.2;
    pts.push({ x: Math.cos(t) * r * d, y: y * d, z: Math.sin(t) * r * d, s: 0.5 + Math.random() * 1.6, c: Math.random() < 0.18 });
  }
  let size = 0, dpr = 1, a = 0;
  const tilt = 0.38, ct = Math.cos(tilt), st = Math.sin(tilt);
  const fit = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    size = cv.clientWidth;
    cv.width = cv.height = Math.round(size * dpr);
  };
  const draw = () => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    const R = size * 0.34, c = size / 2, ca = Math.cos(a), sa = Math.sin(a);
    for (const p of pts) {
      const x1 = p.x * ca + p.z * sa, z1 = -p.x * sa + p.z * ca;
      const y2 = p.y * ct - z1 * st, z2 = p.y * st + z1 * ct;
      const k = (z2 / 1.1 + 1) / 2; // 0 = arrière, 1 = avant
      ctx.globalAlpha = 0.12 + 0.8 * k;
      ctx.fillStyle = p.c ? '#5cc0e0' : '#9aa0ab';
      ctx.beginPath();
      ctx.arc(c + x1 * R, c + y2 * R, p.s * (0.5 + k * 0.9), 0, 6.2832);
      ctx.fill();
    }
    if (!still) { a += 0.0022; requestAnimationFrame(draw); }
  };
  fit();
  draw();
  window.addEventListener('resize', () => { fit(); if (still) draw(); });
}
