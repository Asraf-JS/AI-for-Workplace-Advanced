// Starts the capture browser: headless Edge on the persistent profile, with a debugging port
// that run-helpers.mjs attaches to. Run it in its own terminal and leave it running:
//   node _design/shots/browser-session.mjs
import { chromium } from 'playwright';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const headed = process.argv.includes('--headed'); // for signing in by hand
const context = await chromium.launchPersistentContext(resolve(root, '.capture-profile'), {
  ...(process.platform === 'win32'
    ? { executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' }
    : { channel: 'msedge' }),
  headless: !headed, viewport: { width: 1600, height: 900 },
  deviceScaleFactor: 1, args: ['--remote-debugging-port=9223'],
});
for (const page of context.pages()) page.on('dialog', () => {});
context.on('page', page => page.on('dialog', () => {}));
console.log(`Capture browser ready on localhost:9223 (${headed ? 'headed, sign in by hand' : 'headless'})`);
await new Promise(() => {});
