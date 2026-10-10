import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const result = await build({
  absWorkingDir: root,
  entryPoints: ['assets/avatar.js'],
  outfile: 'assets/avatar.bundle.js',
  bundle: true,
  minify: true,
  format: 'iife',
  target: ['es2020'],
  legalComments: 'inline',
  sourcemap: false,
  write: false,
});

// Normalize trailing whitespace in bundled GLSL shader templates.
for (const output of result.outputFiles) {
  await writeFile(output.path, output.text.replace(/[ \t]+$/gm, ''));
}

// Publish only runtime files; keep source, build tools, and node_modules private.
const publicDirectory = join(root, 'public');
const publicFiles = [
  'index.html',
  'resume.html',
  'styles.css',
  'app.js',
  'assets/avatar.bundle.js',
  'assets/favicon.svg',
  'assets/fonts/manrope-latin.woff2',
  'assets/fonts/OFL.txt',
  'assets/vendor/THREE-LICENSE.txt',
];
await rm(publicDirectory, { recursive: true, force: true });
for (const file of publicFiles) {
  const destination = join(publicDirectory, file);
  await mkdir(dirname(destination), { recursive: true });
  await cp(join(root, file), destination);
}
console.log(`Built ${publicFiles.length} static files in public/`);
