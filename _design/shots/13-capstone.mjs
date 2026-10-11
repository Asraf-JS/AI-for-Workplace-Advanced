// Module 13 capture phases. Run browser-session.mjs first; use steps 1 through 7 in order.
import {attach,openSite,capture,stable,send,newChat,note,remember,root,state} from './run-helpers.mjs';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
const M='13-capstone',step=Number(process.argv[2]);
const prompts=[...readFileSync(resolve(root,M,'prompts.md'),'utf8').matchAll(/```\r?\n([\s\S]*?)```/g)].map(x=>x[1].trim());
const files=[...readFileSync(resolve(root,'_design/shots',M+'.md'),'utf8').matchAll(/`(13-\d+[^`]+\.png)`/g)].map(x=>x[1]);
const sample=f=>resolve(root,M,'sample-files',f),cap=async(p,n)=>{await p.emulateMedia({colorScheme:'light'});await capture(p,M,files[n-1]);};
const {page,context}=await attach();
async function drive(){const url=process.env.CAPTURE_ONEDRIVE_URL||state['13-drive']||state['06-drive'];const {page:d}=await openSite(url,url);await d.goto(url,{waitUntil:'domcontentloaded'});remember('13-drive',url);return d;}
async function sendExact(prompt){
 const before=await page.locator('.fai-UserMessage').count(),pending=send(page,prompt);await page.waitForTimeout(6000);
 const box=page.getByRole('textbox',{name:'Message Copilot',exact:true});
 if(await page.locator('.fai-UserMessage').count()===before&&(await box.innerText()).replaceAll('\r','').includes(prompt.replaceAll('\r',''))&&await page.getByRole('button',{name:'Send',exact:true}).isEnabled())await page.getByRole('button',{name:'Send',exact:true}).click();
 await pending;remember('13-chat',page.url());
}
async function renameChat(){
 const id=new URL(page.url()).pathname.split('/').at(-1),row=page.locator(`a[href*="${id}"]`);
 if(!await row.count())await page.getByRole('button',{name:'Chats',exact:true}).click();await row.hover();await row.locator('..').getByRole('button',{name:'More',exact:true}).focus();await page.keyboard.press('Enter');
 await page.getByRole('menuitem',{name:'Rename',exact:true}).click();await page.getByLabel('Chat name',{exact:true}).fill('AIW 13 - capstone brief A');await page.getByRole('button',{name:'Save',exact:true}).click();remember('13-chat',page.url());
}
if(step===1){
 const d=await drive();
 if(!await d.getByRole('button',{name:'brief-a-invoice-matching.pdf',exact:true}).count()){
  await d.getByRole('button',{name:'Create or upload',exact:true}).click();await d.waitForTimeout(800);const choosing=d.waitForEvent('filechooser');await d.getByText('Files upload',{exact:true}).click();
  await (await choosing).setFiles(['brief-a-invoice-matching.pdf','brief-b-stock-enquiries.pdf','brief-c-monthly-spend-report.pdf','ai-workflow-canvas.docx'].map(sample));
  await d.getByRole('button',{name:'brief-a-invoice-matching.pdf',exact:true}).waitFor({timeout:60000});
 }
 await d.getByRole('button',{name:'brief-a-invoice-matching.pdf',exact:true}).dblclick();await stable(d);
 for(let i=0;i<2;i++){await d.getByRole('button',{name:'Next',exact:true}).click();await stable(d);await d.waitForTimeout(1000);}
 for(let i=0;i<2;i++){await d.getByRole('button',{name:'Previous',exact:true}).click();await stable(d);}
 await cap(d,1);
}
if(step===2){
 const d=await drive(),opened=context.waitForEvent('page');await d.getByRole('button',{name:'ai-workflow-canvas.docx',exact:true}).dblclick();const w=await opened;await w.waitForTimeout(5000);const f=w.frames()[1];
 await f.getByRole('button',{name:'File',exact:true}).click();await f.getByRole('menuitem',{name:'Create a Copy',exact:true}).click();await f.getByRole('menuitem',{name:'Create a copy online',exact:true}).click();
 await f.getByLabel('File Name',{exact:true}).fill('AIW 13 - capstone brief A canvas');await f.getByRole('dialog').getByRole('button',{name:'Create a Copy',exact:true}).click();await w.waitForTimeout(3000);remember('13-word',w.url());
 await context.grantPermissions(['clipboard-read','clipboard-write']);
 for(const [label,value] of [['Team','Daniel Wong Kah Leong'],['Brief (A, B or C)','A - Supplier invoice matching']]){
  await f.locator('#PagesContainer').click({position:{x:420,y:150}});await w.keyboard.press('Control+f');await f.getByPlaceholder('Search in document',{exact:true}).fill(label);await w.keyboard.press('Enter');await w.waitForTimeout(1000);
  await f.getByRole('button',{name:label,exact:true}).click();await f.getByRole('button',{name:'Hide Navigation Pane',exact:true}).click();await f.locator('#WACViewPanel_EditingElement').focus();await w.keyboard.press('ArrowRight');await w.keyboard.press('Tab');
  await f.evaluate(async text=>navigator.clipboard.writeText(text),value);await w.keyboard.press('Control+Shift+V');await f.locator('#WACViewPanel_EditingElement').focus();
 }
 await w.keyboard.press('Control+Home');await w.waitForTimeout(2000);await cap(w,2);
}
if(step===3){await newChat(page);await page.locator('input[type=file]').setInputFiles(sample('brief-a-invoice-matching.pdf'));await page.waitForTimeout(4000);await cap(page,3);}
if(step===4){await sendExact(prompts[0]);await renameChat();await page.locator('.fai-CopilotMessage').last().evaluate(e=>e.scrollIntoView({block:'start'}));await cap(page,4);}
if(step>=5&&step<=7){
 if(page.url()!==state['13-chat'])await page.goto(state['13-chat'],{waitUntil:'domcontentloaded'});await page.getByRole('textbox',{name:'Message Copilot',exact:true}).waitFor({timeout:60000});await page.waitForTimeout(7000);await stable(page);
 if(step===5){await page.locator('input[type=file]').setInputFiles(['brief-a-purchase-orders.csv','brief-a-goods-received.csv','brief-a-invoices.csv'].map(sample));await page.waitForTimeout(5000);}
 await sendExact(prompts[step===5?1:step===6?4:5]);await page.locator('.fai-CopilotMessage').last().evaluate(e=>e.scrollIntoView({block:'start'}));await cap(page,step);
}
if(process.argv[2]==='notes'){
 note(M,'13.2.2','list every rule as a numbered checklist','Copilot presents the five rules as an unnumbered checkbox checklist');
 note(M,'13.3 capture correction','four invoices should stop and nine should match','the initial answer stopped both copies of the duplicate invoice and reported five stops and eight matches; after a chat reload temporarily showed only the brief response, the same data prompt was resent and the final answer reports four stops and nine matches, confirmed independently against the CSV files');
}
process.exit(0);
