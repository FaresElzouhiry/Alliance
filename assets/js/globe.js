/* Interactive 3D dotted globe for the hero (canvas 2D, no dependencies).
   Land and network countries are bitmasks on the same 200×77 lat/lon grid as world-map.svg. */
(() => {
  'use strict';

  const canvas = document.querySelector('[data-globe]');
  if (!canvas || !canvas.getContext) return;

  const LAND = 'AAAAAACE/wP///8BAHwCAAAAAB8AAAAAAAAAAABgAPjB////AQAwAAAAAABgAAAAAAAAAAAAODlmAPD//wEAAAAA8ACA/wcAHwAAAAAAgAeQAwDg//8BAAAAAAwA8P8CAAAAAAAAAMD9s/wH4P9/AAAAAAAGjP3//wd8AAAAAAAA0IfxPsD/PwAAAB8AAO7//////x8AAQDA/w8DN3iA/x8AAOD/Ifr//////////x8AwP///z/4g/8BAADwv+f/7/////////8IAMD///8/foA/AA8A/Hz9////////////AADA////A/AAHwAAAH///////////////wAAwP///wAOAA4AAIA/////////////pw8AAID+/38AHgEAAACAP/z/////////f2MAAAAA/P//Af4DAAAAAFj9/////////wN4AAAAAPD//w/+AwAAAAAO//////////8AOAAAAAD0//8//w8AAIAB8P//////////AhgAAAAA4P//f/8fAACAgPD///////9//A8IAAAAAKD/////FwAAAMD4////////P/gLAAAAAAAAAAD//zAAAAAA4P/////v/x/gAwAAAAAAAAAA4N9AAAAAAOf//fz/g/9/gAkAAAAAAAAAAMAPAwAAAAD3nz7+/4H/D+AAAAAAAAAAAADAAAAAAAAAzA84/v8B/gNgAAAAAAAAAAAAAAAAAACAAZgHcPz/AAAADAAAAAAAAAAAAAAAAAAAgACAAeD8HwAAAAQAAAAAAAAAAAAAAAAAAIAAGAFg/D8AAAAAAAAAAAAAAAAAAAAAAAAA8AMA//8/AAAAAAAAAAAAAAAAAAAAAAAAAP8DAP//HwAAAAAAAAAAAAAACAAAAAAAAID/j4H//z8AAAAAAAAAAAAAAOADAAAAAACA/7//8f8fAAAAAAAAAAAAAADADwAAAAAAwP//P0D/DwYAAAAAAAAAAAAAoB8AAAAAAOD//38A9Ad4BgAAAAAAAAAAAAA/AAAAAADw//9/AEAGIAIAAAAAAAAAAAAAPgAAAAAA+P///wAYAGAHgAAAAAAAAAAAADwAAQAAAPj///8BGACA7wAAAAAAAAAAAAB8DBgAAAD4////AQwAAH8AAAAAAAAAAAAA+AcSAAAA+P///4MHAAB+gAAAAAAAAAAAAOAHAAAAAPj////zAQAA/YAAAAAAAAAAAAAAPgAAAAD4////dwAAAPiBAAAAAAAAAAAAADAAAAAA+P///x8AAADogQAAAAAAAAAAAAAwPAAAAPD////PAQAAwEADAAAAAAAAAAAAgP0DAADg/////wAAAEggAAAAAAAAAAAAAAD+DwAA4P////8AAAMIAAIAAAAAAAAAAAAA/n8AAICP//9/AAAAEDAAAAAAAAAAAAAAAP7/AAAAAP7/PwAAADQYAAAAAAAAAAAAAAD//wAAAAD8/x8AAAAoPAAAAAAAAAAAAAAA//8AAAAA/v8PAAAAOB4AAAAAAAAAAAAAgP//BgAAAP7/BwAAADDeYAEAAAAAAAAAAID//38AAAD8/wMAAABg0MQPAAAAAAAAAACA////AAAA+P8DAAAAQEAAHgEAAAAAAAAAAP///wEAAPj/AwAAAIAHAD4AAAAAAAAAAAD///8BAAD4/wMAAAAAAAJMIAAAAAAAAAAA/v//AAAA8P8HAAAAAAAAAAAAAAAAAAAAAP7/fwAAAPj/hwAAAAAA4AgAAAAAAAAAAAD8/z8AAAD4/4cAAAAAAHQIAAAAAAAAAAAA+P8/AAAA+P/jAAAAAAD+GQAAAAAAAAAAAOD/PwAAAPj/4QAAAAAA/x8AAAAAAAAAAADg/z8AAAD4/2AAAAAAgP8/AAAAAAAAAAAA4P8fAAAA8P9wAAAAAPD/fwAAAAAAAAAAAOD/BwAAAPDHcAAAAAD4//8AAAAAAAAAAADg/wEAAADwQyAAAAAA+P//AQAAAAAAAAAA4P8BAAAAYCAAAAAAAPj//wEAAAAAAAAAAPD/AQAAAEAAAAAAAADw//8BAAAAAAAAAADw/wAAAAAAAAAAAAAA8P//AQAAAAAAAAAA8H8AAAAAAAAAAAAAAPCD/wEAAAAAAAAAAPA/AAAAAAAAAAAAAABwgP8AAAAAAAAAAADwDwAAAAAAAAAAAAAAAAD8AAAAAAAAAAAA+A8AAAAAAAAAAAAAAAAAfAAgAAAAAAAAAPgDAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAgADAAAAAAAAAA8AAAAAAAAAAAAAAAAAAAIAAIAAAAAAAAAHgAAAAAAAAAAAAAAAAAAAAABgAAAAAAAAB4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
  const HIGH = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/AMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4PwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/z8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP4/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/PwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAgAAAAAAAAAABgAAAAAAAAAAAAAAAAAMAAgAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMCgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHA8AAAAAAACAAwAAAAAAAAAAAAAAAAAAACIHAAAAAAAAwAcAAAAAAAAA//8AAAAAAAD4HwAAAAAQAOAfAAAAAAAAgP//HyAAAAAA+BgAAAAAfACAfwAAAAAAAID//z9wAAAAAPgAAAAAAH4A8B8AAAAAAACA//8/HwAAAIC/AAAAAAD+AfwfGAAAAAAAgP///w8AAAAAHgDICAAA////AwAAAAAAAID///8HAAAAAC8A+B8A4P//PwAEAAAAAAAA////AwAAAAAPAPgfAMD//z8MAgAAAAAAAP7//wMAAAAAAAAAAADA//9/DAMAAAAAAAD8//8BAAAAAAAAAAAA4P//f+AAAAAAAAAA8P9/AAAAAAAAAAAAAMD//38AAAAAAAAAAAD8fwAAAAAAAAAADgDg//9/AAAAAAAAAAAAcEAAAAAAAAAAgD8A8Pn//wAAAAAAAAAAACDAAAAAAAAAAAD/APiH+X8AAAAAAAAAAAAAAAAAAAAAAAAA/gH43/0/AAAAAAAAAAAAAAAAAAAAAAAAAPwH/J/4HwAAAAAAAAAAAAAAAAAAAAAAAAD8B/gfEAIAAAAAACAAAAAAAAAAAAAAAAAA+APwDwACAAAAAAAAAAAAAAAAAAAAAAAAAHgA4AcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgB8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKA/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';

  // Labels follow the page language: en, ar, es, ja, zh (Simplified), ko
  const LANGS = ['en', 'ar', 'es', 'ja', 'zh-hans', 'ko'];
  const li = Math.max(0, LANGS.indexOf((document.documentElement.lang || 'en').toLowerCase()));
  const HQ = { lon: 46.72, lat: 24.69, name: ['Riyadh', 'الرياض', 'Riad', 'リヤド', '利雅得', '리야드'][li] };
  // [lon, lat, [en, ar, es, ja, zh, ko]]
  const NETWORK = [
    [54.29, 23.9, ['UAE', 'الإمارات', 'EAU', 'UAE', '阿联酋', 'UAE']],
    [51.16, 25.34, ['Qatar', 'قطر', 'Catar', 'カタール', '卡塔尔', '카타르']],
    [50.54, 26.02, ['Bahrain', 'البحرين', 'Baréin', 'バーレーン', '巴林', '바레인']],
    [35.42, 39.0, ['Türkiye', 'تركيا', 'Turquía', 'トルコ', '土耳其', '튀르키예']],
    [-2.48, 53.95, ['United Kingdom', 'المملكة المتحدة', 'Reino Unido', 'イギリス', '英国', '영국']],
    [2.45, 46.6, ['France', 'فرنسا', 'Francia', 'フランス', '法国', '프랑스']],
    [10.37, 51.1, ['Germany', 'ألمانيا', 'Alemania', 'ドイツ', '德国', '독일']],
    [14.11, 47.57, ['Austria', 'النمسا', 'Austria', 'オーストリア', '奥地利', '오스트리아']],
    [-3.56, 40.4, ['Spain', 'إسبانيا', 'España', 'スペイン', '西班牙', '스페인']],
    [-99.14, 39.54, ['United States', 'الولايات المتحدة', 'Estados Unidos', 'アメリカ', '美国', '미국']],
    [103.79, 36.62, ['China', 'الصين', 'China', '中国', '中国', '중국']],
    [137.95, 36.58, ['Japan', 'اليابان', 'Japón', '日本', '日本', '일본']],
    [127.87, 36.47, ['South Korea', 'كوريا الجنوبية', 'Corea del Sur', '韓国', '韩国', '대한민국']],
    [79.6, 22.89, ['India', 'الهند', 'India', 'インド', '印度', '인도']],
    [25.16, -29.03, ['South Africa', 'جنوب أفريقيا', 'Sudáfrica', '南アフリカ', '南非', '남아프리카공화국']],
  ];
  const LABEL_FONT = ['Montserrat', 'Cairo', 'Montserrat', '"Hiragino Sans", "Yu Gothic", Meiryo', '"PingFang SC", "Microsoft YaHei"', '"Apple SD Gothic Neo", "Malgun Gothic"'][li];

  const RAD = Math.PI / 180;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const ctx = canvas.getContext('2d');

  const toXYZ = (lon, lat) => [Math.cos(lat * RAD) * Math.sin(lon * RAD), Math.sin(lat * RAD), Math.cos(lat * RAD) * Math.cos(lon * RAD)];

  // Decode a bitmask into xyz triples; thin out rows near the poles so dots stay evenly spaced
  const decode = (b64) => {
    const s = atob(b64);
    const out = [];
    for (let j = 0; j < 77; j++) {
      const lat = 80 - ((2 + 5 * j) / 383) * 138;
      const keep = Math.max(1, Math.round(1 / Math.cos(lat * RAD)));
      for (let i = 0; i < 200; i++) {
        if (!(s.charCodeAt(j * 25 + (i >> 3)) & (1 << (i & 7))) || i % keep) continue;
        out.push(...toXYZ(((2 + 5 * i) / 1000) * 360 - 180, lat));
      }
    }
    return new Float32Array(out);
  };
  const land = decode(LAND);
  const high = decode(HIGH);

  // Great-circle arcs from Riyadh, lifted above the surface
  const hq = toXYZ(HQ.lon, HQ.lat);
  const markers = NETWORK.map(([lon, lat, names]) => ({ p: toXYZ(lon, lat), name: names[li] }));
  const STEPS = 44;
  const arcs = markers.map((m, idx) => {
    const a = hq, b = m.p;
    const omega = Math.acos(Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
    const lift = 0.04 + 0.22 * (omega / Math.PI);
    const pts = new Float32Array((STEPS + 1) * 3);
    for (let k = 0; k <= STEPS; k++) {
      const t = k / STEPS;
      const s0 = Math.sin((1 - t) * omega) / Math.sin(omega), s1 = Math.sin(t * omega) / Math.sin(omega);
      const h = 1 + lift * Math.sin(Math.PI * t);
      pts[k * 3] = (a[0] * s0 + b[0] * s1) * h;
      pts[k * 3 + 1] = (a[1] * s0 + b[1] * s1) * h;
      pts[k * 3 + 2] = (a[2] * s0 + b[2] * s1) * h;
    }
    return { pts, offset: (idx * 0.137) % 1, speed: 0.12 + (idx % 4) * 0.02 };
  });

  // View state: start with Riyadh facing the viewer
  let yaw = -HQ.lon, pitch = 22, vyaw = 0, vpitch = 0;
  // extra turn that follows the mouse anywhere over the hero (eased towards the target each frame)
  let followYaw = 0, followPitch = 0, targetYaw = 0, targetPitch = 0;
  let W = 0, H = 0, R = 0, cx = 0, cy = 0, dpr = 1;
  let hoverX = -1e4, hoverY = -1e4; // cursor position in canvas pixels
  let glow = null;
  // wait for the intro screen (home, first visit) before the globe assembles
  const introActive = !!document.querySelector('.intro') && !document.documentElement.classList.contains('no-intro');
  const start = performance.now() + (introActive && !reduceMotion ? 1300 : 0);

  // Pre-allocated buffers for depth-sorted dot drawing
  const BUCKETS = 6;
  const landBuf = Array.from({ length: BUCKETS }, () => new Float32Array(land.length));
  const landCnt = new Uint16Array(BUCKETS);
  const backBuf = new Float32Array(land.length);
  const highBuf = Array.from({ length: 3 }, () => new Float32Array(high.length));
  const highCnt = new Uint16Array(3);

  let cy_, sy_, cp_, sp_;
  const setRotation = () => {
    const y = (yaw + followYaw) * RAD, p = (pitch + followPitch) * RAD;
    cy_ = Math.cos(y); sy_ = Math.sin(y); cp_ = Math.cos(p); sp_ = Math.sin(p);
  };
  // rotate a model point; returns [screenX, screenY, depth]
  const proj = (x, y, z, scale, out) => {
    const x1 = x * cy_ + z * sy_, z1 = -x * sy_ + z * cy_;
    const y2 = y * cp_ - z1 * sp_, z2 = y * sp_ + z1 * cp_;
    out[0] = cx + x1 * scale; out[1] = cy - y2 * scale; out[2] = z2; out[3] = Math.hypot(x1, y2);
    return out;
  };
  const tmp = new Float32Array(4);

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(1, Math.round(rect.width * dpr));
    H = Math.max(1, Math.round(rect.height * dpr));
    canvas.width = W; canvas.height = H;
    cx = W / 2; cy = H / 2; R = Math.min(W, H) * 0.42;
    // static atmosphere + sphere shading, rendered once per size
    glow = document.createElement('canvas'); glow.width = W; glow.height = H;
    const g = glow.getContext('2d');
    const halo = g.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.32);
    halo.addColorStop(0, 'rgba(211,181,116,0.28)'); halo.addColorStop(0.35, 'rgba(194,155,94,0.10)'); halo.addColorStop(1, 'rgba(194,155,94,0)');
    g.fillStyle = halo; g.beginPath(); g.arc(cx, cy, R * 1.32, 0, Math.PI * 2); g.fill();
    const body = g.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
    body.addColorStop(0, 'rgba(32,96,74,0.55)'); body.addColorStop(0.7, 'rgba(9,48,37,0.55)'); body.addColorStop(1, 'rgba(4,23,15,0.85)');
    g.fillStyle = body; g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.fill();
    g.strokeStyle = 'rgba(232,210,166,0.35)'; g.lineWidth = 1 * dpr; g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.stroke();
    if (!running) draw(performance.now());
  };

  const ease = (t) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
  const frac = (x) => x - Math.floor(x); // always 0..1, also for negative x

  const draw = (now) => {
    const t = (now - start) / 1000;
    const intro = reduceMotion ? 1 : ease(t / 1.6);
    const scale = R * (0.82 + 0.18 * intro);
    setRotation();
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = intro;
    if (glow) {
      const s = 0.82 + 0.18 * intro;
      ctx.drawImage(glow, cx - (W * s) / 2, cy - (H * s) / 2, W * s, H * s);
    }

    // bucket land dots by depth
    landCnt.fill(0); highCnt.fill(0);
    let back = 0;
    for (let i = 0; i < land.length; i += 3) {
      proj(land[i], land[i + 1], land[i + 2], scale, tmp);
      if (tmp[2] < 0) { backBuf[back++] = tmp[0]; backBuf[back++] = tmp[1]; continue; }
      const b = Math.min(BUCKETS - 1, (tmp[2] * BUCKETS) | 0);
      const buf = landBuf[b]; buf[landCnt[b]++] = tmp[0]; buf[landCnt[b]++] = tmp[1];
    }
    for (let i = 0; i < high.length; i += 3) {
      proj(high[i], high[i + 1], high[i + 2], scale, tmp);
      if (tmp[2] < 0) continue;
      const b = Math.min(2, (tmp[2] * 3) | 0);
      const buf = highBuf[b]; buf[highCnt[b]++] = tmp[0]; buf[highCnt[b]++] = tmp[1];
    }

    // far side (seen through the glass)
    const r0 = 0.8 * dpr;
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    for (let k = 0; k < back; k += 2) ctx.fillRect(backBuf[k] - r0, backBuf[k + 1] - r0, r0 * 2, r0 * 2);
    // near side, brighter and larger towards the viewer
    for (let b = 0; b < BUCKETS; b++) {
      const d = (b + 0.5) / BUCKETS, r = (0.85 + d * 0.75) * dpr;
      ctx.fillStyle = `rgba(214,232,224,${(0.14 + d * 0.5).toFixed(3)})`;
      const buf = landBuf[b];
      for (let k = 0; k < landCnt[b]; k += 2) ctx.fillRect(buf[k] - r, buf[k + 1] - r, r * 2, r * 2);
    }
    for (let b = 0; b < 3; b++) {
      const d = (b + 0.5) / 3, r = (1.05 + d * 0.8) * dpr;
      ctx.fillStyle = `rgba(222,186,120,${(0.45 + d * 0.55).toFixed(3)})`;
      const buf = highBuf[b];
      for (let k = 0; k < highCnt[b]; k += 2) ctx.fillRect(buf[k] - r, buf[k + 1] - r, r * 2, r * 2);
    }

    // arcs grow in after the globe appears, then carry travelling pulses
    const grow = reduceMotion ? 1 : ease((t - 0.9) / 1.4);
    ctx.lineWidth = 1.1 * dpr;
    ctx.lineCap = 'round';
    const visible = (p) => p[2] > 0 || p[3] > scale; // in front, or lifted beyond the rim
    for (const arc of arcs) {
      const last = Math.round(STEPS * grow);
      if (last < 1) continue;
      ctx.strokeStyle = 'rgba(232,201,135,0.5)';
      ctx.beginPath();
      let pen = false;
      for (let k = 0; k <= last; k++) {
        proj(arc.pts[k * 3], arc.pts[k * 3 + 1], arc.pts[k * 3 + 2], scale, tmp);
        if (visible(tmp)) { pen ? ctx.lineTo(tmp[0], tmp[1]) : ctx.moveTo(tmp[0], tmp[1]); pen = true; } else pen = false;
      }
      ctx.stroke();
      if (grow >= 1 && !reduceMotion) {
        const f = frac(t * arc.speed + arc.offset);
        const k = Math.round(f * STEPS);
        proj(arc.pts[k * 3], arc.pts[k * 3 + 1], arc.pts[k * 3 + 2], scale, tmp);
        if (visible(tmp)) {
          const a = Math.sin(Math.PI * f);
          ctx.fillStyle = `rgba(255,236,190,${(0.9 * a).toFixed(3)})`;
          ctx.beginPath(); ctx.arc(tmp[0], tmp[1], 2.2 * dpr, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = `rgba(232,201,135,${(0.25 * a).toFixed(3)})`;
          ctx.beginPath(); ctx.arc(tmp[0], tmp[1], 6 * dpr, 0, Math.PI * 2); ctx.fill();
        }
      }
    }

    // country markers; the one nearest the cursor gets a name tag
    const showLabels = finePointer && W / dpr > 420;
    let near = null, nearD = 40 * dpr, nx = 0, ny = 0;
    markers.forEach((m, i) => {
      proj(m.p[0], m.p[1], m.p[2], scale, tmp);
      if (tmp[2] <= 0.05) return;
      const pulse = reduceMotion ? 0.5 : frac(t * 0.6 + i * 0.13);
      ctx.strokeStyle = `rgba(241,215,160,${(0.7 * (1 - pulse) * tmp[2]).toFixed(3)})`;
      ctx.lineWidth = 1 * dpr;
      ctx.beginPath(); ctx.arc(tmp[0], tmp[1], (3 + pulse * 9) * dpr, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#f1d7a0';
      ctx.beginPath(); ctx.arc(tmp[0], tmp[1], 2.4 * dpr, 0, Math.PI * 2); ctx.fill();
      const d = Math.hypot(tmp[0] - hoverX, tmp[1] - hoverY);
      if (d < nearD) { near = m; nearD = d; nx = tmp[0]; ny = tmp[1]; }
    });
    const tag = (text, x, y, strong) => {
      ctx.font = `${strong ? 700 : 600} ${12 * dpr}px ${LABEL_FONT}, sans-serif`;
      const w = ctx.measureText(text).width + 18 * dpr, h = 24 * dpr;
      ctx.fillStyle = strong ? 'rgba(194,155,94,0.95)' : 'rgba(4,23,15,0.82)';
      ctx.strokeStyle = 'rgba(232,210,166,0.6)'; ctx.lineWidth = 1 * dpr;
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2) : ctx.rect(x - w / 2, y - h / 2, w, h); ctx.fill(); if (!strong) ctx.stroke();
      ctx.fillStyle = strong ? '#062019' : '#f6e7c6';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(text, x, y + 1 * dpr);
    };
    // headquarters
    proj(hq[0], hq[1], hq[2], scale, tmp);
    if (tmp[2] > 0) {
      const pulse = reduceMotion ? 0.4 : frac(t * 0.5);
      ctx.strokeStyle = `rgba(255,255,255,${(0.8 * (1 - pulse)).toFixed(3)})`;
      ctx.lineWidth = 1.4 * dpr;
      ctx.beginPath(); ctx.arc(tmp[0], tmp[1], (5 + pulse * 16) * dpr, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(tmp[0], tmp[1], 4 * dpr, 0, Math.PI * 2); ctx.fill();
      if (showLabels && grow > 0) tag(HQ.name, tmp[0], tmp[1] + 26 * dpr, true);
    }
    if (showLabels && near && grow >= 1) tag(near.name, nx, ny - 20 * dpr, false);
    ctx.globalAlpha = 1;
  };

  // Animation loop: runs only while the globe is on screen and the tab is visible
  let running = false, onScreen = true, raf = 0, last = performance.now();
  const loop = (now) => {
    const dt = Math.min(64, now - last); last = now;
    if (!dragging) {
      yaw += vyaw * dt / 16 + (reduceMotion ? 0 : 0.05 * dt / 16);
      pitch += vpitch * dt / 16;
      vyaw *= 0.94; vpitch *= 0.9;
      pitch += (22 - pitch) * 0.01; // drift back to the default tilt
    }
    followYaw += (targetYaw - followYaw) * 0.06;
    followPitch += (targetPitch - followPitch) * 0.06;
    draw(now);
    raf = requestAnimationFrame(loop);
  };
  const play = () => { if (running || reduceMotion) return; running = true; last = performance.now(); raf = requestAnimationFrame(loop); };
  const stop = () => { running = false; cancelAnimationFrame(raf); };
  const update = () => (onScreen && !document.hidden ? play() : stop());

  new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; update(); }).observe(canvas);
  document.addEventListener('visibilitychange', update);
  new ResizeObserver(resize).observe(canvas);

  // Drag to spin (horizontal drags only on touch, so the page still scrolls)
  let dragging = false, px = 0, py = 0;
  canvas.addEventListener('pointerdown', (e) => {
    dragging = true; px = e.clientX; py = e.clientY; vyaw = vpitch = 0;
    canvas.setPointerCapture(e.pointerId); canvas.classList.add('is-dragging');
  });
  canvas.addEventListener('pointerleave', () => { hoverX = hoverY = -1e4; });

  // Mouse anywhere over the hero turns the globe towards it (desktop only)
  const hero = canvas.closest('.hero');
  if (hero && finePointer && !reduceMotion) {
    hero.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = hero.getBoundingClientRect();
      targetYaw = ((e.clientX - r.left) / r.width - 0.5) * 50;
      targetPitch = ((e.clientY - r.top) / r.height - 0.5) * -24;
    }, { passive: true });
    hero.addEventListener('pointerleave', () => { targetYaw = 0; targetPitch = 0; });
  }
  canvas.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    hoverX = (e.clientX - rect.left) * dpr; hoverY = (e.clientY - rect.top) * dpr;
    if (!dragging) return;
    const dx = e.clientX - px, dy = e.clientY - py; px = e.clientX; py = e.clientY;
    vyaw = dx * 0.35; yaw += vyaw;
    if (e.pointerType !== 'touch') { vpitch = -dy * 0.2; pitch = Math.max(-15, Math.min(60, pitch + vpitch)); }
    if (!running) draw(performance.now());
  });
  const end = () => { dragging = false; canvas.classList.remove('is-dragging'); };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);

  resize();
  update();
})();
