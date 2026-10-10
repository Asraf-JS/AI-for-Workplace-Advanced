// Gemini Notebook uses regular Edge per AGENTS.md. Capture the real page via
// the browser extension, then mask its account avatar and save identical PNGs.
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
if (!process.env.CAPTURE_PYTHON) throw Error('Set CAPTURE_PYTHON to bundled Python');
execFileSync(process.env.CAPTURE_PYTHON, ['-c', 'from PIL import Image,ImageDraw; import sys; im=Image.open(sys.argv[1]).convert("RGB"); assert im.size==(1600,900), im.size; ImageDraw.Draw(im).rectangle((1536,4,1592,60),fill="white"); im.save(sys.argv[2])', input, output]);
copyFileSync(output, resolve(raw, name));
console.log('SAVED', name);
