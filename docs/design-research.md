# Design and motion research

The goal is a professional developer portfolio with a memorable character, readable work stories, and fast static delivery. The palette uses deep green ink (`#22372c`), pale sage (`#e6ebe0`), off-white (`#f7f8f2`), bright yellow-green (`#e6f36a`), and a lavender project surface (`#ddd3ef`). Self-hosted Manrope provides one coherent type family. A single 3D guide carries the main personality while the surrounding layout stays quiet.

## Online skills read and applied

- [Anthropic Frontend Design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md): deliberate typography, subject-specific identity, one memorable focal point, and browser-based visual critique.
- [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill): responsive hierarchy, keyboard access, contrast, reserved layout dimensions, and motion controls. Its local search workflow was inspected before running. The refined `creative portfolio 3D` query matched Portfolio/Personal and Scroll-Triggered Storytelling; automatic brutalist styling recommendations were rejected because they conflicted with the requested smooth professional design.
- [Fixing Motion Performance](https://github.com/ibelick/ui-skills/blob/main/skills/fixing-motion-performance/SKILL.md): transform-based transitions, visibility observers, render-loop stop conditions, no continuous layout measurements, and reduced-motion handling.
- [Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md): semantics, focus, responsive interfaces, readable content, and progressive enhancement.

These were retrieved online and read during implementation; they are guidance sources, not installed runtime dependencies.

## Portfolio references

- [Bruno Simon](https://bruno-simon.com), via the official [2019 source](https://github.com/brunosimon/folio-2019) and [2025 source](https://github.com/brunosimon/folio-2025): a recognizable interactive identity, staged exploration, and attention to resource loading. This project adapts those principles to a small guide alongside ordinary HTML, with no copied models or portfolio code.
- [Brittany Chiang](https://brittanychiang.com), via the official [portfolio README](https://github.com/bchiang7/v4): clear developer positioning, disciplined content hierarchy, and easy access to work and experience.

Direct showcase pages, Awwwards, Dennis Snellenberg’s site, and search engines returned network-policy errors. Their live rendering and current award rankings were not inspected. “World’s best” is subjective; no ranking or award is claimed for this implementation.

## Motion decisions

Native scrolling drives chapter changes through IntersectionObserver. A discrete FLIP transform moves the character from its hero stage into a small guide at the viewport edge. The character presents, thinks, stands confidently, and waves according to the current chapter. CSS Scroll Timeline provides the progress line when supported. The scene renders at a capped 30 FPS with limited pixel ratio and no expensive postprocessing; hidden tabs, offscreen scenes, pause controls, and reduced motion stop continuous rendering.

The content is available immediately and the 3D bundle loads during browser idle time. No remote textures or character models are required. A static SVG character covers WebGL failure, disabled JavaScript, and Data Saver. Pause and hide controls are always reachable. Project previews are CSS compositions, not bitmap downloads.
