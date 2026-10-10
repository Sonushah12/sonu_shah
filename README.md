# Sonu Shah’s portfolio

A static portfolio with a procedural Three.js developer guide, semantic project stories, a printable résumé, and no runtime CDN requests.

## Run

The compiled avatar is included. No dependency installation is needed to serve the site:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open the served page in a browser with JavaScript and WebGL for the animated guide. The core portfolio and résumé remain readable without WebGL or JavaScript. A static character illustration replaces the renderer if WebGL is unavailable. Data Saver skips the 3D bundle.

## Change the avatar

Use Node 20+ and install the locked development tools:

```sh
npm ci
npm run build
```

Edit `assets/avatar.js` and rebuild the committed `assets/avatar.bundle.js`. The UI lives in `index.html`, `styles.css`, and `app.js`. `resume.html` has a print/save-PDF action.

## Interaction and accessibility

The guide changes poses as each section enters the viewport using IntersectionObserver. The welcome button triggers a wave. The guide can be hidden and motion paused; choices persist locally. System reduced motion renders static poses. Scrolling is native and never hijacked. Project details use native modal dialogs with focus restoration and Escape dismissal. All content and links remain functional if the optional renderer fails.

## Delivery

Serve these static files over HTTPS. Enable Brotli or gzip for HTML, CSS, JavaScript, and SVG. The avatar bundle is approximately 132 KB with gzip (about 520 KB uncompressed); static hosts without compression transfer the full file. Assets are versioned in Git but not content-hashed, so use revalidation rather than a year-long immutable cache. Never cache `index.html` indefinitely.

The 3D renderer caps device pixel ratio, avoids texture downloads and shadow maps, and stops its loop while hidden or paused. Self-hosted Manrope includes only the Latin variable font. Library and font licenses are in `assets/vendor` and `assets/fonts`.

## Content

Employment, education, technology, and project claims come from the previous portfolio and the owner’s conversation. The avatar is an original stylized character, not a verified likeness. Device interfaces are illustrative concepts rather than production screenshots. Review dates and work descriptions as the résumé changes.

See [design research](docs/design-research.md) for references, skill guidance, and the design decisions behind the implementation.
