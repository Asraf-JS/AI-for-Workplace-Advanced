# 14 - Product Card: Claude

How to do this course's labs in Claude. Use it alongside each module's **Product Notes** table.

> **Note:** checked in October 2026. Claude changes often, so a button may have moved. If something here doesn't match your screen, tell your trainer.

---

## Which Plan Do You Have?

Click your name at the bottom left. Your plan shows next to it.

| Plan | Who has it | What matters for this course |
|---|---|---|
| Free | Anyone with an account | Works for most labs, with lower usage limits. Up to 5 Projects |
| Pro, Max | Personal paid plans | Higher limits, more models, and the Claude for Word, Excel and PowerPoint add-ins |
| Team, Enterprise | A company workspace | Your admin controls settings such as file creation and connectors |

---

## Before Class: Check Your Data Setting

On Free, Pro and Max, you choose whether your chats can be used to train Claude.

1. Click your name, then **Settings**.
2. Select **Privacy**.
3. Turn off the setting that lets your chats help improve Claude's models.

<!-- VERIFY: the exact label of the model training switch under Settings > Privacy. -->

> **Important:** even with that setting off, use only the course's fictional files. Don't upload real company documents to a personal plan.

On Team and Enterprise, chats aren't used for training.

---

## Module by Module

| Module | What you do | In Claude |
|---|---|---|
| 01 | Compare two model types | Switch models, or turn extended thinking on and off |
| 02 | Prompt chain with Markdown output | Any chat |
| 03 | Build the Quotation Checker | A **Project** with instructions and knowledge files |
| 04 | Grounded research with citations | A Project with the policy files, or use Gemini Notebook for this lab |
| 05 | Analyse the purchase history | Upload the spreadsheet; Claude runs the analysis |
| 06 | Memo and deck from templates | Upload the template and ask Claude to create the file |
| 07 | Score the Checker | Run each test quotation in your Project |
| 08 | Connectors and MCP | **Customize** > **Connectors** |
| 09 | Diagnose a wrong citation | A Project with both policy versions |

---

## Turn On File Creation (Do This First)

Modules 05 and 06 need Claude to run code and create files.

1. Click your name, then **Settings**.
2. Select **Capabilities**.
3. Turn on code execution and file creation.

On Team and Enterprise you won't see this switch. Your organisation's owner controls it.

<!-- VERIFY: the exact label of the switch under Settings > Capabilities. -->

---

## Pick a Model (Module 01)

1. Start a new chat.
2. Open the model menu under the message box.
3. Send the same prompt once with a fast model and once with extended thinking on (or a larger model).

<!-- VERIFY: where the model menu and the extended thinking switch sit, and which models Free can choose in October 2026. -->

---

## Upload Files

Click **+** in the message box, choose **Upload a file**, and send your prompt. You can also drag files into the chat.

---

## Build a Custom Assistant (Modules 03, 07, 10)

A **Project** keeps your instructions and files together, and every chat inside it follows the instructions. Free accounts can have up to 5 Projects.

1. In the left pane, select **Projects**, then **New project**.
2. Name it `Quotation Checker` and create it.
3. Under the project's instructions, paste the Checker instructions from the Module 03 prompts page, and save.
4. Add `procurement-policy-v3.0.pdf` and `approved-vendor-list.pdf` to the project knowledge.
5. Start a chat inside the project and upload a quotation to check it.

<!-- VERIFY: the button names for New project, project instructions and adding knowledge files. -->

---

## Ground Answers in Your Files (Modules 04 and 09)

Use a Project with only the policy files in it, and ask for the clause number and a short quote with every answer. Then open the PDF and check the quote is really there.

For Module 04, many people find **Gemini Notebook** (free with a Google account) easier, because each citation links to the exact quote. See the [Gemini card](./gemini.md).

---

## Analyse a Spreadsheet (Module 05)

1. Check that file creation is on (see above).
2. Upload `purchase-history.xlsx`.
3. Ask your question. Claude writes and runs code to work it out, and can make charts.
4. Ask it to show the calculation, so you can check it.

---

## Word and PowerPoint (Module 06)

Claude can create Word (.docx), PowerPoint (.pptx), Excel (.xlsx) and PDF files on every plan, once file creation is on.

1. Upload `sinar-maju-memo.docx` or `sinar-maju-deck.pptx`.
2. Describe what you need and ask Claude to fill the template and give you the file.
3. Download the file and open it in Word or PowerPoint.

Claude makes a new file rather than changing your original. On Pro, Max, Team and Enterprise, the **Claude for Word**, **Claude for PowerPoint** and **Claude for Excel** add-ins can also edit a document directly inside the app.

---

## Connectors and MCP (Module 08)

1. Click **Customize** in the left pane, then **Connectors**.
2. Browse the directory to see which tools Claude can connect to, and what each one can read or change.

Claude connects to MCP servers as custom connectors (**Add custom connector**). Free accounts can add one; paid plans can add more. Module 08 is a mapping exercise, so you don't need to connect anything.

> **Caution:** a custom connector isn't reviewed by Anthropic. Only add one your organisation trusts.

<!-- VERIFY: that Customize > Connectors is still the path on Free in October 2026. -->
