import { openSite, capture, stable, remember, state, root } from './run-helpers.mjs';
import { readFileSync } from 'node:fs';
import { selectors } from 'playwright';
selectors.setTestIdAttribute('data-test-id');
const module='10-n8n-agent-workflow';
const {page,browser,context}=await openSite(state['10-workflow']||process.env.CAPTURE_N8N_URL||state['10-workspace'],'/workflow/');
remember('10-workspace',page.url());
const shots=[...readFileSync(`${root}/_design/shots/${module}.md`,'utf8').matchAll(/\| `(10-[^`]+\.png)`/g)].map(m=>m[1]);
const step=process.argv[2];
const prompts=[...readFileSync(`${root}/${module}/prompts.md`,'utf8').matchAll(/```\r?\n([\s\S]*?)\r?\n```/g)].map(m=>m[1]);
async function closeNode(){await stable(page);const close=page.getByTestId('ndv-close-button');if(await close.isVisible()){await close.click();await close.waitFor({state:'hidden'});}}
async function expression(field,value){
 const input=page.getByTestId(`parameter-input-${field}`);
 if(!await input.locator('[contenteditable=true]').count())await page.getByTestId(`${field}-parameter-input-options-container`).getByText('Expression',{exact:true}).press('Space');
 const editor=input.locator('[contenteditable=true]');await editor.click();await page.keyboard.press('Control+a');await page.keyboard.insertText(value);await page.getByText('Parameters',{exact:true}).click();
}
async function email(name,subject,approval=true){
 await page.getByTestId('node-title-container').click();await page.getByPlaceholder('Enter new name...').fill(name);await page.getByPlaceholder('Enter new name...').press('Enter');
 await page.getByTestId('parameter-input-toRecipients').locator('input').fill(process.env.CAPTURE_ACCOUNT);
 await expression('subject',subject);
 await closeNode();await page.getByTestId('canvas-node').filter({hasText:name}).dblclick();
 await expression(approval?'message':'bodyContent',approval?prompts[3]:'Quotation from {{ $json.supplier }} ({{ $json.quotation_no }}) for RFQ-2026-131.\nVerdict: {{ $json.verdict }}\nCorrect total including tax: RM{{ $json.correct_total }}\nProblems found:\n{{ $json.problems.map(p => p.clause + ": " + p.finding).join("\\n") }}');
 await closeNode();await page.getByTestId('canvas-node').filter({hasText:name}).dblclick();
}
async function addEmail(index,approval=true){
 await closeNode();
 await page.getByTestId('canvas-node').filter({hasText:'mode: Rules'}).locator(`[data-test-id=canvas-node-output-handle][data-index="${index}"]`).getByTestId('canvas-handle-plus-wrapper').click();
 await page.getByPlaceholder('Search nodes...').fill('Microsoft Outlook');await page.getByTestId('node-creator-item-name').filter({hasText:/^Microsoft Outlook$/}).click();
 await page.getByText(approval?'Send message and wait for response':'Send a message',{exact:true}).click();
 await page.getByTestId('parameter-input-toRecipients').waitFor();
}
if(step==='22')await capture(page,module,shots[21]);
if(step==='repair-prompt'){
 await closeNode();await page.getByTestId('canvas-node').filter({hasText:'Check the quotation'}).dblclick();await stable(page);await expression('text',prompts[0]);await closeNode();
 await page.getByTestId('canvas-node').filter({hasText:'Check the quotation'}).dblclick();await stable(page);console.log('Prompt visible last lines:',(await page.getByTestId('parameter-input-text').locator('.cm-line').allTextContents()).slice(-2));await capture(page,module,shots[11]);await closeNode();await page.keyboard.press('Control+s');
}
if(step==='23'){await email('Ask for approval','[AIW TRAINING] Approve: {{ $json.supplier }}');await capture(page,module,shots[22],{mask:[page.getByTestId('parameter-input-toRecipients')]});}
if(step==='24'){await addEmail(3);await email('Ask Finance Director','[AIW TRAINING] Finance Director approval: {{ $json.supplier }}');await capture(page,module,shots[23],{mask:[page.getByTestId('parameter-input-toRecipients')]});}
if(step==='25-add'){await addEmail(Number(process.argv[3]),false);console.log(JSON.stringify(await page.locator('[data-test-id^="parameter-input-"]').evaluateAll(es=>es.filter(e=>e.offsetWidth).map(e=>({test:e.getAttribute('data-test-id'),text:e.innerText.slice(0,100)})))));}
if(step==='25-revise')await email('Report revise','[AIW TRAINING] Revise: {{ $json.supplier }}',false);
if(step==='25-reject'){await email('Report reject','[AIW TRAINING] Reject: {{ $json.supplier }}',false);await capture(page,module,shots[24],{mask:[page.getByTestId('parameter-input-toRecipients')]});await closeNode();await page.keyboard.press('Control+s');}
if(step==='repair-emails'){
 await closeNode();
 for(const [name,subject,approval,index] of [['Ask for approval','Approve',true,22],['Ask Finance Director','Finance Director approval',true,23],['Report revise','Revise',false,-1],['Report reject','Reject',false,24]]){
  await page.getByTestId('canvas-node').filter({hasText:name}).dblclick();await email(name,`[AIW TRAINING] ${subject}: {{ $json.supplier }}`,approval);
  console.log(name,'subject saved:',(await page.getByTestId('parameter-input-subject').innerText()).includes('[AIW TRAINING]'),'message saved:',(await page.getByTestId(`parameter-input-${approval?'message':'bodyContent'}`).innerText()).includes('Quotation from'));
  if(index>=0)await capture(page,module,shots[index],{mask:[page.getByTestId('parameter-input-toRecipients')]});await closeNode();
 }
 await page.keyboard.press('Control+s');
}
if(step==='26'){
 await closeNode();await page.keyboard.press('Control+s');
 await page.getByTestId('canvas-node').filter({hasText:'Upload quotation'}).dblclick();
 const url=(await page.locator('body').innerText()).match(/https:\/\/[^\s]+\/form-test\/[^\s]+/)[0];remember('10-form',url);
 await closeNode();await page.getByRole('button',{name:'Execute workflow',exact:true}).last().click();
 await page.waitForTimeout(1000);
 const form=context.pages().find(p=>p.url().includes('/form-test/'))||await context.newPage();if(!form.url().includes('/form-test/'))await form.goto(url);
 await form.getByText('Sinar Maju: check a quotation',{exact:true}).waitFor();await capture(form,module,shots[25]);
}
if(step==='27-submit'){
 const form=context.pages().find(p=>p.url().includes('/form-test/'));if(!form)throw Error('Test form missing');
 await form.locator('input[type=file]').setInputFiles(`${root}/${module}/sample-files/${process.argv[3]}`);await form.getByLabel('RFQ number').fill('RFQ-2026-131');
 await form.getByRole('button',{name:'Submit',exact:true}).click();console.log('Submitted',process.argv[3]);
}
if(step==='27-status')console.log((await page.locator('body').innerText()).slice(-2200));
if(step==='27-open'){
 await page.getByTestId('radio-button-workflow').click();await page.getByRole('button',{name:'Execute workflow',exact:true}).last().waitFor();
 await page.reload({waitUntil:'domcontentloaded'});await page.waitForTimeout(6000);await stable(page);await page.getByRole('button',{name:'Execute workflow',exact:true}).last().waitFor();
 await page.getByRole('button',{name:'Execute workflow',exact:true}).last().click();
 await page.getByText('Waiting for trigger event',{exact:true}).waitFor();
 const form=context.pages().find(p=>p.url().includes('/form-test/'))||await context.newPage();await form.goto(state['10-form']);await form.getByLabel('RFQ number').waitFor();
}
if(step==='27-capture'){const form=context.pages().find(p=>p.url().includes('/form-test/'));await capture(form,module,shots[26]);}
if(step==='28'||step==='29'){
 await closeNode();await page.getByTestId('radio-button-executions').click();await page.getByText('Auto refresh',{exact:true}).waitFor();
 if(process.argv[3])await page.getByRole('link',{name:new RegExp(process.argv[3])}).click();await stable(page);await page.getByRole('button',{name:'Zoom to Fit',exact:true}).click();await capture(page,module,shots[step==='28'?27:28]);
}
if(step==='repair-route'){
 for(const [index,value,name] of [[1,'pass','Approve'],[2,'revise','Revise'],[3,'reject','Reject'],[4,'escalate','Escalate']]){
  const header=page.getByRole('button',{name:`Routing Rule ${index}`,exact:true});const panel=page.locator('div._collapsiblePanel_1u59p_276').filter({has:header});
  if(!await panel.getByTestId('filter-condition-left').isVisible())await header.press('Enter');await panel.getByTestId('filter-condition-left').waitFor();
  const left=panel.getByTestId('filter-condition-left');if(!await left.locator('[contenteditable=true]').count())await left.getByText('Expression',{exact:true}).press('Space');
  const editor=left.locator('[contenteditable=true]');await editor.click();await page.keyboard.press('Control+a');await page.keyboard.insertText('{{ $json.verdict }}');await page.getByText('Parameters',{exact:true}).click();
  const right=panel.getByPlaceholder('value2',{exact:true});await right.fill(value);await right.press('Tab');await stable(page);await header.press('Enter');
 }
 await closeNode();await page.keyboard.press('Control+s');await page.reload();await page.getByTestId('canvas-node').filter({hasText:'mode: Rules'}).dblclick();await stable(page);
 for(let index=1;index<=4;index++){
  const header=page.getByRole('button',{name:`Routing Rule ${index}`,exact:true});const panel=page.locator('div._collapsiblePanel_1u59p_276').filter({has:header});if(!await panel.getByPlaceholder('value2',{exact:true}).isVisible())await header.press('Enter');await panel.getByPlaceholder('value2',{exact:true}).waitFor();console.log('Rule',index,'left:',await panel.locator('.cm-line').allTextContents(),'right:',await panel.getByPlaceholder('value2',{exact:true}).inputValue());
 }
 await capture(page,module,shots[19]);await closeNode();
}
if(step==='12') {
 await expression('text',prompts[0]);await closeNode();await page.getByTestId('canvas-node').filter({hasText:'Check the quotation'}).dblclick();
 await capture(page,module,shots[11]);
 console.log(await page.getByTestId('parameter-input-hasOutputParser').locator('*').evaluateAll(es=>es.map(e=>({tag:e.tagName,role:e.getAttribute('role'),label:e.getAttribute('aria-label'),type:e.getAttribute('type')})).filter(x=>x.role||x.type)));
}
if(step==='13') {
 await page.locator('[contenteditable=true]').fill(prompts[1]); await page.getByTestId('node-title-container').click(); await page.keyboard.press('Escape');
 await capture(page,module,shots[12]);
}
if(step==='14-start') {
 await page.getByTestId('ndv-close-button').click(); await page.getByTestId('canvas-node').filter({hasText:'Check the quotation'}).dblclick();
 await page.getByTestId('node-execute-button').click(); console.log('AI test started');
}
if(step==='14-status') { console.log((await page.locator('body').innerText()).slice(-4200)); }
if(step==='14-capture') {
 await page.getByTestId('ndv-close-button').click(); await page.getByTestId('canvas-node').filter({hasText:'Check the quotation'}).dblclick();
 await page.getByTestId('output-panel').getByText('pass',{exact:true}).waitFor(); await capture(page,module,shots[13]);
}
if(step==='15-open') {
 const close=page.getByTestId('ndv-close-button'); if(await close.isVisible()) await close.click();
 await page.getByTestId('canvas-node').filter({hasText:'Check the quotation'}).locator('[data-connection-type=main]').getByTestId('canvas-handle-plus-wrapper').click();
 await page.getByPlaceholder('Search nodes...').fill('Code'); console.log((await page.locator('body').innerText()).slice(-1800));
}
if(step==='16') {await page.getByText('Run Once for Each Item',{exact:true}).click(); await capture(page,module,shots[15]);}
if(step==='17') {await page.locator('[contenteditable=true]').fill(prompts[2]); await page.locator('[contenteditable=true]').press('Control+End'); await capture(page,module,shots[16]);}
if(step==='18') {await page.getByTestId('node-execute-button').click(); await page.getByTestId('output-panel').getByText('on_avl',{exact:true}).waitFor(); await capture(page,module,shots[17]); console.log(await page.getByTestId('output-panel').innerText());}
if(step==='20') {
 for(const [index,value,name] of [[1,'pass','Approve'],[2,'revise','Revise'],[3,'reject','Reject'],[4,'escalate','Escalate']]) {
  if(await page.getByRole('button',{name:`Routing Rule ${index}`,exact:true}).count()===0) await page.getByTestId('fixed-collection-add-top-level-button').press('Enter');
  const header=page.getByRole('button',{name:`Routing Rule ${index}`,exact:true});
  const panel=page.locator('div._collapsiblePanel_1u59p_276').filter({has:header});
  if(!await panel.getByTestId('filter-condition-left').isVisible()) await header.press('Enter');
  const left=panel.getByTestId('filter-condition-left');
  if(await left.locator('[contenteditable=true]').count()===0) await left.getByText('Expression',{exact:true}).press('Space');
  await left.locator('[contenteditable=true]').click();await page.keyboard.press('Control+a');await page.keyboard.insertText('{{ $json.verdict }}');await page.getByText('Parameters',{exact:true}).click();
  await panel.getByPlaceholder('value2',{exact:true}).fill(value);await panel.getByPlaceholder('value2',{exact:true}).press('Tab');
  const rename=panel.getByTestId('parameter-input-renameOutput').getByRole('switch');
  if(await rename.getAttribute('aria-checked')!=='true') await rename.press('Space');
  await panel.getByTestId('parameter-input-outputKey').locator('input').fill(name);await panel.getByTestId('parameter-input-outputKey').locator('input').press('Tab');await stable(page);
  if(index!==4) await header.press('Enter');
 }
 await capture(page,module,shots[19]); console.log((await page.locator('body').innerText()).slice(-1100));
}
if(step==='21') {await page.getByTestId('node-execute-button').click();await page.getByTestId('output-panel').getByText('supplier',{exact:true}).waitFor(); await capture(page,module,shots[20]);console.log(await page.getByTestId('output-panel').innerText());}
if(step==='02') {
 const close=page.getByTestId('close-chat-button'); if(await close.isVisible()) await close.click();
 await page.getByTestId('workflow-menu').click(); await page.getByText('Import',{exact:true}).click(); await capture(page,module,shots[1]);
 console.log((await page.locator('body').innerText()).slice(-1800));
}
if(step==='03') {
 await page.locator('input[type=file]').setInputFiles(`${root}/${module}/sample-files/quotation-approval-starter.json`);
 await page.getByText('Upload quotation',{exact:true}).first().waitFor();
 await capture(page,module,shots[2]);
 remember('10-workflow',page.url());
}
if(step==='04') {await page.getByText('Upload quotation',{exact:true}).first().waitFor(); await page.getByRole('button',{name:'Zoom to Fit',exact:true}).click(); await capture(page,module,shots[3]);}
if(step==='05') { await page.keyboard.press('Escape'); await page.getByTestId('workflow-menu').click(); await page.getByText('Rename',{exact:true}).click(); await page.getByTestId('inline-edit-input').fill('AIW Quotation approval'); await page.getByTestId('inline-edit-input').press('Enter'); await page.keyboard.press('Control+s'); await stable(page); remember('10-workflow',page.url()); await capture(page,module,shots[4]); console.log((await page.locator('body').innerText()).slice(0,400)); }
if(step==='06') {await page.keyboard.press('Escape'); await page.getByTestId('canvas-node').filter({hasText:'Upload quotation'}).dblclick(); await stable(page); console.log((await page.locator('body').innerText()).slice(-4000)); console.log(await page.locator('button').evaluateAll(es=>es.filter(e=>e.offsetWidth).map(e=>({text:e.innerText,label:e.getAttribute('aria-label'),test:e.getAttribute('data-test-id')}))));}
if(step==='06-form') {
 const url=(await page.locator('body').innerText()).match(/https:\/\/[^\s]+\/form-test\/[^\s]+/)[0]; remember('10-form',url);
 await page.getByTestId('node-execute-button').click();
 await page.waitForTimeout(1500);
 const form=context.pages().find(p=>p.url().includes('/form-test/'))||await context.newPage(); if(!form.url().includes('/form-test/')) await form.goto(url);
 await form.getByText('Sinar Maju: check a quotation',{exact:true}).waitFor();
 await capture(form,module,shots[5]); console.log((await form.locator('body').innerText()));
}
if(step==='07') {
 const form=context.pages().find(p=>p.url().includes('/form-test/')); if(!form) throw Error('Test form missing');
 await form.locator('input[type=file]').setInputFiles(`${root}/${module}/sample-files/quotation-alat-tulis-cendana.pdf`);
 await form.getByLabel('RFQ number').fill('RFQ-2026-131');
 await form.getByRole('button',{name:'Submit',exact:true}).click(); await stable(form);
 await capture(form,module,shots[6]); console.log((await form.locator('body').innerText()));
}
if(step==='08-open'||step==='09-open') {
 const close=page.getByTestId('ndv-close-button'); if(await close.isVisible()) await close.click();
 await page.getByTestId('canvas-node').filter({hasText:step==='08-open'?'Read the PDF text':'Policy limits'}).dblclick();
 await stable(page); console.log((await page.locator('body').innerText()).slice(-5000));
}
if(step==='08-test'||step==='09-test') {
 await page.getByTestId('node-execute-button').click(); await page.waitForTimeout(2000); await stable(page);
 console.log((await page.locator('body').innerText()).slice(-4500));
 await capture(page,module,shots[step==='08-test'?7:8]);
}
if(step==='10-open') {
 await page.getByTestId('canvas-node').filter({hasText:'Policy limits'}).getByTestId('canvas-handle-plus-wrapper').click();
 console.log((await page.locator('body').innerText()).slice(-1300)); console.log(await page.locator('input').evaluateAll(es=>es.filter(e=>e.offsetWidth).map(e=>({placeholder:e.placeholder,test:e.getAttribute('data-test-id')}))));
}
if(step==='01') await capture(page,module,shots[0]);
if(step==='inspect') console.log(await page.locator('button,a').evaluateAll(es=>es.map(e=>({tag:e.tagName,text:e.innerText,label:e.getAttribute('aria-label'),test:e.getAttribute('data-test-id')}))));
await browser.close();




