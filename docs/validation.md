# Validation

The completed portfolio passed 73 browser checks using Playwright and Chromium, with SwiftShader software WebGL. No uncaught browser errors or external runtime requests were observed.

## Verified behavior

- Responsive desktop, tablet, 390px and 320px layouts without horizontal overflow.
- Mobile navigation and keyboard Escape behavior.
- All three project dialogs, focus restoration, backdrop dismissal, and native focus containment.
- Email copying through the real clipboard and the actual résumé link.
- Five avatar chapter poses, explicit greeting, pause/resume, hide/show, persisted preferences, and reduced motion.
- Failed-bundle and unavailable-WebGL fallback illustrations.
- Rendering stops while paused/hidden; software-rendered geometry is capped at 30 FPS.
- Footer content remains unobscured by the guide on narrow screens.
- Zero axe WCAG A/AA violations on desktop, mobile, and dialogs. Automated checks do not replace a complete human accessibility assessment.
- `npm ci`, `npm run build`, JavaScript syntax checks, and `git diff --check` passed.

## Local performance evidence

| Measurement | Desktop layout | Mobile layout |
| --- | ---: | ---: |
| Largest contentful paint | 1.46 s | 0.36 s |
| Cumulative layout shift | 0 | 0 |
| Longest 3D initialization task | 1.26 s | 0.19 s |

These are isolated localhost measurements using a software renderer, not real-device or deployed-site performance. The optional renderer starts after the content paint and uses asynchronous shader compilation, but software WebGL still causes a noticeable initialization task. GPU hardware, slow networks, and actual hosting remain unmeasured.

Initial page assets total roughly 603 KB uncompressed, including the optional 3D bundle, or 173 KB with gzip. Python's development server sends uncompressed responses. Enable gzip/Brotli at deployment. The font is self-hosted; project illustrations require no image downloads. The 3D renderer uses 48 draw calls and approximately 42,000 triangles, with bounded resolution and no shadow maps.
