# Shot list: 10 - Building an AI Agent Workflow in n8n

**Capture in:** n8n (the trial account Asraf signs in to by hand), and Outlook on the web for the approval emails.

**Set up first:** The files from `10-n8n-agent-workflow/sample-files`. An AI credential in n8n set up by Asraf beforehand.

**During capture:** Name the workflow `AIW Quotation approval`. Emails go only to the signed-in Outlook account, subject starting `[AIW TRAINING]`. Click Approve only on emails sent by this workflow. Capture 10.7 with the four quotations in the README's order.

Capture each shot right after its step: for a step that sends a prompt, when the answer is complete, scrolled so the start of the answer shows.

| File | Section | Step | Blur after capture? |
|---|---|---|---|
| `10-01-sign-n8n-details-from.png` | 10.1 Import the Starter Workflow | n8n Overview page after signing in, with Run live demo, Build an agent and Build a workflow |  |
| `10-02-create-new-workflow-open.png` | 10.1 Import the Starter Workflow | A new workflow with the ... menu open next to its name and Import highlighted |  |
| `10-03-select-quotation-approval-starter.png` | 10.1 Import the Starter Workflow | The imported workflow named Quotation approval (starter) on the canvas |  |
| `10-04-ll-see-three-connected.png` | 10.1 Import the Starter Workflow | The starter's three connected nodes and four sticky notes, Step 1 to Step 4 |  |
| `10-05-save-workflow.png` | 10.1 Import the Starter Workflow | The workflow saved as AIW Quotation approval |  |
| `10-06-double-click-upload-quotation.png` | 10.2 Test the First Three Nodes | The test form Sinar Maju: check a quotation, with Quotation PDF and RFQ number fields |  |
| `10-07-upload-quotation-alat-tulis.png` | 10.2 Test the First Three Nodes | Form Submitted, Your response has been recorded |  |
| `10-08-back-n8n-open-read.png` | 10.2 Test the First Three Nodes | Read the PDF text node with Input Binary Field set to Quotation_PDF and its output fields |  |
| `10-09-open-policy-limits-its.png` | 10.2 Test the First Three Nodes | Policy limits node listing fields such as one_quotation_below_rm and max_advance_percent |  |
| `10-10-select-after-policy-limits.png` | 10.3 Add the AI Check | A new Basic LLM Chain node named Check the quotation, with its default settings |  |
| `10-11-under-model-add-chat.png` | 10.3 Add the AI Check | OpenAI Chat Model node using Gateway credits with $2.00 left and the gpt-5-mini model |  |
| `10-12-set-prompt-source-define.png` | 10.3 Add the AI Check | Check the quotation with Source for Prompt set to Define below and the Part 1 prompt pasted in |  |
| `10-13-turn-require-specific-output.png` | 10.3 Add the AI Check | Structured Output Parser with Schema Type Generate From JSON Example and the Part 2 example |  |
| `10-14-select-test-step-output.png` | 10.3 Add the AI Check | Check the quotation output with supplier, correct_total, problems and verdict for Alat Tulis Cendana |  |
| `10-15-add-code-node-after.png` | 10.4 Check the Supplier with a Rule | A new Code node named Check the vendor list with its sample code |  |
| `10-16-set-mode-run-once.png` | 10.4 Check the Supplier with a Rule | Code node with Mode Run Once for Each Item and Language JavaScript |  |
| `10-17-replace-code-part-3.png` | 10.4 Check the Supplier with a Rule | The Part 3 code in the Code node, ending with the rule that changes the verdict to reject |  |
| `10-18-select-test-step-check.png` | 10.4 Check the Supplier with a Rule | Check the vendor list output with on_avl true |  |
| `10-19-add-switch-node-after.png` | 10.5 Route by Verdict | A new Switch node named Route with one empty routing rule |  |
| `10-20-add-four-rules-checking.png` | 10.5 Route by Verdict | Route's routing rules checking $json.verdict, with outputs renamed Approve, Revise and Reject |  |
| `10-21-select-test-step-alat.png` | 10.5 Route by Verdict | Route output with tabs Approve (1 item), Revise, Reject and Escalate |  |
| `10-22-approve-output-add-gmail.png` | 10.6 Ask a Person to Approve | Microsoft Outlook node with Operation Send and Wait for Response and Response Type Approval |  |
| `10-23-fill.png` | 10.6 Ask a Person to Approve | Ask for approval node with the AIW TRAINING Approve subject, the Part 4 message and Response Type Approval |  |
| `10-24-do-same-escalate-output.png` | 10.6 Ask a Person to Approve | Ask Finance Director node with the subject AIW TRAINING Finance Director approval |  |
| `10-25-revise-reject-outputs-add.png` | 10.6 Ask a Person to Approve | Report reject node with Operation Send and the AIW TRAINING Reject subject |  |
| `10-26-save-workflow-open-form.png` | 10.7 Run All Four Quotations | The test form opened again to upload the next quotation | Yes |
| `10-27-upload-four-quotations-turn.png` | 10.7 Run All Four Quotations | Form Submitted after uploading a quotation | Yes |
| `10-28-after-check-inbox-open.png` | 10.7 Run All Four Quotations | The workflow's Executions tab with a list of succeeded runs and the selected run's path on the canvas | Yes |
| `10-29-approval-emails-click-approve.png` | 10.7 Run All Four Quotations | An execution marked Waiting in the Executions list, ID 13 | Yes |

## Check while you're there

- in the capture run, the Approve links in the Cendana emails (executions 7 and 13) opened blank pages and the executions stayed Waiting. Click Approve by hand on a trial and check the execution finishes as Succeeded, and what the page after clicking shows.
