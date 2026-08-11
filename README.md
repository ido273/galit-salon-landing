# הסלון של גלית — Landing Page

Single-page marketing site for **הסלון של גלית**, a bridal getting-ready venue rental business (hair/makeup styling space for brides on their wedding day). The page exists to convert visitors into leads via an embedded contact form, and to showcase the space through a photo gallery.

Fully in Hebrew, right-to-left layout, built to WCAG 2.0 AA / Israeli Standard 5568 accessibility requirements — including a custom 19-tool accessibility widget (see below).

## Tech stack

- **Frontend**: Plain static HTML/CSS/JS. No framework, no build step, no bundler.
- **Hosting**: [Cloudflare Pages](https://pages.cloudflare.com/), deployed straight from this GitHub repo with auto-deploy on every push to `main`.
- **Lead capture**: An [Airtable](https://airtable.com/) form embedded via `<iframe>` in the contact section — form submissions land directly in an Airtable base. No backend of our own.
- **Fonts**: [Heebo](https://fonts.google.com/specimen/Heebo) via Google Fonts.

## File structure

```
/
├── index.html                    Main landing page
├── privacy.html                  Privacy policy page
├── css/
│   └── style.css                 All styles (palette defined as CSS variables at the top)
├── js/
│   ├── main.js                   Gallery lightbox, FAQ accordion, footer year, scroll-reveal animations
│   └── accessibility-widget.js   Self-contained 19-tool accessibility widget
├── assets/
│   └── images/                   Optimized photos actually shipped to the site
│       ├── hero/
│       ├── about/
│       └── gallery/
└── pic/                          Raw, full-resolution photo originals — gitignored, not deployed
```

## Setup

No install, no build. Clone the repo and open `index.html` directly, or serve it locally:

```bash
python3 -m http.server 8765
# then open http://localhost:8765/index.html
```

## Deploy

The repo is connected to Cloudflare Pages with these build settings:

- **Framework preset**: None
- **Build command**: *(empty)*
- **Build output directory**: `/` (repo root)

Every push to `main` auto-deploys. To connect a custom domain: Cloudflare Pages project → **Custom domains** → **Set up a custom domain**.

## Content that's live

- **Airtable form**: embedded in the contact section of `index.html`.
- **WhatsApp button**: `972509453353`.
- **Instagram**: `https://www.instagram.com/hasalon_galit`
- **Facebook**: `https://www.facebook.com/profile.php?id=61583377915797`
- **Privacy contact**: רותם — `050-9453353` / `rotemelmalem@gmail.com` (`privacy.html`).

## Content still needed

Search `index.html` for `<!-- TODO -->` comments — currently marks: about-section bio text, three testimonials, three FAQ answers, and a possible hero/about photo upgrade if a better shot becomes available.

## Accessibility widget

Floating button bottom-left (WhatsApp stays bottom-right, they never overlap) opens a grid of 19 tools — 4 columns on desktop, 3 on tablet, 2 on phones — sized so everything is visible without an internal scrollbar on desktop. Vanilla JS, no third-party accessibility service.

Tools: large/black cursor, keyboard-navigation focus boost, stop flashing, stop animations, 5 mutually-exclusive color modes (monochrome / sepia / high contrast / black-yellow / invert), highlight headings/links, image-description tooltip (hover or persistent), readable font, font size +/-, page zoom +/-. Escape resets everything and closes the panel; preferences persist via `localStorage`.

## Notes

- Gallery uses a CSS-columns masonry layout so mixed portrait/landscape photos sit naturally without cropping.
- Section backgrounds alternate cream / rose / cream-alt top to bottom so no two adjacent sections share a shade.
