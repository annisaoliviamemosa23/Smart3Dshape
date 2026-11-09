/* ===== Bank soal & pembuat soal acak ===== */
const CUBE_C = '#3BB8F0', BALOK_C = '#06C793';

const Gen = {
  /* --- unsur kubus & balok --- */
  unsur() {
    const kub = isoSVG([{ x: 0, y: 0, z: 0, dx: 2, dy: 2, dz: 2, c: CUBE_C }], { size: 46 });
    const bal = isoSVG([{ x: 0, y: 0, z: 0, dx: 3, dy: 1.6, dz: 1.8, c: BALOK_C }], { size: 44 });
    const pool = [
      () => mcNum('Berapa banyak <b>sisi</b> pada kubus ini?', 6, [4, 8, 12], '', { vis: kub, hint: 'Sisi adalah permukaan datar: atas, bawah, depan, belakang, kiri, kanan.' }),
      () => mcNum('Berapa banyak <b>rusuk</b> pada balok ini?', 12, [6, 8, 10], '', { vis: bal, hint: 'Rusuk adalah garis tempat dua sisi bertemu. Ada 4 panjang, 4 lebar, dan 4 tinggi.' }),
      () => mcNum('Berapa banyak <b>titik sudut</b> pada kubus ini?', 8, [4, 6, 12], '', { vis: kub, hint: 'Hitung pojok di bagian atas (4), lalu di bagian bawah (4).' }),
      () => mcNum('Berapa banyak <b>titik sudut</b> pada balok ini?', 8, [6, 10, 12], '', { vis: bal, hint: 'Balok punya pojok sebanyak kubus.' }),
      () => mcText('Sisi-sisi kubus berbentuk ...', ['persegi', 'persegi panjang', 'segitiga', 'lingkaran'], { vis: kub, hint: 'Semua rusuk kubus sama panjang, jadi sisinya ...' }),
      () => mcText('Rusuk-rusuk kubus panjangnya ...', ['semuanya sama', 'semuanya berbeda', 'ada 3 ukuran', 'ada 2 ukuran'], { hint: 'Kubus adalah bangun ruang yang paling "rapi".' }),
      () => mcText('Benda yang berbentuk <b>balok</b> adalah ...', ['kotak sepatu', 'dadu', 'bola', 'kaleng susu'], { hint: 'Cari benda dengan sisi persegi panjang.' }),
      () => mcText('Benda yang berbentuk <b>kubus</b> adalah ...', ['dadu', 'kotak pensil', 'kaleng', 'buku'], { hint: 'Cari benda yang semua sisinya persegi sama besar.' }),
      () => mcNum('Balok memiliki berapa <b>pasang</b> sisi yang sama dan sejajar?', 3, [2, 4, 6], '', { vis: bal, hint: 'Atas dengan bawah, depan dengan belakang, kiri dengan ...' }),
      () => mcNum('Pada satu titik sudut kubus, ada berapa <b>rusuk</b> yang bertemu?', 3, [2, 4, 6], '', { vis: kub, hint: 'Lihat satu pojok saja, lalu hitung garis yang keluar dari pojok itu.' }),
      () => mcText('Apa persamaan kubus dan balok?', ['banyak sisi, rusuk, dan titik sudutnya sama', 'semua rusuknya sama panjang', 'semua sisinya persegi', 'tidak punya titik sudut'], { hint: 'Bandingkan jumlah sisi, rusuk, dan titik sudutnya.' })
    ];
    return pick(pool)();
  },

  /* --- jaring-jaring --- */
  net(mode) {
    const not = mode === 'not' || (mode == null && Math.random() < .3);
    let opts;
    if (!not) opts = [{ c: transformNet(pick(NETS_OK)), ok: 1 }, ...shuffle(NETS_BAD).slice(0, 3).map(c => ({ c: transformNet(c), ok: 0 }))];
    else opts = [{ c: transformNet(pick(NETS_BAD)), ok: 1 }, ...shuffle(NETS_OK).slice(0, 3).map(c => ({ c: transformNet(c), ok: 0 }))];
    opts = shuffle(opts);
    return {
      text: not ? 'Manakah yang <b>BUKAN</b> jaring-jaring kubus?' : 'Manakah yang merupakan <b>jaring-jaring kubus</b>?',
      type: 'mc', options: opts.map(o => ({ pic: netSVG(o.c) })), answer: opts.findIndex(o => o.ok),
      hint: 'Bayangkan melipatnya. Jika ada dua persegi yang menutup sisi yang sama, atau ada 4 persegi membentuk kotak 2 × 2, itu bukan jaring-jaring kubus.'
    };
  },

  /* --- hitung kubus satuan --- */
  kubusSatuan() {
    const p = rnd(2, 4), l = rnd(2, 3), t = rnd(1, 3);
    return { text: `Berapa banyak <b>kubus satuan</b> yang menyusun balok ini?`, vis: isoSVG(unitCubes(p, l, t, '#7B61FF'), { size: 28 }), type: 'num', answer: p * l * t, unit: 'kubus', hint: `Hitung satu lapis dulu: ${p} × ${l}. Lalu kalikan dengan banyak lapisnya (${t}).` };
  },

  /* --- volume angka --- */
  volume(asMC) {
    const kind = rnd(0, 4); let q;
    if (kind === 0) { const s = rnd(3, 10); q = { text: `Sebuah kubus memiliki rusuk <b>${s} cm</b>. Berapa volumenya?`, ans: s ** 3, unit: 'cm³', wr: [s * 3, s * s, 6 * s * s], hint: 'Volume kubus = s × s × s (bukan s + s + s).', vis: isoSVG([{ x: 0, y: 0, z: 0, dx: 2, dy: 2, dz: 2, c: CUBE_C }], { size: 34, labels: { p: s + ' cm', l: s + ' cm', t: s + ' cm' } }) }; }
    else if (kind === 1) { const p = rnd(4, 12), l = rnd(2, 8), t = rnd(2, 9); q = { text: `Balok berukuran panjang <b>${p} cm</b>, lebar <b>${l} cm</b>, dan tinggi <b>${t} cm</b>. Berapa volumenya?`, ans: p * l * t, unit: 'cm³', wr: [p + l + t, p * l, 2 * (p * l + p * t + l * t)], hint: 'Volume balok = p × l × t.', vis: isoSVG([{ x: 0, y: 0, z: 0, dx: 3, dy: 1.6, dz: 1.8, c: BALOK_C }], { size: 34, labels: { p: p + ' cm', l: l + ' cm', t: t + ' cm' } }) }; }
    else if (kind === 2) { const s = rnd(3, 10); q = { text: `Volume sebuah kubus adalah <b>${fmt(s ** 3)} cm³</b>. Berapa panjang rusuknya?`, ans: s, unit: 'cm', wr: [Math.round(s ** 3 / 3), s * s, s + 2], hint: 'Cari bilangan yang jika dikalikan tiga kali dengan dirinya sendiri hasilnya volume itu.' }; }
    else if (kind === 3) { const p = rnd(5, 12), l = rnd(2, 6), t = rnd(2, 8); q = { text: `Balok bervolume <b>${fmt(p * l * t)} cm³</b> dengan panjang ${p} cm dan lebar ${l} cm. Berapa tingginya?`, ans: t, unit: 'cm', wr: [p * l, t + 2, p * l * t - p * l], hint: `Tinggi = volume : (p × l) = ${fmt(p * l * t)} : ${p * l}.` }; }
    else { const s = pick([50, 60, 80, 100]); q = { text: `Bak mandi berbentuk kubus dengan rusuk <b>${s} cm</b>. Jika diisi penuh, berapa <b>liter</b> air di dalamnya? (1 liter = 1.000 cm³)`, ans: s ** 3 / 1000, unit: 'liter', wr: [s * 3, s * s / 10, s ** 3 / 100], hint: `Hitung volume dalam cm³ dulu (${s} × ${s} × ${s}), lalu bagi 1.000.` }; }
    if (asMC) return mcNum(q.text, q.ans, q.wr, q.unit, { hint: q.hint, vis: q.vis });
    return { text: q.text, type: 'num', answer: q.ans, unit: q.unit, hint: q.hint, vis: q.vis };
  },

  /* --- luas permukaan --- */
  luas(asMC) {
    let q;
    if (Math.random() < .5) { const s = rnd(2, 9); q = { text: `Berapa <b>luas permukaan</b> kubus dengan rusuk ${s} cm?`, ans: 6 * s * s, wr: [s ** 3, 4 * s * s, 12 * s], hint: 'Kubus punya 6 sisi persegi. Luas permukaan = 6 × s × s.' }; }
    else { const p = rnd(4, 10), l = rnd(2, 5), t = rnd(2, 6); q = { text: `Berapa <b>luas permukaan</b> balok ${p} cm × ${l} cm × ${t} cm?`, ans: 2 * (p * l + p * t + l * t), wr: [p * l * t, p * l + p * t + l * t, 2 * p * l], hint: 'Luas permukaan balok = 2 × (p×l + p×t + l×t).' }; }
    if (asMC) return mcNum(q.text, q.ans, q.wr, 'cm²', { hint: q.hint });
    return { text: q.text, type: 'num', answer: q.ans, unit: 'cm²', hint: q.hint };
  },

  /* --- tampak depan / atas / samping --- */
  tampak(which) {
    let h, V;
    for (let tries = 0; tries < 50; tries++) {
      const Y = rnd(2, 3), X = rnd(2, 3);
      h = Array.from({ length: Y }, () => Array.from({ length: X }, () => rnd(0, 3)));
      if (h.flat().filter(v => v).length < 3 || h[0].every(v => !v) || h.every(r => !r[0]) || h[Y - 1].every(v => !v) || h.every(r => !r[X - 1])) continue;
      V = viewsOf(h);
      if (new Set([gridKey(V.top), gridKey(V.front), gridKey(V.side)]).size === 3) break;
    }
    which = which || pick(['atas', 'depan', 'samping']);
    const correct = which === 'atas' ? V.top : which === 'depan' ? V.front : V.side;
    const cands = [V.top, V.front, V.side, V.top.map(r => r.slice().reverse()), V.front.map(r => r.slice().reverse()), V.side.map(r => r.slice().reverse())];
    const seen = new Set([gridKey(correct)]), wrong = [];
    shuffle(cands).forEach(g => { const k = gridKey(g); if (!seen.has(k) && wrong.length < 3) { seen.add(k); wrong.push(g); } });
    let opts = shuffle([{ g: correct, ok: 1 }, ...wrong.map(g => ({ g, ok: 0 }))]);
    const X = h[0].length, Y = h.length;
    return {
      text: `Perhatikan susunan kubus. Manakah gambar <b>tampak ${which === 'samping' ? 'samping (kanan)' : which}</b>-nya?`,
      vis: isoSVG(stackBoxes(h), { size: 30, front: [X, Y] }), type: 'mc',
      options: opts.map(o => ({ pic: gridSVG(o.g, { s: 26 }) })), answer: opts.findIndex(o => o.ok),
      hint: which === 'atas' ? 'Bayangkan kamu terbang di atasnya. Hanya terlihat petak yang ada kubusnya.' : which === 'depan' ? 'Berdirilah di sisi bertanda DEPAN. Lihat kubus tertinggi di setiap kolom.' : 'Berdirilah di sisi kanan. Lihat kubus tertinggi di setiap baris.'
    };
  },

  /* --- soal cerita --- */
  cerita() {
    const pool = [
      () => { const p = 60, l = 30, t = 40; return mcNum(`Akuarium berbentuk balok berukuran ${p} cm × ${l} cm × ${t} cm. Berapa volumenya?`, p * l * t, [p + l + t, p * l, p * l * t * 10], 'cm³', { hint: 'Volume = p × l × t.' }); },
      () => { const s = rnd(4, 8); return mcNum(`Rina menyusun kubus-kubus kecil menjadi kubus besar dengan ${s} kubus di setiap rusuknya. Berapa kubus kecil yang dibutuhkan?`, s ** 3, [s * s, s * 6, s * 12], 'buah', { hint: 'Banyak kubus kecil = s × s × s.' }); },
      () => { const p = 10, l = 5, t = 2; return mcNum(`Kolam renang berukuran ${p} m × ${l} m × ${t} m. Berapa volume kolam itu?`, p * l * t, [p + l + t, p * l, 2 * (p * l + p * t + l * t)], 'm³', { hint: 'Soal cerita tetap memakai V = p × l × t.' }); },
      () => { return mcNum('Kardus 30 cm × 20 cm × 10 cm akan diisi mainan berbentuk kubus dengan rusuk 5 cm. Paling banyak berapa mainan yang muat?', 48, [60, 24, 6000], 'buah', { hint: 'Panjang muat 30:5 = 6, lebar muat 20:5 = 4, tinggi muat 10:5 = 2.' }); },
      () => { const s = pick([10, 20, 30]); return mcNum(`Ayah membuat kotak kado berbentuk kubus dengan rusuk ${s} cm. Berapa cm² kertas kado minimal untuk menutup semua sisinya?`, 6 * s * s, [s ** 3, 4 * s * s, 12 * s], 'cm²', { hint: 'Yang ditutup adalah permukaan, jadi pakai luas permukaan = 6 × s × s.' }); },
      () => { const s = pick([50, 60, 100]); return mcNum(`Bak air berbentuk kubus dengan rusuk ${s} cm diisi penuh. Berapa liter airnya?`, s ** 3 / 1000, [s ** 3 / 100, s * 3, s * s / 10], 'liter', { hint: '1 liter = 1.000 cm³. Hitung volume, lalu bagi 1.000.' }); },
      () => { const t = rnd(2, 5); return mcNum(`Sebuah lemari berbentuk balok bervolume ${fmt(40 * 50 * t * 10)} cm³, panjang 40 cm, lebar 50 cm. Berapa tingginya?`, t * 10, [t, t * 100, 40 + 50], 'cm', { hint: 'Tinggi = volume : (p × l).' }); }
    ];
    return pick(pool)();
  }
};
