# Validation — hand-drawn sketchbook redesign

Validated against the generated `public/` build using Chromium and Python Playwright.

## Build and source checks

- Clean `npm ci` and `npm run build` succeed with the committed lockfile.
- The build creates 16 allowlisted runtime files. Development tools, skills, source modules, and dependencies are excluded.
- HTML/CSS formatting checks, Node syntax checks, and `git diff --check` pass.
- Only Kalam 700 and Patrick Hand 400 are requested: two local Latin font files totaling 46,088 bytes, with both OFL licenses included.
- The motion controller is 2,716 bytes before compression, approximately 1,203 bytes with gzip. The optional renderer remains approximately 132 KB with gzip.

## Browser validation

98 functional checks and 33 targeted design/interaction checks pass, including:

- All 13 project dialogs, complete narratives, Escape dismissal, and restored keyboard focus.
- Explicit in-progress and partially implemented project scope labels.
- Archive filters and announced result counts.
- Direction-aware hover from four sides, animation cleanup on pause/resume, and pointer cancellation handling.
- Active navigation, mobile menus, stored pause/guide preferences, and live reduced-motion changes.
- Correct guide chapter after viewport changes at 320, 360, 390, 600, 700, 768, 1024, and 1440 pixels. The observer selects from all currently intersecting chapters rather than only the most recent callback.
- Readable no-JavaScript content, SVG fallback on WebGL failure, Data Saver skipping the optional renderer, and a printable résumé.
- Correct handwritten fonts, paper palette, hard card shadows, button press state, and greeting tooltip on pointer hover and keyboard focus.
- No horizontal overflow across tested widths; compact guide controls and motion controls remain separate.
- No JavaScript errors or failed resources.

Axe reports zero WCAG 2 A/AA and WCAG 2.1 AA violations on the page and an open project dialog. Automated checks do not replace a complete manual accessibility audit.

The committed `scripts/check-scroll.py` passes 17 representative scenes in both scroll directions, including every featured project, the traced timeline, the cover underline, and the contact arrow. It verifies identical reverse states and confirms that pause removes the effects. Fonts and completed frame boundaries are awaited before visual-state sampling.

Desktop and mobile screenshots of the cover, work, about, journey, and contact areas were inspected. Hover checks wait for animation completion instead of assuming a fixed elapsed interval, so software rendering contention does not produce false failures.

## Performance observations

The final unthrottled local functional run records LCP at approximately 0.98 seconds and zero cumulative layout shift. The largest observed main-thread task is 430 ms with software WebGL during startup. These are local observations, not production mobile Core Web Vitals guarantees.

Native scroll timelines and a repeating observer fallback avoid JavaScript scroll-position polling. The optional 3D renderer is deferred until after the short heading entrance, caps frame rate and pixel ratio, and stops rendering when hidden or paused. Three lazy-loaded WebP illustrations total 119,050 bytes. Production hosting should compress HTML, CSS, and scripts.
