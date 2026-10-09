# Shot list: 03 - Building Custom AI Assistants

**Capture in:** Copilot app, Agent Builder (the M365 Copilot (Basic) training account).

**Set up first:** All six files from `03-custom-assistants/sample-files`.

**During capture:** Create the agent `Quotation Checker` once and keep it: Modules 07 and 11 reuse it. Copilot Basic agents can't hold files, so upload the policy and the vendor list first in every chat with the agent.

Capture each shot right after its step: for a step that sends a prompt, when the answer is complete, scrolled so the start of the answer shows.

| File | Section | Step | Blur after capture? |
|---|---|---|---|
| `03-01-open-ai-tool-create.png` | 3.1 Create the Assistant | Step 3.1.1: Open your AI tool and create a new custom assistant (Project, agent, Gem or skill). The product card for your tool has the clicks |  |
| `03-02-name-quotation-checker.png` | 3.1 Create the Assistant | Step 3.1.2: Name it Quotation Checker |  |
| `03-03-paste-these-instructions-into.png` | 3.1 Create the Assistant | Step 3.1.3: Paste these instructions into the instructions box |  |
| `03-04-save-assistant.png` | 3.1 Create the Assistant | Step 3.1.4: Save the assistant |  |
| `03-05-start-new-chat-quotation.png` | 3.3 Check One Quotation at a Time | Step 3.3.1: Start a new chat with your Quotation Checker. If your assistant has no files, upload the policy and the vendor list first | Yes |
| `03-06-upload-rfq-2026-118.png` | 3.3 Check One Quotation at a Time | Step 3.3.2: Upload rfq-2026-118.pdf and quotation-duduk-selesa.pdf, then send | Yes |
| `03-07-read-report-arithmetic-row.png` | 3.3 Check One Quotation at a Time | Step 3.3.3: Read the report. For the arithmetic row, check one line yourself with a calculator | Yes |
| `03-08-repeat-steps-1-3.png` | 3.3 Check One Quotation at a Time | Step 3.3.4: Repeat steps 1 to 3 for quotation-kerusi-nadira.pdf and quotation-ergoluma.pdf, each in a new chat with the assistant | Yes |
| `03-09-start-new-chat-assistant.png` | 3.4 Compare the Three | Step 3.4.1: Start a new chat with the assistant, and upload the RFQ and all three quotations (with Copilot, send the RFQ first, then the three quotations in a s... | Yes |
| `03-10-send.png` | 3.4 Compare the Three | Step 3.4.2: Send | Yes |
| `03-11-same-chat-send.png` | 3.5 Recommend a Supplier | Step 3.5.1: In the same chat, send | Yes |
| `03-12-before-accept-recommendation-check.png` | 3.5 Recommend a Supplier | Step 3.5.2: Before you accept the recommendation, check two things yourself: the arithmetic you found in 3.3, and the warranty and payment terms against the RFQ... | Yes |

## Check while you're there

- the instruction length limit in Copilot Agent Builder, Claude and ChatGPT Projects, and Gemini skills, October 2026.
