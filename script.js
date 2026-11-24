/* ---------- EXIT environment: an infinite red hallway with signs on its walls ----------
   x/y = % of the stage, s = font size (cqw), b = blur px, o = opacity,
   ry = turn toward the hallway (deg, perspective), rz = tilt, flip = mirrored lettering. */
const GHOSTS = [
  { x: 11, y: 18, s: 7.5, b: 3.5, o: .45, ry: 62,  rz: 3 },  { x: 24, y: 30, s: 5,   b: 2.5, o: .5,  ry: 55 },
  { x: 10, y: 62, s: 8,   b: 4,   o: .35, ry: 65,  rz: -3 }, { x: 25, y: 76, s: 4.6, b: 3,   o: .38, ry: 55 },
  { x: 89, y: 20, s: 7.5, b: 3.5, o: .45, ry: -62, rz: -3, flip: 1 }, { x: 76, y: 32, s: 5, b: 2.5, o: .5, ry: -55, flip: 1 },
  { x: 90, y: 64, s: 8,   b: 4,   o: .35, ry: -65, rz: 3, flip: 1 },  { x: 75, y: 78, s: 4.6, b: 3, o: .38, ry: -55, flip: 1 },
  { x: 36, y: 44, s: 2,   b: 2.5, o: .3,  ry: 40 },          { x: 64, y: 55, s: 2,   b: 2.5, o: .3,  ry: -40, flip: 1 },
  { x: 15, y: 90, s: 7,   b: 8,   o: .2,  ry: 50 },          { x: 85, y: 92, s: 7,   b: 8,   o: .2,  ry: -50, flip: 1 }
];
const SIGNS = [
  { x: 18, y: 48, s: 5.4, b: .8, o: .85, ry: 58, lit: 1, d: 11 },   // the one brighter sign, off to the left
  { x: 82, y: 42, s: 4.4, b: 1.3, o: .7, ry: -58, d: 8 },
  { x: 31, y: 63, s: 2.4, b: 1.6, o: .6, ry: 48, d: 7 },
  { x: 70, y: 70, s: 2.6, b: 1.8, o: .55, ry: -48, d: 10 },
  { x: 40, y: 52, s: 1.1, b: 1.4, o: .5, ry: 30, d: 9 },
  { x: 60, y: 47, s: 1.1, b: 1.4, o: .5, ry: -30, d: 12 }
];
const FRAMES = 10;

const room = document.getElementById('room');
const mk = (tag, cls, parent) => { const e = document.createElement(tag); e.className = cls; parent.appendChild(e); return e; };
const hall = mk('div', 'layer', room); mk('div', 'hall', hall);
for (let i = 0; i < FRAMES; i++) mk('div', 'frame', hall).style.setProperty('--i', i);
const ghosts = mk('div', 'layer', room), signs = mk('div', 'layer', room);
const place = (e, c) => { e.style.cssText = `left:${c.x}%;top:${c.y}%;font-size:calc(${c.s}cqw * var(--k));opacity:${c.o};` +
  `filter:blur(${c.b}px);--ry:${c.ry || 0}deg;--rz:${c.rz || 0}deg;--d:${c.d || 8}s;--fx:${c.flip ? -1 : 1}`; };
const word = () => 'EXIT';
GHOSTS.forEach(c => { const e = mk('span', 'ghost-txt', ghosts); e.textContent = word(c); place(e, c); });
SIGNS.forEach(c => { const e = mk('span', 'sign' + (c.lit ? ' lit' : ''), signs); e.textContent = word(c); place(e, c); });
/* subtle parallax */
{
  addEventListener('pointermove', e => {
    const x = (e.clientX / innerWidth - .5), y = (e.clientY / innerHeight - .5);
    hall.style.transform = `translate(${x * 6}px, ${y * 4}px)`;
    ghosts.style.transform = `translate(${x * 18}px, ${y * 10}px)`;
    signs.style.transform = `translate(${x * 12}px, ${y * 7}px)`;
  }, { passive: true });
}

/* ---------- MUSIC: auto-loaded from assets/music/tracks.json ----------
   To add a song:
     1. Put the .mp3 in assets/music/
     2. Add a line to assets/music/tracks.json:
        { "title": "Song Name", "file": "assets/music/yourfile.mp3" }
   That's it — no changes needed in this file. */
let TRACKS = [];

/* ---------- Links (edit here) ---------- */
const LINKS = {
  music: [
    ['SOUNDCLOUD', 'https://soundcloud.com/wingriddenxxx'],
    ['SPOTIFY', 'https://open.spotify.com/artist/3G7adoiOdj4Jf9a6OALjqb'],
    ['APPLE MUSIC', 'https://music.apple.com/us/artist/wingridden/1619284391'],
    ['YOUTUBE MUSIC', 'https://music.youtube.com/channel/UCQI9gBJjB_BuzQe14k1tiDQ'],
    ['YOUTUBE', 'https://www.youtube.com/@wingriddenxxx']
  ],
  contact: [
    ['TIKTOK', 'https://www.tiktok.com/@wingriddenxxx'],
    ['INSTAGRAM', 'https://www.instagram.com/atribecallednico/'],
    ['X', 'https://x.com/wingridden888'],
    ['EMAIL', 'reveal:wingriddenxxx@gmail.com']
  ]
};
const linkList = key => '<div class="link-list">' + LINKS[key].map(([n, u]) => u.startsWith('reveal:')
  ? `<button type="button" data-reveal="${u.slice(7)}">${n} ↗</button>`
  : `<a href="${u}" target="_blank" rel="noopener">${n} ↗</a>`).join('') + '</div>';

/* ---------- Player (the audio object lives outside the panel so music keeps playing) ---------- */
const audio = new Audio(); audio.preload = 'metadata';
let current = -1;
const fmt = s => isFinite(s) ? Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0') : '';
const playerHTML = () => TRACKS.length
  ? '<div class="tracks">' + TRACKS.map((t, i) =>
      `<button class="track" data-i="${i}"><span class="tp">▶</span><span class="tt">${t.title}</span><span class="tm"></span></button>`).join('') +
    '</div><div class="bar" id="bar"><div class="fill" id="fill"></div></div>'
  : '<p class="no-tracks">No tracks yet — add .mp3 files and update tracks.json.</p>';
function syncPlayer() {
  document.querySelectorAll('.track').forEach(b => {
    const on = +b.dataset.i === current;
    b.classList.toggle('playing', on && !audio.paused);
    b.querySelector('.tp').textContent = on && !audio.paused ? '❚❚' : '▶';
    b.querySelector('.tm').textContent = on ? fmt(audio.currentTime) + ' / ' + fmt(audio.duration) : '';
  });
  const fill = document.getElementById('fill');
  if (fill) fill.style.width = (audio.duration ? audio.currentTime / audio.duration * 100 : 0) + '%';
}
function wirePlayer() {
  document.querySelectorAll('.track').forEach(b => b.addEventListener('click', () => {
    const i = +b.dataset.i;
    if (i === current) { audio.paused ? audio.play() : audio.pause(); }
    else { current = i; audio.src = TRACKS[i].file; audio.play(); }
    syncPlayer();
  }));
  const bar = document.getElementById('bar');
  if (bar) bar.addEventListener('click', e => {
    const r = bar.getBoundingClientRect();
    if (audio.duration) audio.currentTime = (e.clientX - r.left) / r.width * audio.duration;
  });
  syncPlayer();
}
['timeupdate', 'play', 'pause', 'loadedmetadata'].forEach(ev => audio.addEventListener(ev, syncPlayer));
audio.addEventListener('ended', () => {
  if (current < TRACKS.length - 1) { current++; audio.src = TRACKS[current].file; audio.play(); } else syncPlayer();
});

/* ---------- Load tracks from tracks.json (runs once at page load) ---------- */
fetch('assets/music/tracks.json')
  .then(r => r.ok ? r.json() : Promise.reject(r.status))
  .then(data => { TRACKS = data; })
  .catch(() => { TRACKS = []; });  // silently fall back to empty list if file missing

/* ---------- Load visuals from visuals.json (runs once at page load) ---------- */
fetch('assets/visuals/visuals.json')
  .then(r => r.ok ? r.json() : Promise.reject(r.status))
  .then(data => { VISUALS = data; })
  .catch(() => { VISUALS = []; });  // silently fall back to empty list if file missing

/* ---------- VISUALS: auto-loaded from assets/visuals/visuals.json ----------
   To add artwork:
     1. Put NAME.jpg in assets/visuals/ — just the one file, no thumbnail needed
     2. Add a line to assets/visuals/visuals.json:
        { "file": "name", "title": "Title" }
   The site generates thumbnails automatically and reads the dominant colour from the image.
   Add "mono": true only if you want the black & white glitch effect.
   That's it — no changes needed in this file. */
let VISUALS = [];
let currentVisual = -1;

/* --- Dominant-hue extraction via canvas (reads the thumbnail, no server needed) --- */
const _hueCache = {};
function getDominantHue(src) {
  if (_hueCache[src] !== undefined) return Promise.resolve(_hueCache[src]);
  return new Promise(resolve => {
    const img = new Image(); img.crossOrigin = 'anonymous';
    img.onload = () => {
      const cv = document.createElement('canvas'), g = cv.getContext('2d');
      cv.width = cv.height = 32;                        // downsample — fast enough
      g.drawImage(img, 0, 0, 32, 32);
      const px = g.getImageData(0, 0, 32, 32).data;
      let rSum = 0, gSum = 0, bSum = 0, n = 0;
      for (let i = 0; i < px.length; i += 4) {
        const r = px[i], g2 = px[i + 1], b = px[i + 2], sat = Math.max(r, g2, b) - Math.min(r, g2, b);
        if (sat < 20) continue;                         // skip near-grey pixels
        rSum += r; gSum += g2; bSum += b; n++;
      }
      if (!n) { _hueCache[src] = 0; resolve(0); return; }
      /* RGB → hue */
      const r = rSum / n, gv = gSum / n, b = bSum / n;
      const max = Math.max(r, gv, b), min = Math.min(r, gv, b), d = max - min;
      let h = 0;
      if (d) {
        if (max === r)      h = ((gv - b) / d + 6) % 6;
        else if (max === gv) h = (b - r)  / d + 2;
        else                 h = (r - gv) / d + 4;
        h = h / 6 * 360;
      }
      /* rot is the delta from the site's base red (~0°) to the image hue */
      const rot = Math.round(h);
      _hueCache[src] = rot; resolve(rot);
    };
    img.onerror = () => { _hueCache[src] = 0; resolve(0); };
    img.src = src;
  });
}

const setTheme = (deg, mono) => {
  const s = document.documentElement.style;
  s.setProperty('--rot', deg + 'deg'); s.setProperty('--gray', mono ? 1 : 0); s.setProperty('--con', mono ? 1.2 : 1);
};

/* glitch on every image click — intensity controls how wild it gets (0–1) */
function imageGlitch(mono) {
  document.body.classList.remove('pg'); void document.body.offsetWidth; document.body.classList.add('pg');
  staticBurst(document.body, mono ? 900 : 600, true);
  setTimeout(() => document.body.classList.remove('pg'), mono ? 950 : 650);
}

/* downscale the full image into a canvas thumbnail so no -t.jpg files are needed */
function makeThumbnail(src, size = 300) {
  const cv = document.createElement('canvas'); cv.width = cv.height = size;
  const g = cv.getContext('2d'), img = new Image(); img.crossOrigin = 'anonymous';
  img.onload = () => {
    const r = Math.min(size / img.naturalWidth, size / img.naturalHeight);
    const w = img.naturalWidth * r, h = img.naturalHeight * r;
    g.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
  };
  img.src = src;
  return cv;
}
const galleryHTML = () => '<figure class="viewer" id="viewer"></figure><div class="gallery">' + VISUALS.map((v, i) =>
  `<button class="vis${i === currentVisual ? ' active' : ''}" data-v="${i}" data-src="assets/visuals/${v.file}.jpg"><span class="thumb-wrap"></span><span>${v.title}</span></button>`).join('') + '</div>';

function showVisual(i) {
  currentVisual = i;
  const v = VISUALS[i], box = document.getElementById('viewer');
  document.querySelectorAll('.vis').forEach(b => b.classList.toggle('active', +b.dataset.v === i));
  if (!v) { setTheme(0, false); box.className = 'viewer'; box.innerHTML = ''; return; }

  /* fire glitch immediately with current rot, then update rot once hue is known */
  imageGlitch(v.mono);

  getDominantHue(`assets/visuals/${v.file}.jpg`).then(rot => {
    const finalRot = v.rot !== undefined ? v.rot : rot;   // manual override still works
    setTheme(finalRot, v.mono || false);
  });

  box.className = 'viewer';
  box.innerHTML = `<img src="assets/visuals/${v.file}.jpg" alt="${v.title}"><figcaption><span>${v.title}</span><button type="button" id="resetTheme">RESET THEME</button></figcaption>`;
  void box.offsetWidth; box.className = 'viewer on';
  document.getElementById('resetTheme').addEventListener('click', () => showVisual(-1));
}

function wireGallery() {
  document.querySelectorAll('.vis').forEach(b => {
    /* inject canvas thumbnail */
    const wrap = b.querySelector('.thumb-wrap');
    const cv = makeThumbnail(b.dataset.src);
    cv.setAttribute('aria-hidden', 'true');
    wrap.appendChild(cv);
    b.addEventListener('click', () => {
      showVisual(+b.dataset.v);
      document.getElementById('viewer').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
  if (currentVisual >= 0) showVisual(currentVisual);
}

/* ---------- TV static burst over the panel ---------- */
function staticBurst(panelEl, ms = 700, full = false) {
  const cv = document.createElement('canvas'); cv.className = 'static' + (full ? ' fixed' : ''); panelEl.appendChild(cv);
  const g = cv.getContext('2d'), t0 = performance.now();
  (function frame(now) {
    const p = (now - t0) / ms;
    if (p >= 1) { cv.remove(); return; }
    const w = cv.width = Math.max(40, (full ? innerWidth : panelEl.clientWidth) >> 2), h = cv.height = Math.max(30, (full ? innerHeight : panelEl.clientHeight) >> 2);
    const img = g.createImageData(w, h), d = img.data, a = 255 * Math.pow(1 - p, 1.4);
    const roll = (p * 3 * h) % h;                         // a bright tracking bar rolling down
    for (let y = 0; y < h; y++) {
      const bar = Math.abs(y - roll) < h * .06 ? 1.8 : 1;
      for (let x = 0; x < w; x++) {
        const v = Math.random() * 255 * bar, i = (y * w + x) * 4;
        d[i] = Math.min(255, v); d[i + 1] = v * .12; d[i + 2] = v * .2; d[i + 3] = a;
      }
    }
    g.putImageData(img, 0, 0);
    requestAnimationFrame(frame);
  })(t0);
}

/* ---------- Draft 1 interactions (scroll lock added) ---------- */
const sleep = ms => new Promise(r => setTimeout(r, ms));
const anim = (el, kf, o) => el.animate(kf, { fill: 'forwards', ...o }).finished;

/* ---------- 1. GATE: glitch for a second, then a huge ENTER over moving static ---------- */
const gate = document.getElementById('gate'), gateBtn = document.getElementById('gate-enter');
const gateCv = document.getElementById('gate-static'), gctx = gateCv.getContext('2d');
let gateLive = true;
function gateFrame() {
  if (!gateLive) return;
  const w = gateCv.width = Math.ceil(innerWidth / 5), h = gateCv.height = Math.ceil(innerHeight / 5);
  const img = gctx.createImageData(w, h), px = new Uint32Array(img.data.buffer), glitching = gate.classList.contains('glitch');
  const amp = glitching ? 1 : .62;
  for (let y = 0; y < h; y++) {
    const gain = glitching && Math.random() < .07 ? 1.7 : 1;
    for (let x = 0; x < w; x++) {
      const v = Math.min(255, (Math.random() * 255 * amp * gain) | 0);
      px[y * w + x] = 0xff000000 | (((v * .18) | 0) << 16) | (((v * .1) | 0) << 8) | v;
    }
  }
  gctx.putImageData(img, 0, 0);
  if (glitching) for (let i = 0; i < 6; i++) {            // torn colour blocks
    gctx.fillStyle = ['#ff1f2f', '#ffffff', '#000', '#19e6ff', '#ff2bd6'][(Math.random() * 5) | 0];
    gctx.fillRect(Math.random() * w, Math.random() * h, Math.random() * w * .7, 1 + Math.random() * h * .07);
  }
  setTimeout(() => requestAnimationFrame(gateFrame), 40);
}
gateFrame();
setTimeout(() => { gate.classList.remove('glitch'); gate.classList.add('ready'); gateBtn.focus({ preventScroll: true }); }, 1150);

/* ---------- 2. TV power-off, then power-on to the main screen ---------- */
const tvTop = document.querySelector('#tv .top'), tvBot = document.querySelector('#tv .bot'), tvLine = document.querySelector('#tv .tvline');
async function tvOff() {
  await Promise.all([
    anim(tvTop, [{ transform: 'translateY(-140%)' }, { transform: 'translateY(0)' }], { duration: 430, easing: 'cubic-bezier(.7,0,.9,.4)' }),
    anim(tvBot, [{ transform: 'translateY(140%)' }, { transform: 'translateY(0)' }], { duration: 430, easing: 'cubic-bezier(.7,0,.9,.4)' })]);
  await anim(tvLine, [{ opacity: 1, transform: 'scaleX(1)', height: '4px' }, { opacity: 1, transform: 'scaleX(.35)', height: '3px' }, { opacity: 1, transform: 'scaleX(.004)', height: '6px' }], { duration: 420, easing: 'ease-in' });
  await anim(tvLine, [{ opacity: 1 }, { opacity: 0 }], { duration: 260 });
}
async function tvOn() {
  await anim(tvLine, [{ opacity: 1, transform: 'scaleX(.004)', height: '6px' }, { opacity: 1, transform: 'scaleX(1)', height: '4px' }], { duration: 260, easing: 'ease-out' });
  await Promise.all([
    anim(tvTop, [{ transform: 'translateY(0)' }, { transform: 'translateY(-140%)' }], { duration: 520, easing: 'cubic-bezier(.2,.7,.3,1)' }),
    anim(tvBot, [{ transform: 'translateY(0)' }, { transform: 'translateY(140%)' }], { duration: 520, easing: 'cubic-bezier(.2,.7,.3,1)' }),
    anim(tvLine, [{ opacity: 1 }, { opacity: 0 }], { duration: 420 })]);
}
let powering = false;
gateBtn.addEventListener('click', async () => {
  if (powering) return; powering = true;
  await tvOff();
  gateLive = false; gate.style.display = 'none'; document.body.classList.remove('gated');
  const h1 = document.querySelector('h1'); h1.style.animation = 'none'; void h1.offsetWidth; h1.style.animation = '';   // replay title reveal
  await sleep(550);                       // black screen
  await tvOn();
  document.querySelector('.hero-content').animate([{ opacity: 0 }, { opacity: 1 }, { opacity: .2 }, { opacity: 1 }, { opacity: .6 }, { opacity: 1 }], { duration: 700, easing: 'steps(1)' });
});

/* ---------- 3. Main ENTER: the page opens like a wormhole, then scrolling unlocks ---------- */
const enter = document.getElementById('enter'), wh = document.getElementById('wormhole'), wctx = wh.getContext('2d');
let opening = false;
function enterSite() {
  document.documentElement.classList.remove('locked'); document.body.classList.remove('locked');
  document.body.classList.add('entered');
  scrollTo({ top: document.getElementById('inside').getBoundingClientRect().top + scrollY, behavior: 'instant' });
}
enter.addEventListener('click', () => {
  if (opening) return; opening = true;
  const W = wh.width = Math.ceil(innerWidth / 2), H = wh.height = Math.ceil(innerHeight / 2);
  wh.style.display = 'block'; wh.style.opacity = 1;
  const hero = document.querySelector('.hero-content');
  hero.animate([{ transform: 'scale(1)', opacity: 1, filter: 'blur(0px)' }, { transform: 'scale(3.2)', opacity: 0, filter: 'blur(12px)' }], { duration: 1300, easing: 'ease-in', fill: 'forwards' });
  const cx = W / 2, cy = H / 2, maxR = Math.hypot(W, H) / 2 * 1.08, D = 2000, t0 = performance.now();
  let jumped = false;
  (function frame(now) {
    const p = Math.min(1, (now - t0) / D), open = 1 - Math.pow(1 - Math.min(1, p / .5), 3), R = maxR * open;
    wctx.clearRect(0, 0, W, H);
    wctx.save(); wctx.beginPath(); wctx.arc(cx, cy, Math.max(1, R), 0, 7); wctx.clip();
    const g = wctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(1, R)); g.addColorStop(0, '#000'); g.addColorStop(.55, '#12000a'); g.addColorStop(1, '#5a0010');
    wctx.fillStyle = g; wctx.fillRect(0, 0, W, H);
    wctx.shadowColor = '#ff2a3a'; wctx.shadowBlur = 12;
    for (let a = 0; a < 9; a++) {                                  // spiral arms
      wctx.beginPath();
      for (let r = 2; r < R; r += 6) { const ang = a * Math.PI * 2 / 9 + r * .012 + p * 9, x = cx + Math.cos(ang) * r, y = cy + Math.sin(ang) * r; r === 2 ? wctx.moveTo(x, y) : wctx.lineTo(x, y); }
      wctx.strokeStyle = 'rgba(255,60,75,.4)'; wctx.lineWidth = 3; wctx.stroke();
    }
    for (let k = 0; k < 22; k++) {                                 // rings rushing outward
      const z = ((k / 22) + p * 2.6) % 1, r = R * Math.pow(z, 1.9);
      wctx.beginPath(); wctx.arc(cx, cy, r, 0, 7);
      wctx.strokeStyle = `rgba(255,${60 + z * 120 | 0},${70 + z * 90 | 0},${Math.sin(z * Math.PI) * .85})`; wctx.lineWidth = 1 + z * z * 16; wctx.stroke();
    }
    const c = wctx.createRadialGradient(cx, cy, 0, cx, cy, 40 + 30 * Math.sin(p * 30)); c.addColorStop(0, 'rgba(255,255,255,.9)'); c.addColorStop(1, 'rgba(255,40,60,0)');
    wctx.fillStyle = c; wctx.fillRect(0, 0, W, H);
    wctx.restore();
    wctx.beginPath(); wctx.arc(cx, cy, R, 0, 7); wctx.strokeStyle = '#ff8a80'; wctx.shadowBlur = 40; wctx.lineWidth = 6; wctx.stroke();   // glowing rim
    if (p > .55 && !jumped) { jumped = true; enterSite(); }
    if (p > .8) wh.style.opacity = Math.max(0, 1 - (p - .8) / .2);
    if (p < 1) requestAnimationFrame(frame);
    else { wh.style.display = 'none'; hero.getAnimations().forEach(x => x.cancel()); opening = false; }
  })(t0);
});

const panel = document.getElementById('panel');
const title = document.getElementById('panel-title');
const copy = document.getElementById('panel-copy');
const content = {
  music: ['Music', () => playerHTML() + '<div class="sub-label">LISTEN ELSEWHERE</div>' + linkList('music')],
  visuals: ['Visuals', () => 'Artwork and covers. Pick one and the whole world takes its colour.' + galleryHTML()],
  archive: ['Archive', 'Lyrics, fragments, notes, and things that do not belong anywhere else.'],
  contact: ['Contact', () => 'Find WingRidden here, or send a message.' + linkList('contact')]
};
/* each tab opens with its own TV / psychedelic effect */
const FX = { music: 'roll', visuals: 'bars', archive: 'slice', contact: 'spiral' };
function playFx(fx) {
  panel.className = 'reveal-panel'; panel.querySelectorAll('.fx-layer').forEach(e => e.remove()); void panel.offsetWidth;
  panel.classList.add('active', 'fx-' + fx);
  const layer = cls => { const d = document.createElement('div'); d.className = 'fx-layer ' + cls; panel.appendChild(d); setTimeout(() => d.remove(), 1300); };
  if (fx === 'roll') { layer('vbar'); staticBurst(panel, 600); }      // vertical hold lost
  if (fx === 'bars') layer('bars');                                  // colour-bar test card
  if (fx === 'slice') staticBurst(panel, 800);                       // VHS tracking glitch
  if (fx === 'spiral') layer('spiral');                              // hypnotic vortex
}
function openPanel(key) {
  const item = content[key];
  title.textContent = item[0];
  copy.innerHTML = typeof item[1] === 'function' ? item[1]() : item[1];
  if (key === 'music') wirePlayer();
  if (key === 'visuals') wireGallery();
  playFx(FX[key]);
  panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
document.querySelectorAll('[data-panel]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  openPanel(link.dataset.panel);
}));
/* email: reveal the address instead of relying on a mail app; click again to copy it */
copy.addEventListener('click', e => {
  const b = e.target.closest('[data-reveal]'); if (!b) return;
  const addr = b.dataset.reveal;
  if (!b.classList.contains('revealed')) { b.classList.add('revealed'); b.textContent = addr; return; }
  if (navigator.clipboard) navigator.clipboard.writeText(addr).then(() => { b.textContent = 'COPIED ✓'; setTimeout(() => b.textContent = addr, 1400); }, () => {});
});
document.getElementById('close').addEventListener('click', () => panel.classList.remove('active'));
