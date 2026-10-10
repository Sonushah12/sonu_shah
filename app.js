(() => {
  'use strict';
  const root = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  const guide = document.querySelector('#avatar-guide');
  const guideHome = document.querySelector('#guide-home');
  const dock = document.querySelector('#guide-dock');
  const motionButton = document.querySelector('#motion-toggle');
  const guideButton = document.querySelector('#guide-toggle');
  const projectDialog = document.querySelector('#project-dialog');
  let activeChapter = 0;
  let isDocked = false;
  let userPaused = false;
  let guideHidden = false;
  let toastTimer;
  let guideAnimation;
  let dialogTrigger;
  try {
    userPaused = localStorage.getItem('sonu-motion-paused') === 'true';
    guideHidden = localStorage.getItem('sonu-guide-hidden') === 'true';
  } catch { /* Preferences are optional in private browsing. */ }

  const chapters = [
    { id: 'home', title: 'Hello, I’m Sonu', line: 'Come on in. Let’s look around.', pose: 'waving hello' },
    { id: 'work', title: 'My work', line: 'A few things I’ve helped bring to life.', pose: 'presenting the selected projects' },
    { id: 'about', title: 'A little about me', line: 'The details are where I feel at home.', pose: 'thoughtfully nodding' },
    { id: 'journey', title: 'My journey', line: 'Each chapter adds a new perspective.', pose: 'standing confidently with hands at the hips' },
    { id: 'contact', title: 'Thanks for stopping by', line: 'Your next idea? I’d love to hear it.', pose: 'greeting the visitor with open arms' },
  ];

  function notify(message) {
    const toast = document.querySelector('#toast');
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('visible');
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 3400);
  }
  function closeMenu() {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
  }
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); }
  });

  function dispatchPose() {
    window.dispatchEvent(new CustomEvent('portfolio:chapter', { detail: { index: activeChapter, reducedMotion: reducedMotion.matches } }));
  }
  function updateMotion() {
    const paused = userPaused || reducedMotion.matches;
    root.classList.toggle('motion-paused', paused);
    root.classList.toggle('guide-hidden', guideHidden);
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.querySelector('span').textContent = reducedMotion.matches ? 'Reduced motion' : paused ? 'Resume motion' : 'Pause motion';
    motionButton.disabled = reducedMotion.matches;
    motionButton.title = reducedMotion.matches ? 'Following your system’s reduced-motion preference' : '';
    guideButton.textContent = guideHidden ? 'Show guide' : 'Hide guide';
    guideButton.setAttribute('aria-pressed', String(guideHidden));
    dock.hidden = guideHidden || !isDocked;
    window.dispatchEvent(new CustomEvent('portfolio:motion', { detail: { paused: paused || guideHidden || projectDialog.open } }));
  }
  motionButton.addEventListener('click', () => {
    userPaused = !userPaused;
    try { localStorage.setItem('sonu-motion-paused', String(userPaused)); } catch {}
    updateMotion();
  });
  guideButton.addEventListener('click', () => {
    guideHidden = !guideHidden;
    try { localStorage.setItem('sonu-guide-hidden', String(guideHidden)); } catch {}
    updateMotion();
  });
  reducedMotion.addEventListener('change', () => { updateMotion(); dispatchPose(); });

  function setDocked(next) {
    if (next === isDocked) return;
    guideAnimation?.cancel();
    const before = guide.getBoundingClientRect();
    isDocked = next;
    if (next) document.body.append(guide);
    else guideHome.append(guide);
    guide.classList.toggle('docked', next);
    const after = guide.getBoundingClientRect();
    if (!reducedMotion.matches && !userPaused && !guideHidden && before.width && after.width) {
      guideAnimation = guide.animate([
        { transformOrigin: 'top left', transform: `translate(${before.left - after.left}px, ${before.top - after.top}px) scale(${before.width / after.width}, ${before.height / after.height})` },
        { transformOrigin: 'top left', transform: 'translate(0, 0) scale(1, 1)' },
      ], { duration: 850, easing: 'cubic-bezier(.22, 1, .36, 1)' });
    }
    dock.hidden = guideHidden || !next;
  }
  function setChapter(index) {
    if (index === activeChapter) return;
    activeChapter = index;
    const chapter = chapters[index];
    document.querySelector('#guide-chapter').textContent = chapter.title;
    document.querySelector('#guide-line').textContent = chapter.line;
    document.querySelector('.guide-next-label').firstChild.textContent = index === 4 ? 'Back to the beginning ' : 'Next chapter ';
    guide.setAttribute('aria-label', `A stylized 3D developer in neutral clothing, ${chapter.pose}`);
    dispatchPose();
  }
  if ('IntersectionObserver' in window) {
    const chapterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setChapter(Number(entry.target.dataset.chapter)); });
    }, { rootMargin: '-25% 0px -45% 0px', threshold: 0 });
    document.querySelectorAll('.chapter').forEach(chapter => chapterObserver.observe(chapter));
    const homeObserver = new IntersectionObserver(entries => {
      const entry = entries[0];
      setDocked(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    }, { rootMargin: '-10% 0px 0px', threshold: 0 });
    homeObserver.observe(document.querySelector('#home'));
  }
  document.querySelector('#guide-next').addEventListener('click', () => {
    const next = chapters[(activeChapter + 1) % chapters.length];
    document.querySelector(`#${next.id}`).scrollIntoView({ behavior: userPaused || reducedMotion.matches ? 'instant' : 'smooth' });
    history.replaceState(null, '', `#${next.id}`);
  });
  document.querySelector('#wave-button').addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('portfolio:wave'));
    notify('Hey! I’m Sonu. Good to have you here.');
  });

  const projects = {
    voice: {
      category: 'Applie Info Solution · Production mobile development', title: 'Calling, without the friction.',
      intro: 'VoIP utility systems built with Flutter and the Twilio Voice SDK, with reliable background execution and native iOS integration.',
      content: '<h3>The engineering challenge</h3><p>Calling experiences need to work beyond the foreground screen. My work focused on the connection between Flutter, the voice SDK, and native platform behavior.</p><h3>My contribution</h3><ul><li>Architected and released production calling utilities using the Twilio Voice SDK.</li><li>Built stable background execution pathways for the calling experience.</li><li>Worked across Flutter and native iOS channels to connect app interfaces with platform capabilities.</li></ul><h3>Toolkit</h3><p>Flutter, Dart, Twilio Voice SDK, iOS native APIs and platform channels.</p>',
    },
    vidhya: {
      category: 'Pdhamecha LLP · Education', title: 'Cloud Vidhya',
      intro: 'A live-streaming EdTech platform connecting learners through real-time WebRTC pipelines.',
      content: '<h3>The experience</h3><p>Bring live learning into a mobile application, with real-time communication at the center of the classroom experience.</p><h3>My contribution</h3><ul><li>Designed and developed the Flutter application for Cloud Vidhya.</li><li>Integrated WebRTC pipelines for live-streaming experiences.</li><li>Worked with GetX state patterns and asynchronous Dart workflows across mobile development.</li></ul><h3>Toolkit</h3><p>Flutter, Dart, WebRTC and GetX.</p>',
    },
    hrms: {
      category: 'Pdhamecha LLP · Enterprise mobile development', title: 'Workflows that keep up.',
      intro: 'An enterprise HRMS application with background geofencing and efficient local data workflows.',
      content: '<h3>The engineering challenge</h3><p>Support dependable location-aware workflows while managing background processing and local application state.</p><h3>My contribution</h3><ul><li>Built background geofencing models for the enterprise application.</li><li>Implemented local data models with Hive.</li><li>Used Dart Isolates to separate asynchronous work from the interface, with GetX state management.</li></ul><h3>Toolkit</h3><p>Flutter, Dart, geofencing, Hive, GetX and Dart Isolates.</p>',
    },
  };
  document.querySelectorAll('[data-project]').forEach(button => {
    button.addEventListener('click', () => {
      const project = projects[button.dataset.project];
      dialogTrigger = button;
      document.querySelector('#dialog-category').textContent = project.category;
      document.querySelector('#dialog-title').textContent = project.title;
      document.querySelector('#dialog-intro').textContent = project.intro;
      document.querySelector('#dialog-content').innerHTML = project.content;
      projectDialog.showModal();
      document.body.classList.add('modal-open');
      root.classList.add('dialog-open');
      updateMotion();
    });
  });
  document.querySelector('.dialog-close').addEventListener('click', () => projectDialog.close());
  projectDialog.addEventListener('click', event => {
    if (event.target !== projectDialog) return;
    const rect = projectDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) projectDialog.close();
  });
  projectDialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    root.classList.remove('dialog-open');
    updateMotion();
    dialogTrigger?.focus({ preventScroll: true });
  });
  document.querySelector('#copy-email').addEventListener('click', async () => {
    const email = 'sonu.shah99098@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
      notify('Email copied. Let’s make something good.');
    } catch {
      const field = document.createElement('textarea');
      field.value = email;
      field.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.append(field);
      field.select();
      const copied = document.execCommand('copy');
      field.remove();
      document.querySelector('#copy-email').focus({ preventScroll: true });
      notify(copied ? 'Email copied. Let’s make something good.' : `Email me at ${email}`);
    }
  });
  document.querySelector('#year').textContent = new Date().getFullYear();
  updateMotion();
  window.addEventListener('portfolio:avatar-ready', () => { dispatchPose(); updateMotion(); });
  function loadAvatar() {
    if (navigator.connection?.saveData) { root.dataset.avatar = 'fallback'; return; }
    const script = document.createElement('script');
    script.src = 'assets/avatar.bundle.js';
    script.async = true;
    script.onerror = () => { root.dataset.avatar = 'fallback'; };
    document.body.append(script);
  }
  // Content and controls work before the optional 3D renderer loads.
  function scheduleAvatar() {
    // Two frame boundaries keep WebGL initialization behind the first content paint.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setTimeout(() => {
        if ('requestIdleCallback' in window) requestIdleCallback(loadAvatar, { timeout: 1200 });
        else loadAvatar();
      }, 250);
    }));
  }
  if (document.readyState === 'complete') scheduleAvatar();
  else window.addEventListener('load', scheduleAvatar, { once: true });
})();
