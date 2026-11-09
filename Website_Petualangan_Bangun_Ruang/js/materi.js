mountChrome('materi.html');

const TABS = [
  ['tujuan', '🎯 Tujuan'], ['kubus', '🧊 Kubus'], ['balok', '📦 Balok'],
  ['jaring', '✂️ Jaring-jaring'], ['volume', '🧮 Volume'], ['tampak', '👀 Tampak']
];
const TP = [
  ['menyebutkan sisi, rusuk, dan titik sudut kubus dan balok', 'kubus'],
  ['membandingkan ciri kubus dan balok', 'balok'],
  ['menyusun jaring-jaring dan menghitung luas permukaan', 'jaring'],
  ['menghitung volume dengan kubus satuan dan rumus', 'volume'],
  ['menggambar tampak depan, atas, dan samping', 'tampak'],
  ['menyelesaikan soal cerita volume sehari-hari', 'volume']
];
const done = () => Store.get('tpDone', []);

function drawTabs(active) {
  $('#tabs').innerHTML = TABS.map(([k, n]) => `<button data-k="${k}" class="${k === active ? 'on' : ''}">${n}${done().includes(k) ? ' <span class="ok">✔</span>' : ''}</button>`).join('');
  $$('#tabs button').forEach(b => b.onclick = () => openTab(b.dataset.k));
}
function drawTP() {
  $('#tplist').innerHTML = TP.map((t, i) => `<div class="tp-item ${done().includes(t[1]) ? 'done' : ''}"><span class="num">${done().includes(t[1]) ? '✔' : i + 1}</span><span>${t[0]}</span></div>`).join('');
}
function openTab(k) {
  Sfx.play('click');
  $$('section[data-tab]').forEach(s => s.classList.toggle('hidden', s.dataset.tab !== k));
  drawTabs(k); location.hash = k;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
$$('[data-go]').forEach(b => b.onclick = () => openTab(b.dataset.go));
$('#kubiT').innerHTML = kubiSVG({ acc: kubiAcc() }).replace('<svg', '<svg style="width:70px;height:86px"');
drawTP();

/* ---------- kotak 3D yang bisa diputar ---------- */
function box3d(stageId, W, H, D, base) {
  const st = $('#' + stageId);
  const el = document.createElement('div'); el.className = 'box3d'; el.style.width = W + 'px'; el.style.height = H + 'px';
  const cols = ['#FF6B6B', '#FFD23F', '#06C793', '#3BB8F0', '#7B61FF', '#FF9F1C'];
  const faces = [
    [W, H, `translateZ(${D / 2}px)`, 0], [W, H, `rotateY(180deg) translateZ(${D / 2}px)`, -.15],
    [D, H, `rotateY(90deg) translateZ(${W / 2}px)`, -.25], [D, H, `rotateY(-90deg) translateZ(${W / 2}px)`, -.1],
    [W, D, `rotateX(90deg) translateZ(${H / 2}px)`, .35], [W, D, `rotateX(-90deg) translateZ(${H / 2}px)`, -.35]
  ];
  faces.forEach(([w, h, tr, sh], i) => {
    const f = document.createElement('div'); f.className = 'f';
    Object.assign(f.style, { width: w + 'px', height: h + 'px', left: (W - w) / 2 + 'px', top: (H - h) / 2 + 'px', transform: tr, background: shade(base, sh) });
    f.dataset.base = shade(base, sh); f.dataset.col = cols[i];
    f.innerHTML = `<span>${i + 1}</span>`; el.appendChild(f);
  });
  let n = 1;
  for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) {
    const d = document.createElement('div'); d.className = 'dot'; d.textContent = n++;
    d.style.transform = `translate3d(${W / 2 + x * W / 2}px,${H / 2 + y * H / 2}px,${z * D / 2}px)`; el.appendChild(d);
  }
  st.appendChild(el);
  let rx = -22, ry = 35, drag = null;
  const apply = () => el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`; apply();
  st.addEventListener('pointerdown', e => { drag = [e.clientX, e.clientY, rx, ry]; st.setPointerCapture(e.pointerId); });
  st.addEventListener('pointermove', e => { if (!drag) return; ry = drag[3] + (e.clientX - drag[0]) * .6; rx = drag[2] - (e.clientY - drag[1]) * .6; apply(); });
  st.addEventListener('pointerup', () => drag = null);
  let auto = setInterval(() => { if (!drag) { ry += .4; apply(); } }, 30);
  st.addEventListener('pointerdown', () => clearInterval(auto), { once: true });
  const info = { faces: '6 sisi diberi warna dan nomor 1 sampai 6.', edges: '12 rusuk ditandai garis merah.', points: '8 titik sudut diberi nomor 1 sampai 8.' };
  return mode => {
    el.className = 'box3d ' + mode;
    $$('.f', el).forEach(f => f.style.background = mode === 'faces' ? f.dataset.col : f.dataset.base);
    if (info[mode]) toast(info[mode]);
  };
}
const setters = { stKubus: box3d('stKubus', 160, 160, 160, '#3BB8F0'), stBalok: box3d('stBalok', 230, 130, 110, '#06C793') };
$$('.modebtns').forEach(g => $$('button', g).forEach(b => b.onclick = () => {
  $$('button', g).forEach(x => x.classList.toggle('on', x === b)); Sfx.play('click'); setters[g.dataset.for](b.dataset.m);
}));

/* ---------- jaring-jaring lipat ---------- */
(function () {
  const S = 90, w = $('#netWorld');
  const cols = ['#FFD23F', '#FF6B6B', '#3BB8F0', '#06C793', '#7B61FF', '#FF9F1C'];
  const mk = (cls, n, c, css) => { const d = document.createElement('div'); d.className = 'nf ' + cls; d.textContent = n; d.style.background = c; d.style.boxShadow = 'inset 0 0 0 3px #23264A'; d.style.border = 'none'; Object.assign(d.style, css); return d; };
  const base = mk('base', 1, cols[0], { position: 'relative', left: 0, top: 0 });
  const L = mk('', 2, cols[1], { left: -S + 'px', top: 0, transformOrigin: '100% 50%' });
  const R = mk('', 3, cols[2], { left: S + 'px', top: 0, transformOrigin: '0 50%' });
  const K = mk('', 4, cols[3], { left: 0, top: -S + 'px', transformOrigin: '50% 100%' });
  const F = mk('', 5, cols[4], { left: 0, top: S + 'px', transformOrigin: '50% 0' });
  const T = mk('', 6, cols[5], { left: 0, top: -S + 'px', transformOrigin: '50% 100%' });
  K.appendChild(T); [L, R, K, F].forEach(x => base.appendChild(x)); w.appendChild(base);
  let folded = false;
  const set = () => {
    L.style.transform = folded ? 'rotateY(90deg)' : 'none';
    R.style.transform = folded ? 'rotateY(-90deg)' : 'none';
    K.style.transform = folded ? 'rotateX(-90deg)' : 'none';
    F.style.transform = folded ? 'rotateX(90deg)' : 'none';
    T.style.transform = folded ? 'rotateX(-90deg)' : 'none';
    w.style.transform = folded ? 'rotateX(62deg) rotateZ(-38deg) translateZ(-45px)' : 'rotateX(50deg) rotateZ(-30deg)';
    $('#foldBtn').textContent = folded ? '📄 Buka jaring-jaring' : '📦 Lipat jadi kubus';
  };
  set();
  $('#foldBtn').onclick = () => { folded = !folded; Sfx.play('click'); set(); };
  $('#netSamples').innerHTML = NETS_OK.slice(5, 9).map(n => `<div style="width:110px">${netSVG(n, { s: 22 })}</div>`).join('');

  const up = () => {
    const s = +$('#lsS').value, p = +$('#lsP').value, l = +$('#lsL').value, t = +$('#lsT').value;
    $('#lsSv').textContent = s; $('#lsPv').textContent = p; $('#lsLv').textContent = l; $('#lsTv').textContent = t;
    $('#lsKubus').innerHTML = `L = 6 × ${s} × ${s} = <b>${fmt(6 * s * s)} cm²</b>`;
    $('#lsBalok').innerHTML = `L = 2 × (${p * l} + ${p * t} + ${l * t}) = <b>${fmt(2 * (p * l + p * t + l * t))} cm²</b>`;
  };
  ['lsS', 'lsP', 'lsL', 'lsT'].forEach(id => $('#' + id).oninput = up); up();
})();

/* ---------- volume ---------- */
(function () {
  let anim = null;
  const val = id => +$('#' + id).value;
  const draw = (count) => {
    const p = val('vP'), l = val('vL'), t = val('vT'), all = p * l * t;
    const shown = count == null ? all : count;
    const ghost = count == null ? [] : [{ x: 0, y: 0, z: 0, dx: p, dy: l, dz: t, c: '#ffffff' }];
    $('#volIso').innerHTML = count === 0
      ? isoSVG(ghost, { size: 36, sw: 2 }).replace(/fill="#[0-9a-f]+"/g, 'fill="#F4F2FF"')
      : isoSVG(unitCubes(p, l, t, '#7B61FF', shown), { size: 36 });
    $('#volCount').innerHTML = `V = ${p} × ${l} × ${t} = <span style="color:var(--grape)">${shown}</span> kubus satuan`;
  };
  const sync = (src) => {
    if ($('#volCube').checked) { const v = $('#' + (src || 'vP')).value; ['vP', 'vL', 'vT'].forEach(i => $('#' + i).value = v); }
    ['vP', 'vL', 'vT'].forEach(i => $('#' + i + 'v').textContent = $('#' + i).value);
    clearInterval(anim); draw();
  };
  ['vP', 'vL', 'vT'].forEach(i => $('#' + i).oninput = () => sync(i));
  $('#volCube').onchange = () => sync('vP');
  $('#fillBtn').onclick = () => {
    clearInterval(anim); let c = 0; const all = val('vP') * val('vL') * val('vT');
    draw(0);
    anim = setInterval(() => { c++; draw(c); Sfx.play('tick'); if (c >= all) { clearInterval(anim); Sfx.play('ok'); } }, Math.max(40, 1600 / all));
  };
  sync();
})();

/* ---------- tampak ---------- */
(function () {
  const PRE = [
    ['Tangga', [[1, 2, 3], [1, 1, 1]]],
    ['Menara', [[2, 3], [1, 1]]],
    ['Huruf L', [[3, 0, 0], [1, 1, 1]]],
    ['Benteng', [[2, 1, 2], [1, 0, 1]]]
  ];
  const show = i => {
    const h = PRE[i][1], V = viewsOf(h);
    $$('#tpPreset button').forEach((b, j) => b.classList.toggle('sun', i === j));
    $('#tpIso').innerHTML = isoSVG(stackBoxes(h), { size: 40, front: [h[0].length, h.length] });
    $('#tpViews').innerHTML = [['Tampak Depan', V.front], ['Tampak Atas', V.top], ['Tampak Samping (kanan)', V.side]]
      .map(([n, g]) => `<div class="v flip" style="height:auto;min-width:170px"><div>${n}</div><div class="ans" style="min-height:120px;display:flex;align-items:center;justify-content:center"><span class="btn sm sun">❓ Ketuk</span></div></div>`).join('');
    $$('#tpViews .v').forEach((c, j) => c.onclick = () => { const g = [V.front, V.top, V.side][j]; $('.ans', c).innerHTML = gridSVG(g, { s: 30 }); Sfx.play('ok'); });
  };
  $('#tpPreset').innerHTML = PRE.map((p, i) => `<button class="btn sm" data-i="${i}">${p[0]}</button>`).join('');
  $$('#tpPreset button').forEach(b => b.onclick = () => { Sfx.play('click'); show(+b.dataset.i); });
  show(0);
})();

/* ---------- cek pemahaman ---------- */
const CHECKS = {
  kubus: () => [mcNum('Berapa banyak <b>rusuk</b> kubus?', 12, [6, 8, 10]), mcText('Sisi kubus berbentuk ...', ['persegi', 'persegi panjang', 'segitiga', 'lingkaran'])],
  balok: () => [mcNum('Balok punya berapa <b>titik sudut</b>?', 8, [6, 10, 12]), mcText('Perbedaan kubus dan balok ada pada ...', ['panjang rusuknya', 'banyak sisinya', 'banyak rusuknya', 'banyak titik sudutnya'], { hint: 'Banyak sisi, rusuk, dan titik sudutnya sama. Bandingkan ukurannya.' })],
  jaring: () => [Gen.net('ok'), mcNum('Luas permukaan kubus dengan rusuk 3 cm adalah ...', 54, [27, 36, 9], 'cm²', { hint: 'L = 6 × s × s = 6 × 3 × 3.' })],
  volume: () => [Gen.kubusSatuan(), mcNum('Volume balok 5 cm × 3 cm × 2 cm adalah ...', 30, [10, 15, 62], 'cm³', { hint: 'V = p × l × t.' })],
  tampak: () => [Gen.tampak('atas'), Gen.tampak('depan')]
};
const BADGE_OF = { kubus: 'rusuk', jaring: 'jaring', volume: 'volume', tampak: 'tampak' };

function setupCheck(box) {
  const key = box.dataset.check;
  let qs, i;
  const start = () => { qs = CHECKS[key](); i = 0; render(); };
  const render = () => {
    box.innerHTML = `<div class="card bg-grape"><div class="row" style="justify-content:space-between"><h2>🧪 Cek Pemahaman</h2><span class="chip">Soal ${i + 1} dari ${qs.length}</span></div><div class="qhost"></div></div>`;
    renderQuestion($('.qhost', box), qs[i], (ok, v, ui) => {
      if (ok) {
        Sfx.play('ok'); addStars(2);
        if (ui.btn) ui.btn.classList.add('ok');
        if (++i < qs.length) setTimeout(render, 700);
        else finish();
      } else {
        Sfx.play('bad');
        if (ui.btn) { ui.btn.classList.add('bad', 'shake'); ui.btn.disabled = true; }
        if (ui.inp) { ui.inp.classList.remove('shake'); void ui.inp.offsetWidth; ui.inp.classList.add('shake'); }
        popup({ kind: 'bad', title: pick(ENCOURAGE), html: `<p><b>Petunjuk:</b> ${qs[i].hint || 'Baca lagi materi di atas, lalu coba lagi.'}</p>`, buttons: [{ label: '🔁 Coba Lagi', cls: 'sun' }] });
      }
    }, { noFocus: true });
  };
  const finish = () => {
    const first = !done().includes(key);
    if (first) { Store.set('tpDone', [...done(), key]); addStars(5); if (BADGE_OF[key]) addBadge(BADGE_OF[key]); }
    confetti(); Sfx.play('win'); drawTabs(key); drawTP();
    const idx = TABS.findIndex(t => t[0] === key), next = TABS[idx + 1];
    box.innerHTML = `<div class="card bg-mint center"><h2>🎉 Hebat! Bagian ini tuntas!</h2><p>${first ? 'Kamu mendapat bonus ⭐ 5 bintang.' : 'Kamu sudah menuntaskan bagian ini.'}</p>
      <div class="row mt1" style="justify-content:center"><button class="btn" id="ulang-${key}">🔁 Ulangi</button>${next ? `<button class="btn sun" id="next-${key}">Lanjut: ${next[1]} ▶</button>` : `<a class="btn sun" href="kuis.html">Ayo ke Kuis ▶</a>`}</div></div>`;
    $('#ulang-' + key).onclick = start;
    if (next) $('#next-' + key).onclick = () => openTab(next[0]);
  };
  start();
}
$$('[data-check]').forEach(setupCheck);

const h = location.hash.slice(1);
openTab(TABS.some(t => t[0] === h) ? h : 'tujuan');
window.addEventListener('hashchange', () => { const k = location.hash.slice(1); if (TABS.some(t => t[0] === k) && !$(`section[data-tab="${k}"]`).offsetParent) openTab(k); });
