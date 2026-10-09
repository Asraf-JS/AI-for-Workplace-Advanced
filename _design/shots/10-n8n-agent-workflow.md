# Shot list: 10 - Building an AI Agent Workflow in n8n

**Capture in:** n8n (the trial account Asraf signs in to by hand), and Outlook on the web for the approval emails.

**Set up first:** The files from `10-n8n-agent-workflow/sample-files`. An AI credential in n8n set up by Asraf beforehand.

**During capture:** Name the workflow `AIW Quotation approval`. Emails go only to the signed-in Outlook account, subject starting `[AIW TRAINING]`. Click Approve only on emails sent by this workflow. Capture 10.7 with the four quotations in the README's order.

Capture each shot right after its step: for a step that sends a prompt, when the answer is complete, scrolled so the start of the answer shows.

| File | Section | Step | Blur after capture? |
|---|---|---|---|
| `10-01-sign-n8n-details-from.png` | 10.1 Import the Starter Workflow | Step 10.1.1: Sign in to n8n with the details from your trainer |  |
| `10-02-create-new-workflow-open.png` | 10.1 Import the Starter Workflow | Step 10.1.2: Create a new workflow. Open the ... menu at the top right and choose Import from File |  |
| `10-03-select-quotation-approval-starter.png` | 10.1 Import the Starter Workflow | Step 10.1.3: Select quotation-approval-starter.json |  |
| `10-04-ll-see-three-connected.png` | 10.1 Import the Starter Workflow | Step 10.1.4: You'll see three connected nodes (Upload quotation, Read the PDF text, Policy limits) and four sticky notes describing the steps you'll build |  |
| `10-05-save-workflow.png` | 10.1 Import the Starter Workflow | Step 10.1.5: Save the workflow |  |
| `10-06-double-click-upload-quotation.png` | 10.2 Test the First Three Nodes | Step 10.2.1: Double-click Upload quotation and select Test step (or open the test form URL). A form opens in your browser |  |
| `10-07-upload-quotation-alat-tulis.png` | 10.2 Test the First Three Nodes | Step 10.2.2: Upload quotation-alat-tulis-cendana.pdf, type RFQ-2026-131, and submit |  |
| `10-08-back-n8n-open-read.png` | 10.2 Test the First Three Nodes | Step 10.2.3: Back in n8n, open Read the PDF text. Its output should show a field called text with the quotation's words |  |
| `10-09-open-policy-limits-its.png` | 10.2 Test the First Three Nodes | Step 10.2.4: Open Policy limits. Its output should show the same text, plus fields such as max_advance_percent and finance_director_above_rm |  |
| `10-10-select-after-policy-limits.png` | 10.3 Add the AI Check | Step 10.3.1: Select + after Policy limits and add a Basic LLM Chain node. Name it Check the quotation |  |
| `10-11-under-model-add-chat.png` | 10.3 Add the AI Check | Step 10.3.2: Under Model, add a chat model (for example OpenAI Chat Model) and choose the credential your trainer gave you |  |
| `10-12-set-prompt-source-define.png` | 10.3 Add the AI Check | Step 10.3.3: Set the prompt source to define it yourself, and paste the Part 1 prompt from the prompts page. It's your Checker instructions, adapted to read the... |  |
| `10-13-turn-require-specific-output.png` | 10.3 Add the AI Check | Step 10.3.4: Turn on Require Specific Output Format. Add a Structured Output Parser, choose to generate it from a JSON example, and paste the Part 2 example fro... |  |
| `10-14-select-test-step-output.png` | 10.3 Add the AI Check | Step 10.3.5: Select Test step. The output should have an output object with supplier, correct_total, problems and verdict |  |
| `10-15-add-code-node-after.png` | 10.4 Check the Supplier with a Rule | Step 10.4.1: Add a Code node after Check the quotation. Name it Check the vendor list |  |
| `10-16-set-mode-run-once.png` | 10.4 Check the Supplier with a Rule | Step 10.4.2: Set the mode to Run Once for Each Item and the language to JavaScript |  |
| `10-17-replace-code-part-3.png` | 10.4 Check the Supplier with a Rule | Step 10.4.3: Replace the code with the Part 3 code from the prompts page. It holds the names from approved-vendors.csv, and it changes the verdict to reject if... |  |
| `10-18-select-test-step-check.png` | 10.4 Check the Supplier with a Rule | Step 10.4.4: Select Test step and check the output has on_avl: true for Alat Tulis Cendana |  |
| `10-19-add-switch-node-after.png` | 10.5 Route by Verdict | Step 10.5.1: Add a Switch node after Check the vendor list. Name it Route |  |
| `10-20-add-four-rules-checking.png` | 10.5 Route by Verdict | Step 10.5.2: Add four rules, each checking the value {{ $json.verdict }} |  |
| `10-21-select-test-step-alat.png` | 10.5 Route by Verdict | Step 10.5.3: Select Test step. Alat Tulis Cendana should come out of Approve |  |
| `10-22-approve-output-add-gmail.png` | 10.6 Ask a Person to Approve | Step 10.6.1: On the Approve output, add a Gmail (or Microsoft Outlook) node with the Send and Wait for Response operation. Connect your email account |  |
| `10-23-fill.png` | 10.6 Ask a Person to Approve | Step 10.6.2: Fill it in |  |
| `10-24-do-same-escalate-output.png` | 10.6 Ask a Person to Approve | Step 10.6.3: Do the same on the Escalate output, with the subject AIW TRAINING Finance Director approval: the supplier |  |
| `10-25-revise-reject-outputs-add.png` | 10.6 Ask a Person to Approve | Step 10.6.4: On the Revise and Reject outputs, add a plain Send email to yourself saying what happened. (At work, Revise would draft an email to the supplier, a... |  |
| `10-26-save-workflow-open-form.png` | 10.7 Run All Four Quotations | Step 10.7.1: Save the workflow. Open the form again (Upload quotation > Test step) | Yes |
| `10-27-upload-four-quotations-turn.png` | 10.7 Run All Four Quotations | Step 10.7.2: Upload each of the four quotations in turn, submitting the form once for each | Yes |
| `10-28-after-check-inbox-open.png` | 10.7 Run All Four Quotations | Step 10.7.3: After each one, check your inbox, and open the workflow's Executions to see which route it took | Yes |
| `10-29-approval-emails-click-approve.png` | 10.7 Run All Four Quotations | Step 10.7.4: For the approval emails, click Approve and watch the waiting execution finish | Yes |

## Check while you're there

- import quotation-approval-starter.json into an n8n trial account (Workflows > Import from File). Check the three nodes connect, the form shows a PDF upload field, and Read the PDF text finds the file (binary field Quotation_PDF). Built against n8n's source in October 2026, not tested in n8n itself.
- Basic LLM Chain option labels (prompt source, Require Specific Output Format), the Structured Output Parser's "generate from JSON example" option, and whether n8n trial accounts include free AI credits or need a key from the trainer, October 2026.
- that Send and Wait for Response is available in the Gmail and Microsoft Outlook nodes on n8n Cloud, and the label of the Approval response type.
