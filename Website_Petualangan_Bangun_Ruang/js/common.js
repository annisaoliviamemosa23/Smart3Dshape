/* ===== Petualangan Bangun Ruang · fungsi bersama ===== */

/* ---------- penyimpanan (aman bila localStorage diblokir) ---------- */
const Store = {
  mem: {},
  get(k, d) {
    try { const v = localStorage.getItem('br_' + k); return v === null ? (k in this.mem ? this.mem[k] : d) : JSON.parse(v); }
    catch (e) { return k in this.mem ? this.mem[k] : d; }
  },
  set(k, v) { this.mem[k] = v; try { localStorage.setItem('br_' + k, JSON.stringify(v)); } catch (e) {} }
};

const BADGES = {
  rusuk:   { icon: '🏅', name: 'Jago Rusuk' },
  jaring:  { icon: '✂️', name: 'Ahli Jaring' },
  volume:  { icon: '👑', name: 'Raja Volume' },
  tampak:  { icon: '👀', name: 'Mata Elang' },
  kuis:    { icon: '🧠', name: 'Juara Kuis' },
  penjelajah: { icon: '🗺️', name: 'Penjelajah Ruang' },
  gameshow:{ icon: '🎤', name: 'Bintang Panggung' },
  lulus:   { icon: '🎓', name: 'Juara Ruang' }
};

function addStars(n) {
  const s = Store.get('stars', 0) + n;
  Store.set('stars', s);
  document.querySelectorAll('.stars-count').forEach(e => e.textContent = s);
  return s;
}
function addBadge(id) {
  const b = Store.get('badges', []);
  if (b.includes(id)) return false;
  b.push(id); Store.set('badges', b);
  setTimeout(() => toast(`${BADGES[id].icon} Lencana baru: <b>${BADGES[id].name}</b>!`), 600);
  return true;
}
function playerName() { return Store.get('name', ''); }

/* ---------- helper ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
function fmt(n) { return Number(n).toLocaleString('id-ID'); }
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function parseNum(s) {
  if (s == null) return NaN;
  s = String(s).trim().replace(/\s/g, '').replace(/(cm|m|liter|l|buah|kubus)[²³23]?$/i, '');
  s = s.replace(/\./g, '').replace(',', '.');
  return parseFloat(s);
}

/* ---------- maskot Kubi ---------- */
function kubiSVG(opt = {}) {
  const cls = opt.cls || 'kubi';
  const mood = opt.mood || 'happy';
  const mouth = mood === 'sad'
    ? '<path d="M27 88 Q37 78 50 84" fill="none" stroke="#23264A" stroke-width="3.5" stroke-linecap="round"/>'
    : mood === 'wow'
      ? '<ellipse cx="38" cy="84" rx="6" ry="7" fill="#23264A"/>'
      : '<path d="M26 78 Q37 92 50 86" fill="none" stroke="#23264A" stroke-width="3.5" stroke-linecap="round"/>';
  let acc = '';
  const a = opt.acc || '';
  if (a === 'topi') acc = '<polygon points="60,-24 46,16 76,16" fill="#7B61FF" stroke="#23264A" stroke-width="3.5" stroke-linejoin="round"/><circle cx="60" cy="-26" r="6" fill="#FFD23F" stroke="#23264A" stroke-width="3"/>';
  if (a === 'jubah') acc = '<path d="M14 40 L-4 118 L40 104 Z" fill="#FF6B6B" stroke="#23264A" stroke-width="3.5" stroke-linejoin="round"/>';
  if (a === 'mahkota') acc = '<polygon points="38,14 42,-14 52,4 60,-20 68,4 78,-14 82,14" fill="#FFD23F" stroke="#23264A" stroke-width="3.5" stroke-linejoin="round"/><circle cx="60" cy="-2" r="4" fill="#FF6B6B"/>';
  const cape = a === 'jubah' ? acc : '';
  const hat = a !== 'jubah' ? acc : '';
  return `<svg class="${cls}" viewBox="-8 -30 136 172" xmlns="http://www.w3.org/2000/svg" aria-label="Kubi si kubus">
  ${cape}
  <line x1="38" y1="104" x2="34" y2="130" stroke="#23264A" stroke-width="5" stroke-linecap="round"/>
  <line x1="80" y1="104" x2="84" y2="130" stroke="#23264A" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="32" cy="132" rx="9" ry="5" fill="#FF6B6B" stroke="#23264A" stroke-width="3"/>
  <ellipse cx="86" cy="132" rx="9" ry="5" fill="#FF6B6B" stroke="#23264A" stroke-width="3"/>
  <line x1="14" y1="64" x2="2" y2="44" stroke="#23264A" stroke-width="5" stroke-linecap="round"/>
  <line x1="106" y1="64" x2="117" y2="46" stroke="#23264A" stroke-width="5" stroke-linecap="round"/>
  <polygon points="60,8 106,30 60,52 14,30" fill="#FFE27A" stroke="#23264A" stroke-width="4" stroke-linejoin="round"/>
  <polygon points="14,30 60,52 60,110 14,88" fill="#FFD23F" stroke="#23264A" stroke-width="4" stroke-linejoin="round"/>
  <polygon points="60,52 106,30 106,88 60,110" fill="#FF9F1C" stroke="#23264A" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="29" cy="60" r="6" fill="#fff" stroke="#23264A" stroke-width="3"/><circle cx="30" cy="61" r="2.5" fill="#23264A"/>
  <circle cx="47" cy="68" r="6" fill="#fff" stroke="#23264A" stroke-width="3"/><circle cx="48" cy="69" r="2.5" fill="#23264A"/>
  ${mouth}
  <ellipse cx="22" cy="74" rx="4" ry="2.5" fill="#FF8FB1"/><ellipse cx="54" cy="83" rx="4" ry="2.5" fill="#FF8FB1"/>
  ${hat}
</svg>`;
}
function kubiAcc() {
  const adv = Store.get('adv', { unlocked: 1, stars: {} });
  if (adv.stars[5]) return 'mahkota';
  if (adv.stars[3]) return 'jubah';
  if (adv.stars[1]) return 'topi';
  return '';
}
const STAR = '<svg viewBox="0 0 50 50"><polygon points="25,3 31,18 47,19 34,29 39,45 25,36 11,45 16,29 3,19 19,18" fill="#FFD23F" stroke="#23264A" stroke-width="3" stroke-linejoin="round"/></svg>';
const HEART = '<svg viewBox="0 0 50 46"><path d="M25 42 C5 28 2 18 6 11 C11 3 21 4 25 12 C29 4 39 3 44 11 C48 18 45 28 25 42Z" fill="#FF6B6B" stroke="#23264A" stroke-width="3" stroke-linejoin="round"/></svg>';

/* ---------- suara (dibuat dengan Web Audio, tanpa file) ---------- */
const Sfx = {
  ctx: null,
  get on() { return Store.get('sound', true); },
  init() { if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); },
  tone(freq, start, dur, type = 'sine', vol = .18, slideTo) {
    const c = this.ctx, t = c.currentTime + start;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur + .05);
  },
  play(name) {
    if (!this.on) return; this.init(); if (!this.ctx) return;
    switch (name) {
      case 'ok': [523, 659, 784, 1047].forEach((f, i) => this.tone(f, i * .09, .25, 'triangle')); break;
      case 'bad': this.tone(300, 0, .45, 'sawtooth', .12, 90); break;
      case 'click': this.tone(660, 0, .07, 'square', .06); break;
      case 'tick': this.tone(1000, 0, .05, 'square', .04); break;
      case 'spin': for (let i = 0; i < 16; i++) this.tone(700 + i * 20, i * .17 * (1 + i / 22), .04, 'square', .05); break;
      case 'win': [523, 523, 659, 784, 659, 784, 1047].forEach((f, i) => this.tone(f, i * .14, .3, 'triangle', .2)); break;
      case 'hit': this.tone(180, 0, .25, 'square', .12, 60); this.tone(900, .05, .15, 'triangle', .1); break;
    }
  }
};

/* ---------- konfeti ---------- */
function confetti(n = 140) {
  let cv = document.getElementById('confetti');
  if (!cv) { cv = document.createElement('canvas'); cv.id = 'confetti'; document.body.appendChild(cv); }
  const ctx = cv.getContext('2d'); cv.width = innerWidth; cv.height = innerHeight;
  const cols = ['#FFD23F', '#3BB8F0', '#06C793', '#FF6B6B', '#7B61FF', '#FF9F1C', '#FF8FB1'];
  const ps = Array.from({ length: n }, () => ({ x: Math.random() * cv.width, y: -20 - Math.random() * cv.height * .5, vx: (Math.random() - .5) * 4, vy: 2 + Math.random() * 4, r: 5 + Math.random() * 7, a: Math.random() * 6, va: (Math.random() - .5) * .3, c: pick(cols), s: Math.random() < .3 }));
  const t0 = performance.now();
  (function step(t) {
    ctx.clearRect(0, 0, cv.width, cv.height);
    ps.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += .05; p.a += p.va;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c;
      if (p.s) { ctx.beginPath(); for (let i = 0; i < 10; i++) { const rr = i % 2 ? p.r * .45 : p.r; ctx.lineTo(Math.cos(i * Math.PI / 5) * rr, Math.sin(i * Math.PI / 5) * rr); } ctx.fill(); }
      else ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2);
      ctx.restore();
    });
    if (t - t0 < 3600) requestAnimationFrame(step); else ctx.clearRect(0, 0, cv.width, cv.height);
  })(t0);
}

/* ---------- popup & toast ---------- */
function popup({ kind = '', title = '', html = '', buttons = [{ label: 'OK', cls: 'sun' }], mood, acc, closable = false } = {}) {
  const ov = document.createElement('div'); ov.className = 'overlay';
  const m = mood || (kind === 'bad' ? 'sad' : 'happy');
  ov.innerHTML = `<div class="pop ${kind}" role="dialog" aria-modal="true">
    <div class="head">${kubiSVG({ mood: m, acc: acc || kubiAcc(), cls: 'kubi' + (kind === 'bad' ? ' kubi-sad' : '') })}<div><h2>${title}</h2></div></div>
    <div class="body">${html}</div><div class="btns"></div></div>`;
  const close = () => ov.remove();
  const bw = $('.btns', ov);
  buttons.forEach(b => {
    const el = document.createElement('button'); el.className = 'btn ' + (b.cls || ''); el.innerHTML = b.label;
    el.onclick = () => { Sfx.play('click'); if (b.keep !== true) close(); b.onClick && b.onClick(); };
    bw.appendChild(el);
  });
  if (closable) ov.addEventListener('click', e => { if (e.target === ov) close(); });
  document.body.appendChild(ov);
  setTimeout(() => { const f = $('.btns .btn:last-child', ov); f && f.focus(); }, 50);
  return close;
}
function toast(html) {
  const t = document.createElement('div');
  t.style.cssText = 'position:fixed;left:12px;right:12px;margin:0 auto;width:fit-content;max-width:90vw;text-align:center;bottom:24px;background:#fff;border:3px solid #23264A;border-radius:16px;padding:10px 18px;font-family:Fredoka;font-size:1.2rem;z-index:400;box-shadow:0 5px 0 #23264A;animation:pop .35s';
  t.innerHTML = html; document.body.appendChild(t); setTimeout(() => t.remove(), 3200);
}
const PRAISE = ['Hebat! Kamu Benar!', 'Luar Biasa!', 'Kamu Jenius Ruang!', 'Mantap Sekali!', 'Keren! Tepat Sekali!', 'Wah, Pintar!'];
const ENCOURAGE = ['Ups, Belum Tepat!', 'Hampir! Coba Lagi Ya!', 'Ayo, Kamu Pasti Bisa!'];

/* ---------- header & footer ---------- */
const PAGES = [
  ['index.html', '🏠', 'Beranda'], ['materi.html', '📘', 'Materi'], ['kuis.html', '❓', 'Kuis'],
  ['games.html', '🎮', 'Games'], ['evaluasi.html', '📝', 'Evaluasi'], ['profil.html', '👩‍🏫', 'Profil']
];
function mountChrome(active) {
  const h = document.createElement('header'); h.className = 'topbar';
  h.innerHTML = `<div class="in">
    <a class="logo" href="index.html">${kubiSVG({ acc: kubiAcc() })}<span>Bangun Ruang</span></a>
    <nav class="nav" id="mainnav">${PAGES.map(p => `<a href="${p[0]}" class="${p[0] === active ? 'on' : ''}">${p[1]} ${p[2]}</a>`).join('')}</nav>
    <span class="pill stars-pill" title="Bintangmu">⭐ <span class="stars-count">${Store.get('stars', 0)}</span></span>
    <button class="iconbtn" id="sndbtn" title="Suara aktif/mati" aria-label="Suara">${Sfx.on ? '🔊' : '🔇'}</button>
    <button class="iconbtn burger" id="burger" aria-label="Menu">☰</button>
  </div>`;
  document.body.prepend(h);
  $('#sndbtn').onclick = () => { Store.set('sound', !Sfx.on); $('#sndbtn').textContent = Sfx.on ? '🔊' : '🔇'; Sfx.play('click'); };
  $('#burger').onclick = () => $('#mainnav').classList.toggle('open');
  const f = document.createElement('footer'); f.className = 'foot';
  f.innerHTML = `Petualangan Bangun Ruang · Media Pembelajaran Matematika Kelas V · <a href="panduan.html">Panduan Guru &amp; Orang Tua</a>`;
  document.body.appendChild(f);
  document.addEventListener('pointerdown', () => Sfx.init(), { once: true });
}

/* ================= GEOMETRI GAMBAR ================= */
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const f = v => Math.max(0, Math.min(255, Math.round(amt > 0 ? v + (255 - v) * amt : v * (1 + amt))));
  return '#' + [f(r), f(g), f(b)].map(v => v.toString(16).padStart(2, '0')).join('');
}
/* kotak isometrik. boxes: [{x,y,z,dx,dy,dz,c}] ; x ke kanan-bawah, y ke kiri-bawah (sisi depan), z ke atas */
function isoSVG(boxes, opt = {}) {
  const S = opt.size || 30, ca = .866 * S, sa = .5 * S;
  const P = (x, y, z) => [(x - y) * ca, (x + y) * sa - z * S];
  const sorted = boxes.slice().sort((a, b) => (a.x + a.y + a.z) - (b.x + b.y + b.z) || a.z - b.z);
  let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9, out = '';
  const poly = (pts, fill) => {
    pts.forEach(p => { minX = Math.min(minX, p[0]); maxX = Math.max(maxX, p[0]); minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]); });
    return `<polygon points="${pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')}" fill="${fill}" stroke="#23264A" stroke-width="${opt.sw || 2.5}" stroke-linejoin="round"/>`;
  };
  sorted.forEach(b => {
    const { x, y, z } = b, dx = b.dx || 1, dy = b.dy || 1, dz = b.dz || 1, c = b.c || '#3BB8F0';
    out += poly([P(x, y, z + dz), P(x + dx, y, z + dz), P(x + dx, y + dy, z + dz), P(x, y + dy, z + dz)], shade(c, .45));
    out += poly([P(x + dx, y, z), P(x + dx, y + dy, z), P(x + dx, y + dy, z + dz), P(x + dx, y, z + dz)], shade(c, -.25));
    out += poly([P(x, y + dy, z), P(x + dx, y + dy, z), P(x + dx, y + dy, z + dz), P(x, y + dy, z + dz)], c);
  });
  let extra = '';
  if (opt.labels) {
    const b = boxes[0], dx = b.dx || 1, dy = b.dy || 1, dz = b.dz || 1;
    const L = opt.labels, mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    const lab = (pt, txt, ox, oy) => { minX = Math.min(minX, pt[0] + ox - 40); maxX = Math.max(maxX, pt[0] + ox + 40); maxY = Math.max(maxY, pt[1] + oy + 12); minY = Math.min(minY, pt[1] + oy - 20); return `<text x="${(pt[0] + ox).toFixed(1)}" y="${(pt[1] + oy).toFixed(1)}" font-family="Fredoka" font-weight="600" font-size="${S * .6}" fill="#23264A" text-anchor="middle">${txt}</text>`; };
    if (L.p) extra += lab(mid(P(0, dy, 0), P(dx, dy, 0)), L.p, -S * .4, S * .7);
    if (L.l) extra += lab(mid(P(dx, 0, 0), P(dx, dy, 0)), L.l, S * .5, S * .7);
    if (L.t) extra += lab(mid(P(dx, 0, 0), P(dx, 0, dz)), L.t, S * 1.1, 6);
  }
  if (opt.front) {
    const X = opt.front[0], Y = opt.front[1];
    const p = P(X / 2, Y + .9, 0); const q = P(X / 2, Y + .2, 0);
    extra += `<line x1="${p[0]}" y1="${p[1] + 18}" x2="${q[0]}" y2="${q[1] + 10}" stroke="#FF6B6B" stroke-width="4" marker-end="url(#ah)"/><text x="${p[0] - 6}" y="${p[1] + 40}" font-family="Fredoka" font-weight="700" font-size="${S * .55}" fill="#FF6B6B" text-anchor="middle">DEPAN</text>`;
    maxY = Math.max(maxY, p[1] + 46); minX = Math.min(minX, p[0] - 50);
  }
  const pad = 8;
  return `<svg viewBox="${(minX - pad).toFixed(0)} ${(minY - pad).toFixed(0)} ${(maxX - minX + 2 * pad).toFixed(0)} ${(maxY - minY + 2 * pad).toFixed(0)}" xmlns="http://www.w3.org/2000/svg"><defs><marker id="ah" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#FF6B6B"/></marker></defs>${out}${extra}</svg>`;
}
function unitCubes(p, l, t, c = '#7B61FF', count) {
  const a = [];
  for (let z = 0; z < t; z++) for (let y = 0; y < l; y++) for (let x = 0; x < p; x++) a.push({ x, y, z, c });
  return count == null ? a : a.slice(0, count);
}
/* susunan kubus dari tinggi: h[y][x] */
function stackBoxes(h, c = '#FF9F1C') {
  const a = []; h.forEach((row, y) => row.forEach((v, x) => { for (let z = 0; z < v; z++) a.push({ x, y, z, c }); })); return a;
}
function viewsOf(h) {
  const Y = h.length, X = h[0].length, H = Math.max(...h.flat());
  const top = h.map(r => r.map(v => v > 0 ? 1 : 0));
  const front = [], side = [];
  for (let k = H - 1; k >= 0; k--) {
    front.push(Array.from({ length: X }, (_, x) => Math.max(...h.map(r => r[x])) > k ? 1 : 0));
    side.push(Array.from({ length: Y }, (_, i) => { const y = Y - 1 - i; return Math.max(...h[y]) > k ? 1 : 0; }));
  }
  return { top, front, side };
}
function gridSVG(g, opt = {}) {
  const s = opt.s || 34, rows = g.length, cols = g[0].length;
  let o = '';
  g.forEach((r, y) => r.forEach((v, x) => { if (v) o += `<rect x="${x * s + 3}" y="${y * s + 3}" width="${s}" height="${s}" fill="${opt.c || '#FF9F1C'}" stroke="#23264A" stroke-width="3"/>`; }));
  return `<svg viewBox="0 0 ${cols * s + 6} ${rows * s + 6}" xmlns="http://www.w3.org/2000/svg" style="width:${cols * s * (opt.k || 1) + 6}px">${o}</svg>`;
}
const gridKey = g => g.map(r => r.join('')).join('/');

/* ---------- jaring-jaring ---------- */
function normNet(cells) {
  const mx = Math.min(...cells.map(c => c[0])), my = Math.min(...cells.map(c => c[1]));
  return cells.map(c => [c[0] - mx, c[1] - my]).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
}
function netKey(cells) { return normNet(cells).map(c => c.join(',')).join(';'); }
function transformNet(cells) {
  let c = cells.map(p => p.slice());
  const r = rnd(0, 3); for (let i = 0; i < r; i++) c = c.map(([x, y]) => [-y, x]);
  if (Math.random() < .5) c = c.map(([x, y]) => [-x, y]);
  return normNet(c);
}
function isCubeNet(cells) {
  if (cells.length !== 6) return false;
  const K = (x, y) => x + ',' + y, set = new Set(cells.map(c => K(c[0], c[1])));
  if (set.size !== 6) return false;
  const seen = new Map(), used = new Set([0]);
  const st0 = { b: 0, t: 1, n: 2, s: 3, e: 4, w: 5 };
  const q = [[cells[0][0], cells[0][1], st0]]; seen.set(K(cells[0][0], cells[0][1]), 1);
  const moves = [
    [1, 0, s => ({ b: s.e, e: s.t, t: s.w, w: s.b, n: s.n, s: s.s })],
    [-1, 0, s => ({ b: s.w, w: s.t, t: s.e, e: s.b, n: s.n, s: s.s })],
    [0, -1, s => ({ b: s.n, n: s.t, t: s.s, s: s.b, e: s.e, w: s.w })],
    [0, 1, s => ({ b: s.s, s: s.t, t: s.n, n: s.b, e: s.e, w: s.w })]
  ];
  while (q.length) {
    const [x, y, st] = q.shift();
    for (const [dx, dy, f] of moves) {
      const k = K(x + dx, y + dy);
      if (set.has(k) && !seen.has(k)) { const ns = f(st); if (used.has(ns.b)) return false; used.add(ns.b); seen.set(k, 1); q.push([x + dx, y + dy, ns]); }
    }
  }
  return used.size === 6 && seen.size === 6;
}
const NET_CANDIDATES = [
  [[0,0],[0,1],[1,1],[2,1],[3,1],[0,2]], [[0,0],[0,1],[1,1],[2,1],[3,1],[1,2]], [[0,0],[0,1],[1,1],[2,1],[3,1],[2,2]],
  [[0,0],[0,1],[1,1],[2,1],[3,1],[3,2]], [[1,0],[0,1],[1,1],[2,1],[3,1],[1,2]], [[1,0],[0,1],[1,1],[2,1],[3,1],[2,2]],
  [[0,0],[1,0],[1,1],[2,1],[3,1],[3,2]], [[0,0],[1,0],[1,1],[2,1],[3,1],[2,2]], [[0,0],[1,0],[1,1],[2,1],[3,1],[1,2]],
  [[0,0],[1,0],[1,1],[2,1],[2,2],[3,2]], [[0,0],[1,0],[2,0],[2,1],[3,1],[4,1]],
  [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]], [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]], [[0,0],[1,0],[2,0],[3,0],[4,0],[2,1]],
  [[0,0],[1,0],[0,1],[1,1],[2,1],[3,1]], [[1,0],[2,0],[0,1],[1,1],[2,1],[3,1]], [[0,0],[0,1],[0,2],[0,3],[1,3],[2,3]],
  [[0,0],[1,0],[2,0],[1,1],[1,2],[2,2]], [[0,0],[1,0],[1,1],[2,1],[2,2],[2,3]], [[1,0],[0,1],[1,1],[2,1],[1,2],[2,2]],
  [[0,0],[1,0],[2,0],[3,0],[0,1],[3,1]], [[0,1],[1,1],[2,1],[3,1],[1,0],[1,2]]
];
const NETS_OK = NET_CANDIDATES.filter(isCubeNet);
const NETS_BAD = NET_CANDIDATES.filter(c => !isCubeNet(c));
function netSVG(cells, opt = {}) {
  const s = opt.s || 26, n = normNet(cells), W = Math.max(...n.map(c => c[0])) + 1, H = Math.max(...n.map(c => c[1])) + 1;
  const o = n.map(([x, y]) => `<rect x="${x * s + 3}" y="${y * s + 3}" width="${s}" height="${s}" fill="${opt.c || '#FFD23F'}" stroke="#23264A" stroke-width="3"/>`).join('');
  return `<svg viewBox="0 0 ${W * s + 6} ${H * s + 6}" xmlns="http://www.w3.org/2000/svg">${o}</svg>`;
}

/* ---------- tampilan kuis satu soal (dipakai di banyak halaman) ----------
   q = {text, vis, type:'mc'|'num', options:[{t, pic}], answer (index utk mc | angka utk num), unit, hint, explain} */
function renderQuestion(host, q, onAnswer, opt = {}) {
  host.innerHTML = `<div class="qtext">${q.text}</div>${q.vis ? `<div class="qvis">${q.vis}</div>` : ''}<div class="ans"></div>`;
  const ans = $('.ans', host);
  if (q.type === 'num') {
    ans.innerHTML = `<div class="numin"><input type="text" inputmode="decimal" placeholder="jawabanmu" aria-label="Jawaban"><span class="unit">${q.unit || ''}</span><button class="btn mint">✔ Periksa</button></div>`;
    const inp = $('input', ans), b = $('button', ans);
    const go = () => { const v = parseNum(inp.value); if (isNaN(v)) { inp.classList.remove('shake'); void inp.offsetWidth; inp.classList.add('shake'); inp.focus(); return; } onAnswer(Math.abs(v - q.answer) < 1e-6, v, { inp, b }); };
    b.onclick = go; inp.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    if (!opt.noFocus) setTimeout(() => inp.focus({ preventScroll: true }), 50);
  } else {
    const L = 'ABCD';
    ans.innerHTML = `<div class="opts">${q.options.map((o, i) => `<button class="opt ${o.pic ? 'pic' : ''}" data-i="${i}">${o.pic ? `<span class="k">${L[i]}</span>${o.pic}` : `<span class="k">${L[i]}</span><span>${o.t}</span>`}</button>`).join('')}</div>`;
    $$('.opt', ans).forEach(b => b.onclick = () => { const i = +b.dataset.i; onAnswer(i === q.answer, i, { btn: b, all: $$('.opt', ans) }); });
  }
}
/* soal pilihan ganda dari angka, dengan pengecoh */
function mcNum(text, ans, wrongs, unit = '', extra = {}) {
  const w = [...new Set(wrongs.filter(v => v !== ans && v > 0))].slice(0, 3);
  let k = 2; while (w.length < 3) { const v = ans + k * (Math.random() < .5 ? -1 : 1) * Math.max(1, Math.round(ans / 10)); if (v > 0 && v !== ans && !w.includes(v)) w.push(v); k++; }
  const opts = shuffle([ans, ...w]);
  return Object.assign({ text, type: 'mc', options: opts.map(v => ({ t: fmt(v) + (unit ? ' ' + unit : '') })), answer: opts.indexOf(ans) }, extra);
}
/* soal pilihan dari daftar teks (benar di indeks 0) */
function mcText(text, list, extra = {}) {
  const opts = shuffle(list.map((t, i) => ({ t, ok: i === 0 })));
  return Object.assign({ text, type: 'mc', options: opts, answer: opts.findIndex(o => o.ok) }, extra);
}
