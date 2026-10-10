import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { writeFile } from 'node:fs/promises';
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
