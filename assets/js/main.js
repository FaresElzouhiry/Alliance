/* Alliance Investment — site behaviour (no dependencies) */
(() => {
  'use strict';

  // Google Analytics 4 measurement ID (set to '' to disable analytics)
  const GA_ID = 'G-WH9W4CYF88';

  // Site root, worked out from this file's location (assets/js/main.js)
  const SITE_ROOT = new URL('../../', document.currentScript ? document.currentScript.src : location.href);

  // Enables JS-only styles (scroll reveal, marquee). Without JS everything stays visible.
  document.documentElement.classList.add('js');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;

  // Interface text in the page language (from <html lang="…">)
  const STRINGS = {
    en: {
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      sent: 'Thank you — your message has been sent. Our team will get back to you shortly.',
      failed: (email) => `Sorry, the message could not be sent. Please email us at ${email}.`,
      mailOpened: 'Your email app has opened with the message ready — just press send.',
      subject: 'Website enquiry',
    },
    ar: {
      openMenu: 'افتح القائمة',
      closeMenu: 'أغلق القائمة',
      sent: 'شكرًا لك — تم إرسال رسالتك، وسيتواصل معك فريقنا قريبًا.',
      failed: (email) => `عذرًا، تعذّر إرسال الرسالة. يرجى مراسلتنا على ${email}.`,
      mailOpened: 'تم فتح تطبيق البريد الإلكتروني والرسالة جاهزة — فقط اضغط إرسال.',
      subject: 'استفسار من الموقع',
    },
    es: {
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
      sent: 'Gracias: su mensaje ha sido enviado. Nuestro equipo se pondrá en contacto con usted en breve.',
      failed: (email) => `Lo sentimos, no se pudo enviar el mensaje. Escríbanos a ${email}.`,
      mailOpened: 'Se ha abierto su aplicación de correo con el mensaje listo: solo tiene que pulsar enviar.',
      subject: 'Consulta desde el sitio web',
    },
    ja: {
      openMenu: 'メニューを開く',
      closeMenu: 'メニューを閉じる',
      sent: 'ありがとうございます。メッセージを送信しました。担当者より追ってご連絡いたします。',
      failed: (email) => `申し訳ありません。メッセージを送信できませんでした。${email} までメールでご連絡ください。`,
      mailOpened: 'メールアプリが開き、メッセージが入力されています。送信ボタンを押してください。',
      subject: 'ウェブサイトからのお問い合わせ',
    },
    'zh-hans': {
      openMenu: '打开菜单',
      closeMenu: '关闭菜单',
      sent: '谢谢！您的留言已发送，我们的团队将尽快与您联系。',
      failed: (email) => `抱歉，消息未能发送。请发送邮件至 ${email}。`,
      mailOpened: '已为您打开邮件应用并填好内容，只需点击发送即可。',
      subject: '网站咨询',
    },
    ko: {
      openMenu: '메뉴 열기',
      closeMenu: '메뉴 닫기',
      sent: '감사합니다. 메시지가 전송되었습니다. 담당자가 곧 연락드리겠습니다.',
      failed: (email) => `죄송합니다. 메시지를 보내지 못했습니다. ${email}(으)로 이메일을 보내 주세요.`,
      mailOpened: '메일 앱이 열렸으며 메시지가 작성되어 있습니다. 보내기만 누르시면 됩니다.',
      subject: '웹사이트 문의',
    },
  };
  const T = STRINGS[(document.documentElement.lang || 'en').toLowerCase()] || STRINGS.en;

  /* ---------- Header: solid background after scrolling ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Language menu: close on outside click / Escape ---------- */
  const langMenu = document.querySelector('details.lang');
  if (langMenu) {
    document.addEventListener('click', (e) => { if (langMenu.open && !langMenu.contains(e.target)) langMenu.open = false; });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && langMenu.open) { langMenu.open = false; langMenu.querySelector('summary').focus(); }
    });
  }

  /* ---------- Mobile navigation ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (toggle && nav) {
    const setOpen = (open) => {
      body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? T.closeMenu : T.openMenu);
    };
    toggle.addEventListener('click', () => setOpen(!body.classList.contains('nav-open')));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    window.matchMedia('(min-width: 961px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });
  }

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const introActive = !!document.querySelector('.intro') && !document.documentElement.classList.contains('no-intro');

  /* ---------- Headings: wrap each word so it can rise in ---------- */
  const splitWords = (root) => {
    let i = 0;
    const walk = (node) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const outer = document.createElement('span');
            const inner = document.createElement('span');
            outer.className = 'w';
            inner.textContent = part;
            inner.style.setProperty('--i', i++);
            outer.appendChild(inner);
            frag.appendChild(outer);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === Node.ELEMENT_NODE && n.tagName !== 'BR') {
          walk(n);
        }
      });
    };
    walk(root);
  };
  if (!reduceMotion) document.querySelectorAll('[data-reveal] .h2, .cta-band[data-reveal] h2').forEach(splitWords);

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Count-up numbers ([data-count], optional data-suffix) ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !reduceMotion) {
    const run = (el) => {
      const target = Number(el.dataset.count), suffix = el.dataset.suffix || '', t0 = performance.now(), dur = 1700;
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 4))) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        cio.unobserve(entry.target);
        const inHero = !!entry.target.closest('.hero');
        setTimeout(() => run(entry.target), inHero ? (introActive ? 1700 : 450) : 150);
      });
    }, { threshold: 0.5 });
    counters.forEach((el) => { el.textContent = `0${el.dataset.suffix || ''}`; cio.observe(el); });
  }

  /* ---------- Desktop-only touches: 3D tilt, magnetic buttons, spotlight ---------- */
  if (finePointer && !reduceMotion) {
    // 3D tilt with a soft glare that follows the pointer (works for cards added later too)
    const TILT = '.sector, .card, .party, .step, .person';
    let tilted = null;
    const untilt = (el) => { el.classList.remove('is-tilting'); el.style.transform = ''; };
    document.addEventListener('pointermove', (e) => {
      const el = e.target.closest(TILT);
      if (tilted && tilted !== el) { untilt(tilted); tilted = null; }
      if (!el) return;
      if (!el.hasAttribute('data-tilt')) el.setAttribute('data-tilt', '');
      tilted = el;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      const max = el.classList.contains('sector') ? 11 : 6;
      el.style.transform = `perspective(900px) rotateX(${((0.5 - py) * max).toFixed(2)}deg) rotateY(${((px - 0.5) * max).toFixed(2)}deg) translateY(-4px)`;
      el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
      el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
      el.classList.add('is-tilting');
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => { if (tilted) { untilt(tilted); tilted = null; } });

    // buttons lean towards the cursor
    document.querySelectorAll('.hero .btn, .nav__cta, .cta-band .btn, .center-cta .btn').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${(dx * 0.18).toFixed(1)}px, ${(dy * 0.3).toFixed(1)}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });

    // gold light that follows the cursor on dark sections
    document.querySelectorAll('.texture, .contact__info, .cta-band').forEach((el) => {
      el.classList.add('spotlight');
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      }, { passive: true });
      el.addEventListener('pointerenter', () => el.classList.add('is-lit'));
      el.addEventListener('pointerleave', () => el.classList.remove('is-lit'));
    });
  }

  /* ---------- Hero video: optional (set data-src), desktop only, after the page has loaded ---------- */
  const video = document.querySelector('.hero__video');
  if (video && video.dataset.src) {
    const conn = navigator.connection || {};
    const wide = window.matchMedia('(min-width: 900px)').matches;
    if (wide && !reduceMotion && !conn.saveData) {
      window.addEventListener('load', () => {
        video.src = video.dataset.src;
        video.addEventListener('playing', () => video.classList.add('is-playing'), { once: true });
        video.play().catch(() => {});
      }, { once: true });
    }
  }

  /* ---------- Partners marquee: duplicate tiles for a seamless loop ---------- */
  if (!reduceMotion) {
    document.querySelectorAll('.marquee__track').forEach((track) => {
      const items = Array.from(track.children);
      items.forEach((item) => {
        const clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.querySelectorAll('img').forEach((img) => { img.alt = ''; });
        track.appendChild(clone);
      });
      track.style.setProperty('--marquee-duration', `${items.length * 3.2}s`);
      track.classList.add('is-looping');
    });
  }

  /* ---------- Contact form ---------- */
  const form = document.getElementById('contact-form');
  if (form) {
    // "Other" options reveal a free-text field
    form.querySelectorAll('select[data-other]').forEach((select) => {
      const extra = document.getElementById(select.dataset.other);
      const input = extra.querySelector('input');
      const sync = () => {
        const show = select.value === 'Other' || select.value === 'Other (please specify)';
        extra.hidden = !show;
        input.disabled = !show;
        input.required = show;
      };
      select.addEventListener('change', sync);
      sync();
    });

    const status = form.querySelector('.form__status');
    const showStatus = (ok, msg) => {
      status.hidden = false;
      status.className = `form__status form__status--${ok ? 'ok' : 'err'}`;
      status.textContent = msg;
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      if (data.get('website')) return; // honeypot

      // Optional: set data-endpoint on the form to a form service (Formspree, Web3Forms, …)
      const endpoint = form.dataset.endpoint;
      if (endpoint) {
        const button = form.querySelector('button[type="submit"]');
        button.disabled = true;
        try {
          const res = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
          if (!res.ok) throw new Error(res.statusText);
          form.reset();
          showStatus(true, T.sent);
        } catch {
          showStatus(false, T.failed(form.dataset.email));
        } finally {
          button.disabled = false;
        }
        return;
      }

      // No endpoint configured: open the visitor's email app with the message prefilled
      const val = (name) => (data.get(name) || '').toString().trim();
      const pick = (name) => (val(`${name}_other`) ? `${val(name)}: ${val(`${name}_other`)}` : val(name));
      const lines = [
        `Full Name: ${val('name')}`,
        `Email: ${val('email')}`,
        `Mobile: ${val('mobile')}`,
        `Organization: ${val('organization')}`,
        `Position / Title: ${pick('position')}`,
        `Sector: ${pick('sector')}`,
        `Purpose: ${pick('purpose')}`,
        '',
        val('message'),
      ];
      const subject = `${T.subject} — ${val('purpose') || 'General'} — ${val('name')}`;
      window.location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
      showStatus(true, T.mailOpened);
    });
  }

  /* ---------- Service worker (offline support + cache you can refresh by bumping VERSION in sw.js) ---------- */
  if ('serviceWorker' in navigator) {
    // On localhost it stays off so edits show up immediately; open any page with ?sw to test it locally.
    const local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
    let testing = false;
    try {
      if (/[?&]sw\b/.test(location.search)) sessionStorage.setItem('sw-test', '1');
      testing = sessionStorage.getItem('sw-test') === '1';
    } catch { /* storage blocked */ }
    if (local && !testing) {
      navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()));
    } else {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register(new URL('sw.js', SITE_ROOT), { scope: SITE_ROOT.pathname }).catch(() => {});
      }, { once: true });
    }
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------- Analytics (loaded after the page, never blocks rendering) ---------- */
  if (GA_ID && location.protocol.startsWith('http') && !/^(localhost|127\.)/.test(location.hostname)) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const s = document.createElement('script');
        s.async = true;
        s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
        document.head.appendChild(s);
        window.dataLayer = window.dataLayer || [];
        window.gtag = function gtag() { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', GA_ID);
      }, 1500);
    }, { once: true });
  }
})();
