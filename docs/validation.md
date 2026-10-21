# Validation — clean reference-based rebuild

Validated against the generated `public/` build using Chromium and Python Playwright on 22 October 2026.

## Build and source checks

- Clean `npm ci` and `npm run build` succeed with the committed dependency lockfile.
- The build creates 17 allowlisted runtime files, including local fonts, artwork, and both compiled scripts.
- HTML formatting/parser checks, Node syntax checks, and `git diff --check` pass.
- Development skill files, source modules, dependencies, and tests are excluded from deployment.
- The local motion controller is 2,631 bytes before compression, approximately 1,189 bytes with gzip.

## Functional browser validation

97 checks pass, including:

- All 13 project dialogs, populated narratives, Escape dismissal, and focus restoration.
- Preservation of in-progress and partially implemented project scope labels.
- Archive filters and announced result counts.
- Direction-aware hover entry and exit from four edges.
- Active-section navigation, mobile navigation, pause/resume, stored preferences, and live reduced-motion changes.
- Hover-effect cleanup when motion is paused and resumed.
- Repeating Watcher fallback when native scroll timelines are unavailable.
- Readable content without JavaScript, static guide fallback on WebGL failure, and Data Saver skipping the optional renderer after the deferred loading path is reached.
- No horizontal overflow at 320, 390, 650, 768, 1024, and 1440 pixels.
- No JavaScript errors or failed asset requests; the résumé remains available.

Axe reports zero WCAG 2 A/AA and WCAG 2.1 AA violations for the page and an open case-study dialog. Earlier checks caught spotlight overflow at tablet widths and slightly insufficient muted-text contrast on tinted panels. Both were corrected before the final passing run. Automated checks are not a complete manual accessibility audit.

The committed `scripts/check-scroll.py` passes 15 scene checks for forward/backward visual-state matching, plus motion pause. It waits for fonts and completed frame boundaries before sampling compositor state, avoiding timing-dependent readings during optional 3D initialization.

A final targeted review checks the greeting tooltip with both pointer and keyboard focus, verifies its local semantic structure, and confirms that the mobile guide navigation and motion controls remain separate at 320, 360, 390, and 600 pixels. Keyboard focus receives a visible inset treatment on the fixed controls. Desktop and mobile screenshots are reviewed.

## Performance observations

The final unthrottled local run records LCP at approximately 0.99 seconds and zero cumulative layout shift. The largest observed main-thread task is 241 ms during the page/optional renderer startup period. These are local measurements, not production mobile Core Web Vitals guarantees.

The optional renderer initializes after the short text entrance rather than competing with it. The motion system uses native scroll timelines for gentle reversible movement, a repeating observer fallback, finite word and hover animations, and no custom JavaScript scroll-position loop. The guide remains capped and stops when paused or hidden. The three lazy-loaded WebP illustrations total 119,050 bytes. Production hosting should compress HTML, CSS, and scripts.
