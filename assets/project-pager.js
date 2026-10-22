// An original project notebook. Native scrolling drives a bounded sticky chapter.
const pager = document.querySelector(".project-pager");
if (pager) {
  const pages = pager.querySelector(".project-pages");
  const cards = [...pages.querySelectorAll(".project-card")];
  const controls = pager.querySelector(".project-pagination");
  const navigation = pager.querySelector(".project-page-buttons");
  const previous = pager.querySelector("#project-previous");
  const next = pager.querySelector("#project-next");
  const number = pager.querySelector("#project-page-number");
  const announcement = pager.querySelector("#project-page-announcement");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const titles = cards.map((card) => card.querySelector("h3").textContent);
  let index = 0;
  let animations = [];
  let revision = 0;
  let lastWidth = 0;
  let resizeFrame;
  let touch;
  let suppressClick = false;
  let clickTimer;
  let scrollObserver;
  let scrollStep = 0;
  let stickyTop = 0;
  let manualScroll = 0;
  let scrollSync = false;
  const track = document.createElement("div");
  track.className = "project-scroll-track";
  pager.before(track);
  track.append(pager);
  const steps = cards.map((_, page) => {
    const step = document.createElement("span");
    step.className = "project-scroll-step";
    step.setAttribute("aria-hidden", "true");
    step.dataset.page = String(page);
    track.append(step);
    return step;
  });
  const note = pager.querySelector(".pager-note");
  const originalNote = note.textContent;

  const buttons = cards.map((card, page) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = String(page + 1).padStart(2, "0");
    button.setAttribute("aria-label", `Project ${page + 1}: ${titles[page]}`);
    button.setAttribute("aria-controls", card.id);
    button.addEventListener("click", () => show(page));
    navigation.append(button);
    card.setAttribute("role", "group");
    card.setAttribute("aria-roledescription", "slide");
    card.setAttribute(
      "aria-label",
      `${page + 1} of ${cards.length}: ${titles[page]}`,
    );
    return button;
  });

  function settle() {
    revision++;
    animations.forEach((animation) => animation.cancel());
    animations = [];
    pager.removeAttribute("data-transitioning");
    cards.forEach((card, page) => {
      card.hidden = page !== index;
      card.inert = page !== index;
      if (page === index) card.removeAttribute("aria-hidden");
      else card.setAttribute("aria-hidden", "true");
    });
  }

  function updateControls(announce) {
    pager.dataset.page = String(index + 1);
    number.textContent = String(index + 1).padStart(2, "0");
    previous.disabled = index === 0;
    next.disabled = index === cards.length - 1;
    buttons.forEach((button, page) => {
      if (page === index) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    if (announce)
      announcement.textContent = `Project ${index + 1} of ${cards.length}: ${titles[index]}`;
  }

  function show(page, focus = false, fromScroll = false) {
    const target = Math.max(0, Math.min(cards.length - 1, page));
    if (target === index) return;
    settle();
    const old = cards[index];
    const incoming = cards[target];
    const direction = target > index ? 1 : -1;
    const focusInCard = old.contains(document.activeElement);
    index = target;
    updateControls(true);
    incoming.hidden = false;
    incoming.inert = false;
    incoming.removeAttribute("aria-hidden");
    // An outgoing page is visual only, never a second keyboard or screen-reader page.
    if (focusInCard)
      incoming.querySelector(".project-open").focus({ preventScroll: true });
    else if (focus) buttons[index].focus({ preventScroll: true });
    // Disabled boundary buttons must not strand focus after their last action.
    else if (document.activeElement === previous && previous.disabled)
      buttons[index].focus({ preventScroll: true });
    else if (document.activeElement === next && next.disabled)
      buttons[index].focus({ preventScroll: true });
    old.inert = true;
    old.setAttribute("aria-hidden", "true");
    if (!fromScroll && scrollStep) {
      // The notebook stays in place while the native document moves to this page's step.
      const token = ++manualScroll;
      scrollSync = true;
      window.scrollTo({
        top:
          track.getBoundingClientRect().top +
          window.scrollY +
          index * scrollStep -
          stickyTop +
          3,
        behavior: "instant",
      });
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (manualScroll === token) scrollSync = false;
        }),
      );
    }
    const paused =
      reduced.matches ||
      document.documentElement.classList.contains("motion-paused");
    if (paused || document.hidden || !incoming.animate) {
      settle();
      return;
    }
    pager.dataset.transitioning = "true";
    const token = revision;
    animations = [
      old.animate(
        [
          { opacity: 1, transform: "none" },
          {
            opacity: 0,
            transform: `translateX(${-direction * 32}px) rotate(${-direction * 0.8}deg)`,
          },
        ],
        { duration: 220, easing: "cubic-bezier(.4,0,1,1)", fill: "forwards" },
      ),
      incoming.animate(
        [
          {
            opacity: 0,
            transform: `translateX(${direction * 44}px) rotate(${direction * 1.2}deg)`,
          },
          { opacity: 1, transform: "none" },
        ],
        {
          duration: 380,
          delay: 35,
          easing: "cubic-bezier(.22,1,.36,1)",
          fill: "both",
        },
      ),
    ];
    Promise.all(
      animations.map((animation) => animation.finished.catch(() => {})),
    ).then(() => {
      if (revision === token) settle();
    });
  }

  function measure() {
    // One batched measurement per width/font change keeps all pages equally tall.
    // Every card shares the same stack cell, so this cannot stretch the document.
    scrollObserver?.disconnect();
    scrollObserver = null;
    scrollStep = 0;
    scrollSync = false;
    manualScroll++;
    const supported = "IntersectionObserver" in window;
    track.classList.toggle("project-scroll-active", supported);
    track.style.height = "";
    settle();
    measureCards();
    stickyTop = Math.ceil(
      document.querySelector(".site-header").getBoundingClientRect().bottom +
        16,
    );
    const height = Math.ceil(pager.getBoundingClientRect().height);
    const fits = height <= window.innerHeight - stickyTop - 16;
    if (!supported || !fits) {
      // Short viewports keep the full reading layout and manual pagination.
      track.classList.remove("project-scroll-active");
      note.textContent = originalNote;
      measureCards();
      return;
    }
    note.textContent = "Scroll to turn the page ↓";
    scrollStep = Math.round(
      Math.max(240, Math.min(620, window.innerHeight * 0.56)),
    );
    track.style.height = `${height + scrollStep * (cards.length - 1)}px`;
    track.style.setProperty("--project-sticky-top", `${stickyTop}px`);
    steps.forEach((step, page) => {
      step.style.top = `${page * scrollStep}px`;
      step.style.height = `${page === cards.length - 1 ? height : scrollStep}px`;
    });
    const visible = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollObserver !== observer) return;
        entries.forEach((entry) => {
          const page = Number(entry.target.dataset.page);
          if (entry.isIntersecting) visible.add(page);
          else visible.delete(page);
        });
        if (
          visible.size &&
          !scrollSync &&
          !document.querySelector("#project-dialog").open
        )
          show(Math.max(...visible), false, true);
      },
      {
        rootMargin: `-${stickyTop}px 0px -${Math.max(0, window.innerHeight - stickyTop - 2)}px 0px`,
        threshold: 0,
      },
    );
    scrollObserver = observer;
    steps.forEach((step) => observer.observe(step));
  }

  function measureCards() {
    pages.style.minHeight = "";
    cards.forEach((card) => {
      card.hidden = false;
    });
    const height = Math.max(
      ...cards.map((card) => card.getBoundingClientRect().height),
    );
    pages.style.minHeight = `${Math.ceil(height)}px`;
    settle();
  }

  previous.addEventListener("click", () => show(index - 1));
  next.addEventListener("click", () => show(index + 1));
  pager.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = {
      ArrowLeft: index - 1,
      ArrowRight: index + 1,
      Home: 0,
      End: cards.length - 1,
    }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    show(target, true);
  });
  pages.addEventListener("pointerdown", (event) => {
    if (event.isPrimary && event.pointerType !== "mouse")
      touch = { id: event.pointerId, x: event.clientX, y: event.clientY };
  });
  pages.addEventListener("pointercancel", () => {
    touch = null;
  });
  pages.addEventListener("pointerup", (event) => {
    if (!touch || event.pointerId !== touch.id) return;
    const dx = event.clientX - touch.x;
    const dy = event.clientY - touch.y;
    touch = null;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
    const target = index + (dx < 0 ? 1 : -1);
    if (target < 0 || target >= cards.length) return;
    suppressClick = true;
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
      suppressClick = false;
    }, 500);
    show(target);
  });
  pages.addEventListener(
    "click",
    (event) => {
      if (!suppressClick) return;
      suppressClick = false;
      event.preventDefault();
      event.stopPropagation();
    },
    true,
  );
  window.addEventListener("portfolio:effects", (event) => {
    if (event.detail.paused) settle();
  });
  reduced.addEventListener("change", () => {
    if (reduced.matches) settle();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) settle();
  });
  pager.dataset.enhanced = "true";
  updateControls(false);
  settle();
  controls.hidden = false;
  pager.querySelector(".project-page-hint").hidden = false;
  measure();
  document.fonts?.ready.then(measure);
  if ("ResizeObserver" in window) {
    new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width);
      if (width === lastWidth) return;
      lastWidth = width;
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(measure);
    }).observe(pages);
  }
  // Height-only changes (rotation or browser chrome) also affect sticky eligibility.
  window.addEventListener("resize", () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(measure);
  });
}
