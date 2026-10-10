import { root, remember } from './run-helpers.mjs';
import { readFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
// Gemini runs in regular Edge via cua_repl. Save each browser JPEG to
// .capture-profile/09-NN.jpg immediately after its step, then run this script.
// It converts to PNG and masks only the training-account avatar.
const module = '09-rag-fundamentals';
const names = [
 '09-01-create-new-notebook-called.png',
 '09-02-add-procurement-policy-v3.png',
 '09-03-look-page-1-pdf.png',
 '09-04-ask-four-questions.png',
 '09-05-answer-click-or-open.png',
 '09-06-diagnose-why.png',
 '09-07-fix-two-ways.png',
];
const index = Number(process.argv[2]);
if (!Number.isInteger(index) || index < 1 || index > names.length) throw Error('Pass shot number 1-7');
const dir = resolve(root,module,'images');
mkdirSync(dir,{recursive:true}); mkdirSync(resolve(root,'_design/shots/raw'),{recursive:true});
const output = resolve(dir,names[index-1]);
const input = resolve(root,'.capture-profile',`09-${String(index).padStart(2,'0')}.jpg`);
const python = process.env.CAPTURE_PYTHON;
if (!python) throw Error('Set CAPTURE_PYTHON to bundled Python');
const code = 'import sys; from PIL import Image,ImageDraw; im=Image.open(sys.argv[1]).convert("RGB"); assert im.size[0]==1600 and im.size[1] in (873,900), im.size; ' + (index===3 ? '' : 'ImageDraw.Draw(im).rectangle((1538,6,1590,58),fill="white"); ') + 'im.save(sys.argv[2])';
const result=spawnSync(python,['-c',code,input,output],{encoding:'utf8'});
if(result.status!==0) throw Error(result.stderr);
copyFileSync(output,resolve(root,'_design/shots/raw',names[index-1]));
remember('09-notebook',readFileSync(resolve(root,'.capture-profile/09-notebook-url.txt'),'utf8').trim());
console.log('SAVED',names[index-1]);

