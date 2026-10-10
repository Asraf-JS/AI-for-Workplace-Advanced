import {attach,openSite,newChat,send,capture,stable,note,remember,state,root} from './run-helpers.mjs';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
const module='06-output-templates',step=process.argv[2];
const prompts=[...readFileSync(resolve(root,module,'prompts.md'),'utf8').matchAll(/```\s*\n([\s\S]*?)\n```/g)].map(m=>m[1].replaceAll('\r',''));
const {browser,context,page}=await attach();
async function shot(p,name){
 if(/Teratai Holdings|Pinnacle Komputer/.test(await p.locator('body').innerText()))throw Error('STOP: another course is visible');
 await capture(p,module,name,{mask:p.frames().flatMap(f=>[f.getByRole('button',{name:/Asraf/}),f.getByText(/^Saved in Asraf/)])});
}
async function office(key){const p=context.pages().find(p=>p.url()===state[key]);if(!p)throw Error('Office tab missing: '+key);await p.emulateMedia({colorScheme:'light'});let f;for(const fr of p.frames())if(await fr.getByRole('tab',{name:'Home',exact:true}).count())f=fr;return {p,f};}
async function openFile(name,key){
 const drive=context.pages().find(p=>p.url()===state['06-drive']);
 const popup=context.waitForEvent('page');await drive.getByRole('button').filter({hasText:new RegExp('^'+name.replaceAll('.','\\.')+'$')}).first().dblclick();
 const p=await popup;await p.waitForLoadState('domcontentloaded');await p.waitForTimeout(8000);remember(key,p.url());return p;
}
async function renameChat(key,title){if(await page.getByRole('button',{name:'Close preview',exact:true}).isVisible())await page.getByRole('button',{name:'Close preview',exact:true}).click();if(await page.getByRole('button',{name:'Expand sidebar',exact:true}).isVisible())await page.getByRole('button',{name:'Expand sidebar',exact:true}).click();await stable(page);remember(key,page.url());const id=page.url().match(/conversation\/([^/?]+)/)?.[1];const row=page.locator(`.fai-CopilotNavSubItem[href*="${id}"]`).locator('..');await row.hover();await row.getByRole('button',{name:'More',exact:true}).click();await page.getByRole('menuitem',{name:'Rename',exact:true}).click();await page.getByRole('textbox',{name:'Chat name',exact:true}).fill(title);await page.getByRole('button',{name:'Save',exact:true}).click();}
async function answer(){await stable(page);await page.locator('.fai-CopilotMessage').last().evaluate(e=>{for(let p=e.parentElement;p;p=p.parentElement)if(/auto|scroll/.test(getComputedStyle(p).overflowY)&&p.scrollHeight>p.clientHeight){p.scrollTop=p.scrollHeight;break;}});await stable(page);await page.locator('.fai-CopilotMessage').last().evaluate(e=>{for(let p=e.parentElement;p;p=p.parentElement)if(/auto|scroll/.test(getComputedStyle(p).overflowY)&&p.scrollHeight>p.clientHeight){p.scrollTop+=e.getBoundingClientRect().top-140;break;}});await stable(page);}
try{
 if(step==='setup'){
  const {page:drive,browser:b}=await openSite('https://jsasraf-my.sharepoint.com/','jsasraf-my.sharepoint.com');
  if(!decodeURIComponent(drive.url()).includes('/AIW Training')){
   await drive.getByRole('link',{name:'My files',exact:true}).first().click();await stable(drive);
   await drive.getByRole('button').filter({hasText:/^AIW Training$/}).first().dblclick();
  }await stable(drive);
  for(const name of ['sinar-maju-deck.pptx','sinar-maju-deck-bad.pptx','sinar-maju-memo.docx']){
   if(await drive.getByText(name,{exact:true}).count())continue;
   await drive.getByRole('button',{name:'Create or upload',exact:true}).click();await stable(drive);
   await drive.getByRole('menuitem').filter({hasText:/^Files upload$/}).click();
   await drive.locator('input[type=file]').setInputFiles({name,mimeType:name.endsWith('.docx')?'application/vnd.openxmlformats-officedocument.wordprocessingml.document':'application/vnd.openxmlformats-officedocument.presentationml.presentation',buffer:readFileSync(resolve(root,module,'sample-files',name))});
   await drive.getByText(name,{exact:true}).first().waitFor({timeout:60000});await stable(drive);
  }
  remember('06-drive',drive.url());
  const popup=context.waitForEvent('page');await drive.getByRole('button').filter({hasText:/^sinar-maju-deck.pptx$/}).first().dblclick();
  const office=await popup;await office.waitForLoadState('domcontentloaded');await office.waitForTimeout(7000);remember('06-good',office.url());
  console.log('FRAMES',office.frames().map(f=>({name:f.name(),url:f.url().split('?')[0]})));
  for(const f of office.frames())console.log('CONTROLS',await f.getByRole('button').evaluateAll(es=>es.filter(e=>e.getBoundingClientRect().width).map(e=>e.getAttribute('aria-label')||e.innerText).filter(x=>x&&/layout|edit|review|home|view/i.test(x)).slice(0,30)));
  await b.close();
 }else if(step==='good-result'){
  const {p,f}=await office('06-good-result');await f.getByRole('menu',{name:'Slide Layout',exact:true}).getByText('SM Closing',{exact:true}).waitFor();
  await shot(p,'06-13-download-open-powerpoint-check.png');
  await p.keyboard.press('Escape');
  for(let i=0;i<4;i++){
   await f.getByRole('option').nth(i).click();await p.waitForTimeout(800);
   await f.getByRole('menuitem',{name:'Slide Layout',exact:true}).click();
   await f.getByRole('menu',{name:'Slide Layout',exact:true}).getByText('SM Closing',{exact:true}).waitFor();
   console.log('SLIDE_LAYOUT',i+1,await f.getByRole('menu',{name:'Slide Layout',exact:true}).locator('button[aria-checked=true]').innerText());
   await p.keyboard.press('Escape');
   console.log('SLIDE_TEXT',i+1,await f.locator('.NormalTextRun').evaluateAll(es=>es.filter(e=>e.getBoundingClientRect().width>0).map(e=>e.innerText).join(' ')));
  }
  note(module,'6.4.3','download and check the deck layouts','Copilot saved a four-slide PowerPoint file to OneDrive; Open file opened it in PowerPoint for the web and Home > Slide Layout confirms SM Title, SM Title Only, SM Content and SM Closing on slides 1 to 4');
 }else if(step==='memo-result'){
  const {p,f}=await office('06-memo-result');await f.getByRole('tab',{name:'View',exact:true}).click();await f.getByRole('button',{name:'View Navigation Pane',exact:true}).click();await stable(p);
  console.log('HEADINGS',await f.getByText(/^[1-6]\. /).allTextContents());console.log('PLACEHOLDERS',await f.getByText(/^\[/).allTextContents());
  await f.getByLabel('Navigation',{exact:true}).getByText('6. Approval Required',{exact:true}).waitFor();await shot(p,'06-10-download-file-open-word.png');
  note(module,'6.3.3','download the finished memo and open it in Word with six headings and no placeholders','Copilot saved a Word file to OneDrive and Open file opened it in Word for the web; its Navigation Pane keeps all six headings and no square-bracket placeholders were found');
 }else if(step==='memo-answer'){
  await renameChat('06-chat-memo','AIW 06 - approval memo');await answer();await shot(page,'06-09-copy-prompt-below-replace.png');
  await page.getByRole('button',{name:'Open preview',exact:true}).click();await stable(page);
  console.log('PREVIEW_BUTTONS',await page.getByRole('button').evaluateAll(es=>es.filter(e=>e.getBoundingClientRect().width).map(e=>e.getAttribute('aria-label')||e.innerText).filter(x=>/Word|Download|Close/.test(x))));
 }else if(step.endsWith('-upload')){
  const type=step.replace('-upload',''),name={memo:'sinar-maju-memo.docx',good:'sinar-maju-deck.pptx',bad:'sinar-maju-deck-bad.pptx'}[type];
  await newChat(page);await page.locator('input[type=file]').setInputFiles(resolve(root,module,'sample-files',name));await page.getByText(name,{exact:false}).last().waitFor();await stable(page);
  if(type!=='bad')await shot(page,type==='memo'?'06-08-start-new-chat-ai.png':'06-11-start-new-chat-upload.png');
 }else if(step.endsWith('-send')){
  const type=step.replace('-send','');await send(page,prompts[type==='memo'?0:2]);await renameChat('06-chat-'+type,'AIW 06 - '+{memo:'approval memo',good:'good approval deck',bad:'bad approval deck'}[type]);await answer();
  await shot(page,{memo:'06-09-copy-prompt-below-replace.png',good:'06-12-send.png',bad:'06-14-start-new-chat-upload.png'}[type]);
  console.log('ANSWER', (await page.locator('.fai-CopilotMessage').last().innerText()).slice(0,1800));
  console.log('FILE_LINKS',await page.locator('.fai-CopilotMessage').last().getByRole('link').evaluateAll(es=>es.map(e=>({text:e.innerText,href:e.href.split('?')[0]}))));
 }else if(step==='memo-nav'){
  const {p,f}=await office('06-memo');await stable(p);await shot(p,'06-06-select-view-navigation-pane.png');
  await f.getByText('[Your name, Procurement Executive]',{exact:true}).click({force:true});await stable(p);await shot(p,'06-07-click-into-grey-text.png');
  note(module,'6.2.2','select View > Navigation Pane','Word for the web calls the command View Navigation Pane and shows all six numbered headings');
 }else if(step==='memo-open'){
  const {p,f}=await office('06-memo');await stable(p);await shot(p,'06-05-open-sinar-maju-memo.png');
  await f.getByRole('tab',{name:'View',exact:true}).click();await stable(p);
  console.log('VIEW',await f.getByRole('button').evaluateAll(es=>es.filter(e=>e.getBoundingClientRect().width).map(e=>e.getAttribute('aria-label')||e.innerText).filter(Boolean).slice(0,65)));
 }else if(step==='good-check'){
  const {p,f}=await office('06-good');await f.getByRole('button',{name:'Check Accessibility',exact:true}).click();await stable(p);
  console.log('CHECK',await f.getByText(/Accessibility|Missing|No issues|Congratulations/).allTextContents());
  await shot(p,'06-03-select-review-check-accessibility.png');
  await p.close();await openFile('sinar-maju-deck-bad.pptx','06-bad');
 }else if(step==='bad-check'){
  const {p,f}=await office('06-bad');
  await f.getByRole('tab',{name:'Home',exact:true}).click();await f.getByRole('menuitem',{name:'Slide Layout',exact:true}).click();await stable(p);
  console.log('BAD_LAYOUTS',await f.getByRole('menuitem').allTextContents());await p.keyboard.press('Escape');
  await f.getByRole('tab',{name:'View',exact:true}).click();await stable(p);
  await f.getByRole('tab',{name:'Review',exact:true}).click();await f.getByRole('button',{name:'Check Accessibility',exact:true}).click();await stable(p);
  console.log('BAD_CHECK',await f.getByText(/Accessibility|Missing|title|Errors/).allTextContents());
  await shot(p,'06-04-close-do-same-three.png');
  await openFile('sinar-maju-memo.docx','06-memo');
 }else if(step==='good-view'){
  const p=context.pages().find(p=>p.url()===state['06-good']);let f;for(const fr of p.frames())if(await fr.getByRole('tab',{name:'View',exact:true}).count())f=fr;
  await f.getByRole('tab',{name:'View',exact:true}).click();await stable(p);
  await shot(p,'06-02-select-view-outline-view.png');
  note(module,'6.1.2','select View > Outline View','PowerPoint for the web has Normal (Tri-pane) View and Slide Sorter but no Outline View; the View ribbon was captured');
  await f.getByRole('tab',{name:'Review',exact:true}).click();await stable(p);
  console.log('REVIEW',await f.getByRole('button').evaluateAll(es=>es.filter(e=>e.getBoundingClientRect().width).map(e=>e.getAttribute('aria-label')||e.innerText).filter(Boolean)));
 }else if(step==='good-layout'){
  const p=context.pages().find(p=>p.url()===state['06-good']);
  await p.emulateMedia({colorScheme:'light'});let f;for(const fr of p.frames())if(await fr.getByRole('tab',{name:'Home',exact:true}).count())f=fr;
  await f.getByRole('tab',{name:'Home',exact:true}).click();
  await f.getByRole('menuitem',{name:'Slide Layout',exact:true}).click();await stable(p);
  await f.getByRole('menu',{name:'Slide Layout',exact:true}).getByText('SM Closing',{exact:true}).waitFor();console.log('LAYOUTS',await f.getByText(/^SM /).allTextContents());
  await shot(p,'06-01-open-sinar-maju-deck.png');
  await p.keyboard.press('Escape');await f.getByRole('tab',{name:'View',exact:true}).click();await stable(p);
  console.log('VIEW',await f.getByRole('button').evaluateAll(es=>es.filter(e=>e.getBoundingClientRect().width).map(e=>e.getAttribute('aria-label')||e.innerText).filter(Boolean)));
 }
}catch(e){console.log(e.message.split('\n')[0]);process.exitCode=1;}finally{await browser.close();}


