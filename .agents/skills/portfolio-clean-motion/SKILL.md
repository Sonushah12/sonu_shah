---
name: portfolio-clean-motion
description: Design clean portfolio interfaces with restrained text, hover, viewport, and tracing effects informed by Aceternity examples and AnimMaster documentation. Apply for this portfolio's UI and motion work.
---

# Clean portfolio motion

This is a project-authored skill, not an official Aceternity or AnimMaster package. Read [source notes](references/source-notes.md) before extending it or describing provenance. Vendor component code and proprietary template code are not bundled by this skill.

## Design intent

Create calm, useful interactions within the owner's hand-drawn sketchbook design system. Use warm paper, Kalam marker headings, Patrick Hand body text, irregular borders, hard offset shadows, and restrained red, blue, and yellow accents. Centralize reusable shapes and colors in CSS tokens. Keep the work and contributions easy to find. Give each motion a purpose: introduce content, indicate an action, connect stages, or preserve spatial continuity. The owner's uploaded design brief supersedes the earlier serif and sans-serif direction.

## Motion recipes

1. **Text generation:** wrap meaningful words in inline spans while retaining their normal reading order. Animate a short introduction with 12 px translation, opacity, 500 ms duration, and 55 ms bounded stagger. Content remains visible when JavaScript or animation fails. Skip for reduced motion and deep-link entry.
2. **Watcher:** use IntersectionObserver with a small threshold to set inside/outside viewport state. Remove the visible state when leaving so scrolling backward can replay it. Do not use a once-only flag for section motion.
3. **Scroll reveal:** prefer native View Timelines with 16 px travel and opacity no lower than .85 for reading content. The final and reverse states must remain legible. Use the repeating Watcher as an older-browser fallback.
4. **Image parallax:** move only the artwork, at most 7 px each way with a small overscan scale. Reserve image dimensions. Avoid perspective rotation, page pinning, and large masks for this clean direction.
5. **Direction-aware hover:** measure the artwork rectangle on pointer entry, determine the nearest edge, and bring in a compact action overlay using transform/opacity. Exit through the departure edge. Keep it pointer-fine only, supply the same action visibly and on keyboard focus, and disable the effect when motion is paused.
6. **Tracing:** use a thin progress line to connect an existing timeline. Animate scaleY rather than height. It rewinds naturally with the scroll position.
7. **Context tooltip:** use a compact hint on an existing focusable control. Animate presence with opacity and a 5 px translation, provide `role="tooltip"` and `aria-describedby`, and show it for both hover and keyboard focus. Avoid pointer-following rotation or extra tab stops.
8. **Button emphasis:** use a small border emphasis on hover/focus and a maximum 2 px lift. No continuously moving borders, magnetic pointer following, or looping shimmer in the default state.
9. **Project pagination:** present one page with numbered buttons, previous/next, arrow/Home/End keys, and horizontal swipes. Use a brief directional slide and small rotation, without perspective or autoplay. Hide and inert inactive pages, announce selections, and move focus away from outgoing pages. Measure equal page heights only after width/font changes. Cancel interrupted transitions and settle on the latest requested page. Pause/reduced motion switch instantly; vertical touch gestures retain native scrolling. Preserve all pages in no-JavaScript and print views.

## Implementation constraints

- Keep native scrolling and real anchor URLs. Expose active navigation with `aria-current`.
- No scroll-position polling, per-frame layout reads, page-wide blur, or hidden mandatory content.
- Stop finite animations in hidden tabs. Cancel transient animations when paused.
- Reduced motion and manual pause render readable static final states. Persist user preferences.
- The 3D guide stays optional, capped, and independent of document content.
- Keep the runtime dependency budget small. A React reference does not require converting a static portfolio into a React app.
- Do not claim that a synthesized pattern is a directly installed vendor component. Do not copy unlicensed or proprietary source.

## Verify

Test forward and backward scrolling, pointer entry from multiple edges, keyboard access, pause/resume, reduced motion, small screens, JavaScript-disabled content, WebGL failure, project dialogs, and no horizontal overflow. Check contrast during motion, not only after it settles. Confirm the deployed output contains only the allowlisted runtime files.
