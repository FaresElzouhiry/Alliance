# Alliance Investment — website

```
index.html, ar/, about-us/, business-model/, privacy-policy/, assets/, data/, sw.js …  ← the website (repo root)
original/    ← copy of the old WordPress site, for reference only (git-ignored)
serve.ps1    ← local preview server
```

The new site is plain HTML + CSS + a little JavaScript. No WordPress, no database,
no build step, no frameworks. It can be hosted on any static host
(Cloudflare Pages, Netlify, GitHub Pages, Vercel, or any normal web hosting).

## Preview on your computer

```
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Open http://localhost:8080/ (use `-Folder original` to preview the old site).
Don't double-click the HTML files: the team section and icons need a web server.

## Where things are

| What | File |
|---|---|
| Home page | `index.html` · other languages: `ar/`, `es/`, `ja/`, `zh/`, `ko/` + `index.html` |
| About Us (vision, mission, team) | `about-us/index.html` · e.g. `es/about-us/index.html` |
| Business Model | `business-model/index.html` · e.g. `ja/business-model/index.html` |
| Privacy Policy | `privacy-policy/index.html` · e.g. `ko/privacy-policy/index.html` |
| 404 page (all languages) | `404.html` |
| All styles (colors, fonts, layout) | `assets/css/styles.css` — colors are at the top under `:root` |
| Menu, animations, contact form | `assets/js/main.js` |
| Team section renderer | `assets/js/team.js` |
| 3D globe in the home hero | `assets/js/globe.js` |
| Service worker (cache / offline) | `sw.js` |
| Images (all WebP, optimized) | `assets/img/` |
| Icons | `assets/img/icons.svg` |
| World map | `assets/img/world-map.svg` |
| Design models for review (6 alternative one-page sites, hidden from Google) | `models/` — open `models/` to compare them. 1–3 are inspired by Invest Saudi, ADIO and AstroLabs; 4–6 are original 3D concepts. Shared content: `models/content.js`; shared effects: `models/models.js` / `models.css`; map data: `models/geo.js`; preview images: `models/img/`. The 3D models load three.js from cdn.jsdelivr.net. |

The header and footer are repeated in each of the 24 HTML files (4 pages × 6 languages).
If you change the phone number, email or menu, change it in all of them.

## Updating the cache for visitors (service worker)

`sw.js` keeps a copy of the site in each visitor's browser, so repeat visits
open instantly and the site still works offline.

- **Pages (HTML)** always load from the network first, so text changes appear right away.
- **Files (CSS, JS, images, fonts)** come from the cache and refresh in the background.
- **To force everyone onto the new version**, open `sw.js` **in the repo root** and change
  `const VERSION = 'v5';` → `'v6'` (then `'v7'`, …), and upload. Browsers detect the change,
  download everything fresh and delete the old cache. (Only the root `sw.js` counts —
  a copy inside another folder is ignored.)

On `localhost` the service worker is switched off, so your edits show up immediately.
To test it locally, open any page with `?sw` (e.g. http://localhost:8080/?sw).

## Effects

- Intro: the gold coin logo animation on the home page (once per browser session).
- 3D globe: drag to spin; it shows the 16 network countries with arcs from Riyadh.
  The countries and their names are in the `NETWORK` list at the top of `globe.js`.
- 3D tilt cards, magnetic buttons and the cursor spotlight run on desktop (mouse) only.
- Visitors whose system asks for reduced motion get a calm, still version.

## Languages

| Language | Folder | `<html lang>` |
|---|---|---|
| English (default) | site root | `en` |
| Arabic (right-to-left) | `ar/` | `ar` |
| Spanish | `es/` | `es` |
| Japanese | `ja/` | `ja` |
| Chinese (Simplified) | `zh/` | `zh-Hans` |
| Korean | `ko/` | `ko` |

Every page has a language menu (🌐) that opens the same page in another language,
and `hreflang` tags + `sitemap.xml` tell Google the versions belong together.
All languages share one stylesheet: Arabic switches to right-to-left, and Japanese,
Chinese and Korean use the visitor's built-in system fonts (nothing extra to download).

Each language is plain HTML. When you change text on the English page, change the
same text in the other five language files too. Interface text that JavaScript writes
(menu labels, form messages, team headings, globe labels) lives in the `STRINGS`
lists in `assets/js/main.js` and `assets/js/team.js`, and in `NETWORK` in `globe.js`.

## Editing the team

Edit `data/team.json`. Every About page reads this file, so there's no need
to touch the HTML. Fields ending in `_ar`, `_es`, `_ja`, `_zh` or `_ko`
(e.g. `title_ja`, `bio_es`) are shown on that language's page; if one is missing,
the English text is used. Names stay as written in `name` unless you add `name_xx`.
To add a person, copy one block, then change the names, titles, bios and the photo path.
Photos are square 400×400 images in `assets/img/`. A `bio` can be a single
text or a list of bullet points.

## Contact form

There is no server, so by default the form opens the visitor's email app with
the message already filled in, addressed to Ksa@alliance.sa.

To receive messages directly without the email app, create a free form endpoint
(for example at formspree.io or web3forms.com) and paste its URL into
`data-endpoint=""` on the `<form id="contact-form">` in the home page of every
language (`index.html`, `ar/index.html`, `es/index.html`, …). Each form shows labels
in its own language but sends the same English option values, so every enquiry
reaches you in one format.

## Analytics

Google Analytics (`G-WH9W4CYF88`, the same ID as the old site) loads after the
page has finished loading. Change or remove it at the top of `assets/js/main.js`.

## Hero video (optional)

The old site's hero video (10 MB) is in `original/wp-content/uploads/2025/07/Untitled-design-10.mp4`.
The new site uses a still image instead to stay fast. To bring the video back,
compress it first (e.g. with HandBrake, 720p, about 2–3 MB), save it as
`assets/video/hero.mp4`, and set `data-src="assets/video/hero.mp4"` on the
`<video class="hero__video">` tag in `index.html`. It then plays on
desktop only, after the page has loaded.

## Going live

1. The repo root is the website. On GitHub: Settings → Pages → Deploy from a branch → `main` / `(root)`.
   For alliance.sa, add the custom domain there (GitHub creates a `CNAME` file) and point the DNS to GitHub Pages.
   `.nojekyll` tells GitHub to serve the files as they are.
2. `sitemap.xml`, `robots.txt`, the canonical URLs and the Google Search
   Console verification tag are already in place.
3. The old URLs (`/about-us/`, `/business-model/`, `/privacy-policy/`) are unchanged,
   so existing links and Google results keep working. The other languages are new
   URLs under `/ar/`, `/es/`, `/ja/`, `/zh/` and `/ko/`.
4. The share preview tags (`og:url` and `og:image`, the picture and link that WhatsApp,
   LinkedIn, X, etc. show when someone shares a page) point to the GitHub Pages copy
   `https://faresElzouhiry.github.io/Alliance/` while alliance.sa still runs the old site.
   Once alliance.sa serves this site, replace `https://faresElzouhiry.github.io/Alliance/`
   with `https://alliance.sa/` in those two tags in all 24 pages.
