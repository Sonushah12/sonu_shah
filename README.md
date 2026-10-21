# Sonu Shah’s portfolio

A static portfolio with a procedural Three.js developer guide, semantic project stories, a printable résumé, and no runtime CDN requests.

## Run

The compiled avatar and small motion controller are included. No dependency installation is needed to serve the site:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open the served page in a browser with JavaScript and WebGL for the animated guide. The core portfolio and résumé remain readable without WebGL or JavaScript. A static character illustration replaces the renderer if WebGL is unavailable. Data Saver skips the 3D bundle.

## Edit and build

Use Node 20+ and install the locked development tools:

```sh
npm ci
npm run build
```

Edit `assets/avatar.js` and rebuild the committed `assets/avatar.bundle.js`. The UI lives in `index.html`, `styles.css`, and `app.js`. The ink-and-citrus design uses asymmetric case studies, offset typography, a kinetic platform band, and a light approach chapter. Project narratives are in `projects.js`; scroll-timeline coordination and the repeating legacy fallback are in `assets/motion.js`. Rebuild both JavaScript bundles after editing their sources. `resume.html` has a print/save-PDF action.

## Interaction and accessibility

Every main chapter has reversible scroll-driven effects in `styles.css`, using native CSS View Timelines. Older browsers receive repeating observer-triggered arrivals and departures. The guide changes poses as each section enters the viewport using IntersectionObserver. The welcome button triggers a wave. The guide can be hidden and motion paused; choices persist locally. System reduced motion renders static poses. Scrolling is native and never hijacked. Project details use native modal dialogs with focus restoration and Escape dismissal. All content and links remain functional if the optional renderer fails.

## Delivery

`npm run build` also creates a clean `public/` directory containing the HTML pages, styles, application script, compiled avatar and motion bundles, project narratives, compressed artwork, local fonts, and licenses. Deploy this generated directory. It is ignored by Git and rebuilt from source during deployment.

For Vercel, the included `vercel.json` selects the static framework, runs `npm run build`, and uses `public` as the Output Directory. Keep the project Root Directory at the repository root. To check the same output locally, run `python3 -m http.server 8000 --bind 127.0.0.1 --directory public` after building.

Serve these static files over HTTPS. Enable Brotli or gzip for HTML, CSS, JavaScript, and SVG. The avatar bundle is approximately 132 KB with gzip (about 520 KB uncompressed); static hosts without compression transfer the full file. Assets are versioned in Git but not content-hashed, so use revalidation rather than a year-long immutable cache. Never cache `index.html` indefinitely.

The 3D renderer caps device pixel ratio, avoids texture downloads and shadow maps, and stops its loop while hidden or paused. Self-hosted Manrope and Space Grotesk include only their Latin variable fonts. Three generated WebP illustrations total approximately 119 KB and load lazily. Library and font licenses are in `assets/vendor` and `assets/fonts`.

## Content

Employment, education, technology, and project claims come from the previous portfolio and the owner’s conversation. The avatar is an original stylized character, not a verified likeness. Device artwork is illustrative rather than production screenshots. Ten additional project areas come from the owner’s pasted project history; the media downloader and paywall system retain explicit in-progress / partially implemented labels. Review dates and work descriptions as the résumé changes.

See [design research](docs/design-research.md) for references, skill guidance, and the design decisions behind the implementation.

## Check reversible scrolling

With the built site served locally, run:

```sh
python3 scripts/check-scroll.py --url http://127.0.0.1:8000/
```

This uses Python Playwright and an installed Chromium browser. It checks 14 representative scenes, including each featured project, at scroll positions reached from both directions. It also checks that pausing removes the effects and exposes the artwork. Full browser-validation results are recorded in [validation](docs/validation.md).
