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
| Home page | `index.html` · Arabic: `ar/index.html` |
| About Us (vision, mission, team) | `about-us/index.html` · Arabic: `ar/about-us/index.html` |
| Business Model | `business-model/index.html` · Arabic: `ar/business-model/index.html` |
| Privacy Policy | `privacy-policy/index.html` · Arabic: `ar/privacy-policy/index.html` |
| 404 page (both languages) | `404.html` |
| All styles (colors, fonts, layout) | `assets/css/styles.css` — colors are at the top under `:root` |
| Menu, animations, contact form | `assets/js/main.js` |
| Team section renderer | `assets/js/team.js` |
| 3D globe in the home hero | `assets/js/globe.js` |
| Service worker (cache / offline) | `sw.js` |
| Images (all WebP, optimized) | `assets/img/` |
| Icons | `assets/img/icons.svg` |
| World map | `assets/img/world-map.svg` |

The header and footer are repeated in each of the 8 HTML files (4 English + 4 Arabic).
If you change the phone number, email or menu, change it in all of them.

## Updating the cache for visitors (service worker)

`sw.js` keeps a copy of the site in each visitor's browser, so repeat visits
open instantly and the site still works offline.

- **Pages (HTML)** always load from the network first, so text changes appear right away.
- **Files (CSS, JS, images, fonts)** come from the cache and refresh in the background.
- **To force everyone onto the new version**, open `sw.js` and change the first line
  `const VERSION = 'v1';` → `'v2'` (then `'v3'`, …), and upload. Browsers detect the change,
  download everything fresh and delete the old cache.

On `localhost` the service worker is switched off, so your edits show up immediately.
To test it locally, open any page with `?sw` (e.g. http://localhost:8080/?sw).

## Effects

- Intro: the gold coin logo animation on the home page (once per browser session).
- 3D globe: drag to spin; it shows the 16 network countries with arcs from Riyadh.
  The countries and their names are in the `NETWORK` list at the top of `globe.js`.
- 3D tilt cards, magnetic buttons and the cursor spotlight run on desktop (mouse) only.
- Visitors whose system asks for reduced motion get a calm, still version.

## Arabic version

The Arabic site lives in `ar/` (right-to-left, Cairo font). Every page has a
language switch in the menu (العربية / English) that jumps to the same page in the
other language, and `hreflang` tags tell Google the two versions belong together.
Layout and styles are shared: `styles.css` switches direction automatically from
`<html lang="ar" dir="rtl">`. When you change text on an English page, update the
matching Arabic page too.

## Editing the team

Edit `data/team.json`. Both About pages read this file, so there's no need
to touch the HTML. Fields ending in `_ar` (`name_ar`, `title_ar`, `bio_ar`) are
shown on the Arabic page; if one is missing, the English text is used. To add a
person, copy one block, then change the names, titles, bios and the photo path.
Photos are square 400×400 images in `assets/img/`. A `bio` can be a single
text or a list of bullet points.

## Contact form

There is no server, so by default the form opens the visitor's email app with
the message already filled in, addressed to Ksa@alliance.sa.

To receive messages directly without the email app, create a free form endpoint
(for example at formspree.io or web3forms.com) and paste its URL into
`data-endpoint=""` on the `<form id="contact-form">` in `index.html` and
`ar/index.html`. The Arabic form shows Arabic labels but sends the same
English option values, so every enquiry reaches you in one format.

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
   so existing links and Google results keep working. The Arabic pages are new
   URLs under `/ar/`.
