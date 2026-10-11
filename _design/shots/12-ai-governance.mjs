import {attach,newChat,send,capture,stable,note,remember,root,state} from './run-helpers.mjs';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
const M='12-ai-governance',step=Number(process.argv[2]);
const prompts=[...readFileSync(resolve(root,M,'prompts.md'),'utf8').matchAll(/```\r?\n([\s\S]*?)```/g)].map(x=>x[1].trim());
const shots=[...readFileSync(resolve(root,'_design/shots',M+'.md'),'utf8').matchAll(/`(12-\d+[^`]+\.png)`/g)].map(x=>x[1]);
const {page}=await attach();
async function rename(){
 const id=new URL(page.url()).pathname.split('/').at(-1),row=page.locator(`a[href*="${id}"]`);
 if(!await row.count())await page.getByRole('button',{name:'Chats',exact:true}).click();
 await row.hover();await row.locator('..').getByRole('button',{name:'More',exact:true}).focus();await page.keyboard.press('Enter');
 await page.getByRole('menuitem',{name:'Rename',exact:true}).click();await page.getByLabel('Chat name',{exact:true}).fill('AIW 12 - governance');await page.getByRole('button',{name:'Save',exact:true}).click();
}
if(step===1){await newChat(page);await capture(page,M,shots[0]);}
if(step>=2&&step<=5){
 if(step>2){await page.goto(state['12-governance'],{waitUntil:'domcontentloaded'});await page.getByRole('textbox',{name:'Message Copilot',exact:true}).waitFor({timeout:60000});}
 const index={2:0,3:1,4:2,5:4}[step];await send(page,prompts[index]);
 if(step===2)await rename();
 remember('12-governance',page.url());await page.locator('.fai-CopilotMessage').last().evaluate(e=>e.scrollIntoView({block:'start'}));await capture(page,M,shots[step-1]);
 console.log('ANSWER',(await page.locator('.fai-CopilotMessage').last().innerText()).slice(0,6500));
}

if(process.argv[2]==='notes'){
 note(M,'12.1.2','list six AI uses in the register','the initial table repeats Customer Stock Enquiry Reply Drafting, producing seven rows; the risk table returns to six');
 note(M,'12.2','the example rates the policy notebook Low because staff check the cited clause','Copilot rates it Medium because staff may rely on its answers; customer enquiries are High and the other five uses are Medium');
 note(M,'Topics / Check while you are there','verify the AI Governance Bill status before each class; the October note says it was being prepared for Cabinet','checked 11 October 2026: still in draft, with tabling expected in early 2027 according to the [5 October 2026 Parliamentary statement](https://hansard.parlimen.gov.my/hansard/dewan-rakyat/2026-10-05?search=inflasi); [NAIO](https://www.ai.gov.my/faq/ai-governance-policy/) confirms there is currently no dedicated AI law');
}

process.exit(0);
