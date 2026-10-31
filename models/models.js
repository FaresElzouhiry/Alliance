/* Shared behaviour for the six design models in /models/.
 * Opt-in attributes:
 *   data-reveal        fade/slide in once on screen (adds .is-in)
 *   data-split         split a heading into words that rise in (needs data-reveal or works alone)
 *   data-count="41"    count up when on screen (data-suffix="+")
 *   data-speed="0.2"   parallax drift while scrolling
 *   data-pin           tall wrapper with a sticky child: sets --p (0→1) while pinned
 *   data-progress      sets --p (0→1) while the element crosses the screen
 *   data-tilt          3D tilt toward the pointer (sets --rx / --ry)
 *   data-magnetic      button drifts toward the pointer
 *   data-marquee       repeats its list so a CSS marquee loops without a gap
 *   data-tabs          [data-tab=x] buttons show [data-panel=x] panels
 *   data-menu-toggle   mobile menu button (aria-controls = menu id)
 *   data-header        gets .is-scrolled after 40px
 *   <body data-cursor> custom cursor (mouse only)
 */
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var Models = window.Models = { calm: calm, fine: fine, lenis: null };

  // ---- Split headings into words (keeps inline tags such as <em> and <span class="gold">)
  document.querySelectorAll('[data-split]').forEach(function (el) {
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'w';
            var s = document.createElement('span'); s.textContent = part; s.style.setProperty('--i', i++);
            w.appendChild(s); frag.appendChild(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') walk(child);
      });
    })(el);
  });

  // ---- Mobile menu
  document.querySelectorAll('[data-menu-toggle]').forEach(function (btn) {
    var menu = document.getElementById(btn.getAttribute('aria-controls'));
    function set(open) {
      btn.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('menu-open', open);
      if (Models.lenis) open ? Models.lenis.stop() : Models.lenis.start();
    }
    btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
    if (menu) menu.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  });

  // ---- Tabs
  document.querySelectorAll('[data-tabs]').forEach(function (box) {
    var tabs = box.querySelectorAll('[data-tab]');
    function show(id) {
      tabs.forEach(function (t) { var on = t.dataset.tab === id; t.setAttribute('aria-selected', String(on)); t.classList.toggle('is-active', on); });
      box.querySelectorAll('[data-panel]').forEach(function (p) { var on = p.dataset.panel === id; p.hidden = !on; p.classList.toggle('is-active', on); });
      box.dispatchEvent(new CustomEvent('tabchange', { detail: id }));
    }
    tabs.forEach(function (t) {
      t.setAttribute('role', 'tab');
      t.addEventListener('click', function () { show(t.dataset.tab); });
      if (box.hasAttribute('data-tabs-hover') && fine) t.addEventListener('mouseenter', function () { show(t.dataset.tab); });
    });
    if (tabs[0]) show((box.querySelector('[data-tab].is-active') || tabs[0]).dataset.tab);
  });

  // ---- Marquees: repeat the list once so translateX(-50%) loops seamlessly
  document.querySelectorAll('[data-marquee]').forEach(function (track) {
    track.insertAdjacentHTML('beforeend', track.innerHTML.replace(/ alt="[^"]*"/g, ' alt="" aria-hidden="true"'));
  });

  // ---- Counters
  function count(el) {
    var end = +el.dataset.count, suffix = el.dataset.suffix || '', start = performance.now();
    if (calm) { el.textContent = end + suffix; return; }
    (function tick(now) {
      var t = Math.min(1, (now - start) / 1600), v = Math.round(end * (1 - Math.pow(1 - t, 4)));
      el.textContent = v + suffix;
      if (t < 1) requestAnimationFrame(tick);
    })(start);
  }

  // ---- Reveal on scroll
  var seen = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      el.classList.add('is-in');
      if (el.dataset.count) count(el);
      el.querySelectorAll('[data-count]').forEach(function (c) { if (!c.closest('[data-reveal]:not(.is-in)')) count(c); });
      seen.unobserve(el);
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('[data-reveal], [data-split], [data-count]').forEach(function (el) {
    if (el.hasAttribute('data-count') && el.closest('[data-reveal]') && el.closest('[data-reveal]') !== el) return; // counted with its parent
    seen.observe(el);
  });

  // ---- Scroll-linked effects (one rAF per frame)
  var header = document.querySelector('[data-header]');
  var pins = Array.prototype.slice.call(document.querySelectorAll('[data-pin]'));
  var progs = Array.prototype.slice.call(document.querySelectorAll('[data-progress]'));
  var speeds = calm ? [] : Array.prototype.slice.call(document.querySelectorAll('[data-speed]'));
  var ticking = false;
  function frame() {
    ticking = false;
    var vh = innerHeight;
    if (header) header.classList.toggle('is-scrolled', scrollY > 40);
    pins.forEach(function (el) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--p', Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh))).toFixed(4));
    });
    progs.forEach(function (el) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--p', Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height))).toFixed(4));
    });
    speeds.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      el.style.translate = '0 ' + ((r.top + r.height / 2 - vh / 2) * -parseFloat(el.dataset.speed)).toFixed(1) + 'px';
    });
  }
  function request() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request);
  frame();

  // ---- Pointer effects (mouse only)
  if (fine && !calm) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      var max = parseFloat(el.dataset.tilt) || 8;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--rx', (-y * max).toFixed(2) + 'deg');
        el.style.setProperty('--ry', (x * max).toFixed(2) + 'deg');
        el.style.setProperty('--mx', (x + 0.5) * 100 + '%');
        el.style.setProperty('--my', (y + 0.5) * 100 + '%');
      });
      el.addEventListener('pointerleave', function () { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
    });
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.translate = ((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1) + 'px ' + ((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1) + 'px';
      });
      el.addEventListener('pointerleave', function () { el.style.translate = ''; });
    });
    if (document.body.hasAttribute('data-cursor')) {
      var dot = document.createElement('div'), ring = document.createElement('div');
      dot.className = 'cursor-dot'; ring.className = 'cursor-ring';
      document.body.append(dot, ring);
      var mx = -100, my = -100, rx = -100, ry = -100;
      addEventListener('pointermove', function (e) {
        mx = e.clientX; my = e.clientY;
        dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
        ring.classList.toggle('is-link', !!e.target.closest('a, button, summary, [data-tab], input, label'));
      });
      (function follow() {
        rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
        ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
        requestAnimationFrame(follow);
      })();
      document.documentElement.classList.add('has-cursor');
    }
  }

  // ---- Smooth scrolling on desktop (Lenis); falls back to normal scrolling if it can't load
  if (fine && !calm && !document.body.hasAttribute('data-no-smooth')) {
    import('https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.mjs').then(function (mod) {
      var lenis = Models.lenis = new mod.default({ lerp: 0.1, wheelMultiplier: 1 });
      lenis.on('scroll', request);
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
    }).catch(function () {});
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) return;
    var target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    if (Models.lenis) Models.lenis.scrollTo(target, { offset: -72 });
    else target.scrollIntoView({ behavior: calm ? 'auto' : 'smooth' });
  });

  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // ---- Floating bar to switch between the models
  var NAMES = ['Gateway', 'Investor Hub', 'Expansion', 'Constellation', 'Riyadh Nights', 'Silk & Gold'];
  var current = (location.pathname.match(/\/models\/(\d)\//) || [])[1];
  var bar = document.createElement('nav');
  bar.className = 'model-bar';
  bar.setAttribute('aria-label', 'Design models');
  bar.innerHTML = '<a href="../">All</a>' + NAMES.map(function (name, i) {
    var n = String(i + 1);
    return '<a href="../' + n + '/"' + (n === current ? ' aria-current="page"' : '') + '><b>' + n + '</b><span>' + name + '</span></a>';
  }).join('') + '<a href="../../">Current site</a>';
  document.body.appendChild(bar);
})();
