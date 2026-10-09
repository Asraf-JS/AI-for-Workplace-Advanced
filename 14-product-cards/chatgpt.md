# 14 - Product Card: ChatGPT

How to do this course's labs in ChatGPT. Use it alongside each module's **Product Notes** table.

> **Note:** checked in October 2026. ChatGPT changes often, so a button may have moved. If something here doesn't match your screen, tell your trainer.

---

## Which Plan Do You Have?

Click your name or picture at the bottom left. Your plan shows in the menu.

| Plan | Who has it | What matters for this course |
|---|---|---|
| Free | Anyone with an account | Works for most labs, with tight daily limits on uploads and data analysis |
| Go, Plus, Pro | Personal paid plans | Higher limits. Same features as Free for most labs |
| Business, Enterprise, Edu | A company or school workspace | Your data isn't used for training by default, and you may be able to build GPTs |

<!-- VERIFY: where the plan name shows (profile menu or Settings) on Free and Plus. -->

---

## Before Class: Check Your Data Setting

On personal plans (Free, Go, Plus, Pro), ChatGPT can use your chats to train its models unless you switch that off.

1. Click your name or picture, then **Settings**.
2. Select **Data controls**.
3. Turn off **Improve the model for everyone**.

> **Important:** even with that setting off, use only the course's fictional files. Don't upload real company documents to a personal plan.

On Business, Enterprise and Edu, your chats aren't used for training by default. Your workspace admin controls the setting.

---

## Module by Module

| Module | What you do | In ChatGPT |
|---|---|---|
| 01 | Compare two model types | Switch models in the model menu |
| 02 | Prompt chain with Markdown output | Any chat |
| 03 | Build the Quotation Checker | A **Project** with instructions and files (personal plans can't build new GPTs) |
| 04 | Grounded research with citations | A Project with the policy files, or use Gemini Notebook for this lab |
| 05 | Analyse the purchase history | Upload the spreadsheet; ChatGPT runs the analysis |
| 06 | Memo and deck from templates | Upload the template and ask for a file, or use ChatGPT for Word and PowerPoint |
| 07 | Score the Checker | Run each test quotation in your Project |
| 08 | Connectors and MCP | Look at **Apps** in Settings |
| 09 | Diagnose a wrong citation | A Project with both policy versions |

---

## Pick a Model (Module 01)

1. Start a new chat.
2. Open the model menu at the top of the chat.
3. Choose a fast model for one answer, then a thinking (reasoning) model for the second.

<!-- VERIFY: the model menu's position and the names of the fast and thinking options in October 2026. -->

> **If you don't see this:** on Free, you may only have one model, or ChatGPT may switch you to a smaller one after a few messages. Compare with someone on another plan or tool instead.

---

## Upload Files

1. In the message box, click **+**.
2. Choose your file and send your prompt.

> **If you don't see this:** Free plans allow only a few uploads a day, and fewer at busy times. Upload only the files the lab needs, or put several into one Project (see below) so you don't upload them again.

<!-- VERIFY: the Free daily upload limit (help pages say "up to 3 a day, lower at peak times"). -->

---

## Build a Custom Assistant (Modules 03, 07, 10)

Personal ChatGPT plans can't create new GPTs any more, so the Quotation Checker is built as a **Project**. A Project keeps your instructions, files and chats together, and every chat inside it follows the instructions.

1. In the left pane, next to **Projects**, select **New project**.
2. Name it `Quotation Checker` and create it.
3. Open the project's **more options** menu (**...**) and choose **Project settings**.
4. Paste the Checker instructions from the Module 03 prompts page into the instructions box, and save.
5. Add the policy (`procurement-policy-v3.0.pdf`) and the vendor list (`approved-vendor-list.pdf`) as project files.
6. Start a chat inside the project and upload a quotation to check it.

> **Tip:** Free plans allow up to 5 files per project, which is enough for the policy, the vendor list and a quotation or two.

On a **Business, Enterprise or Edu** workspace you may be able to build a GPT instead, if your admin allows it.

<!-- VERIFY: the exact wording of "New project" and where Project settings sits. -->

---

## Ground Answers in Your Files (Modules 04 and 09)

Use a Project with only the policy files in it, and ask for the clause number with every answer. Then open the PDF and check the clause says what ChatGPT claims.

For Module 04, many people find **Gemini Notebook** (free with a Google account) easier, because each citation links to the exact quote. See the [Gemini card](./gemini.md).

---

## Analyse a Spreadsheet (Module 05)

1. Upload `purchase-history.xlsx`.
2. Ask your question. ChatGPT writes and runs code to work it out, and can make charts.
3. Ask it to show the calculation, so you can check it.

> **If you don't see this:** data analysis has its own limit on Free. If you hit it, use the `.csv` file, ask fewer, bigger questions, or pair up with someone on a paid plan.

---

## Word and PowerPoint (Module 06)

Two ways:

- **In the chat:** upload `sinar-maju-memo.docx` or `sinar-maju-deck.pptx`, describe what you need, and ask for a finished file to download.
- **Inside Office:** **ChatGPT for Word** and **ChatGPT for PowerPoint** add a ChatGPT pane to the app. They're on every plan, with limited use on Free.

<!-- VERIFY: that a Free and Plus chat can return a downloadable .docx and .pptx built on an uploaded template, and how the Office add-ins are installed. -->

---

## Connectors and MCP (Module 08)

Click your name, then **Settings**, then **Apps** to see the apps ChatGPT can connect to, such as Google Drive or Outlook. Adding your own MCP server needs developer mode, which is fully available only on Business, Enterprise and Edu. Module 08 is a mapping exercise, so you don't need to connect anything.

<!-- VERIFY: the Settings section name (Apps or Apps & Connectors) in October 2026. -->

