// news-image-20261118 — "Sum up 18 November's world news in one image".
// The entry image is entry.png beside this file (a front-page poster of the
// day's news, drawn for this competition). This program writes it to the
// grader's output directory as /output/entry.png, byte for byte.
//
// Node 22, standard library only. No network, no randomness, no clock:
// every run writes the same bytes. Run locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'entry.png');
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const target = join(outDir, 'entry.png');

if (!existsSync(source)) {
  throw new Error(`entry image missing: ${source}`);
}
mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);

// Confirm the copy landed whole: same byte count as the source image,
// and still a whole PNG (the gate reads the file's first bytes to tell
// PNG from JPEG, so a truncated copy must fail loudly here, not at grade).
const inBytes = statSync(source).size;
const outBytes = statSync(target).size;
if (inBytes !== outBytes) {
  throw new Error(`copy incomplete: ${outBytes} of ${inBytes} bytes`);
}
const magic = readFileSync(target).subarray(0, 8);
const pngSig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!magic.equals(pngSig)) {
  throw new Error('output is not a PNG');
}
console.log(`wrote ${target} (${outBytes} bytes)`);
