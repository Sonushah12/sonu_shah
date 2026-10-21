# Reference notes

Requested references: https://ui.aceternity.com/ and https://animmasterlib.dev/.

Both website hosts returned HTTP CONNECT policy denials in the managed environment. Public GitHub material was inspected through the supported proxy instead. No request was made to bypass the site's network policy or obtain paid component source.

## AnimMaster — primary public documentation

Repository: [Animmaster/docs](https://github.com/Animmaster/docs). Its README explicitly links the template to `https://www.animmasterlib.dev/`, establishing the relationship to the requested reference.

Inspected pages:

- [Watcher](https://github.com/Animmaster/docs/blob/main/watcherdoc.html): IntersectionObserver, entering/leaving state, configurable threshold, and optional once-only behavior. This portfolio deliberately uses repeatable visibility states.
- [SplitType](https://github.com/Animmaster/docs/blob/main/splittypedoc.html): word/line/character wrapping for staggered text. This portfolio uses authored word spans because the short heading does not require a splitting dependency.
- [ScrollTo](https://github.com/Animmaster/docs/blob/main/scroll.html): section links, header offset, and active navigation. This portfolio uses native anchors, scroll-padding, and `aria-current`.
- [Scroll parallax](https://github.com/Animmaster/docs/blob/main/parallaxdoc.html): bounded relative image movement and configurable direction. Implemented here through native CSS View Timelines.
- [Mouse parallax](https://github.com/Animmaster/docs/blob/main/mousedoc.html): sensitivity and wrapper-based pointer interactions. Continuous pointer movement was excluded from this clean design.
- [Styles](https://github.com/Animmaster/docs/blob/main/animstyles.html): component-level styles, typography, spacing tokens, and adaptive containers.

No public source-code license was identified for the template. The portfolio contains original implementations informed by these documented concepts; it does not redistribute the template or claim to have installed it.

## Aceternity — creator-published example and design patterns

Inspected [creator-published AnimatedTooltip](https://github.com/manuarora700/ui.aceternity/blob/main/src/uiAceternity/Tooltip.tsx), which demonstrates scoped presence animations, compact contextual feedback, and transform/opacity interaction states. Its high-amplitude pointer-following rotation was intentionally excluded.

The [community Aceternity MCP catalogue](https://github.com/rudra016/aceternityui-mcp/blob/main/src/utils/components-data.ts) was also inspected for component descriptions and official documentation URLs. It is a secondary reference, not an official source-code license. The catalogue verified the Text Generate Effect description and registry URL. The subtle spotlight, directional hover, and trace are project-authored patterns, rather than copied vendor components. Because the live registry was blocked and a component-wide license was not established, these are original adaptations rather than copied or officially installed components. The portfolio does not claim that every live component source was inspected.

## Runtime mapping

- `index.html`: semantic word spans, artwork wrappers, native project buttons, and timeline markup.
- `styles.css`: calm surfaces, reversible section reveals, small image parallax, trace, and focus states.
- `assets/motion.js`: finite word introduction, repeated Watcher fallback, direction-aware hover, and pause cleanup.
- `app.js`: native navigation, active-section state, dialogs, and guide preferences.
