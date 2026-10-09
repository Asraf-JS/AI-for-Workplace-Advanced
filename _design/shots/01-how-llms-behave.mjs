import { resolve } from 'node:path';
import { attach, newChat, send, capture, stable, remember, root, note } from './run-helpers.mjs';

const module = '01-how-llms-behave';
const subject = 'Write a one-line email subject asking a supplier to send a revised quotation. Give me only the subject line.';
const summary = "I work in procurement at Sinar Maju Sdn Bhd. I've uploaded our request for quotation (RFQ-2026-118) and one supplier's quotation. Summarise the quotation in five bullets: supplier, grand total, validity, warranty and payment terms. Then tell me in one sentence whether it meets the RFQ.";
const arithmetic = 'Now check the arithmetic. Recalculate every line amount as quantity x unit price, then the subtotal, the tax and the grand total. Show your working in a table and compare each figure with the one printed in the quotation.';
const { browser, page } = await attach();

async function rename(name, key) {
  const input = page.getByRole('textbox', { name: 'Chat name', exact: true });
  if (!await input.count()) {
    const id = page.url().match(/conversation\/([^/?]+)/)?.[1];
    if (!id) throw Error('Created conversation URL missing');
    const row = page.locator(`.fai-CopilotNavSubItem[href*="${id}"]`).locator('..');
    await row.hover();
    await row.getByRole('button', { name: 'More', exact: true }).click();
    await page.getByRole('menuitem', { name: 'Rename', exact: true }).click();
  }
  await input.fill(name);
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await stable(page);
  remember(key, page.url());
}

async function startAnswer() {
  await page.locator('.fai-CopilotMessage').last().scrollIntoViewIfNeeded();
  await page.locator('.fai-CopilotMessage').last().evaluate(e => e.scrollIntoView({ block: 'start' }));
  await stable(page);
}

async function upload() {
  await page.getByRole('button', { name: 'Add and manage sources', exact: true }).click();
  await page.locator('input[type=file]').setInputFiles([
    resolve(root, module, 'sample-files/rfq-2026-118.pdf'),
    resolve(root, module, 'sample-files/quotation-duduk-selesa.pdf'),
  ]);
  await page.keyboard.press('Escape');
  await page.getByText('rfq-2026-118.pdf', { exact: true }).first().waitFor();
  await page.getByText('quotation-duduk-selesa.pdf', { exact: true }).first().waitFor();
  await stable(page);
}

try {
  switch (process.argv[2]) {
    case 'begin':
      await newChat(page, '01-subject-a');
      await capture(page, module, '01-01-open-ai-tool-start.png');
      await send(page, subject);
      break;
    case 'subjects':
      await rename('AIW 01 - Subject line A', '01-subject-a');
      await startAnswer();
      await capture(page, module, '01-02-send-prompt.png');
      await newChat(page, '01-subject-b');
      await send(page, subject);
      await rename('AIW 01 - Subject line B', '01-subject-b');
      await startAnswer();
      await capture(page, module, '01-03-start-another-new-chat.png');
      break;
    case 'fastsetup':
      await newChat(page, '01-fast');
      await page.getByRole('button', { name: /Model Selector/ }).click();
      await page.getByRole('menuitemradio', { name: /^Quick response/ }).click();
      await capture(page, module, '01-04-start-new-chat-choose.png');
      await upload();
      await capture(page, module, '01-05-upload-rfq-2026-118.png');
      break;
    case 'fastsend':
      await send(page, summary);
      await rename('AIW 01 - Fast quotation check', '01-fast');
      await startAnswer();
      await capture(page, module, '01-06-send-prompt.png');
      break;
    case 'reasonsetup':
      await newChat(page, '01-reason');
      await page.getByRole('button', { name: /Model Selector/ }).click();
      await page.getByRole('menuitemradio', { name: /^Think deeper/ }).click();
      await capture(page, module, '01-07-start-new-chat-switch.png');
      await upload();
      await capture(page, module, '01-08-upload-same-two-files.png');
      note(module, '1.2.1 and 1.3.1', 'choose a quick or deeper reasoning option in the model menu (Auto by default)', 'Auto (Decides how long to think), Quick response (Answers right away), Think deeper (Think longer for better answers), plus GPT (OpenAI); Quick response used for 1.2 and Think deeper for 1.3');
      break;
    case 'reasonsend':
      await send(page, summary);
      await rename('AIW 01 - Reasoning quotation check', '01-reason');
      await send(page, arithmetic);
      await startAnswer();
      await capture(page, module, '01-09-send-same-prompt-1.png');
      break;
    default:
      throw Error('Choose subjects, fastsetup, fastsend, reasonsetup or reasonsend');
  }
} catch (error) {
  console.error(error.message.split('\n')[0]);
  process.exitCode = 1;
} finally {
  await browser.close();
}
