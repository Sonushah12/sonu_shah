# Clean portfolio redesign — sources and decisions

The owner requested a fresh UI and cleaner animation informed by [Aceternity UI](https://ui.aceternity.com/) and [AnimMaster](https://animmasterlib.dev/). Both live hosts returned HTTP CONNECT policy denials in this environment. Public GitHub material was used through the supported proxy.

## Verified reference material

[AnimMaster's public documentation](https://github.com/Animmaster/docs) explicitly links its template to animmasterlib.dev. The Watcher, SplitType, ScrollTo, parallax, mouse-parallax, and styles pages were inspected. The useful ideas were repeated visibility states, small word groups, natural section navigation, active-section feedback, and configurable image movement. The proprietary template was not downloaded or redistributed.

The [Aceternity creator's AnimatedTooltip example](https://github.com/manuarora700/ui.aceternity/blob/main/src/uiAceternity/Tooltip.tsx) was inspected for compact contextual feedback and transform/opacity presence animation. The portfolio adapts this into an accessible hint on its existing greeting button, with hover and keyboard-focus support. Large pointer-following rotations and bouncy springs were excluded.

A [community component catalogue](https://github.com/rudra016/aceternityui-mcp/blob/main/src/utils/components-data.ts) verified the Text Generate Effect description and its official registry URL. This catalogue is a secondary reference, not a license for vendor component source. The portfolio's short word introduction is an original implementation of that documented behavior. Its soft spotlight, directional project overlay, and timeline trace are also original adaptations; a direct vendor-component installation is not claimed.

No installable Aceternity skill was returned by the skill search. A reusable project-authored [portfolio-clean-motion skill](../.agents/skills/portfolio-clean-motion/SKILL.md) was created instead. Its [source notes](../.agents/skills/portfolio-clean-motion/references/source-notes.md) distinguish verified sources from adaptation and explain what is bundled.

## A quieter visual direction

Instrument Serif supplies expressive regular and italic headings. Manrope keeps body copy and project details easy to read. The palette combines warm white, neutral gray, a restrained blue accent, a pale sage about section, and a soft blue contact panel. A single featured project leads into a simpler two-column grid. The archive, experience timeline, and contact details use a clear hierarchy rather than large decorative effects.

The guide keeps its neutral clothing and friendly gestures, with cooler gray and blue accents to match the new palette. It remains optional, can be hidden, and never gates access to content.

## Motion rules actually applied

- Four hero words receive a finite 500 ms introduction with a small, bounded stagger.
- Section content rises by at most 16 px. Text keeps full contrast throughout the scroll.
- Artwork moves by only 7 px each way, with reserved dimensions and slight overscan.
- Direction-aware action overlays respond to pointer entry and exit. The action is also available through the native button and keyboard focus.
- A greeting tooltip uses a small presence transition on an existing focusable control.
- A thin timeline trace connects the experience entries and rewinds on backward scroll.
- The contact button receives a quiet border emphasis on hover and focus.

Native CSS View Timelines provide reversible scroll effects. Repeating IntersectionObserver state changes cover older browsers. Native anchors and scroll-padding handle navigation; the active chapter uses `aria-current`. There is no scroll hijacking, page pinning, heavy blur, continuously moving border, pointer-following magnet, or JavaScript scroll-position loop.

System reduced motion and manual pause leave final, readable states. Transient animations are canceled when paused and suspended in hidden tabs. Hover effects are limited to fine pointers. Content remains available without JavaScript or WebGL.

## Content and dependencies

All 13 project narratives, verified contact information, employment history, and development-status distinctions are retained. Artwork remains explicitly conceptual. No metrics, release claims, or product links were invented.

Instrument Serif is self-hosted under its included OFL license. Unused GSAP and Space Grotesk dependencies and runtime assets were removed. The application remains a static site with a small motion controller and an optional locally bundled Three.js renderer. The build publishes only an explicit runtime allowlist.
