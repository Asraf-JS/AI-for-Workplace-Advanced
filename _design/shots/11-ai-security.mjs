// Module 11 capture phases; start browser-session.mjs first.
import { attach, openSite, capture, stable, send, note, remember, root, state } from './run-helpers.mjs';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const M='11-ai-security', step=Number(process.argv[2]);
const prompts=[...readFileSync(resolve(root,M,'prompts.md'),'utf8').matchAll(/```\r?\n([\s\S]*?)```/g)].map(x=>x[1].trim());
const shots=[...readFileSync(resolve(root,'_design/shots',M+'.md'),'utf8').matchAll(/`(11-\d+[^`]+\.png)`/g)].map(x=>x[1]);
const sample=n=>resolve(root,'07-evaluating-output/sample-files',n);
const pdf=resolve(root,M,'sample-files/quotation-rakmas-poisoned.pdf');
const {page,context}=await attach();
const cap=(p,n)=>capture(p,M,shots[n-1]);
async function word(){const {page:w}=await openSite(state.m11Word,state.m11Word);await w.waitForTimeout(3000);return {w,f:w.frames()[1]};}
async function selectNote(w){await w.keyboard.press('Control+End');for(let i=0;i<prompts[0].split('\n').at(-1).length;i++)await w.keyboard.press('Shift+ArrowLeft');}
async function rename(title){
 await page.keyboard.press('Escape');const id=new URL(page.url()).pathname.split('/').at(-1);const row=page.locator(`a[href*="${id}"]`);
 if(!await row.count())await page.getByRole('button',{name:'Chats',exact:true}).click();
 await row.hover();await row.locator('..').getByRole('button',{name:'More',exact:true}).focus();await page.keyboard.press('Enter');
 await page.getByRole('menuitem',{name:'Rename',exact:true}).click();await page.getByLabel('Chat name',{exact:true}).fill(title);await page.getByRole('button',{name:'Save',exact:true}).click();
}
async function ready(title,key){
 await page.goto(state['03-retake-agent'],{waitUntil:'domcontentloaded'});await page.getByRole('textbox',{name:'Message Quotation Checker',exact:true}).waitFor({timeout:60000});
 await page.locator('input[type=file]').setInputFiles([sample('procurement-policy-v3.0.pdf'),sample('approved-vendor-list.pdf')]);await page.waitForTimeout(5000);
 await page.getByRole('button',{name:'Send',exact:true}).click();await page.waitForTimeout(2500);await page.getByRole('button',{name:/^Stop/}).waitFor({state:'hidden',timeout:180000});await stable(page);await rename(title);remember(key,page.url());
}
async function check(file,n){
 await page.locator('input[type=file]').setInputFiles([sample('open-rfqs.pdf'),file]);await page.waitForTimeout(5000);await send(page,prompts[1]);
 await page.locator('.fai-CopilotMessage').last().evaluate(e=>e.scrollIntoView({block:'start'}));await cap(page,n);
}
if(step===1){
 const {page:d}=await openSite(process.env.CAPTURE_ONEDRIVE_URL||state['06-drive'],'sharepoint.com');
 await d.getByRole('button',{name:'Create or upload',exact:true}).click();await d.waitForTimeout(1000);
 const created=context.waitForEvent('page');await d.getByText('Word document',{exact:true}).click();const w=await created;
 await w.waitForTimeout(5000);remember('m11Word',w.url());await cap(w,1);
}
if(step===2){
 const {w,f}=await word();await f.getByLabel('Rename file',{exact:true}).fill('quotation-rakmas-poisoned');await w.keyboard.press('Enter');
 await f.locator('#PagesContainer').click({position:{x:420,y:180}});await context.grantPermissions(['clipboard-read','clipboard-write']);
 await f.evaluate(async t=>navigator.clipboard.writeText(t),prompts[0]);await w.keyboard.press('Control+Shift+V');await w.waitForTimeout(3000);
 await w.keyboard.press('Escape');await w.keyboard.press('Control+Home');remember('m11Word',w.url());await cap(w,2);
}
if(step===3){const {w,f}=await word();await f.locator('#PagesContainer').click({position:{x:420,y:180}});await selectNote(w);await cap(w,3);}
if(step===4){
 const {w,f}=await word();await f.getByRole('button',{name:/^Font Color .*Show More Options$/}).click();await f.getByRole('radio',{name:'White, Background 1',exact:true}).click();
 await f.locator('#FontSize-input').fill('1');await w.keyboard.press('Enter');await w.keyboard.press('ArrowRight');await w.keyboard.press('Control+End');await cap(w,4);
 note(M,'11.1.4','set the hidden paragraph font size to 1','entering 1 produced a white 6-point paragraph in Word PDF export; the hidden note remains extractable');
}
if(step===5){
 const {w,f}=await word();await f.getByRole('button',{name:'File',exact:true}).click();await f.getByRole('menuitem',{name:'Export',exact:true}).click();await f.getByRole('menuitem',{name:'Download as PDF',exact:true}).click();
 await f.getByRole('button',{name:'Download',exact:true}).waitFor({timeout:120000});await cap(w,5);mkdirSync(resolve(root,M,'sample-files'),{recursive:true});
 const session=await context.newCDPSession(w);await session.send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:resolve(root,M,'sample-files'),eventsEnabled:true});
 await f.getByRole('button',{name:'Download',exact:true}).click();await new Promise(r=>setTimeout(r,5000));
 // Edge left complete PDF bytes in a .crdownload file. Copy them only after verifying EOF.
 const pending=pdf+'.crdownload';if(existsSync(pending)){const bytes=readFileSync(pending);if(!bytes.subarray(-100).toString().includes('%%EOF'))throw Error('Incomplete PDF download');writeFileSync(pdf,bytes);}
 note(M,'11.1.5','select File > Save As, choose PDF, and save it','File > Export > Download as PDF shows a Download dialog; the headless browser closes after download, so the completed PDF was copied into 11-ai-security/sample-files before upload and excluded from commit');
}
if(step===6){await ready('AIW 11 - Hidden instruction attack','m11Attack');await cap(page,6);}
if(step===7)await check(pdf,7);
if(step===8){
 const {page:e}=await openSite(state['07-editor']||state['03-retake-builder'],state['07-editor']||state['03-retake-builder']);remember('m11Editor',e.url());
 await e.getByRole('button',{name:'Edit instructions',exact:true}).click();const box=e.getByPlaceholder('Describe what this agent should do, define its tone, and outline any rules or guidelines it must follow');
 const old=await box.inputValue();if(!old.includes(prompts[2]))await box.fill(old.replace('Rules:\n','Rules:\n'+prompts[2]+'\n'));await box.focus();await e.keyboard.press('Control+End');await cap(e,8);
}
if(step===9){const {page:e}=await openSite(state.m11Editor,state.m11Editor);await e.getByRole('button',{name:'Update',exact:true}).click();await e.getByText('Updating your agent',{exact:true}).waitFor({state:'hidden',timeout:120000});await cap(e,9);}
if(step===10){await ready('AIW 11 - Defended hidden instruction','m11Defended');await check(pdf,10);}
if(step===11){await ready('AIW 11 - Original Rakmas regression','m11Case09');await check(sample('case-09-rakmas.pdf'),11);}
process.exit(0);
