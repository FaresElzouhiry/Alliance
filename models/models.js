/* Shared behaviour for the design models in /models/: mobile menu, reveal on scroll,
 * number counters and the floating bar that switches between models. */
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile menu: [data-menu-toggle] opens/closes the element named in aria-controls
  document.querySelectorAll('[data-menu-toggle]').forEach(function (btn) {
    var menu = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('menu-open', open);
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) { btn.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); }
    });
  });

  // Header turns solid after the first screen
  var header = document.querySelector('[data-header]');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', scrollY > 40); };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Count up numbers: <span data-count="10" data-suffix="+">
  function count(el) {
    var end = +el.dataset.count, suffix = el.dataset.suffix || '', start = performance.now();
    if (calm) { el.textContent = end + suffix; return; }
    (function tick(now) {
      var t = Math.min(1, (now - start) / 1400), v = Math.round(end * (1 - Math.pow(1 - t, 3)));
      el.textContent = v + suffix;
      if (t < 1) requestAnimationFrame(tick);
    })(start);
  }

  // Reveal: [data-reveal] fades/slides in once it enters the screen
  var seen = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      entry.target.querySelectorAll('[data-count]').forEach(count);
      if (entry.target.dataset.count) count(entry.target);
      seen.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('[data-reveal], [data-count]').forEach(function (el) { seen.observe(el); });

  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Floating switcher so the models can be compared side by side
  var current = (location.pathname.match(/\/models\/(\d)\//) || [])[1];
  var bar = document.createElement('nav');
  bar.className = 'model-bar';
  bar.setAttribute('aria-label', 'Design models');
  bar.innerHTML = '<a href="../">All models</a>' +
    ['1', '2', '3'].map(function (n) {
      return '<a href="../' + n + '/"' + (n === current ? ' aria-current="page"' : '') + '>Model ' + n + '</a>';
    }).join('') +
    '<a href="../../">Current site</a>';
  document.body.appendChild(bar);
})();
