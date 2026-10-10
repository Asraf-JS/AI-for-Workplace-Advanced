import {attach,openSite,newChat,send,capture,stable,remember,state,root,note} from './run-helpers.mjs';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const module='05-data-analysis', step=process.argv[2];
const prompts=[...readFileSync(resolve(root,module,'prompts.md'),'utf8').matchAll(/```\s*\n([\s\S]*?)\n```/g)].map(m=>m[1].replaceAll('\r',''));
const {browser,page}=await attach();
async function shot(name){
 if(/Teratai Holdings|Pinnacle Komputer/.test(await page.locator('body').innerText()))throw Error('STOP: another course is visible');
 await capture(page,module,name,{mask:[page.getByRole('button',{name:/^Asraf\s+Jaafar Sidik$/})]});
}
async function answer(){
 await stable(page);
 await page.locator('.fai-CopilotMessage').last().evaluate(e=>{for(let p=e.parentElement;p;p=p.parentElement){if(/auto|scroll/.test(getComputedStyle(p).overflowY)&&p.scrollHeight>p.clientHeight){p.scrollTop=p.scrollHeight;break;}}});
 await stable(page);
 const card=page.locator('.fai-CopilotMessage').last();
 await card.scrollIntoViewIfNeeded();
 await card.evaluate(e=>{e.scrollIntoView({block:'start'});for(let p=e.parentElement;p;p=p.parentElement){if(/auto|scroll/.test(getComputedStyle(p).overflowY)&&p.scrollHeight>p.clientHeight){p.scrollTop=Math.max(0,p.scrollTop-80);break;}}});
 await stable(page);
 writeFileSync(resolve(root,'../05-'+step+'-answer.txt'),await card.textContent());
}
try {
 if(step==='retake'){
  if(!state['05-chat'])throw Error('Missing existing Module 05 chat');
  await newChat(page,'05-chat');await stable(page);
  await page.getByText('M365 Copilot (Basic)',{exact:true}).waitFor();
  await page.getByText('AIW 05 - purchase history',{exact:true}).waitFor();
  await page.emulateMedia({colorScheme:'light'});
  const scroller=page.locator('.fui-Virtualizer-Scroll-View-Dynamic__container');
  async function position(text,y){
   const card=page.locator('.fai-CopilotMessage').filter({hasText:text}).first();
   await card.waitFor();
   await card.evaluate((e,y)=>{for(let p=e.parentElement;p;p=p.parentElement){if(/auto|scroll/.test(getComputedStyle(p).overflowY)&&p.scrollHeight>p.clientHeight){p.scrollTop+=e.getBoundingClientRect().top-y;break;}}},y);
   await stable(page);
   const actual=await card.boundingBox();
   if(!actual||actual.y<80||actual.y>300)throw Error('Answer start is outside capture position');
   console.log('ANSWER_POSITION',text,Math.round(actual.y));
  }
  await scroller.evaluate(e=>e.scrollTop=0);await stable(page);
  await position('I have read both sheets in purchase-history.',140);
  await shot('05-02-send.png');
  await scroller.evaluate(e=>e.scrollTop=e.scrollHeight);await stable(page);
  await position('Using the cleaned dataset (cancelled orders removed',140);
  await shot('05-08-look-patterns.png');
  await scroller.evaluate(e=>e.scrollTop=e.scrollHeight);await stable(page);
  await position("I've created the chart showing monthly spend",180);
  await shot('05-09-make-chart.png');
  note(module,'05-02, 05-08 and 05-09 retake','capture the existing answers in light mode','the saved AIW 05 - purchase history chat was reopened in light mode and the same three answers were captured without resending prompts');
  note(module,'check while retaking','check whether Gemini shows its code','Gemini was not opened because this retake covers only three existing Copilot answers; Gemini code visibility remains unverified');
 } else if(step.startsWith('excel-')){
  const {page:excel,browser:excelBrowser}=await openSite(state['05-excel'],'purchase-history-pivot.xlsx');
  const f=excel.frames().find(f=>f.url()===''&&f!==excel.mainFrame());
  const namebox=f.locator('#FormulaBar-NameBox-input');
  if(step==='excel-count'){
   await namebox.fill('A:A');await namebox.press('Enter');await stable(excel);
   console.log('COUNTS',await f.getByText(/^Count:/).allTextContents());
   await capture(excel,module,'05-03-check-row-count-against.png',{mask:[f.getByRole('button',{name:/Asraf/})]});
  } else if(step==='excel-filter'){
   await excel.keyboard.press('Escape');await namebox.fill('B1');await excel.waitForTimeout(600);await namebox.press('Enter');await excel.waitForTimeout(600);
   await excel.keyboard.press('Alt+ArrowDown');await stable(excel);
   console.log('FILTER_OPEN',await f.getByText('Cancelled',{exact:true}).isVisible());
   await f.getByText('Cancelled',{exact:true}).click();console.log('CANCEL_DESELECTED');
   await f.getByText('Apply',{exact:true}).click();console.log('APPLIED');await stable(excel);
   await capture(excel,module,'05-07-filter-status-leave-out.png',{mask:[f.getByRole('button',{name:/Asraf/})]});
   console.log('GRID_TEXT',await f.getByRole('textbox').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label')).filter(s=>s&&/B1|Multiple/.test(s))));
  } else if(step==='excel-fields'){
   let fields;for(const fr of excel.frames())if(await fr.getByRole('checkbox',{name:'Vendor ID',exact:true}).count())fields=fr;
   if(!await fields.getByRole('checkbox',{name:'Vendor ID',exact:true}).isChecked())await fields.getByRole('checkbox',{name:'Vendor ID',exact:true}).click();
   if(!await fields.getByRole('checkbox',{name:'Total (RM)',exact:true}).isChecked())await fields.getByRole('checkbox',{name:'Total (RM)',exact:true}).click();await stable(excel);
   await capture(excel,module,'05-06-put-vendor-id-rows.png',{mask:[f.getByRole('button',{name:/Asraf/})]});
  } else if(step==='excel-pivot-create'){
   await capture(excel,module,'05-05-excel-select-data-choose.png',{mask:[f.getByRole('button',{name:/Asraf/})]});
   let pivot;
   for(const fr of excel.frames())if(await fr.getByText('Create your own PivotTable',{exact:true}).count())pivot=fr;
   await pivot.getByRole('button').filter({hasText:'Insert your own PivotTable on a new Worksheet'}).click();await stable(excel);
   console.log('FIELD_CHECKBOXES',await f.getByRole('checkbox').allTextContents());
   console.log('FIELD_TEXT',await f.getByText(/Vendor ID|Total \(RM\)|PivotTable Fields/).allTextContents());
  } else if(step==='excel-pivot'){
   await namebox.fill('A1:Q355');await namebox.press('Enter');
   await f.getByRole('tab',{name:'Insert',exact:true}).click();
   console.log('PIVOT_BUTTONS',await f.getByRole('button').evaluateAll(es=>es.filter(e=>/pivot/i.test(e.innerText+' '+e.getAttribute('aria-label'))).map(e=>({text:e.innerText,label:e.getAttribute('aria-label')}))));
  }
  await excelBrowser.close();
 } else if(step==='office-setup'){
  const {page:drive,context,browser:driveBrowser}=await openSite(process.env.CAPTURE_ONEDRIVE_URL,new URL(process.env.CAPTURE_ONEDRIVE_URL).host);
  const dialog=drive.getByRole('dialog');
  if(await dialog.count()){
   await dialog.getByRole('textbox').fill('AIW Training');
   await dialog.getByRole('button').filter({hasText:/^Create$/}).click();await stable(drive);
  }
  if(!decodeURIComponent(drive.url()).includes('/AIW Training'))await drive.getByRole('button').filter({hasText:/^AIW Training$/}).first().dblclick();await stable(drive);
  for(const name of ['purchase-history.xlsx','purchase-history-pivot.xlsx']){
   if(await drive.getByText(name,{exact:true}).count())continue;
   await drive.getByRole('button',{name:'Create or upload',exact:true}).click();await stable(drive);
   await drive.getByRole('menuitem').filter({hasText:/^Files upload$/}).click();
   await drive.locator('input[type=file]').setInputFiles({name,mimeType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',buffer:readFileSync(resolve(root,module,'sample-files/purchase-history.xlsx'))});
   await drive.getByText(name,{exact:true}).first().waitFor({timeout:60000});await stable(drive);
  }
  const popup=context.waitForEvent('page');
  await drive.getByRole('button').filter({hasText:/^purchase-history-pivot.xlsx$/}).first().dblclick();
  const excel=await popup;await excel.waitForLoadState('domcontentloaded');await excel.waitForTimeout(7000);
  remember('05-excel',excel.url());console.log('EXCEL_OPEN',excel.url());
  await driveBrowser.close();
 } else if(step==='start'){
  if(page.url()!==state['05-chat']){await newChat(page,'05-chat');await page.waitForTimeout(7000);}
  console.log('UPLOAD_CONTROLS',await page.getByRole('button').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label')).filter(s=>s&&/add|attach|upload/i.test(s))));
 } else if(step==='upload'){
  await page.locator('input[type=file]').setInputFiles(resolve(root,module,'sample-files/purchase-history.xlsx'));
  await page.getByText('purchase-history.xlsx',{exact:false}).last().waitFor();
  await shot('05-01-start-new-chat-upload.png');
 } else if(step==='first'){
  await send(page,prompts[0]); remember('05-chat',page.url());
  const id=page.url().match(/conversation\/([^/?]+)/)?.[1];
  const row=page.locator(`.fai-CopilotNavSubItem[href*="${id}"]`).locator('..');
  await row.hover();await row.getByRole('button',{name:'More',exact:true}).click();
  await page.getByRole('menuitem',{name:'Rename',exact:true}).click();
  await page.getByRole('textbox',{name:'Chat name',exact:true}).fill('AIW 05 - purchase history');
  await page.getByRole('button',{name:'Save',exact:true}).click();
  await answer();await shot('05-02-send.png');
 } else if(step==='quality-capture'){
  await answer();await shot('05-04-find-data-problems.png');
 } else if(['quality','summary','patterns','chart'].includes(step)){
  await newChat(page,'05-chat');
  const index={quality:1,summary:3,patterns:4,chart:6}[step];
  await send(page,prompts[index]);remember('05-chat',page.url());await page.waitForTimeout(3000);await answer();
  const filename={quality:'05-04-find-data-problems.png',patterns:'05-08-look-patterns.png',chart:'05-09-make-chart.png'}[step];
  if(filename)await shot(filename);
 }
} catch(e){console.log(e.message.split('\n')[0]);process.exitCode=1;} finally {await browser.close();}
