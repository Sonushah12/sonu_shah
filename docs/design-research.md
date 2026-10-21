# Design direction — the developer’s sketchbook

The owner's uploaded Hand-Drawn design brief sets the current direction. It replaces the earlier serif portfolio with warm paper, marker headings, handwritten notes, organic borders, hard offset shadows, paper tape, small rotations, and red, blue, and yellow accents. The result is implemented in the existing semantic HTML/CSS/JavaScript stack; reference examples written for React or Tailwind do not require adding either dependency.

## System and layout

`styles.css` centralizes the palette, two reusable irregular border radii, an organic round shape, and two hard shadow sizes. Kalam 700 and Patrick Hand 400 are self-hosted with their OFL licenses. The page loads two Latin font files instead of three. Unused Instrument Serif and Manrope assets and the old font package are removed.

The cover pairs large marker lettering with a taped yellow portrait sheet and the existing neutral-clothing 3D developer. Selected work appears as gently tilted paper cards with original concept artwork, scope notes, tags, and case-study links. The archive is a quieter notebook index with filters. About uses a taped letter and three capability notes; experience uses connected dots; contact is a yellow note with a drawn arrow. The résumé follows the same typography and paper palette and remains printable.

The main column is limited to 1024 pixels. Grids stack on small screens, handwritten copy remains readable, and controls retain touch targets of at least 48 pixels. Decorations are hidden from assistive technology. Red marker fills use dark text; small red annotations use a darker red ink token for contrast. The site adds no fictitious metrics, awards, public product links, or shipment claims.

## Motion

Native CSS View Timelines drive modest content arrivals, artwork parallax, a tracing journey line, a reversible cover underline, and the contact arrow. Scrolling backward restores the same states. JavaScript supplies only finite heading introductions, bounded direction-aware hover, and a repeating IntersectionObserver fallback. Hover geometry is remeasured on departure as tilted cards settle, and pointer cancellation clears the effect. Buttons press down with reduced hard shadows; cards gently straighten on hover.

Reduced motion, manual pause, keyboard focus, no JavaScript, Data Saver, and WebGL failure retain readable content. The optional renderer stays independent of content and is deferred until after the heading introduction. There is no scroll hijacking, page pinning, perpetual decorative loop, or JavaScript scroll-position polling.

## Prior reference provenance

The previous Aceternity and AnimMaster research remains relevant to interaction patterns. Both live sites were blocked by the environment's destination policy. Public material from [AnimMaster's documentation](https://github.com/Animmaster/docs) and [the Aceternity creator's tooltip example](https://github.com/manuarora700/ui.aceternity/blob/main/src/uiAceternity/Tooltip.tsx) informed the project-authored [motion skill](../.agents/skills/portfolio-clean-motion/SKILL.md). Its [source notes](../.agents/skills/portfolio-clean-motion/references/source-notes.md) distinguish source inspection from original adaptations. No proprietary template or paid vendor component is redistributed, and this skill is not an official vendor package.
