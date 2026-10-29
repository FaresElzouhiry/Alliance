/* Renders the About page team section from data/team.json */
(() => {
  'use strict';

  const root = document.getElementById('team-root');
  if (!root) return;

  // page language → field suffix in team.json (name_ar, bio_es, title_ja, bio_zh, bio_ko …)
  const LANG = (document.documentElement.lang || 'en').toLowerCase();
  const SUFFIX = { ar: 'ar', es: 'es', ja: 'ja', 'zh-hans': 'zh', ko: 'ko' }[LANG];
  const base = root.dataset.base || '../';
  const ICONS = `${base}assets/img/icons.svg`;
  const icon = (name, cls = 'icon') => `<svg class="${cls}" aria-hidden="true"><use href="${ICONS}#${name}"/></svg>`;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const bioList = (bio) => (Array.isArray(bio) ? bio : [bio]).filter(Boolean);
  const img = (p) => `${base}${p}`;
  // Other languages use the *_xx fields and fall back to English when one is missing
  const field = (p, key) => (SUFFIX && p[`${key}_${SUFFIX}`]) || p[key];

  const STRINGS = {
    en: {
      groups: { boardMembers: ['Board Members', 'Board Member'], advisors: ['Advisors', 'Advisor'] },
      count: (n) => `${n} ${n === 1 ? 'member' : 'members'}`,
      more: 'View profile',
      error: 'The team list could not be loaded. Open the site through a web server (see README) instead of double-clicking the file.',
    },
    ar: {
      groups: { boardMembers: ['أعضاء مجلس الإدارة', 'عضو مجلس الإدارة'], advisors: ['المستشارون', 'مستشار'] },
      count: (n) => (n === 1 ? 'عضو واحد' : n === 2 ? 'عضوان' : n <= 10 ? `${n} أعضاء` : `${n} عضوًا`),
      more: 'عرض الملف',
      error: 'تعذّر تحميل قائمة الفريق. افتح الموقع من خلال خادم ويب (راجع ملف README) بدلًا من فتح الملف مباشرة.',
    },
    es: {
      groups: { boardMembers: ['Consejo de Administración', 'Consejero'], advisors: ['Asesores', 'Asesor'] },
      count: (n) => `${n} ${n === 1 ? 'miembro' : 'miembros'}`,
      more: 'Ver perfil',
      error: 'No se pudo cargar el equipo. Abra el sitio a través de un servidor web (consulte el README) en lugar de abrir el archivo directamente.',
    },
    ja: {
      groups: { boardMembers: ['取締役会', '取締役'], advisors: ['アドバイザー', 'アドバイザー'] },
      count: (n) => `${n}名`,
      more: 'プロフィールを見る',
      error: 'チーム情報を読み込めませんでした。ファイルを直接開くのではなく、ウェブサーバー経由でサイトを開いてください（README参照）。',
    },
    'zh-hans': {
      groups: { boardMembers: ['董事会成员', '董事会成员'], advisors: ['顾问', '顾问'] },
      count: (n) => `${n} 位成员`,
      more: '查看简介',
      error: '无法加载团队信息。请通过网页服务器打开网站（参见 README），不要直接双击文件。',
    },
    ko: {
      groups: { boardMembers: ['이사회', '이사'], advisors: ['자문위원', '자문위원'] },
      count: (n) => `${n}명`,
      more: '프로필 보기',
      error: '팀 정보를 불러올 수 없습니다. 파일을 직접 열지 말고 웹 서버를 통해 사이트를 열어 주세요(README 참고).',
    },
  };
  const T = STRINGS[LANG] || STRINGS.en;

  const dialog = document.getElementById('profile-dialog');
  const people = [];

  const card = (p, groupName) => {
    const i = people.push({ ...p, group: groupName }) - 1;
    const title = field(p, 'title');
    return `
      <article class="person" data-reveal style="--d:${(i % 4) * 0.06}s">
        <div class="person__photo"><img src="${esc(img(p.image))}" alt="${esc(field(p, 'name'))}" width="128" height="128" loading="lazy" decoding="async"></div>
        <h4>${esc(field(p, 'name'))}</h4>
        <p class="person__title">${esc(title || groupName)}</p>
        <p class="person__excerpt">${esc(bioList(field(p, 'bio')).join(' '))}</p>
        <button class="person__more" type="button" data-person="${i}" aria-haspopup="dialog">${T.more} ${icon('arrow-right')}</button>
      </article>`;
  };

  const group = (key, list) => {
    const [title, singular] = T.groups[key];
    return `
    <div class="team-group">
      <div class="team-group__head"><h3>${esc(title)}</h3><span>${T.count(list.length)}</span></div>
      <div class="team-grid">${list.map((p) => card(p, singular)).join('')}</div>
    </div>`;
  };

  const render = (data) => {
    const ceo = data.ceo;
    root.innerHTML = `
      <article class="ceo-feature" data-reveal>
        <div class="ceo-feature__photo"><img src="${esc(img(ceo.image))}" alt="${esc(field(ceo, 'name'))}" width="400" height="400" loading="lazy" decoding="async"></div>
        <div>
          <p class="ceo-feature__role">${esc(field(ceo, 'title'))}</p>
          <h3>${esc(field(ceo, 'name'))}</h3>
          <ul>${bioList(field(ceo, 'bio')).map((b) => `<li>${icon('check')}<span>${esc(b)}</span></li>`).join('')}</ul>
        </div>
      </article>
      ${group('boardMembers', data.boardMembers || [])}
      ${group('advisors', data.advisors || [])}`;

    // reveal newly added nodes
    requestAnimationFrame(() => root.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible')));
  };

  const openProfile = (p) => {
    const photo = dialog.querySelector('.profile__head img');
    photo.src = img(p.image);
    photo.alt = field(p, 'name');
    dialog.querySelector('.profile__group').textContent = p.group;
    dialog.querySelector('h3').textContent = field(p, 'name');
    const title = dialog.querySelector('.profile__title');
    title.textContent = field(p, 'title') || '';
    title.hidden = !field(p, 'title');
    dialog.querySelector('.profile__bio').innerHTML = bioList(field(p, 'bio')).map((b) => `<li>${icon('check')}<span>${esc(b)}</span></li>`).join('');
    dialog.showModal();
  };

  root.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-person]');
    if (btn) openProfile(people[Number(btn.dataset.person)]);
  });
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || e.target.closest('.profile__close')) dialog.close();
  });

  fetch(`${base}data/team.json`)
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(render)
    .catch(() => {
      root.innerHTML = `<p class="team-status">${T.error}</p>`;
    });
})();
