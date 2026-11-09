mountChrome('evaluasi.html');

const H7 = [[1, 2, 1], [1, 0, 0]], V7 = viewsOf(H7);
const NET_OK3 = [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]];
const NET_BAD3 = [[[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]], [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [2, 1]], [[0, 0], [1, 0], [0, 1], [1, 1], [2, 1], [3, 1]]];

const EVAL = [
  { tp: '5.2', type: 'mc', text: 'Bangun ruang yang <b>semua rusuknya sama panjang</b> adalah ...', o: ['kubus', 'balok', 'prisma segitiga', 'tabung'], ex: 'Kubus memiliki 12 rusuk yang sama panjang.' },
  { tp: '5.1', type: 'mc', text: 'Balok memiliki ... pasang sisi yang sama dan sejajar.', o: ['3 pasang', '2 pasang', '4 pasang', '6 pasang'], ex: 'Atas dan bawah, depan dan belakang, kiri dan kanan: 3 pasang.' },
  { tp: '5.3', type: 'mc', text: 'Manakah gambar yang merupakan <b>jaring-jaring kubus</b>?', pics: [netSVG(NET_OK3), ...NET_BAD3.map(n => netSVG(n))], ex: 'Jaring-jaring berbentuk salib dapat dilipat menjadi kubus. Bentuk lainnya ada sisi yang bertumpuk atau ada kotak 2 × 2.' },
  { tp: '5.4', type: 'mc', text: 'Sebuah kubus memiliki volume <b>216 cm³</b>. Panjang rusuknya adalah ...', o: ['6 cm', '8 cm', '36 cm', '72 cm'], ex: '6 × 6 × 6 = 216, jadi rusuknya 6 cm.' },
  { tp: '5.6', type: 'mc', text: 'Akuarium berbentuk balok berukuran panjang 60 cm, lebar 30 cm, dan tinggi 40 cm. Volume akuarium adalah ...', o: ['72.000 cm³', '130 cm³', '7.200 cm³', '720.000 cm³'], ex: '60 × 30 × 40 = 72.000 cm³ (sama dengan 72 liter).' },
  { tp: '5.3', type: 'num', text: 'Sebuah kubus memiliki rusuk <b>4 cm</b>. Berapa <b>luas permukaan</b> kubus tersebut?', unit: 'cm²', ans: 96, vis: isoSVG([{ x: 0, y: 0, z: 0, dx: 2, dy: 2, dz: 2, c: '#3BB8F0' }], { size: 34, labels: { p: '4 cm', l: '4 cm', t: '4 cm' } }), ex: 'L = 6 × 4 × 4 = 96 cm².' },
  { tp: '5.5', type: 'mc', text: 'Perhatikan susunan kubus berikut. Manakah gambar <b>tampak atas</b>-nya?', vis: isoSVG(stackBoxes(H7), { size: 34, front: [3, 2] }), pics: [gridSVG(V7.top, { s: 26 }), gridSVG(V7.front, { s: 26 }), gridSVG(V7.side, { s: 26 }), gridSVG(V7.top.map(r => r.slice().reverse()), { s: 26 })], ex: 'Dari atas terlihat 3 petak di belakang dan 1 petak di depan kiri.' },
  { tp: '5.4', type: 'mc', text: 'Sebuah balok bervolume <b>240 cm³</b> dengan panjang 10 cm dan lebar 6 cm. Tinggi balok adalah ...', o: ['4 cm', '6 cm', '24 cm', '224 cm'], ex: 't = 240 : (10 × 6) = 240 : 60 = 4 cm.' },
  { tp: '5.3', type: 'num', text: 'Sebuah kardus berbentuk balok berukuran <b>20 cm × 10 cm × 5 cm</b>. Berapa <b>luas permukaan</b> kardus tersebut?', unit: 'cm²', ans: 700, vis: isoSVG([{ x: 0, y: 0, z: 0, dx: 3.2, dy: 1.6, dz: 1, c: '#06C793' }], { size: 34, labels: { p: '20 cm', l: '10 cm', t: '5 cm' } }), ex: 'L = 2 × (200 + 100 + 50) = 2 × 350 = 700 cm².' },
  { tp: '5.6', type: 'num', text: 'Kardus berukuran <b>30 cm × 20 cm × 10 cm</b> akan diisi mainan berbentuk kubus dengan rusuk <b>5 cm</b>. Paling banyak berapa mainan yang muat?', unit: 'buah', ans: 48, ex: 'Panjang muat 30 : 5 = 6, lebar 20 : 5 = 4, tinggi 10 : 5 = 2. Jadi 6 × 4 × 2 = 48 mainan.' }
];
const TP_NAME = { '5.1': 'Unsur kubus & balok', '5.2': 'Membandingkan kubus & balok', '5.3': 'Jaring-jaring & luas permukaan', '5.4': 'Volume', '5.5': 'Tampak depan/atas/samping', '5.6': 'Soal cerita volume' };
const DURASI = 30 * 60 * 1000, KKTP = 75;

let S = null, idx = 0, tick = null;
const save = () => Store.set('evalSession', S);

function newSession(ident) {
  const order = shuffle(EVAL.map((_, i) => i));
  const opt = EVAL.map(q => q.type === 'mc' ? shuffle([0, 1, 2, 3]) : null);
  S = { ident, order, opt, ans: {}, start: Date.now(), end: Date.now() + DURASI };
  save();
}
function begin() {
  $('#ident').classList.add('hidden'); $('#exam').classList.remove('hidden');
  $('#who').textContent = `👤 ${S.ident.nama} · Kelas ${S.ident.kelas} · No. ${S.ident.absen}`;
  idx = 0; show();
  clearInterval(tick); tick = setInterval(clock, 500); clock();
}
function clock() {
  const left = Math.max(0, S.end - Date.now()), m = Math.floor(left / 60000), s = Math.floor(left / 1000) % 60;
  $('#clock').textContent = `⏱️ ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  $('#clock').style.background = left < 5 * 60000 ? 'var(--coral)' : '';
  if (left <= 0) { clearInterval(tick); popup({ kind: 'bad', title: 'Waktu Habis! ⏰', html: '<p>Jawabanmu akan langsung dinilai.</p>', buttons: [{ label: 'Lihat Nilai ▶', cls: 'sun', onClick: grade }] }); }
}
function drawNav() {
  $('#numnav').innerHTML = S.order.map((qi, k) => `<button class="${k === idx ? 'cur' : S.ans[qi] != null && S.ans[qi] !== '' ? 'ans' : ''}" data-k="${k}">${k + 1}</button>`).join('');
  $$('#numnav button').forEach(b => b.onclick = () => { idx = +b.dataset.k; Sfx.play('click'); show(); });
}
function show() {
  const qi = S.order[idx], q = EVAL[qi];
  drawNav();
  $('#qtype').textContent = `Soal ${idx + 1} · ${q.type === 'mc' ? 'Pilihan ganda' : 'Isian singkat'}`;
  const host = $('#qhost');
  let h = `<div class="qtext">${q.text}</div>${q.vis ? `<div class="qvis">${q.vis}</div>` : ''}`;
  if (q.type === 'mc') {
    h += `<div class="opts">${S.opt[qi].map((oi, k) => {
      const sel = S.ans[qi] === oi ? 'sel' : '';
      return q.pics ? `<button class="opt pic ${sel}" data-o="${oi}"><span class="k">${'ABCD'[k]}</span>${q.pics[oi]}</button>` : `<button class="opt ${sel}" data-o="${oi}"><span class="k">${'ABCD'[k]}</span><span>${q.o[oi]}</span></button>`;
    }).join('')}</div>`;
  } else {
    h += `<div class="numin"><input type="text" inputmode="decimal" id="numAns" placeholder="jawabanmu" value="${S.ans[qi] != null ? esc(S.ans[qi]) : ''}"><span class="unit">${q.unit}</span></div>`;
  }
  host.innerHTML = h;
  if (q.type === 'mc') $$('.opt', host).forEach(b => b.onclick = () => { S.ans[qi] = +b.dataset.o; save(); Sfx.play('click'); $$('.opt', host).forEach(x => x.classList.toggle('sel', x === b)); drawNav(); });
  else { const i = $('#numAns'); i.oninput = () => { S.ans[qi] = i.value; save(); drawNav(); }; i.onkeydown = e => { if (e.key === 'Enter') go(1); }; }
  $('#prevBtn').disabled = idx === 0; $('#nextBtn').disabled = idx === S.order.length - 1;
}
function go(d) { idx = Math.max(0, Math.min(S.order.length - 1, idx + d)); show(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
$('#prevBtn').onclick = () => go(-1);
$('#nextBtn').onclick = () => go(1);
$('#doneBtn').onclick = () => {
  const empty = S.order.filter(qi => S.ans[qi] == null || S.ans[qi] === '').length;
  popup({ title: 'Sudah yakin?', mood: 'wow', html: empty ? `<p>Masih ada <b>${empty} soal</b> yang belum dijawab. Periksa lagi ya!</p>` : '<p>Semua soal sudah dijawab. Kirim jawabanmu sekarang?</p>',
    buttons: [{ label: '◀ Periksa Lagi' }, { label: '🏁 Kirim Jawaban', cls: 'coral', onClick: grade }] });
};

function isRight(qi) {
  const q = EVAL[qi], a = S.ans[qi];
  if (a == null || a === '') return false;
  return q.type === 'mc' ? a === 0 : Math.abs(parseNum(a) - q.ans) < 1e-6;
}
function ansText(qi, a) {
  const q = EVAL[qi];
  if (a == null || a === '') return '<i>tidak dijawab</i>';
  if (q.type === 'num') return esc(a) + ' ' + q.unit;
  return q.pics ? `gambar ${'ABCD'[S.opt[qi].indexOf(a)]}` : q.o[a];
}
function grade() {
  clearInterval(tick);
  const benar = S.order.filter(isRight).length, nilai = benar * 10, lulus = nilai >= KKTP;
  const nama = S.ident.nama;
  const rec = { waktu: new Date().toLocaleString('id-ID'), nama, kelas: S.ident.kelas, absen: S.ident.absen, nilai, benar, tuntas: lulus ? 'Tuntas' : 'Belum tuntas', durasi_menit: Math.round((Date.now() - S.start) / 60000), detail: EVAL.map((_, qi) => isRight(qi) ? 1 : 0).join('') };
  const all = Store.get('results', []); all.push(rec); Store.set('results', all);
  if (window.SHEET_URL) { try { fetch(window.SHEET_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(rec) }); } catch (e) {} }
  if (lulus) { addBadge('lulus'); addStars(20); }
  const perTP = {};
  EVAL.forEach((q, qi) => { perTP[q.tp] = perTP[q.tp] || [0, 0]; perTP[q.tp][1]++; if (isRight(qi)) perTP[q.tp][0]++; });
  const weak = Object.entries(perTP).filter(([, v]) => v[0] < v[1]);
  const session = S; Store.set('evalSession', null);
  $('#exam').classList.add('hidden');
  const r = $('#result'); r.classList.remove('hidden');
  r.innerHTML = `<div class="card center ${lulus ? 'bg-mint' : 'bg-sun'}">
      <div style="display:flex;justify-content:center">${kubiSVG({ acc: kubiAcc(), mood: lulus ? 'happy' : 'wow' }).replace('<svg', '<svg style="width:130px;height:160px"')}</div>
      <h2>${lulus ? `Selamat, ${esc(nama)}! Kamu Tuntas! 🎉` : `Terima kasih, ${esc(nama)}! Ayo belajar lagi! 💪`}</h2>
      <div class="score-big mt1" style="color:${lulus ? 'var(--mint)' : 'var(--orange)'}">${nilai}</div>
      <p>${benar} dari 10 soal benar · KKTP ${KKTP}</p>
      <div class="row mt2" style="justify-content:center">
        ${lulus ? '<button class="btn sun" id="certBtn">🏅 Unduh Sertifikat</button>' : '<a class="btn sky" href="materi.html">📘 Pelajari Lagi</a>'}
        <button class="btn" id="revBtn">📖 Lihat Pembahasan</button>
        <button class="btn" id="againBtn">🔁 Kerjakan Ulang</button>
      </div>
    </div>
    <div class="card mt2"><h3>📊 Hasil per Tujuan Pembelajaran</h3>
      <table class="tb mt1"><tr><th>TP</th><th>Materi</th><th>Benar</th></tr>
      ${Object.keys(perTP).sort().map(k => `<tr><td>${k}</td><td>${TP_NAME[k]}</td><td>${perTP[k][0]} dari ${perTP[k][1]} ${perTP[k][0] === perTP[k][1] ? '✅' : '⚠️'}</td></tr>`).join('')}</table>
      ${weak.length ? `<p class="mt1 remember">💡 Saran Kubi: pelajari lagi <b>${weak.map(([k]) => TP_NAME[k]).join(', ')}</b>.</p>` : '<p class="mt1">Semua tujuan pembelajaran sudah kamu kuasai. Hebat!</p>'}
    </div>
    <div id="review" class="hidden mt2">${session.order.map((qi, k) => { const q = EVAL[qi], ok = isRight(qi); return `<div class="review ${ok ? 'r-ok' : 'r-bad'}"><b class="fd" style="font-size:1.2rem">Soal ${k + 1} ${ok ? '✅ Benar' : '❌ Salah'}</b><p>${q.text}</p>
      <p>Jawabanmu: <b>${ansText(qi, session.ans[qi])}</b>${ok ? '' : ` · Jawaban benar: <b>${q.type === 'num' ? q.ans + ' ' + q.unit : q.pics ? 'gambar ' + 'ABCD'[session.opt[qi].indexOf(0)] : q.o[0]}</b>`}</p>
      ${q.pics && !ok ? `<div style="max-width:140px">${q.pics[0]}</div>` : ''}<p><b>Pembahasan:</b> ${q.ex}</p></div>`; }).join('')}</div>`;
  if (lulus) { Sfx.play('win'); confetti(220); $('#certBtn').onclick = () => certificate(nama, S.ident.kelas, nilai); }
  else Sfx.play('ok');
  $('#revBtn').onclick = () => { $('#review').classList.toggle('hidden'); };
  $('#againBtn').onclick = () => { $('#result').classList.add('hidden'); $('#ident').classList.remove('hidden'); };
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- sertifikat PNG ---------- */
async function certificate(nama, kelas, nilai) {
  const W = 1600, H = 1130, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  try { await document.fonts.load('700 40px Fredoka'); await document.fonts.load('800 30px Nunito'); } catch (e) {}
  x.fillStyle = '#FFF8E7'; x.fillRect(0, 0, W, H);
  x.fillStyle = '#3BB8F0'; x.fillRect(0, 0, W, 28); x.fillRect(0, H - 28, W, 28);
  x.lineWidth = 10; x.strokeStyle = '#23264A'; x.strokeRect(50, 60, W - 100, H - 120);
  x.lineWidth = 4; x.strokeStyle = '#FFD23F'; x.strokeRect(72, 82, W - 144, H - 164);
  const star = (cx, cy, r, f) => { x.beginPath(); for (let i = 0; i < 10; i++) { const rr = i % 2 ? r * .45 : r, a = -Math.PI / 2 + i * Math.PI / 5; x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } x.closePath(); x.fillStyle = f; x.fill(); x.lineWidth = 4; x.strokeStyle = '#23264A'; x.stroke(); };
  star(170, 190, 48, '#FFD23F'); star(W - 170, 190, 48, '#FFD23F'); star(260, 950, 30, '#FF9F1C'); star(W - 260, 950, 30, '#FF9F1C');
  x.textAlign = 'center'; x.fillStyle = '#7B61FF'; x.font = '600 44px Fredoka, sans-serif'; x.fillText('Petualangan Bangun Ruang', W / 2, 190);
  x.fillStyle = '#23264A'; x.font = '700 120px Fredoka, sans-serif'; x.fillText('SERTIFIKAT', W / 2, 330);
  x.font = '600 50px Fredoka, sans-serif'; x.fillStyle = '#FF9F1C'; x.fillText('JUARA RUANG', W / 2, 400);
  x.fillStyle = '#23264A'; x.font = '700 38px Nunito, sans-serif'; x.fillText('diberikan kepada', W / 2, 490);
  x.font = '700 96px Fredoka, sans-serif'; x.fillStyle = '#3BB8F0'; x.fillText(nama, W / 2, 600);
  x.fillStyle = '#23264A'; x.font = '700 36px Nunito, sans-serif';
  x.fillText(`Kelas ${kelas} · telah menuntaskan Evaluasi Bangun Ruang (Kubus dan Balok)`, W / 2, 690);
  x.font = '700 64px Fredoka, sans-serif'; x.fillStyle = '#06C793'; x.fillText(`Nilai: ${nilai}`, W / 2, 790);
  x.fillStyle = '#23264A'; x.font = '700 30px Nunito, sans-serif';
  x.fillText(new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), W / 2, 870);
  const img = new Image();
  img.onload = () => {
    x.drawImage(img, W - 330, 760, 210, 265); x.drawImage(img, 120, 760, 210, 265);
    const a = document.createElement('a'); a.download = `Sertifikat-Juara-Ruang-${nama.replace(/\s+/g, '-')}.png`; a.href = c.toDataURL('image/png'); a.click();
    toast('🏅 Sertifikat sudah diunduh!');
  };
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(kubiSVG({ acc: 'mahkota' }).replace('<svg ', '<svg width="136" height="172" '));
}

/* ---------- mulai ---------- */
const nm = playerName(); if (nm) $('#fNama').value = nm;
const old = Store.get('evalSession', null);
if (old && old.end > Date.now()) {
  S = old;
  popup({ title: 'Lanjutkan evaluasi?', html: `<p>Ada evaluasi yang belum selesai atas nama <b>${esc(old.ident.nama)}</b>.</p>`, buttons: [{ label: 'Mulai Baru', onClick: () => { S = null; Store.set('evalSession', null); } }, { label: '▶ Lanjutkan', cls: 'sun', onClick: begin }] });
}
$('#startBtn').onclick = () => {
  const nama = $('#fNama').value.trim(), kelas = $('#fKelas').value.trim(), absen = $('#fAbsen').value.trim();
  const miss = [!nama && 'nama', !kelas && 'kelas', !absen && 'nomor absen'].filter(Boolean);
  if (miss.length) { Sfx.play('bad'); popup({ kind: 'bad', title: 'Identitas belum lengkap', html: `<p>Isi dulu ${miss.join(', ')} ya.</p>`, buttons: [{ label: 'OK', cls: 'sun' }] }); return; }
  Sfx.play('click'); newSession({ nama, kelas, absen }); begin();
};
