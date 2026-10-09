import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { attach, newChat, send, capture, stable, remember, root, note } from './run-helpers.mjs';

const module = '02-context-engineering';
const blocks = [...readFileSync(resolve(root, module, 'prompts.md'), 'utf8')
  .replaceAll('\r', '').matchAll(/```\n([\s\S]*?)\n```/g)].map(m => m[1]);
const { browser, page } = await attach();

async function upload() {
  await page.getByRole('button', { name: 'Add and manage sources', exact: true }).click();
  await page.locator('input[type=file]').setInputFiles(resolve(root, '01-how-llms-behave/sample-files/rfq-2026-118.pdf'));
  await page.keyboard.press('Escape');
  await page.getByText('rfq-2026-118.pdf', { exact: true }).first().waitFor();
  await stable(page);
}

async function rename(name, key) {
  const id = page.url().match(/conversation\/([^/?]+)/)?.[1];
  if (!id) throw Error('Created conversation URL missing');
  const row = page.locator(`.fai-CopilotNavSubItem[href*="${id}"]`).locator('..');
  await row.hover();
  await row.getByRole('button', { name: 'More', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Rename', exact: true }).click();
  await page.getByRole('textbox', { name: 'Chat name', exact: true }).fill(name);
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await stable(page);
  remember(key, page.url());
}

async function result(name, key) {
  const answer = page.locator('.fai-CopilotMessage').last();
  await answer.scrollIntoViewIfNeeded();
  await answer.evaluate(e => e.scrollIntoView({ block: 'start' }));
  await capture(page, module, name);
  writeFileSync(resolve(root, '../' + key + '.txt'), await answer.textContent());
}

try {
  switch (process.argv[2]) {
    case 'extract':
      await newChat(page, '02-chain');
      await capture(page, module, '02-01-start-new-chat-ai.png');
      await upload();
      await capture(page, module, '02-02-upload-rfq-2026-118.png');
      await send(page, blocks[0]);
      await rename('AIW 02 - requirements chain', '02-chain');
      await result('02-03-send-prompt.png', '02-requirements');
      break;
    case 'comparison':
      await newChat(page, '02-chain');
      await send(page, blocks[2]);
      await result('02-04-step-2-turn-into.png', '02-comparison');
      break;
    case 'json':
      await newChat(page, '02-chain');
      await send(page, blocks[3]);
      await result('02-05-step-3-turn-into.png', '02-json');
      break;
    case 'combined':
      await newChat(page, '02-combined');
      await upload();
      await capture(page, module, '02-06-start-new-chat-upload.png');
      await send(page, blocks[5]);
      await rename('AIW 02 - combined prompt', '02-combined');
      await result('02-07-send-everything-once.png', '02-combined');
      note(module, 'Product Notes check', "Gemini has Export to Sheets under a table and Claude may open long JSON in a side panel", 'this capture run uses M365 Copilot (Basic); Gemini and Claude were not opened, so both claims remain unverified');
      break;
    default:
      throw Error('Choose extract, comparison, json or combined');
  }
} catch (error) {
  console.error(error.message.split('\n')[0]);
  process.exitCode = 1;
} finally {
  await browser.close();
}
