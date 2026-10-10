// Retake existing answers only; no prompts are sent.
import {attach,capture,stable,note,state} from './run-helpers.mjs';
const M='12-ai-governance';
const {page}=await attach();
await page.goto(state['12-governance'],{waitUntil:'domcontentloaded'});
await page.emulateMedia({colorScheme:'light'});
await page.getByRole('link',{name:'AIW 12 - governance',exact:true}).waitFor({timeout:60000});
await page.locator('.fai-CopilotMessage').nth(3).waitFor({timeout:60000});
await page.getByRole('button',{name:/^Stop/}).waitFor({state:'hidden',timeout:60000});
await stable(page);
if(!await page.getByText('M365 Copilot (Basic)',{exact:true}).count())throw Error('Basic account label missing');
const initialMessages=await page.locator('.fai-UserMessage').count();
const files=['12-03-rate-risk.png','12-04-write-department-s-ai.png','12-05-check-against-national-principles.png'];
for(let i=0;i<files.length;i++){
 const answer=page.locator('.fai-CopilotMessage').nth(i+1);
 await answer.evaluate(e=>e.scrollIntoView({block:'start'}));
 if(i===0){
  const scroll=await answer.locator('table').first().evaluate(e=>{let p=e.parentElement;while(p&&!(p.scrollWidth>p.clientWidth&&['auto','scroll'].includes(getComputedStyle(p).overflowX)))p=p.parentElement;if(!p)throw Error('Risk table scroller not found');p.scrollLeft=p.scrollWidth-p.clientWidth;return {left:p.scrollLeft,max:p.scrollWidth-p.clientWidth};});
  console.log('RISK_SCROLL',scroll);
  const visible=await answer.locator('table').first().evaluate(e=>{const cells=[...e.querySelectorAll('th')].filter(t=>/^(Risk|Reason for rating)$/.test(t.innerText.trim()));let p=e.parentElement;while(p&&getComputedStyle(p).overflowX!=='auto')p=p.parentElement;const b=p.getBoundingClientRect();return cells.map(t=>{const r=t.getBoundingClientRect();return {header:t.innerText,visible:r.left>=b.left&&r.right<=b.right+1&&r.top>=0&&r.bottom<=900};});});
  if(visible.length!==2||visible.some(h=>!h.visible))throw Error('Risk headers are not fully visible');console.log('RISK_HEADERS',visible);
 }
 await page.emulateMedia({colorScheme:'light'});await capture(page,M,files[i]);
}
if(await page.locator('.fai-UserMessage').count()!==initialMessages)throw Error('Unexpected chat change');
console.log('UNCHANGED_MESSAGES',initialMessages);
note(M,'12.2 retake','the example rates the policy notebook Low because staff check the cited clause','the existing answer rates it Medium; the retake scrolls the table horizontally to show Risk and Reason for rating');
note(M,'Topics / Check while you are there','verify the AI Governance Bill status before each class','checked 11 October 2026: still in draft, with tabling expected in early 2027 according to the [5 October 2026 Parliamentary statement](https://hansard.parlimen.gov.my/hansard/dewan-rakyat/2026-10-05?search=inflasi); [NAIO](https://www.ai.gov.my/faq/ai-governance-policy/) confirms there is currently no dedicated AI law');
process.exit(0);
