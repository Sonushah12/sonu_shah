# Design research — scroll-responsive portfolio

## Direction

The UI uses deep ink (`#171a17`), citrus (`#d6f58b`), warm paper (`#eceee4`), and a restrained coral accent. Large Space Grotesk typography, offset headings, sharp frames, an asymmetric case-study layout, and a light approach chapter replace the previous lavender card grid. Manrope remains the local body font. Project narratives and their development-status distinctions remain intact.

## Sources inspected online

The official GitHub source and README were retrieved and read for these Codrops experiments:

- [ScrollTextMotion](https://github.com/codrops/ScrollTextMotion): typography that changes arrangement as the scroll playhead moves through a composition. The inspected source uses paired scrubbed timelines. This portfolio uses its own split-heading arrangement and native View Timelines.
- [RotatingOnScrollAnimations](https://github.com/codrops/RotatingOnScrollAnimations): alternating image-plane orientations with rotation synchronized to scroll progress. This portfolio applies smaller deterministic rotations, transform-based shutters, and a simpler mobile translation.
- [OneElementScroll](https://github.com/codrops/OneElementScroll): visual continuity across waypoints, with a single element joining different chapters. This supports the existing 3D guide's continuing role and its reversible chapter poses.

Repository discovery also identified [ConnectedGrid](https://github.com/codrops/ConnectedGrid), [3DCarousel](https://github.com/codrops/3DCarousel), and [ElasticGridScroll](https://github.com/codrops/ElasticGridScroll). These were discovery results, not fully inspected live implementations. No claim is made that any reference is the world's most unique or that this site has won an award. No demo code, images, or character models were copied.

## Installed skills applied

- [UI UX Pro Max](../.agents/skills/ui-ux-pro-max/SKILL.md): a refined `portfolio personal scroll storytelling` design-system query matched Scroll-Triggered Storytelling. Applied complete DOM reading order, distinct chapters, a progress indicator, simpler mobile motion, and static reduced-motion states. The first query incorrectly returned a documentation pattern and was rejected. Generic brutalist style recommendations were also rejected where they conflicted with readable, fluid product presentation.
- [HyperFrames Animation](../.agents/skills/hyperframes-animation/SKILL.md): deterministic, seekable compositions; explicit motion endpoints; measured SVG geometry; transform-based choreography. Its video runtime is not required for the interactive website.
- [Fixing Motion Performance](../.agents/skills/fixing-motion-performance/SKILL.md): native View Timelines, no custom scroll-position polling, transform and opacity as the main animated properties, a bounded pointer interaction, and static final states for reduced motion and pause.

## Motion map

All effects below follow scroll position in both directions on browsers with native View Timeline support:

| Area | Motion |
| --- | --- |
| Hero | Headline lines move apart; orbital frames turn in opposite directions |
| Platform band | Large type moves horizontally as the band crosses the viewport |
| Work introduction | Offset headline lines approach from opposing sides |
| Five featured studies | Image planes unfold; two shutters open; headings rise into view |
| Archive | The title moves into place and individual rows glide into position |
| Approach | Words brighten in sequence; architecture rings turn and measured connection paths draw |
| Capabilities | Each heading rises as its item enters the viewport |
| Experience | Heading lines converge; the timeline spine draws; individual roles unfold |
| Contact | Two type lines converge and the circular email link turns into position |

Native scroll remains in control. There is no scroll hijacking, page pinning, video background, autoplay audio, or JavaScript scroll-position loop. A magnetic contact button caches its geometry on pointer entry and performs transform writes while the pointer moves. The existing Three.js guide retains capped rendering and visibility stop conditions.

Older browsers receive repeating IntersectionObserver arrivals and departures instead of continuous native scrubbing. The fallback is explicitly tested; it is not described as an equivalent scrub implementation. Both variants honor reduced motion and manual pause, while all copy remains readable without motion or JavaScript.

The previous GSAP runtime import is no longer required by the browser motion module. The local development dependency remains available for future work; the deployed motion bundle contains the small native-timeline controller rather than GSAP. The original three compressed project images remain unchanged and labeled conceptual.
