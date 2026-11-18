/* ==========================================================
   Thiệp cưới — hành vi trang (dữ liệu nằm trong js/config.js)
   ========================================================== */
(function () {
  'use strict';

  document.documentElement.classList.add('js');
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  const C = window.WEDDING;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const pad = (n) => String(n).padStart(2, '0');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Tiện ích ngày giờ ---------- */
  const parseDate = (s) => new Date(s + 'T00:00:00');
  const weekday = (d) => d.toLocaleDateString('vi-VN', { weekday: 'long' });
  const fmtStamp = (d) =>
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;

  const cd = parseDate(C.ceremony.date);
  const pd = parseDate(C.party.date);

  /* ---------- Dữ liệu hiển thị suy ra từ config ---------- */
  const view = {
    coverDate: `${pd.getDate()} tháng ${pd.getMonth() + 1}, ${pd.getFullYear()}`,
    groomRole: C.groom.role,
    brideRole: C.bride.role,
    ceremonyPlace: C.ceremony.place,
    ceremonyAt: `Vào lúc ${C.ceremony.time}`,
    ceremonyWeekday: weekday(cd),
    ceremonyDay: pad(cd.getDate()),
    ceremonyMonth: `Tháng ${pad(cd.getMonth() + 1)}`,
    ceremonyYear: String(cd.getFullYear()),
    ceremonyLunar: `(Tức ngày ${C.ceremony.lunar})`,
    partyWeekday: weekday(pd),
    partyDay: pad(pd.getDate()),
    partyMonth: `Tháng ${pad(pd.getMonth() + 1)}`,
    partyYear: String(pd.getFullYear()),
    partyLunar: `(Tức ngày ${C.party.lunar})`
  };
  const data = Object.assign({}, C, { view: view });

  function bindText() {
    $$('[data-bind]').forEach((el) => {
      const v = el.dataset.bind.split('.').reduce((a, k) => (a == null ? a : a[k]), data);
      if (v != null) el.textContent = v;
    });
    document.title = `Thiệp cưới ${C.groom.name} & ${C.bride.name}`;
  }

  /* ---------- Ảnh minh hoạ (khi chưa có ảnh thật) ---------- */
  function placeholder(i) {
    const P = [
      ['#f0e2d2', '#c79a88'], ['#ecdccb', '#b98778'], ['#f2e6d6', '#c9a27d'], ['#e5d1c0', '#a56f66'],
      ['#efe0d0', '#bd8f82'], ['#e9d8c6', '#a87b72'], ['#f1e3d5', '#c19a8a']
    ][i % 7];
    const sx = [0, -30, 25, -10, 35, -25, 10][i % 7];
    const flip = i % 2 ? -1 : 1;
    const svg =
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 900'>` +
      `<defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='${P[0]}'/><stop offset='1' stop-color='${P[1]}'/></linearGradient>` +
      `<radialGradient id='l' cx='.5' cy='.3' r='.6'><stop offset='0' stop-color='#fff' stop-opacity='.6'/><stop offset='1' stop-color='#fff' stop-opacity='0'/></radialGradient></defs>` +
      `<rect width='600' height='900' fill='url(#g)'/><rect width='600' height='900' fill='url(#l)'/>` +
      `<g transform='translate(${300 + sx} 0) scale(${flip} 1) translate(-300 0)'>` +
      /* chú rể */
      `<path d='M165 430Q250 372 335 430L352 790H148Z' fill='#6a5d52'/>` +
      `<path d='M250 392L224 468L250 522L276 468Z' fill='#f7f2ea'/><path d='M244 420h12l5 40-11 12-11-12z' fill='#7b2430'/>` +
      `<rect x='236' y='350' width='28' height='40' rx='10' fill='#e2bd9f'/>` +
      `<circle cx='250' cy='308' r='42' fill='#ebcbb0'/><path d='M208 304Q214 252 252 258Q290 252 294 304Q276 276 250 280Q226 278 208 304Z' fill='#3d2a24'/>` +
      /* cô dâu */
      `<path d='M312 450Q372 404 432 450L488 820H256Z' fill='#fbf4ec'/><path d='M312 450Q372 404 432 450L440 560Q372 590 304 560Z' fill='#fff' fill-opacity='.7'/>` +
      `<path d='M330 330Q300 460 262 560L300 640Q330 480 372 380Z' fill='#fff' fill-opacity='.45'/>` +
      `<rect x='358' y='366' width='26' height='42' rx='10' fill='#e6c3a6'/>` +
      `<circle cx='371' cy='334' r='38' fill='#efd0b6'/><path d='M331 332Q330 280 372 284Q414 282 412 340Q400 308 372 306Q346 308 331 332Z' fill='#4a2f2a'/><circle cx='404' cy='304' r='16' fill='#4a2f2a'/>` +
      `<circle cx='312' cy='580' r='20' fill='#7b2430'/><circle cx='336' cy='592' r='17' fill='#a8434f'/><circle cx='296' cy='604' r='15' fill='#c9a24a'/><circle cx='322' cy='616' r='14' fill='#7b2430'/>` +
      `</g>` +
      `<text x='300' y='862' text-anchor='middle' font-family='Georgia,serif' font-size='24' letter-spacing='8' fill='#511419' fill-opacity='.38'>ẢNH CƯỚI ${i + 1}</text>` +
      `</svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  const photos = C.photos && C.photos.length
    ? C.photos
    : Array.from({ length: C.photoCount || 7 }, (_, i) => placeholder(i));

  function bindPhotos() {
    $$('img[data-photo]').forEach((img) => {
      img.src = photos[Number(img.dataset.photo) % photos.length];
    });
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  /* ---------- Bìa thiệp ---------- */
  function initCover() {
    const cover = $('#cover');
    const guest = new URLSearchParams(location.search).get('to');
    if (guest && guest.trim()) {
      const g = $('#guestName');
      g.textContent = guest.trim().slice(0, 60);
      g.hidden = false;
    }

    const colors = ['rgba(236,160,172,.65)', 'rgba(232,196,130,.55)', 'rgba(250,226,218,.6)', 'rgba(200,90,105,.5)'];
    const wrap = $('#petals');
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('span');
      p.className = 'petal';
      const s = (7 + Math.random() * 11).toFixed(1);
      p.style.cssText =
        `--x:${(Math.random() * 100).toFixed(1)}%;--s:${s}px;--o:${(0.35 + Math.random() * 0.45).toFixed(2)};` +
        `--t:${(9 + Math.random() * 10).toFixed(1)}s;--dl:-${(Math.random() * 14).toFixed(1)}s;` +
        `--sway:${(Math.random() * 120 - 60).toFixed(0)}px;--c:${colors[i % colors.length]}`;
      wrap.appendChild(p);
    }

    $('#openBtn').addEventListener('click', function () {
      cover.classList.add('is-open');
      document.body.classList.remove('locked');
      window.scrollTo(0, 0);
      startMusic();
      startReveal();
      carousel.start();
      setTimeout(function () {
        cover.setAttribute('aria-hidden', 'true');
        cover.hidden = true;
      }, 1600);
    });
  }

  /* ---------- Hiệu ứng hiện dần khi cuộn ---------- */
  function startReveal() {
    const items = $$('.reveal');
    if (!('IntersectionObserver' in window) || reduceMotion) {
      items.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ---------- Lịch tháng ---------- */
  function renderCalendar() {
    const y = pd.getFullYear();
    const m = pd.getMonth();
    const eventDay = pd.getDate();
    const first = (new Date(y, m, 1).getDay() + 6) % 7; // tuần bắt đầu từ T2
    const days = new Date(y, m + 1, 0).getDate();
    let html = `<div class="cal-title">Tháng ${m + 1} / ${y}</div><div class="cal-grid">`;
    ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].forEach((d) => (html += `<div class="cal-dow">${d}</div>`));
    for (let i = 0; i < first; i++) html += '<div></div>';
    for (let d = 1; d <= days; d++) {
      html += d === eventDay
        ? `<div class="cal-day is-event" aria-label="Ngày cưới"><span>${d}</span></div>`
        : `<div class="cal-day">${d}</div>`;
    }
    $('#calendar').innerHTML = html + '</div>';
  }

  function downloadIcs() {
    const ymd = `${pd.getFullYear()}${pad(pd.getMonth() + 1)}${pad(pd.getDate())}`;
    const t = (s) => s.replace(':', '') + '00';
    const esc = (s) => String(s).replace(/[\\;,]/g, (m) => '\\' + m).replace(/\n/g, '\\n');
    const now = new Date();
    const stamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Save the Date//VI', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${ymd}-${Date.now()}@save-the-date`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${ymd}T${t(C.party.doorsOpen)}`,
      `DTEND:${ymd}T${t(C.party.end)}`,
      `SUMMARY:${esc(`Tiệc cưới ${C.groom.name} & ${C.bride.name}`)}`,
      `LOCATION:${esc(`${C.party.venueName}, ${C.party.address}`)}`,
      `DESCRIPTION:${esc(`Khai tiệc lúc ${C.party.start}. Rất mong được đón tiếp bạn!`)}`,
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tiec-cuoi.ics';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Đã tạo sự kiện lịch (.ics)');
  }

  /* ---------- Bản đồ / dress code / lịch trình ---------- */
  function renderVenue() {
    const q = encodeURIComponent(C.party.mapQuery || `${C.party.venueName} ${C.party.address}`);
    $('#mapFrame').src = `https://www.google.com/maps?q=${q}&output=embed&hl=vi`;
    $('#directions').href = `https://www.google.com/maps/dir/?api=1&destination=${q}`;
  }

  function renderDress() {
    const box = $('#swatches');
    C.dressCode.colors.forEach((c) => {
      const s = document.createElement('span');
      s.className = 'swatch';
      s.style.background = c;
      s.title = c;
      box.appendChild(s);
    });
  }

  const SVG_NS = 'http://www.w3.org/2000/svg';
  function icon(name) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS(SVG_NS, 'use');
    use.setAttribute('href', '#ic-' + name);
    svg.appendChild(use);
    return svg;
  }

  function renderTimeline() {
    const ol = $('#timeline');
    C.timeline.forEach((it) => {
      const li = document.createElement('li');
      li.className = 'tl-item';
      const time = document.createElement('div');
      time.className = 'tl-time';
      if (it.icon && it.icon !== 'none') {
        const ic = document.createElement('span');
        ic.className = 'tl-ic';
        ic.appendChild(icon(it.icon));
        time.appendChild(ic);
      }
      const t = document.createElement('time');
      t.textContent = it.time;
      time.appendChild(t);
      const dot = document.createElement('i');
      dot.className = 'tl-dot';
      const label = document.createElement('div');
      label.className = 'tl-label';
      label.textContent = it.label;
      li.append(time, dot, label);
      ol.appendChild(li);
    });
  }

  /* ---------- Album: carousel 3D ---------- */
  const carousel = (function () {
    const stage = $('#albumStage');
    const dotsBox = $('#albumDots');
    const n = photos.length;
    let cur = 0;
    let timer = null;
    let slides = [];
    let dots = [];

    function build() {
      slides = photos.map((src, i) => {
        const el = document.createElement('div');
        el.className = 'slide';
        el.setAttribute('role', 'group');
        el.setAttribute('aria-label', `Ảnh ${i + 1} / ${n}`);
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Ảnh cưới ${i + 1}`;
        img.draggable = false;
        el.appendChild(img);
        el.addEventListener('click', () => { if (i !== cur) go(i); });
        stage.appendChild(el);
        return el;
      });
      dots = photos.map((_, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'dot';
        b.setAttribute('aria-label', `Xem ảnh ${i + 1}`);
        b.addEventListener('click', () => go(i));
        dotsBox.appendChild(b);
        return b;
      });
    }

    function layout() {
      slides.forEach((el, i) => {
        let d = i - cur;
        if (d > n / 2) d -= n;
        if (d < -n / 2) d += n;
        el.style.setProperty('--d', d);
        el.style.setProperty('--abs', Math.abs(d));
        el.classList.toggle('is-active', d === 0);
        el.dataset.hidden = Math.abs(d) > 3 ? '1' : '';
        el.setAttribute('aria-hidden', d === 0 ? 'false' : 'true');
      });
      dots.forEach((b, i) => b.classList.toggle('on', i === cur));
    }

    function go(i) { cur = (i + n) % n; layout(); restart(); }
    const next = () => go(cur + 1);
    const prev = () => go(cur - 1);

    function start() {
      if (reduceMotion || n < 2 || timer) return;
      timer = setInterval(() => { cur = (cur + 1) % n; layout(); }, 3800);
    }
    function stop() { clearInterval(timer); timer = null; }
    function restart() { if (timer) { stop(); start(); } }

    function init() {
      build();
      layout();
      $('#albumPrev').addEventListener('click', prev);
      $('#albumNext').addEventListener('click', next);

      // vuốt
      let x0 = null;
      stage.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
      stage.addEventListener('pointerup', (e) => {
        if (x0 == null) return;
        const dx = e.clientX - x0;
        x0 = null;
        if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
      });
      stage.addEventListener('pointercancel', () => { x0 = null; });

      stage.tabIndex = 0;
      stage.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      });
      stage.addEventListener('mouseenter', stop);
      stage.addEventListener('mouseleave', () => { if (!document.body.classList.contains('locked')) start(); });
      document.addEventListener('visibilitychange', () => { document.hidden ? stop() : (!document.body.classList.contains('locked') && start()); });
    }
    return { init: init, start: start };
  })();

  /* ---------- Sổ lưu bút ---------- */
  const WISH_KEY = 'std.wishes.v1';
  function loadWishes() {
    try { return JSON.parse(localStorage.getItem(WISH_KEY)) || []; } catch (e) { return []; }
  }
  function saveWishes(list) {
    try { localStorage.setItem(WISH_KEY, JSON.stringify(list.slice(0, 50))); } catch (e) { /* bỏ qua */ }
  }
  function wishNode(w, isNew) {
    const box = document.createElement('article');
    box.className = 'wish' + (isNew ? ' is-new' : '');
    const head = document.createElement('div');
    head.className = 'wish-head';
    const b = document.createElement('b');
    b.textContent = w.name;
    const t = document.createElement('time');
    t.textContent = fmtStamp(new Date(w.ts));
    head.append(b, t);
    const p = document.createElement('p');
    p.textContent = w.text;
    box.append(head, p);
    return box;
  }
  function renderWishes(newFirst) {
    const now = Date.now();
    const seeds = (C.wishes || []).map((w) => ({ name: w.name, text: w.text, ts: now - (w.ago || 0) * 60000 }));
    const all = loadWishes().concat(seeds);
    $('#wishes').replaceChildren(...all.map((w, i) => wishNode(w, newFirst && i === 0)));
  }
  function initGuestbook() {
    renderWishes(false);
    const form = $('#wishForm');
    $('#wishWand').addEventListener('click', () => {
      const list = C.wishSuggestions || [];
      if (!list.length) return;
      $('#wishText').value = list[Math.floor(Math.random() * list.length)];
      $('#wishText').focus();
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#wishName').value.trim();
      const text = $('#wishText').value.trim();
      if (!name || !text) {
        toast('Vui lòng nhập tên và lời chúc');
        (name ? $('#wishText') : $('#wishName')).focus();
        return;
      }
      const list = loadWishes();
      list.unshift({ name: name.slice(0, 60), text: text.slice(0, 400), ts: Date.now() });
      saveWishes(list);
      form.reset();
      renderWishes(true);
      toast('Cảm ơn bạn đã gửi lời chúc ♡');
    });
  }

  /* ---------- Hộp thoại ---------- */
  function wireDialog(dlg) {
    $$('[data-close]', dlg).forEach((b) => b.addEventListener('click', () => dlg.close()));
    dlg.addEventListener('click', (e) => {
      const r = dlg.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) dlg.close();
    });
  }

  function initRsvp() {
    const dlg = $('#rsvpDialog');
    wireDialog(dlg);
    $('#rsvpBtn').addEventListener('click', () => dlg.showModal());
    $('#rsvpForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      const name = String(f.get('name') || '').trim();
      if (!name) return;
      try {
        const key = 'std.rsvp.v1';
        const list = JSON.parse(localStorage.getItem(key) || '[]');
        list.push({ name: name.slice(0, 60), status: f.get('status'), guests: Number(f.get('guests')) || 1, ts: Date.now() });
        localStorage.setItem(key, JSON.stringify(list));
      } catch (err) { /* bỏ qua */ }
      e.target.reset();
      dlg.close();
      toast('Đã ghi nhận xác nhận của bạn. Hẹn gặp bạn!');
    });
  }

  function copyText(text) {
    const done = () => toast('Đã sao chép số tài khoản');
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, () => toast(text));
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { toast(text); }
      ta.remove();
    }
  }

  function buildGift() {
    const grid = $('#giftGrid');
    grid.replaceChildren();
    [['Chú rể', C.groom], ['Cô dâu', C.bride]].forEach(([role, p]) => {
      const b = p && p.bank;
      if (!b) return;
      const card = document.createElement('div');
      card.className = 'gift-card';
      const h = document.createElement('h4');
      h.textContent = role;
      const qr = document.createElement('div');
      qr.className = 'qr';
      try {
        const q = window.qrcode(0, 'M');
        q.addData(window.VietQR.build({ bin: b.bin, account: b.account }));
        q.make();
        qr.innerHTML = q.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
      } catch (err) {
        qr.innerHTML = '<span class="qr-fallback">Không tạo được mã QR</span>';
      }
      const info = document.createElement('div');
      info.className = 'bank';
      const bank = document.createElement('span');
      bank.textContent = b.bankName;
      const acc = document.createElement('b');
      acc.textContent = b.account;
      const holder = document.createElement('span');
      holder.textContent = b.holder;
      info.append(bank, acc, holder);
      const copy = document.createElement('button');
      copy.type = 'button';
      copy.className = 'copy';
      copy.textContent = 'Sao chép STK';
      copy.addEventListener('click', () => copyText(b.account));
      card.append(h, qr, info, copy);
      grid.appendChild(card);
    });
  }

  function initGift() {
    const dlg = $('#giftDialog');
    const btn = $('#giftBtn');
    wireDialog(dlg);
    dlg.addEventListener('close', () => btn.classList.remove('open'));
    btn.addEventListener('click', () => {
      btn.classList.add('open');
      buildGift();
      setTimeout(() => dlg.showModal(), reduceMotion ? 0 : 380);
    });
  }

  /* ---------- Nhạc nền ---------- */
  let audio = null;
  function initMusic() {
    if (!C.music || !C.music.src) return;
    const btn = $('#musicBtn');
    btn.hidden = false;
    audio = new Audio(C.music.src);
    audio.loop = true;
    audio.preload = 'none';
    btn.addEventListener('click', () => {
      if (audio.paused) audio.play().then(() => btn.classList.add('playing'), () => {});
      else { audio.pause(); btn.classList.remove('playing'); }
    });
  }
  function startMusic() {
    if (!audio) return;
    audio.play().then(() => $('#musicBtn').classList.add('playing'), () => {});
  }

  /* ---------- Ánh sáng lung linh: quầng sáng / bokeh / sao ---------- */
  const rnd = (a, b) => a + Math.random() * (b - a);
  const fx = (n, d) => rnd(n, d).toFixed(1);
  function mk(cls, vars) {
    const i = document.createElement('i');
    i.className = cls;
    i.style.cssText = vars;
    return i;
  }
  const starVars = (s0, s1, t0, t1) =>
    `--x:${fx(1, 99)}%;--y:${fx(1, 99)}%;--s:${fx(s0, s1)}px;--t:${fx(t0, t1)}s;--dl:-${fx(0, 6)}s`;
  const bokehVars = (light) =>
    `--x:${fx(2, 98)}%;--y:${fx(1, 99)}%;--s:${fx(14, 58)}px;--o:${(light ? rnd(0.35, 0.8) : rnd(0.3, 0.7)).toFixed(2)};` +
    `--dx:${fx(-40, 40)}px;--dy:${fx(-80, -20)}px;--t:${fx(9, 18)}s;--dl:-${fx(0, 14)}s`;

  function initSparkles() {
    const page = $('#page');
    if (!page) return;
    const h = Math.max(page.scrollHeight, 3000);
    const layer = document.createElement('div');
    layer.className = 'sparkles';
    layer.setAttribute('aria-hidden', 'true');
    const frag = document.createDocumentFragment();

    const nGlow = Math.round(h / 560);
    for (let i = 0; i < nGlow; i++) {
      const left = i % 2 ? rnd(64, 96) : rnd(4, 36);
      const top = ((i + 0.5) / nGlow) * 100 + rnd(-2, 2);
      const warm = i % 3 !== 2;
      frag.appendChild(mk('glow',
        `--x:${left.toFixed(1)}%;--y:${top.toFixed(1)}%;--s:${fx(300, 520)}px;` +
        `--c:${warm ? 'rgba(255,200,110,.55)' : 'rgba(238,150,165,.32)'};--t:${fx(7, 12)}s;--dl:-${fx(0, 8)}s`));
    }
    for (let i = 0, n = Math.round(h / 110); i < n; i++) frag.appendChild(mk('bokeh', bokehVars(false)));
    for (let i = 0, n = Math.round(h / 48); i < n; i++) frag.appendChild(mk('star', starVars(10, 26, 2.4, 5.4)));

    layer.appendChild(frag);
    page.insertBefore(layer, page.firstChild);
  }

  function initCardSparkles() {
    $$('.card').forEach((card) => {
      const box = document.createElement('div');
      box.className = 'card-spark';
      box.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < 24; i++) box.appendChild(mk('star star--light', starVars(8, 18, 2.4, 5.2)));
      card.insertBefore(box, card.firstChild);
    });
  }

  function initCoverSparkles() {
    const wrap = $('#petals');
    for (let i = 0; i < 12; i++) wrap.appendChild(mk('bokeh bokeh--light', bokehVars(true)));
    for (let i = 0; i < 36; i++) wrap.appendChild(mk('star star--light', starVars(8, 22, 2.2, 5)));
  }

  /* ---------- Khởi động ---------- */
  bindText();
  bindPhotos();
  renderCalendar();
  renderVenue();
  renderDress();
  renderTimeline();
  carousel.init();
  initGuestbook();
  initRsvp();
  initGift();
  initMusic();
  initCover();
  initCoverSparkles();
  initCardSparkles();
  initSparkles();
  $('#addCal').addEventListener('click', downloadIcs);
})();
