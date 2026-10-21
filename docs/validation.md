# Validation — editorial portfolio redesign

Validated against the generated `public/` output using Chromium and Python Playwright on 21 October 2026.

## Build and delivery

- `npm ci` succeeds with the committed lockfile.
- `npm run build` emits 17 allowlisted runtime files into a clean `public/` directory.
- `vercel.json` explicitly selects `public` as the output directory and `npm run build` as the build command.
- Application scripts pass Node syntax checks; `git diff --check` passes.
- No skill files, dependencies, or source modules are included in the public directory.
- Both fonts, the three WebP images, the character renderer, and the motion bundle are served locally; there are no runtime CDN requirements.

## Browser checks

80 checks passed, covering:

- All 13 case studies: opening, populated narratives, Escape dismissal, and focus restoration.
- Media Downloader's in-progress scope and Dynamic Paywall's partial-implementation scope.
- Five archive filters, their visible result counts, and live status text.
- Horizontal overflow at widths 320, 390, 650, 768, 1024, and 1440 pixels.
- Mobile navigation, motion pause/resume, stored preferences, guide hiding, and live reduced-motion preference changes.
- Successful WebGL initialization; SVG fallback when WebGL fails; readable content without JavaScript; Data Saver skipping the 3D download.
- Updated résumé content, no JavaScript errors, and no failed asset requests.

Axe's WCAG 2 A/AA and WCAG 2.1 AA rules reported zero violations for the main page and an open case-study dialog. Automated checks do not replace a full manual accessibility audit.

Desktop and mobile screenshots were visually reviewed. A wide-card flow issue was found and fixed; the corrected media and paywall layouts were checked again. The system preference checks wait for the browser's asynchronous media-query change event before asserting the resulting state.

## Performance observations

In an unthrottled local desktop run, LCP was approximately 0.74 seconds and cumulative layout shift was 0. The largest observed main-thread task was 368 ms during the page/3D initialization period with software rendering. These are local observations, not production mobile Core Web Vitals guarantees.

The original generated images are encoded as WebP: voice 21,974 bytes, drawing 56,522 bytes, and keyboard 40,554 bytes (119,050 bytes total). Images load lazily with reserved dimensions. Hero content does not wait for the optional character bundle. Motion is bounded, native-scrolling based, and user-controllable. Production hosting should enable Brotli or gzip for scripts, styles, and HTML.
