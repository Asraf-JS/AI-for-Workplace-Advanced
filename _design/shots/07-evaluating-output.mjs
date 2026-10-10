import {attach,newChat,send,capture,stable,note,remember,state,root} from './run-helpers.mjs';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const module='07-evaluating-output',step=process.argv[2];
const prompts=[...readFileSync(resolve(root,module,'prompts.md'),'utf8').matchAll(/```\s*\n([\s\S]*?)\n```/g)].map(m=>m[1].replaceAll('\r',''));
const {browser,context,page}=await attach();
async function light(p=page){await p.emulateMedia({colorScheme:'dark'});await p.emulateMedia({colorScheme:'light'});await stable(p);}
async function shot(name,p=page){await light(p);if(await p.getByRole('button',{name:'Expand sidebar',exact:true}).isVisible())await p.getByRole('button',{name:'Expand sidebar',exact:true}).click();await stable(p);if(/Teratai Holdings|Pinnacle Komputer/.test(await p.locator('body').innerText()))throw Error('STOP: another course is visible');await page.getByText('M365 Copilot (Basic)',{exact:true}).waitFor();await capture(p,module,name,{mask:[p.getByRole('button',{name:/Asraf/}),p.getByText(/^Saved in Asraf/)]});}
async function position(){await stable(page);const card=page.locator('.fai-CopilotMessage').last();await card.scrollIntoViewIfNeeded();for(let i=0;i<4;i++){await card.evaluate(e=>{for(let p=e.parentElement;p;p=p.parentElement)if(/auto|scroll/.test(getComputedStyle(p).overflowY)&&p.scrollHeight>p.clientHeight){p.scrollTop+=e.getBoundingClientRect().top-140;break;}});await stable(page);const b=await card.boundingBox();if(b&&b.y>=100&&b.y<=250)break;}}
async function rename(){const id=page.url().match(/conversation\/([^/?]+)/)?.[1];if(!id)throw Error('No new conversation ID');const row=page.locator(`.fai-CopilotNavSubItem[href*="${id}"]`).locator('..');await row.hover();await row.getByRole('button',{name:'More',exact:true}).click();await page.getByRole('menuitem',{name:'Rename',exact:true}).click();await page.getByRole('textbox',{name:'Chat name',exact:true}).fill('AIW 07 - case 01');await page.getByRole('button',{name:'Save',exact:true}).click();remember('07-case01',page.url());}
try{
 if(step==='policy-capture'){
  await rename();await position();await shot('07-01-start-new-chat-quotation.png');
 }else if(step==='policy'){
  if(await page.locator('.fai-UserMessage').count())throw Error('Expected empty agent chat');
  await page.locator('input[type=file]').setInputFiles(['procurement-policy-v3.0.pdf','approved-vendor-list.pdf'].map(n=>resolve(root,module,'sample-files',n)));
  const sendButton=page.getByRole('button',{name:'Send',exact:true});await sendButton.waitFor();await page.waitForTimeout(1500);await sendButton.click();
  const stop=page.getByRole('button',{name:/^Stop/i});await stop.waitFor({state:'visible',timeout:15000}).catch(()=>{});await stop.waitFor({state:'hidden',timeout:180000});
  await page.locator('.fai-CopilotMessage').last().getByRole('button',{name:'Copy Response',exact:true}).waitFor({timeout:180000});
  await page.waitForURL(/\/conversation\//,{timeout:30000});await rename();await position();await shot('07-01-start-new-chat-quotation.png');
  console.log('SETUP_ANSWER',await page.locator('.fai-CopilotMessage').last().innerText());
 }else if(step==='case'){
  if(page.url()!==state['07-case01'])await newChat(page,'07-case01');
  await page.locator('input[type=file]').setInputFiles(['open-rfqs.pdf','case-01-kertas-lestari.pdf'].map(n=>resolve(root,module,'sample-files',n)));
  await page.getByText('case-01-kertas-lestari.pdf',{exact:false}).last().waitFor();await send(page,prompts[0]);remember('07-case01',page.url());await position();await shot('07-02-upload-open-rfqs-pdf.png');
  writeFileSync(resolve(root,'../07-case01-answer.txt'),await page.locator('.fai-CopilotMessage').last().innerText());
  console.log('CASE_ANSWER',(await page.locator('.fai-CopilotMessage').last().innerText()).slice(0,2600));
 }else if(step==='rule'){
  const p=context.pages().find(p=>p.url()===state['07-editor']);if(!p||!p.url().endsWith(state['03-retake-agent'].split('/agent/')[1]))throw Error('Wrong agent editor');
  await p.goto(state['07-editor'],{waitUntil:'domcontentloaded'});await p.getByRole('textbox',{name:'Enter agent name',exact:true}).waitFor({timeout:30000});
  if(await p.getByRole('textbox',{name:'Enter agent name',exact:true}).inputValue()!=='Quotation Checker')throw Error('Wrong agent name');
  const instructions=p.locator('textarea[placeholder^="Describe what this agent should do"]');if(!await instructions.isVisible())await p.getByRole('button',{name:'Edit instructions',exact:true}).click();const original=await instructions.inputValue();
  if(!original.includes('Sinar Maju'))throw Error('Wrong course instructions');
  if(original.includes(prompts[1])){
   if(original!==readFileSync(resolve(root,'../07-original-instructions.txt'),'utf8')+'\n\n'+prompts[1])throw Error('Restored draft differs from single append');
  }else{
   writeFileSync(resolve(root,'../07-original-instructions.txt'),original);await instructions.fill(original+'\n\n'+prompts[1]);
   if(await instructions.inputValue()!==original+'\n\n'+prompts[1])throw Error('Instruction edit differs from single append');
  }
  await instructions.focus();await instructions.press('Control+End');await instructions.evaluate(e=>e.scrollTop=e.scrollHeight);await stable(p);
  await p.getByRole('textbox',{name:'Enter agent name',exact:true}).waitFor({state:'attached'});
  await shot('07-03-open-quotation-checker-s.png',p);
 }else if(step==='save'){
  const p=context.pages().find(p=>p.url()===state['07-editor']);const instructions=p.locator('textarea[placeholder^="Describe what this agent should do"]');
  if(!await instructions.isVisible())await p.getByRole('button',{name:'Edit instructions',exact:true}).click();
  if(!(await instructions.inputValue()).endsWith(prompts[1]))throw Error('Expected discount rule missing');
  await p.getByRole('button',{name:'Update',exact:true}).click();await stable(p);await p.waitForTimeout(3000);
  console.log('SAVED_DIALOG',await p.getByRole('dialog').allTextContents());
  console.log('SAVED_STATUS',await p.getByRole('status').allTextContents());
  console.log('SAVED_BUTTONS',await p.getByRole('button').evaluateAll(es=>es.filter(e=>e.getBoundingClientRect().width).map(e=>e.getAttribute('aria-label')||e.innerText).filter(x=>/Update|Done|Close|Open agent/.test(x))));
  await shot('07-04-save-instructions.png',p);
 }else if(step==='editor'){
  if(!state['03-retake-builder'])throw Error('Existing builder URL missing');
  await page.goto(state['03-retake-builder'],{waitUntil:'domcontentloaded'});await page.waitForTimeout(5000);await light();
  console.log('TEXTBOXES',await page.getByRole('textbox').evaluateAll(es=>es.filter(e=>e.getBoundingClientRect().width).map(e=>({label:e.getAttribute('aria-label'),placeholder:e.getAttribute('placeholder'),value:e.value?.slice(0,180)}))));
  console.log('BUTTONS',await page.getByRole('button').evaluateAll(es=>es.filter(e=>e.getBoundingClientRect().width).map(e=>e.getAttribute('aria-label')||e.innerText).filter(Boolean).slice(-40)));
 }else if(step==='start'){
  if(!state['03-retake-agent'])throw Error('Module 03 agent URL missing');
  await page.goto(state['03-retake-agent'],{waitUntil:'domcontentloaded'});await page.waitForTimeout(4000);await light();
  console.log('TEXTBOXES',await page.getByRole('textbox').evaluateAll(es=>es.map(e=>({label:e.getAttribute('aria-label'),placeholder:e.getAttribute('placeholder')}))));
  console.log('BUTTONS',await page.getByRole('button').evaluateAll(es=>es.filter(e=>e.getBoundingClientRect().width).map(e=>e.getAttribute('aria-label')||e.innerText).filter(Boolean).slice(-35)));
 }
}catch(e){console.log(e.message.split('\n')[0]);process.exitCode=1;}finally{await browser.close();}

