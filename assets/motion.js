// Native View Timelines bind every composition to scroll position. Reversing
// scroll reverses the same playhead; no once-only state or scroll polling.
const root = document.documentElement;
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const native = CSS.supports("animation-timeline", "view()");
let paused = root.classList.contains("motion-paused") || reduced.matches;
let observer;
const subjects = [
  ...document.querySelectorAll(
    ".case-step, .archive-item, .capabilities article, .timeline-item, .section-heading, .archive-heading, .reading-statement, .system-diagram, .about-copy, .contact-title-row, .kinetic-band",
  ),
];
const path = document.querySelector(".diagram-path path");
if (path) {
  const length = path.getTotalLength();
  path.style.setProperty("--path-length", length);
  path.style.strokeDasharray = String(length);
}

function configure(nextPaused) {
  paused = nextPaused || reduced.matches;
  root.classList.toggle("motion-enabled", !paused);
  root.classList.toggle("motion-fallback", !paused && !native);
  observer?.disconnect();
  if (paused || native) return;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        entry.target.dataset.viewport = entry.isIntersecting
          ? "inside"
          : "outside";
    },
    { threshold: 0.12 },
  );
  subjects.forEach((subject) => observer.observe(subject));
}
window.addEventListener("portfolio:effects", (event) =>
  configure(event.detail.paused),
);
reduced.addEventListener("change", () =>
  configure(root.classList.contains("motion-paused")),
);
configure(paused);

// The magnetic CTA caches geometry on pointer entry. Pointer movement performs
// only transform writes; native scrolling retains control of the document.
const pointer = matchMedia("(hover: hover) and (pointer: fine)");
document.querySelectorAll(".magnetic-button").forEach((button) => {
  let rect;
  let returnAnimation;
  button.addEventListener("pointerenter", () => {
    if (paused || !pointer.matches) return;
    returnAnimation?.cancel();
    rect = button.getBoundingClientRect();
    button.style.willChange = "transform";
  });
  button.addEventListener("pointermove", (event) => {
    if (!rect || paused || !pointer.matches) return;
    const x = Math.max(
      -8,
      Math.min(8, (event.clientX - rect.left - rect.width / 2) * 0.08),
    );
    const y = Math.max(
      -6,
      Math.min(6, (event.clientY - rect.top - rect.height / 2) * 0.12),
    );
    button.style.transform = `translate(${x}px, ${y}px)`;
  });
  button.addEventListener("pointerleave", () => {
    rect = null;
    const from = button.style.transform || "none";
    button.style.removeProperty("transform");
    if (!paused)
      returnAnimation = button.animate(
        [{ transform: from }, { transform: "none" }],
        { duration: 300, easing: "cubic-bezier(.22,1,.36,1)" },
      );
    button.style.removeProperty("will-change");
  });
});
window.portfolioMotion = {
  get mode() {
    return paused
      ? "paused"
      : native
        ? "native-scroll-timelines"
        : "repeating-intersection-fallback";
  },
  get animations() {
    return document
      .getAnimations()
      .filter(
        (animation) =>
          animation.timeline &&
          animation.timeline.constructor.name !== "DocumentTimeline",
      ).length;
  },
};
