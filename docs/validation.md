# Validation — reversible scroll redesign

Validated the generated `public/` build in Chromium with Python Playwright on 21 October 2026.

## Production build

- `npm run build` succeeds and creates the same 17 allowlisted runtime files in `public/`.
- Application and motion scripts pass Node syntax checks; `git diff --check` passes.
- Local fonts and the existing compressed project artwork require no runtime CDN requests.
- The motion controller is 1,996 bytes before compression and 1,032 bytes with gzip. The browser no longer downloads the previous 72 KB GSAP-based motion bundle.
- Vercel retains its explicit `public` output-directory configuration.

## Reversible scrolling

166 browser checks passed. The suite sampled visual states at three scroll positions, then returned through the same positions in reverse. It checked that the visual state changes on forward scroll and matches when reached again by backward scroll.

The sampled effects include hero type, the platform band, work headings, perspective and shutters for all five projects, archive heading and rows, the about reading reveal, architecture rings and paths, experience heading and spine, individual experience entries, contact type, and the contact orbit. A mobile shutter also passes the direction checks. At desktop size, the browser exposes 61 native scroll-timeline animations.

The repository includes `scripts/check-scroll.py`, a smaller repeatable regression check covering 14 representative scenes plus motion pause. Run it against a locally served production build; it requires Python Playwright and Chromium.

## Functionality and accessibility

The full browser suite covers:

- All 13 case-study dialogs, their populated content, Escape dismissal, focus restoration, and project status labels.
- Five archive filters and their announced counts.
- No horizontal overflow at 320, 390, 600, 650, 768, 1024, and 1440 pixels.
- Mobile navigation, stored guide preferences, manual pause/resume, and live system reduced-motion changes.
- Guide chapter changes while traveling forward and backward through the page.
- Repeating IntersectionObserver fallback when native View Timelines are unavailable.
- Readable no-JavaScript content, WebGL failure preserving the static guide, and Data Saver skipping the character bundle.
- No JavaScript errors or failed asset requests; the résumé remains available.

Axe reported zero WCAG 2 A/AA and WCAG 2.1 AA violations at the home, work, about, and contact positions, and with a case-study dialog open. The first review found a decorative band's missing semantic role and insufficient contrast in the hero's exit state. Both were corrected before the final passing run. Automated checks do not constitute a full manual accessibility audit.

Desktop and mobile screenshots were reviewed. Moving chapter headings are clipped to their own container to prevent horizontal document overflow. Mobile image effects use a small translation and scale rather than desktop perspective rotations. A final targeted check at 320, 360, 390, and 600 pixels confirmed that the compact guide navigation and motion controls do not overlap.

## Performance observations

In the final unthrottled local desktop run, LCP was approximately 0.83 seconds and cumulative layout shift was zero. Software WebGL initialization produced a largest observed main-thread task of 545 ms. These observations are not production mobile Core Web Vitals guarantees.

Most motion uses native scroll timelines and transform/opacity; there is no custom JavaScript scroll-position loop. SVG path drawing is confined to the small architecture illustration. The optional Three.js guide retains capped rendering and stops while hidden or paused. The three lazy-loaded WebP illustrations total 119,050 bytes. Production hosting should compress HTML, CSS, and JavaScript.
