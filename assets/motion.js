// Local skill: portfolio-clean-motion. See its source notes for the distinction
// between verified reference guidance and this original DOM implementation.
import "./project-pager.js";
const root = document.documentElement;
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
const native = CSS.supports("animation-timeline", "view()");
const subjects = [...document.querySelectorAll("[data-watch]")];
const words = [...document.querySelectorAll(".title-word")];
const transient = new Set();
let paused = root.classList.contains("motion-paused") || reduced.matches;
let observer;
let introPlayed = false;
function animate(element, frames, options) {
  const animation = element.animate(frames, options);
  transient.add(animation);
  animation.addEventListener("finish", () => transient.delete(animation), {
    once: true,
  });
  animation.addEventListener("cancel", () => transient.delete(animation), {
    once: true,
  });
  return animation;
}
function intro() {
  if (introPlayed) return;
  introPlayed = true;
  if (location.hash && location.hash !== "#home") return;
  words.forEach((word, index) =>
    animate(
      word,
      [
        { opacity: 0, transform: "translateY(12px)" },
        { opacity: 1, transform: "none" },
      ],
      {
        duration: 500,
        delay: index * 55,
        easing: "cubic-bezier(.22,1,.36,1)",
        fill: "backwards",
      },
    ),
  );
}
function configure(nextPaused) {
  paused = nextPaused || reduced.matches;
  root.classList.toggle("motion-enabled", !paused);
  root.classList.toggle("motion-fallback", !paused && !native);
  observer?.disconnect();
  if (paused) {
    for (const animation of [...transient]) animation.cancel();
    document.querySelectorAll(".project-overlay").forEach((overlay) => {
      overlay.getAnimations().forEach((animation) => animation.cancel());
    });
    return;
  }
  intro();
  if (native || !("IntersectionObserver" in window)) return;
  // Watcher-style repeated visibility states: intentionally no once-only flag.
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        entry.target.dataset.viewport = entry.isIntersecting
          ? "inside"
          : "outside";
    },
    { threshold: 0.08 },
  );
  subjects.forEach((subject) => observer.observe(subject));
}
window.addEventListener("portfolio:effects", (event) =>
  configure(event.detail.paused),
);
reduced.addEventListener("change", () =>
  configure(root.classList.contains("motion-paused")),
);
document.addEventListener("visibilitychange", () => {
  for (const animation of transient) {
    if (document.hidden) animation.pause();
    else if (!paused) animation.play();
  }
});
// Direction-aware hover is a bounded interaction. Geometry is read only when
// entering the artwork; pointer movement is never polled or measured per frame.
function direction(event, rect) {
  const x = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2);
  const y = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2);
  return Math.abs(x) > Math.abs(y)
    ? [x > 0 ? 100 : -100, 0]
    : [0, y > 0 ? 100 : -100];
}
document.querySelectorAll("[data-direction-hover]").forEach((art) => {
  const overlay = art.querySelector(".project-overlay");
  let rect;
  let current;
  art.addEventListener("pointerenter", (event) => {
    if (paused || !finePointer.matches) return;
    rect = art.getBoundingClientRect();
    const [x, y] = direction(event, rect);
    current?.cancel();
    current = animate(
      overlay,
      [
        { transform: `translate(${x}%,${y}%)`, opacity: 0 },
        { transform: "translate(0,0)", opacity: 1 },
      ],
      { duration: 260, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" },
    );
  });
  art.addEventListener("pointerleave", (event) => {
    if (!rect || paused || !finePointer.matches) return;
    // The paper card can settle from its small tilt while hovered.
    // Measure its current bounds on departure, rather than using entry geometry.
    const [x, y] = direction(event, art.getBoundingClientRect());
    const style = getComputedStyle(overlay);
    const start = { transform: style.transform, opacity: style.opacity };
    current?.cancel();
    current = animate(
      overlay,
      [start, { transform: `translate(${x}%,${y}%)`, opacity: 0 }],
      { duration: 210, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" },
    );
    rect = null;
  });
  art.addEventListener("pointercancel", () => {
    current?.cancel();
    rect = null;
  });
});
configure(paused);
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
  get transientAnimations() {
    return transient.size;
  },
};
