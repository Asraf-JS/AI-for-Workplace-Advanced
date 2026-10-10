import {attach,send,capture,stable,note,remember,state,root} from './run-helpers.mjs';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const module='08-agents-connectors-mcp',step=process.argv[2];
const prompts=[...readFileSync(resolve(root,module,'prompts.md'),'utf8').matchAll(/```\s*\n([\s\S]*?)\n```/g)].map(m=>m[1].replaceAll('\r',''));
const {browser,context,page}=await attach();
async function light(p=page){await p.emulateMedia({colorScheme:'dark'});await p.emulateMedia({colorScheme:'light'});await stable(p);}
async function shot(name,p=page){await light(p);if(/Teratai Holdings|Pinnacle Komputer/.test(await p.locator('body').innerText()))throw Error('STOP: another course is visible');await page.getByText('M365 Copilot (Basic)',{exact:true}).waitFor();await capture(p,module,name,{mask:[p.getByRole('button',{name:/Asraf/}),p.getByText(/^Saved in Asraf/)]});}
async function position(card=page.locator('.fai-CopilotMessage').last()){await card.scrollIntoViewIfNeeded();for(let i=0;i<4;i++){await card.evaluate(e=>{for(let p=e.parentElement;p;p=p.parentElement)if(/auto|scroll/.test(getComputedStyle(p).overflowY)&&p.scrollHeight>p.clientHeight){p.scrollTop+=e.getBoundingClientRect().top-140;break;}});await stable(page);const b=await card.boundingBox();if(b&&b.y>=100&&b.y<=250)break;}}
async function showAddedColumns(card){await card.locator('table').first().evaluate(e=>{for(let p=e.parentElement;p;p=p.parentElement)if(/auto|scroll/.test(getComputedStyle(p).overflowX)&&p.scrollWidth>p.clientWidth){p.scrollLeft=p.scrollWidth;break;}});await stable(page);console.log('RIGHT_HEADER',await card.locator('table').first().locator('th').last().boundingBox());}
async function rename(){await page.waitForURL(/\/conversation\//,{timeout:30000});const id=page.url().match(/conversation\/([^/?]+)/)?.[1];const row=page.locator(`.fai-CopilotNavSubItem[href*="${id}"]`).locator('..');await row.hover();await row.getByRole('button',{name:'More',exact:true}).click();await page.getByRole('menuitem',{name:'Rename',exact:true}).click();await page.getByRole('textbox',{name:'Chat name',exact:true}).fill('AIW 08 - systems map');await page.getByRole('button',{name:'Save',exact:true}).click();remember('08-chat',page.url());}
try{
 if(step==='start'){
  await page.goto('https://m365.cloud.microsoft/chat',{waitUntil:'domcontentloaded'});await page.getByRole('textbox',{name:'Message Copilot',exact:true}).waitFor();await stable(page);
  if(await page.locator('.fai-UserMessage').count())throw Error('Expected new empty chat');
  await shot('08-01-start-new-chat-ai.png');
 }else if(['process','access','connectors'].includes(step)){
  if(step!=='process'&&page.url()!==state['08-chat']){await page.goto(state['08-chat'],{waitUntil:'domcontentloaded'});await page.getByRole('textbox',{name:'Message Copilot',exact:true}).waitFor();}
  if(step==='process'&&await page.locator('.fai-UserMessage').count())throw Error('Expected empty systems-map chat');
  await send(page,prompts[{process:0,access:1,connectors:2}[step]]);
  if(step==='process')await rename();else if(page.url()!==state['08-chat'])throw Error('Reply left systems-map chat');
  await position();if(step!=='process')await showAddedColumns(page.locator('.fai-CopilotMessage').last());await shot({process:'08-02-send.png',access:'08-03-mark-read-write-approval.png',connectors:'08-05-same-chat-send.png'}[step]);
  const card=page.locator('.fai-CopilotMessage').last();writeFileSync(resolve(root,'../08-'+step+'-answer.txt'),await card.innerText());
  console.log('ANSWER',(await card.innerText()).slice(0,2700));
 }else if(step==='table-retakes'){
  const access=page.locator('.fai-CopilotMessage').filter({hasText:'Summary'}).first();await position(access);await showAddedColumns(access);await shot('08-03-mark-read-write-approval.png');
  const connectors=page.locator('.fai-CopilotMessage').filter({hasText:'Connector Inventory'}).first();await position(connectors);await showAddedColumns(connectors);await shot('08-05-same-chat-send.png');
  note(module,'8.2 and 8.3.2','show the added read, write, approval and connector columns','the eight-column and nine-column tables scroll horizontally; captures show the answer starts with the tables scrolled right to reveal the added columns');
 }else if(step==='list-capture'){
  const p=context.pages().find(p=>p.url()===state['08-list']);await p.keyboard.press('Escape');
  await p.getByRole('heading',{name:'Knowledge',exact:true}).scrollIntoViewIfNeeded();await p.getByRole('button',{name:'Add knowledge',exact:true}).click();await p.getByRole('dialog').filter({hasText:'Enter a link'}).waitFor();
  await shot('08-04-open-ai-tool-s.png',p);
  note(module,'8.3.1','open the connector list and inspect available connections','the Basic agent editor exposes Configure > Knowledge > Add knowledge with Enter a link and Add website; Knowledge settings says source availability depends on license; no connection was added or settings changed');
  await p.keyboard.press('Escape');await p.close();
 }else if(step==='list'){
  if(!state['07-editor'])throw Error('Existing Agent Builder URL missing');
  const p=await context.newPage();await p.goto(state['07-editor'],{waitUntil:'domcontentloaded'});await p.getByRole('textbox',{name:'Enter agent name',exact:true}).waitFor({timeout:30000});
  if(await p.getByRole('textbox',{name:'Enter agent name',exact:true}).inputValue()!=='Quotation Checker')throw Error('Wrong agent');
  await light(p);await p.getByRole('button',{name:'Add knowledge',exact:true}).click();await stable(p);remember('08-list',p.url());
  console.log('MENU',await p.getByRole('menuitem').allTextContents());console.log('DIALOG',await p.getByRole('dialog').allTextContents());
  console.log('BUTTONS',await p.getByRole('button').evaluateAll(es=>es.filter(e=>e.getBoundingClientRect().width).map(e=>e.getAttribute('aria-label')||e.innerText).filter(Boolean).slice(-30)));
 }
}catch(e){console.log(e.message.split('\n')[0]);process.exitCode=1;}finally{await browser.close();}
