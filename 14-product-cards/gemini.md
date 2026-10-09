# 14 - Product Card: Gemini

How to do this course's labs in Gemini and Gemini Notebook. Use it alongside each module's **Product Notes** table.

> **Note:** checked in October 2026. Google is changing Gemini quickly: Gems are being replaced by skills, and NotebookLM was renamed **Gemini Notebook** in July 2026. If something here doesn't match your screen, tell your trainer.

---

## Which Account Do You Have?

This matters more in Gemini than in the other tools, because the account type decides both the features and how your data is treated.

| Account | Who has it | What matters for this course |
|---|---|---|
| Personal Google account (free) | Anyone with Gmail | Most labs work. Deep Research is limited. Skills need you to be 18 or over |
| Google AI Plus, Pro or Ultra | Personal paid plans | Higher limits, including in Gemini Notebook |
| Google Workspace (work or school) | Your company or school | Licensed accounts: chats aren't reviewed by people or used for training. Gems stay until March 2027 |

To check: open [gemini.google.com](https://gemini.google.com) and look at the account picture at the top right. A work or school account shows your company's domain.

---

## Before Class: Check Your Data Setting

On a **personal** account, Gemini keeps your chats and may use them to train its models, with some chats read by human reviewers, while **Keep Activity** is on.

1. In Gemini, open **Settings and help**, then **Activity**.
2. Turn **Keep Activity** off if you don't want your chats used for training.

<!-- VERIFY: the menu path to Keep Activity in October 2026. -->

> **Important:** skills (below) only work with Keep Activity **on**. If you turn it on to use a skill, use only the course's fictional files, which you should do anyway.

On a licensed **Workspace** account, chats and uploaded files aren't reviewed by people or used to train models.

---

## Module by Module

| Module | What you do | In Gemini |
|---|---|---|
| 01 | Compare two model types | Switch models in the model menu |
| 02 | Prompt chain with Markdown output | Any chat |
| 03 | Build the Quotation Checker | A **skill** (personal accounts) or a **Gem** (Workspace, until March 2027) |
| 04 | Grounded research with citations | **Gemini Notebook** (formerly NotebookLM) |
| 05 | Analyse the purchase history | Upload the spreadsheet in a chat |
| 06 | Memo and deck from templates | Gemini in Docs and Slides (Workspace), or draft in a chat and paste into the template |
| 07 | Score the Checker | Run each test quotation with your skill or Gem |
| 08 | Connectors and MCP | Look at the apps Gemini can connect to |
| 09 | Diagnose a wrong citation | A Gemini Notebook with both policy versions |

---

## Pick a Model (Module 01)

1. Start a new chat.
2. Open the model menu (next to the message box or at the top).
3. Send the same prompt with a fast model, then with a thinking model.

<!-- VERIFY: the model menu's position and the model names on free personal accounts in October 2026. -->

---

## Upload Files

Click **+** in the message box, choose **Upload files**, and send your prompt.

---

## Build a Custom Assistant (Modules 03, 07, 10)

### Personal account: a skill

Google is replacing Gems with **skills**, and Gems on personal accounts end in November 2026. A skill is a saved set of instructions Gemini uses when it fits the task.

1. Make sure **Keep Activity** is on (see above).
2. Open **Settings and help**, then **Skills**.
3. Choose **Create manually**.
4. Name it `quotation-checker`, add a one-line description starting "Use when checking a supplier quotation", and paste the Checker instructions from the Module 03 prompts page.
5. Select **Create**.
6. In a new chat, upload the policy, the vendor list and a quotation, and ask Gemini to check the quotation.

> **If you don't see this:** skills need a personal Google account and an age of 18 or over. On a work or school account, use a Gem instead.

Skills can't hold PDF, Word or Excel files as references, only plain text. That's why you upload the policy and vendor list in the chat.

<!-- VERIFY: the path to the Skills page on the web and that PDFs can't be attached to a skill. -->

### Workspace account: a Gem

1. In the left pane, select **Gems**, then **New Gem**.
2. Name it `Quotation Checker` and paste the Checker instructions.
3. Under **Knowledge**, upload `procurement-policy-v3.0.pdf` and `approved-vendor-list.pdf`.
4. Save, then start a chat with the Gem and upload a quotation.

Gems on Workspace business accounts end in March 2027 and move to skills automatically.

---

## Ground Answers in Your Files (Modules 04 and 09)

**Gemini Notebook** (formerly NotebookLM) answers only from the sources you add, and each citation shows the exact quote it used.

1. Go to [notebooklm.google](https://notebooklm.google) and sign in.
2. Create a new notebook.
3. Add `procurement-policy-v3.0.pdf` and `approved-vendor-list.pdf` as sources.
4. Ask your question, then click a citation number to see the quote in the source.

Free accounts can add up to 50 sources to a notebook, and usage limits reset every five hours.

<!-- VERIFY: the web address and the button names for a new notebook and adding sources after the rename. -->

---

## Analyse a Spreadsheet (Module 05)

1. Upload `purchase-history.xlsx` (or the `.csv`) in a chat.
2. Ask your question, and ask Gemini to show how it worked it out.
3. Check one figure yourself in Excel or Google Sheets.

---

## Word and PowerPoint (Module 06)

- **Workspace account with Gemini:** open the memo template in Google Docs or the deck in Google Slides, and use the Gemini side panel to draft into it.
- **Personal account:** draft the memo text in a chat, then paste it into `sinar-maju-memo.docx` yourself. Gemini works best with Google's own formats, so expect to tidy the formatting.

<!-- VERIFY: whether a free personal account can export a chat or Canvas to Google Docs, and whether Gemini can return a .pptx built on an uploaded template. -->

---

## Connectors and MCP (Module 08)

On a personal account, Gemini can connect to Google apps such as Gmail and Drive. On Workspace, your admin decides which apps it can reach. Module 08 is a mapping exercise, so you don't need to connect anything.

> **Caution:** when you connect Gmail or Drive on a personal account, parts of what Gemini reads there can be used to improve Google's models. Don't connect a work mailbox to a personal account.
