# Shot list: 03 - Building Custom AI Assistants

**Capture in:** Copilot app, Agent Builder (the M365 Copilot (Basic) training account).

**Set up first:** All six files from `03-custom-assistants/sample-files`.

**During capture:** Create a new agent with Agents > New agent > Skip, named `Quotation Checker`, and keep it: Modules 07 and 11 reuse it. If an agent named `Quotation Checker` already exists before 3.1, stop and ask. Copilot Basic agents can't hold files, so upload the policy and the vendor list first in every chat with the agent and wait for Ready. For 03-07, scroll to the Arithmetic row of the report; for 03-12, scroll to what must happen before a purchase order.

Capture each shot right after its step: for a step that sends a prompt, when the answer is complete, scrolled so the start of the answer shows.

| File | Section | Step | Blur after capture? |
|---|---|---|---|
| `03-01-open-ai-tool-create.png` | 3.1 Create the Assistant | A new agent in Copilot's Agent Builder, with the name New Agent and the empty Instructions box highlighted |  |
| `03-02-name-quotation-checker.png` | 3.1 Create the Assistant | The agent named Quotation Checker, with the name and the Describe your agent line highlighted |  |
| `03-03-paste-these-instructions-into.png` | 3.1 Create the Assistant | The Checker instructions pasted into the Instructions box, with the 2,074/8,000 character counter |  |
| `03-04-save-assistant.png` | 3.1 Create the Assistant | The message Your agent was created successfully, with Start chat highlighted |  |
| `03-05-start-new-chat-quotation.png` | 3.3 Check One Quotation at a Time | The policy and vendor list sent to the Quotation Checker, which replies Ready. Send the RFQ and the quotation. | Yes |
| `03-06-upload-rfq-2026-118.png` | 3.3 Check One Quotation at a Time | The Checker's report table for the Duduk Selesa quotation, with its findings blurred | Yes |
| `03-07-read-report-arithmetic-row.png` | 3.3 Check One Quotation at a Time | The Arithmetic row of the Duduk Selesa report highlighted, with the findings blurred | Yes |
| `03-08-repeat-steps-1-3.png` | 3.3 Check One Quotation at a Time | The Ergoluma check in its own new chat, highlighted in the chat list, with the findings blurred | Yes |
| `03-09-start-new-chat-assistant.png` | 3.4 Compare the Three | The policy, vendor list and RFQ sent first, then the three quotations attached in the message box | Yes |
| `03-10-send.png` | 3.4 Compare the Three | The side-by-side comparison with one column per supplier, the figures blurred | Yes |
| `03-11-same-chat-send.png` | 3.5 Recommend a Supplier | The Checker's Recommendation Summary heading, with the recommendation and the table blurred | Yes |
| `03-12-before-accept-recommendation-check.png` | 3.5 Recommend a Supplier | The What must happen before PO can be issued column highlighted, with the recommendation blurred | Yes |

## Check while you're there

- the instruction length limit in Claude and ChatGPT Projects, and Gemini skills, October 2026. Copilot Agent Builder shows 8,000, confirmed in the Module 03 capture.
