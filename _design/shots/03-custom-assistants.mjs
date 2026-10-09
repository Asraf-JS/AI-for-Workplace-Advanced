import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { attach, openSite, newChat, send, capture, stable, remember, state, root, note, lastAnswer } from './run-helpers.mjs';

const module = '03-custom-assistants';
const blocks = [...readFileSync(resolve(root, module, 'prompts.md'), 'utf8').replaceAll('\r', '').matchAll(/```\n([\s\S]*?)\n```/g)].map(m => m[1]);
const action = process.argv[2];
const session = action.startsWith('builder')
  ? await openSite(state['03-editor'], '/agents/edit/')
  : await attach();
const { browser, page } = session;

async function shot(name) {
  await capture(page, module, name, {mask: [page.getByRole('button', {name: /^Asraf\s+Jaafar Sidik$/})]});
}

async function upload(files) {
  await page.getByRole('button', { name: 'Add and manage sources', exact: true }).click();
  await page.locator('input[type=file]').setInputFiles(files.map(file=>resolve(root,module,'sample-files',file)));
  await page.keyboard.press('Escape');
  for (const file of files) await page.getByText(file,{exact:true}).first().waitFor();
  await stable(page);
}

async function rename(name, key) {
  const id = page.url().match(/conversation\/([^/?]+)/)?.[1];
  if (!id) throw Error('Created conversation URL missing');
  const row = page.locator(`.fai-CopilotNavSubItem[href*="${id}"]`).locator('..');
  await row.hover();
  await row.getByRole('button', {name:'More',exact:true}).click();
  await page.getByRole('menuitem', {name:'Rename',exact:true}).click();
  await page.getByRole('textbox', {name:'Chat name',exact:true}).fill(name);
  await page.getByRole('button', {name:'Save',exact:true}).click();
  await stable(page);
  remember(key,page.url());
}

async function result(name, key) {
  const answer = page.locator('.fai-CopilotMessage').last();
  await answer.scrollIntoViewIfNeeded();
  await answer.evaluate(e=>e.scrollIntoView({block:'start'}));
  if (name) await shot(name);
  writeFileSync(resolve(root,'../'+key+'.txt'),await answer.textContent());
}

try {
  switch (action) {
    case 'builder-start':
      await page.getByRole('textbox', { name: 'Enter agent name', exact: true }).scrollIntoViewIfNeeded();
      await shot('03-01-open-ai-tool-create.png');
      note(module, '3.1.1', 'create a new custom assistant', 'Quotation Checker already exists; its Agent Builder editor is reused as required by AGENTS.md');
      await page.getByRole('textbox', { name: 'Enter agent name', exact: true }).fill('Quotation Checker');
      await shot('03-02-name-quotation-checker.png');
      await page.getByRole('button', { name: 'Edit instructions', exact: true }).click();
      await stable(page);
      console.log('Instruction textboxes:', await page.getByRole('textbox', {includeHidden:true}).evaluateAll(es => es.map(e => ({tag:e.tagName,name:e.getAttribute('aria-label'),placeholder:e.getAttribute('placeholder'),maxLength:e.getAttribute('maxlength')}))));
      break;
    case 'builder-instructions': {
      const field = page.getByPlaceholder('Describe what this agent should do, define its tone, and outline any rules or guidelines it must follow', {exact:true});
      await field.fill(blocks[0]);
      if (await field.inputValue() !== blocks[0]) throw Error('Instructions were truncated');
      await field.evaluate(e => { e.scrollTop = 0; });
      await shot('03-03-paste-these-instructions-into.png');
      console.log('Instructions length:', blocks[0].length);
      console.log('Instructions counter:', await field.locator('..').textContent().then(t => t.slice(-250)));
      await page.getByRole('button', {name:'Update',exact:true}).click();
      await stable(page);
      console.log('Save dialogs:', await page.getByRole('dialog', {includeHidden:true}).evaluateAll(es => es.filter(e=>e.getBoundingClientRect().height).map(e => ({text:e.innerText.slice(0,800),buttons:[...e.querySelectorAll('button')].map(b=>b.getAttribute('aria-label')||b.innerText)}))));
      break;
    }
    case 'builder-saved':
      await page.getByText('Updating your agent', {exact:true}).waitFor({state:'hidden',timeout:120000});
      await stable(page);
      console.log('Updated-agent dialog:', await page.getByRole('dialog', {includeHidden:true}).evaluateAll(es => es.filter(e=>e.getBoundingClientRect().height).map(e => ({text:e.innerText.slice(0,700),buttons:[...e.querySelectorAll('button')].map(b=>b.getAttribute('aria-label')||b.innerText)}))));
      await shot('03-04-save-assistant.png');
      break;
    case 'builder-open-chat':
      await page.getByRole('button',{name:'Start chat',exact:true}).click();
      await page.getByRole('textbox',{name:'Message Quotation Checker',exact:true}).waitFor({timeout:60000});
      remember('03-agent',page.url());
      note(module,'3.1.4','save the assistant','the existing agent is saved with Update; confirmation says it was updated successfully and is private, with a Start chat button');
      note(module,'instruction-length check','check instruction length limits in Copilot Agent Builder, Claude, ChatGPT Projects and Gemini skills','Copilot accepted all 1,924 characters without truncation; the instructions textarea exposes no maxlength and no numerical limit was displayed; other tools were not opened and their limits remain unverified');
      break;
    case 'duduk-start':
      await page.goto(state['03-agent'],{waitUntil:'domcontentloaded'});
      await page.getByRole('textbox',{name:'Message Quotation Checker',exact:true}).waitFor({timeout:60000});
      await upload(['procurement-policy-v3.0.pdf','approved-vendor-list.pdf']);
      await send(page,'');
      await rename('AIW 03 - Duduk Selesa check','03-duduk');
      await result('03-05-start-new-chat-quotation.png','03-policy');
      break;
    case 'duduk-check':
      await newChat(page,'03-duduk');
      await upload(['rfq-2026-118.pdf','quotation-duduk-selesa.pdf']);
      await send(page,blocks[1]);
      await result('03-06-upload-rfq-2026-118.png','03-duduk');
      break;
    case 'duduk-review':
      await newChat(page,'03-duduk');
      console.log('Independent calculation:',120*365,'subtotal:',120*365+300,'grand total:',(120*365+300)*1.08);
      await page.getByRole('cell',{name:'Arithmetic',exact:true}).last().scrollIntoViewIfNeeded();
      await shot('03-07-read-report-arithmetic-row.png');
      break;
    case 'other-checks':
      for (const [supplier,file] of [['Kerusi Nadira','quotation-kerusi-nadira.pdf'],['Ergoluma','quotation-ergoluma.pdf']]) {
        const key = '03-'+supplier.replaceAll(' ','-').toLowerCase();
        if (state[key]) {
          await newChat(page,key);
        } else {
          await page.goto(state['03-agent'],{waitUntil:'domcontentloaded'});
          await page.getByRole('textbox',{name:'Message Quotation Checker',exact:true}).waitFor({timeout:60000});
          await upload(['procurement-policy-v3.0.pdf','approved-vendor-list.pdf']);
          await send(page,'');
          await rename('AIW 03 - '+supplier+' check',key);
        }
        if (!await page.locator('.fai-UserMessage').filter({hasText:blocks[1]}).count()) {
          if (!await page.getByText(file,{exact:true}).count()) await upload(['rfq-2026-118.pdf',file]);
          await send(page,blocks[1]);
        } else {
          await page.getByRole('button',{name:/^Stop/}).first().waitFor({state:'hidden',timeout:240000});
          await page.locator('.fai-CopilotMessage').last().locator('[data-testid="CopyButtonTestId"]').waitFor({timeout:240000});
          await stable(page);
        }
        await result(supplier==='Ergoluma'?'03-08-repeat-steps-1-3.png':null,key);
        console.log('CHECK_COMPLETE',supplier);
      }
      break;
    case 'comparison-start':
      await page.goto(state['03-agent'],{waitUntil:'domcontentloaded'});
      await page.getByRole('textbox',{name:'Message Quotation Checker',exact:true}).waitFor({timeout:60000});
      await upload(['procurement-policy-v3.0.pdf','approved-vendor-list.pdf']);
      await send(page,'');
      await rename('AIW 03 - Three quotation comparison','03-comparison');
      await upload(['rfq-2026-118.pdf']);
      await send(page,'');
      await upload(['quotation-duduk-selesa.pdf','quotation-kerusi-nadira.pdf','quotation-ergoluma.pdf']);
      await shot('03-09-start-new-chat-assistant.png');
      break;
    case 'comparison-send':
      if (page.url() !== state['03-comparison']) throw Error('Keep the prepared comparison chat open so its queued attachments are retained');
      await send(page,blocks[3]);
      await result('03-10-send.png','03-comparison');
      break;
    case 'recommendation':
      await newChat(page,'03-comparison');
      await send(page,blocks[4]);
      await result('03-11-same-chat-send.png','03-recommendation');
      break;
    case 'recommendation-review':
      await newChat(page,'03-comparison');
      console.log('Independent totals:',[(120*365+300)*1.08,120*335*1.08,(120*372+250)*1.08].map(n=>n.toFixed(2)));
      console.log('Manual source check: RFQ requires five-year warranty; Nadira offers three/one years; Ergoluma deposit is 50 percent against policy limit 30 percent; normal approval for all totals is HOD and Head of Procurement.');
      await lastAnswer(page);
      await shot('03-12-before-accept-recommendation-check.png');
      break;
    default:
      throw Error('Unknown capture phase');
  }
} catch (error) {
  console.error(error.message.split('\n')[0]);
  process.exitCode = 1;
} finally {
  await browser.close();
}
