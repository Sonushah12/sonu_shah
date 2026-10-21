# Design and motion research

The portfolio uses off-white paper, ink, lavender, and a restrained purple accent. Self-hosted Space Grotesk provides expressive headings; Manrope keeps project narratives readable. The original neutral-clothing Three.js guide connects the chapters without replacing ordinary page navigation.

## Installed skills and applied guidance

The following skills are installed project-locally in `.agents/skills`, pinned by `skills-lock.json`:

- [HyperFrames Animation](https://github.com/heygen-com/hyperframes): the waterfall-entry recipe informed the overlapping, clipped headline arrival; svg-path-draw supplies measured path drawing; the GSAP adapters informed finite labeled timelines, transform/opacity motion, and cleanup. The website adapts composition recipes to browser interactions; it does not ship the HyperFrames video runtime.
- [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill): its local design-system search matched Scroll-Triggered Storytelling. Applied readable DOM chapters, distinct visual hierarchy, responsive simplification, local fonts, reserved artwork dimensions, keyboard access, and reduced-motion controls. Generic brutalist style suggestions were rejected because they conflicted with the requested smooth editorial direction.
- [Fixing Motion Performance](https://github.com/ibelick/ui-skills/tree/main/skills/fixing-motion-performance): native CSS View Timelines for artwork drift, IntersectionObserver for one-time entrances, stopped render loops, no custom scroll-position polling, and temporary layer hints.

The skills are development guidance, not browser dependencies. GSAP and Three.js are bundled locally. The GSAP distribution retains its license notice; the license reference is included in `assets/vendor`.

## Portfolio references

Earlier research consulted [Bruno Simon's official source](https://github.com/brunosimon/folio-2025) for a memorable interactive identity and staged exploration, and [Brittany Chiang's official source](https://github.com/bchiang7/v4) for clear developer positioning and content hierarchy. No portfolio code or models were copied.

Live showcase pages, Awwwards, some search engines, and the shared ChatGPT URL were inaccessible under the environment's network policy. The owner supplied the chat content directly. No current award ranking or award for this implementation is claimed.

## Motion system

`assets/motion.js` contains a finite GSAP introduction, bounded observer-triggered section entrances, and small measured SVG path draws. The intro is inspectable as `window.__timelines['portfolio-intro']`. Native CSS View Timelines move the project art on supported desktop browsers; unsupported browsers retain static art. No scroll hijacking, smooth-scroll library, autoplay audio, or persistent JavaScript scroll loop is used.

The guide uses section observers, discrete FLIP docking, and a capped 30 FPS Three.js scene. It changes between greeting, presenting, thinking, confident, and farewell poses. Its loop stops when hidden, offscreen, paused, or in a hidden tab. Reduced motion retains static poses; a static SVG covers WebGL failure and Data Saver. Pause and hide preferences persist. Reduced motion and manual pause also settle the new timeline effects into readable final states.

## Artwork and content provenance

Three original generated illustrations cover audio, drawing, and keyboard personalization. Their original PNGs remain outside the deployment; mechanically encoded WebP assets total approximately 119 KB. Two other project illustrations are lightweight original HTML/CSS compositions. All artwork is labeled conceptual, not a production screenshot. The external reference images in the pasted chat are not used as project evidence or publisher affiliations.

The owner supplied ten new project areas. Five are featured and five appear in an eight-entry archive with the three earlier projects. Case studies distinguish direct contributions from ongoing work. Media Downloader is in progress; Dynamic Paywall is partially implemented; audio extraction and offline-reading plans are explicitly scoped. No download counts, revenue metrics, release claims, or external product links were invented. Existing employment, education, and contact information is preserved.
