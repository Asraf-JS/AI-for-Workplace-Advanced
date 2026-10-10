// Gemini Notebook capture fallback: Google rejected sign-in in the prescribed
// automated Edge profile. Capture the real UI through the regular Edge extension
// at 1600x900, then use this script to mask the account avatar and save both PNGs.
// Usage: node _design/shots/04-grounded-research.mjs <captured.jpg> <shot.png>
import { root } from './run-helpers.mjs';
import { execFileSync } from 'node:child_process';
import { mkdirSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
const [input, name] = process.argv.slice(2);
if (!input || !/^04-\d\d-[a-z0-9-]+\.png$/.test(name)) throw Error('Specify source JPEG and listed shot filename');
const images = resolve(root, '04-grounded-research/images');
const raw = resolve(root, '_design/shots/raw');
mkdirSync(images, { recursive: true }); mkdirSync(raw, { recursive: true });
const output = resolve(images, name);
const python = process.env.CAPTURE_PYTHON;
if (!python) throw Error('Set CAPTURE_PYTHON to the bundled Python executable');
execFileSync(python, ['-c', 'from PIL import Image,ImageDraw; import sys; im=Image.open(sys.argv[1]).convert("RGB"); assert im.size in [(1600,900),(1600,872)], im.size; ImageDraw.Draw(im).rectangle((1536,4,1592,60),fill="white"); im.save(sys.argv[2])', input, output]);
copyFileSync(output, resolve(raw, name));
console.log('SAVED', name);
