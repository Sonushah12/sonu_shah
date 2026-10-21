import { gsap } from "gsap";

// Finite, deterministic timelines: content never depends on an animation finishing.
// Scroll-linked image movement lives in CSS View Timelines, not a scroll event loop.
const root = document.documentElement;
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const seen = new WeakSet();
const active = new Set();
let observer;
let introPlayed = false;
let effectsPaused = root.classList.contains("motion-paused") || reduced.matches;
window.__timelines = window.__timelines || {};

function track(timeline, elements) {
  active.add(timeline);
  elements.forEach((element) => {
    element.style.willChange = "transform, opacity";
  });
  timeline.eventCallback("onComplete", () => {
    elements.forEach((element) => {
      element.style.removeProperty("will-change");
    });
    active.delete(timeline);
  });
  timeline.play();
  return timeline;
}

function intro() {
  if (introPlayed) return;
  introPlayed = true;
  // Do not replay a hero entrance when opening a deep link.
  if (location.hash && location.hash !== "#home") return;
  const words = [...document.querySelectorAll(".headline-mask > span")];
  const notes = [
    ...document.querySelectorAll(".greeting-bubble, .floating-code"),
  ];
  const underline = document.querySelector(".accent-word path");
  const length = underline.getTotalLength();
  const timeline = gsap.timeline({
    paused: true,
    defaults: { ease: "power3.out" },
  });
  timeline
    .addLabel("words", 0)
    .from(
      words,
      { yPercent: 110, duration: 0.95, stagger: 0.1, clearProps: "transform" },
      "words",
    )
    .from(
      notes,
      {
        y: 16,
        opacity: 0,
        duration: 0.65,
        stagger: 0.12,
        clearProps: "transform,opacity",
      },
      0.35,
    )
    .fromTo(
      underline,
      { strokeDasharray: length, strokeDashoffset: length },
      {
        strokeDashoffset: 0,
        duration: 0.7,
        clearProps: "strokeDasharray,strokeDashoffset",
      },
      0.65,
    );
  window.__timelines["portfolio-intro"] = timeline;
  track(timeline, [...words, ...notes]);
}

function observe() {
  if (!("IntersectionObserver" in window)) return;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || seen.has(entry.target)) continue;
        const element = entry.target;
        seen.add(element);
        observer.unobserve(element);
        const path = element.querySelector(".draw-path");
        const pathLength = path?.getTotalLength();
        const timeline = gsap.timeline({ paused: true });
        timeline.from(element, {
          y: 28,
          opacity: 0,
          duration: 0.75,
          ease: "power3.out",
          clearProps: "transform,opacity",
        });
        if (path)
          timeline.fromTo(
            path,
            { strokeDasharray: pathLength, strokeDashoffset: pathLength },
            {
              strokeDashoffset: 0,
              duration: 1,
              ease: "power2.inOut",
              clearProps: "strokeDasharray,strokeDashoffset",
            },
            0.15,
          );
        track(timeline, [element]);
      }
    },
    { threshold: 0.06, rootMargin: "0px 0px -25px 0px" },
  );
  document.querySelectorAll("[data-reveal]").forEach((element) => {
    if (!seen.has(element)) observer.observe(element);
  });
}

function configure(paused) {
  effectsPaused = paused || reduced.matches;
  observer?.disconnect();
  if (effectsPaused) {
    for (const timeline of [...active]) {
      timeline.progress(1);
      timeline.kill();
    }
    active.clear();
    return;
  }
  intro();
  observe();
}

window.addEventListener("portfolio:effects", (event) =>
  configure(event.detail.paused),
);
document.addEventListener("visibilitychange", () => {
  for (const timeline of active) {
    if (document.hidden) timeline.pause();
    else if (!effectsPaused) timeline.resume();
  }
});
configure(effectsPaused);
