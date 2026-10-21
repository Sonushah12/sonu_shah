/* Owner-provided project narratives. No metrics or store links are inferred. */
window.portfolioProjects = Object.assign(
  {
    voice: {
      category: "Applie Info Solution · Production mobile development",
      title: "Calling, without the friction.",
      intro:
        "VoIP utility systems built with Flutter and the Twilio Voice SDK, with reliable background execution and native iOS integration.",
      content:
        "<h3>The engineering challenge</h3><p>Calling experiences need to work beyond the foreground screen. My work focused on the connection between Flutter, the voice SDK, and native platform behavior.</p><h3>My contribution</h3><ul><li>Architected and released production calling utilities using the Twilio Voice SDK.</li><li>Built stable background execution pathways for the calling experience.</li><li>Worked across Flutter and native iOS channels to connect app interfaces with platform capabilities.</li></ul><h3>Toolkit</h3><p>Flutter, Dart, Twilio Voice SDK, iOS native APIs and platform channels.</p>",
    },
    vidhya: {
      category: "Pdhamecha LLP · Education",
      title: "Cloud Vidhya",
      intro:
        "A live-streaming EdTech platform connecting learners through real-time WebRTC pipelines.",
      content:
        "<h3>The experience</h3><p>Bring live learning into a mobile application, with real-time communication at the center of the classroom experience.</p><h3>My contribution</h3><ul><li>Designed and developed the Flutter application for Cloud Vidhya.</li><li>Integrated WebRTC pipelines for live-streaming experiences.</li><li>Worked with GetX state patterns and asynchronous Dart workflows across mobile development.</li></ul><h3>Toolkit</h3><p>Flutter, Dart, WebRTC and GetX.</p>",
    },
    hrms: {
      category: "Pdhamecha LLP · Enterprise mobile development",
      title: "Workflows that keep up.",
      intro:
        "An enterprise HRMS application with background geofencing and efficient local data workflows.",
      content:
        "<h3>The engineering challenge</h3><p>Support dependable location-aware workflows while managing background processing and local application state.</p><h3>My contribution</h3><ul><li>Built background geofencing models for the enterprise application.</li><li>Implemented local data models with Hive.</li><li>Used Dart Isolates to separate asynchronous work from the interface, with GetX state management.</li></ul><h3>Toolkit</h3><p>Flutter, Dart, geofencing, Hive, GetX and Dart Isolates.</p>",
    },
  },
  {
    memo: {
      title: "Voice Memo — Mic To Speaker",
      category: "Audio · Native Apple platforms · Application development",
      intro:
        "Recording, playback, and premium experiences. Working through the details that make audio reliable.",
      content:
        "<h3>My contribution</h3><ul><li>Developed modular Flutter features with GetX, alongside native recording and playback integrations.</li><li>Investigated audio engine issues involving sample rates, channel counts, buffers, and invalid recording durations.</li><li>Worked on configurable paywall variants, subscription restoration, expiry interpretation, and purchase states.</li></ul><h3>Scope & current status</h3><p>An audio extraction module is ongoing. Its URL entry, format selection, progress, and file-saving flow has been designed; it is not presented as a released feature.</p><h3>Toolkit</h3><p>Flutter · GetX · Native audio · IAP</p>",
    },
    drawing: {
      title: "Kids Drawing & Coloring",
      category: "Creative tools · Local-first assets · Application development",
      intro:
        "A canvas for little imaginations. Brushes, SVG templates, stickers, and creative projects that stay with you.",
      content:
        "<h3>My contribution</h3><ul><li>Worked on the journey from categories and template selection to drawing, saving, and subscription screens.</li><li>Designed local-first retrieval with Firebase-hosted assets, Hive metadata, and a file cache.</li><li>Worked on saved canvas state, colors, stickers, patterns, and project data.</li><li>Investigated brush responsiveness and translated supplied Figma designs into consistent interfaces.</li></ul><h3>Scope & current status</h3><p>This case study describes my work on the application; the artwork is an original concept, not a production screenshot.</p><h3>Toolkit</h3><p>Flutter · SVG canvas · Firebase Storage · Hive</p>",
    },
    keyboard: {
      title: "Keyboard Customization",
      category: "Personalization · iOS extensions · Native integration",
      intro:
        "Personal expression, down to the keys. Connecting a Flutter app with native iOS themes, fonts, and widgets.",
      content:
        "<h3>My contribution</h3><ul><li>Worked across wallpaper, keyboard-theme, font, and widget modules with Firebase-hosted assets.</li><li>Integrated shared-container workflows using iOS App Groups.</li><li>Designed download and cache-update flows between Flutter and native components.</li><li>Investigated template JSON synchronization, widget refresh behavior, missing asset URLs, and font previews.</li></ul><h3>Scope & current status</h3><p>The focus is shared storage and Flutter-to-native communication. No public store listing or publisher affiliation is implied.</p><h3>Toolkit</h3><p>Flutter · Swift · App Groups · Firebase</p>",
    },
    paywall: {
      title: "Dynamic Paywall System",
      category: "Engineering system · Monetization · Partially implemented",
      intro:
        "One configurable foundation for pricing cards, trial states, and subscription experiences.",
      content:
        "<h3>My contribution</h3><ul><li>Designed configuration-driven variants, product ordering, default selections, trial labels, CTA text, and legal links.</li><li>Worked on Firebase configuration retrieval, caching, fallbacks, and platform and app-version targeting.</li><li>Worked on purchase and restore states, trial eligibility, subscription entitlements, and expiry handling.</li></ul><h3>Scope & current status</h3><p>Designed and implemented in part. The complete admin workflow, purchase-flow hardening, analytics, error handling, and entry-point scenarios still need completion and testing.</p><h3>Toolkit</h3><p>Flutter · Remote Config · Firestore · IAP</p>",
    },
    media: {
      title: "Video Downloader & Media Manager",
      category: "Full-stack Flutter · Media workflows · In progress",
      intro:
        "From a media URL to an organized library. Exploring the architecture behind downloads, files, and playback.",
      content:
        "<h3>My contribution</h3><ul><li>Designed separation between Flutter presentation, controllers, backend APIs, extraction services, and local files.</li><li>Worked on URL analysis, metadata retrieval, Express APIs, MongoDB Atlas, and Hive metadata storage.</li><li>Planned queue management, pause/resume/cancel behavior, speed reporting, and failure recovery.</li><li>Designed thumbnail, history, temporary .part file, and atomic-renaming workflows; explored yt-dlp and FFmpeg for extraction and muxing.</li></ul><h3>Scope & current status</h3><p>In progress. Queue controls, recovery, and production download workflows are planned or under development, not claimed as shipped.</p><h3>Toolkit</h3><p>Flutter · Express.js · Dio · Hive</p>",
    },
    editor: {
      title: "Audio Editor & Processing",
      category: "Audio · Reusable architecture · Development & exploration",
      intro:
        "Shared file selection, waveform visualization, playback, and processing through a consistent editing interface.",
      content:
        "<h3>My contribution</h3><ul><li>Organized reusable file-selection, tool-grid, and editor screens for audio effects and processing modules.</li><li>Worked on real file handling and removing dummy data from feature workflows.</li><li>Explored waveform-image storage and locally persisted waveform metadata.</li><li>Investigated native recorder channel mismatches and recording-output validation.</li></ul><h3>Scope & current status</h3><p>Waveform persistence and some processing workflows remain exploratory. No claim is made that all editing tools are released.</p><h3>Toolkit</h3><p>Flutter · GetX · Dart · Native audio</p>",
    },
    bible: {
      title: "Bible Reading App",
      category: "Content · Data architecture · Architecture & development",
      intro:
        "Structured books, chapters, and verses, with a plan for a calm, cache-first reading experience.",
      content:
        "<h3>My contribution</h3><ul><li>Worked on the structures for Bible versions, books, chapters, and verses and a matching Firestore hierarchy.</li><li>Planned Hive caching to reduce repeat requests and support offline reading.</li><li>Worked on onboarding persistence, navigation, and separating UI, controller, repository, and service responsibilities.</li><li>Worked on review-prompt behavior to avoid repeated rating dialogs after the review flow.</li></ul><h3>Scope & current status</h3><p>Offline caching is described as planned architecture, not a verified completed offline feature.</p><h3>Toolkit</h3><p>Flutter · Firestore · GetX · Hive</p>",
    },
    esign: {
      title: "eSign PDF — Signature Maker",
      category: "Documents · Apple platforms · Development & release support",
      intro:
        "PDF and signature workflows, subscription configuration, and attention to the details of an Apple release.",
      content:
        "<h3>My contribution</h3><ul><li>Worked on PDF and signature-related application workflows.</li><li>Supported subscription and in-app purchase configuration.</li><li>Investigated App Store validation issues involving permission descriptions and application metadata.</li><li>Worked on version and build-number corrections during release preparation.</li></ul><h3>Scope & current status</h3><p>This contribution covers the workflows and release support described above; it does not claim ownership of every PDF editing or export feature.</p><h3>Toolkit</h3><p>Flutter · Dart · iOS · IAP</p>",
    },
    printer: {
      title: "Smart Printer / Air Printer",
      category: "Documents · Native file systems · Integration & debugging",
      intro:
        "Bringing document selection, file handling, and printing workflows together on Apple platforms.",
      content:
        "<h3>My contribution</h3><ul><li>Investigated PDF selection and file-path handling in Flutter.</li><li>Diagnosed a lifecycle failure where a PDF had been deleted before it could be copied to cache.</li><li>Worked on Apple-platform printing behavior and release-build troubleshooting.</li><li>Considered platform-specific permissions, discovery, and print workflow requirements.</li></ul><h3>Scope & current status</h3><p>The case study focuses on native integration and file-lifecycle debugging, rather than claiming an entire printing engine.</p><h3>Toolkit</h3><p>Flutter · iOS &amp; macOS · PDF · File systems</p>",
    },
    graphic: {
      title: "Graphic Design App",
      category: "Creative tools · Product delivery · Release support",
      intro:
        "Supporting a creative application through purchase configuration and App Store review.",
      content:
        "<h3>My contribution</h3><ul><li>Worked on application delivery and release-related troubleshooting.</li><li>Investigated an App Store review issue involving in-app purchase functionality.</li><li>Supported review responses and evidence for the purchase workflow.</li></ul><h3>Scope & current status</h3><p>My documented contribution is implementation and release support; this is not a claim that I built the entire design editor.</p><h3>Toolkit</h3><p>Flutter · UI implementation · IAP · App Store Connect</p>",
    },
  },
);
