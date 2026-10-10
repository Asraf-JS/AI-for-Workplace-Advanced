import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {attach,openSite,newChat,send,capture,stable,remember,state,root,note} from './run-helpers.mjs';
const module='03-custom-assistants', key='03-retake-';
const prompts=[...readFileSync(resolve(root,module,'prompts.md'),'utf8').replaceAll('\r','').matchAll(/```\n([\s\S]*?)\n```/g)].map(m=>m[1]);
const phase=process.argv[2];
const {browser,page}=phase.startsWith('builder-')&&phase!=='builder-start'
  ? await openSite(state[key+'builder'],state[key+'builder']) : await attach();
const shot=name=>capture(page,module,name,{mask:[page.getByRole('button',{name:/^Asraf\s+Jaafar Sidik$/})]});
async function position(target){
  await target.scrollIntoViewIfNeeded();
  await target.evaluate(e=>{e.scrollIntoView({block:'start'});for(let p=e.parentElement;p;p=p.parentElement){if(/auto|scroll/.test(getComputedStyle(p).overflowY)&&p.scrollHeight>p.clientHeight){p.scrollTop=Math.max(0,p.scrollTop-90);break;}}});
  await stable(page);
  const box=await target.boundingBox();
  if(!box||box.y<45||box.y>500)throw Error('Capture target is not positioned visibly near the top');
}
async function upload(files){
  await page.getByRole('button',{name:'Add and manage sources',exact:true}).click();
  await page.locator('input[type=file]').setInputFiles(files.map(f=>resolve(root,module,'sample-files',f)));
  await page.keyboard.press('Escape');
  for(const f of files)await page.getByText(f,{exact:true}).first().waitFor();
  await stable(page);
}
async function rename(topic,id){
  const conversation=page.url().match(/conversation\/([^/?]+)/)?.[1];
  if(!conversation)throw Error('Conversation URL missing');
  const row=page.locator(`.fai-CopilotNavSubItem[href*="${conversation}"]`).locator('..');
  await row.hover();await row.getByRole('button',{name:'More',exact:true}).click();
  await page.getByRole('menuitem',{name:'Rename',exact:true}).click();
  await page.getByRole('textbox',{name:'Chat name',exact:true}).fill('AIW 03 - '+topic);
  await page.getByRole('button',{name:'Save',exact:true}).click();
  await stable(page);remember(key+id,page.url());
}
async function fresh(topic,id,includeRFQ=false){
  await page.goto(state[key+'agent'],{waitUntil:'domcontentloaded'});
  await page.getByRole('textbox',{name:'Message Quotation Checker',exact:true}).waitFor({timeout:60000});
  await upload(['procurement-policy-v3.0.pdf','approved-vendor-list.pdf',...(includeRFQ?['rfq-2026-118.pdf']:[])]);
  await send(page,'');await rename(topic,id);
  const answer=await page.locator('.fai-CopilotMessage').last().innerText();
  if(!answer.includes('Ready. Send the RFQ and the quotation.'))note(module,'retake '+id+' setup','reply Ready and wait when no quotation has arrived',answer.replace(/^Quotation Checker said:\s*/,'').slice(0,250));
}
async function result(name,id){
  const answer=page.locator('.fai-CopilotMessage').last();
  await position(answer);
  if(name)await shot(name);
  writeFileSync(resolve(root,'../'+key+id+'.txt'),await answer.textContent());
}
try{
  switch(phase){
    case 'builder-start':
      await page.getByRole('button',{name:'Agents',exact:true}).click();
      if(await page.getByText('Quotation Checker',{exact:true}).count())throw Error('Quotation Checker already exists; stop before creating');
      await page.getByRole('button',{name:/^New agent/}).click();
      await page.getByRole('button',{name:'Skip',exact:true}).click();
      await page.getByRole('textbox',{name:'Enter agent name',exact:true}).waitFor();
      remember(key+'builder',page.url());
      await shot('03-01-open-ai-tool-create.png');
      await page.getByRole('textbox',{name:'Enter agent name',exact:true}).fill('Quotation Checker');
      await shot('03-02-name-quotation-checker.png');
      console.log('Instruction inputs:',await page.locator('textarea').evaluateAll(es=>es.map(e=>({placeholder:e.getAttribute('placeholder'),label:e.getAttribute('aria-label')}))));
      break;
    case 'builder-create':{
      await page.getByRole('textbox',{name:'Describe your agent',exact:true}).fill("Checks supplier quotations against Sinar Maju's Procurement Policy, Approved Vendor List and RFQ.");
      note(module,'retake 3.1.4','name the agent, paste instructions and save','Agent Builder also requires a description before Create is enabled; added a description of the course quotation-checking task');
      const field=page.getByPlaceholder('Describe what this agent should do, define its tone, and outline any rules or guidelines it must follow',{exact:true});
      await field.fill(prompts[0]);
      if(await field.inputValue()!==prompts[0])throw Error('Instructions truncated');
      await field.evaluate(e=>{e.scrollTop=0;});
      await position(field);
      const counter=(await page.locator('body').innerText()).match(/[\d,]+\s*\/\s*8,000/);
      console.log('Instruction counter:',counter?.[0]||'not found');
      await shot('03-03-paste-these-instructions-into.png');
      await page.getByRole('button',{name:'Create',exact:true}).click();
      await page.getByRole('button',{name:'Start chat',exact:true,includeHidden:true}).waitFor({state:'visible',timeout:120000});
      await stable(page);
      await shot('03-04-save-assistant.png');
      await page.getByRole('button',{name:'Start chat',exact:true,includeHidden:true}).click();
      await page.getByRole('textbox',{name:'Message Quotation Checker',exact:true}).waitFor({timeout:60000});
      remember(key+'agent',page.url());
      break;
    }
    case 'duduk-start':
      await fresh('Duduk Selesa retake','duduk');
      await result('03-05-start-new-chat-quotation.png','policy');
      break;
    case 'duduk-check':
      await newChat(page,key+'duduk');
      await upload(['rfq-2026-118.pdf','quotation-duduk-selesa.pdf']);
      await send(page,prompts[1]);
      await result('03-06-upload-rfq-2026-118.png','duduk');
      break;
    case 'duduk-review':
      await newChat(page,key+'duduk');
      console.log('Independent check: 120 x 365 =',120*365,'; correct grand total =',((120*365+300)*1.08).toFixed(2));
      await position(page.locator('.fai-CopilotMessage').last().getByRole('cell',{name:'Arithmetic',exact:true}));
      await shot('03-07-read-report-arithmetic-row.png');
      break;
    case 'other-checks':
      for(const [supplier,id,file]of[['Kerusi Nadira','nadira','quotation-kerusi-nadira.pdf'],['Ergoluma','ergoluma','quotation-ergoluma.pdf']]){
        await fresh(supplier+' retake',id);
        await upload(['rfq-2026-118.pdf',file]);await send(page,prompts[1]);
        await result(id==='ergoluma'?'03-08-repeat-steps-1-3.png':null,id);
        console.log('CHECK_COMPLETE',supplier);
      }
      break;
    case 'comparison-start':
      await fresh('Three quotation comparison retake','comparison',true);
      await upload(['quotation-duduk-selesa.pdf','quotation-kerusi-nadira.pdf','quotation-ergoluma.pdf']);
      await result('03-09-start-new-chat-assistant.png','comparison-ready');
      break;
    case 'comparison-send':
      if(page.url()!==state[key+'comparison'])throw Error('Prepared comparison chat must stay open to retain queued files');
      await send(page,prompts[3]);await result('03-10-send.png','comparison');
      break;
    case 'recommendation':
      await newChat(page,key+'comparison');await send(page,prompts[4]);
      await result('03-11-same-chat-send.png','recommendation');
      console.log('Recommendation headings:',await page.locator('.fai-CopilotMessage').last().getByRole('heading').allTextContents());
      break;
    case 'recommendation-review':
      await newChat(page,key+'comparison');
      console.log('Manual check: correct Duduk total RM47,628.00; Nadira warranty 3/1 years against RFQ 5; Ergoluma deposit 50% against policy limit 30%; ordinary approval HOD and Head of Procurement.');
      await position(page.locator('.fai-CopilotMessage').last().getByRole('columnheader',{name:'What must happen before PO can be issued',exact:true}));
      await shot('03-12-before-accept-recommendation-check.png');
      note(module,'retake other-tools instruction-length check','check instruction limits in Claude, ChatGPT Projects and Gemini skills','this retake uses Copilot only; those tools were not opened, so their limits remain unverified');
      break;
    default:throw Error('Unknown phase');
  }
}catch(e){console.error(e.message.split('\n')[0]);process.exitCode=1;}finally{await browser.close();}
