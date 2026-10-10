# 14 - Product Card: Microsoft 365 Copilot

How to do this course's labs in Microsoft 365 Copilot, with or without the paid license. Use it alongside each module's **Product Notes** table.

> **Note:** checked in October 2026. Copilot changes often, so a button may have moved. If something here doesn't match your screen, tell your trainer.

---

## Which Copilot Do You Have?

Open the **Microsoft 365 Copilot** app ([m365.cloud.microsoft](https://m365.cloud.microsoft)) with your work account. The label under your name at the bottom left tells you which Copilot you have.

| Label | Who has it | What matters for this course |
|---|---|---|
| **Copilot Chat (Basic)** | Organisations with more than 2,000 users, without the paid license | Chat, file upload, Notebooks, Pages and simple agents. No Copilot inside Word, Excel or PowerPoint |
| **M365 Copilot (Basic)** | Smaller organisations, without the paid license | As above, plus standard access to Copilot in Word, Excel and PowerPoint |
| **M365 Copilot (Premium)** | People with the paid Microsoft 365 Copilot license | Everything above, plus your work data, Researcher, Analyst, and full Copilot in the Office apps |

---

## Before Class: Check the Shield

Look for the green shield at the top right of the chat. Hover over it: it should say **Enterprise data protection applies to this chat**. With the shield, your prompts and files are protected under your organisation's Microsoft agreement and aren't used to train the models.

> **Stop:** if you don't see the shield, you may be signed in with a personal Microsoft account. Sign out and sign in with your work account before you upload anything.

---

## Module by Module

| Module | What you do | Basic | Premium |
|---|---|---|---|
| 01 | Compare two model types | Switch models at the top of the chat | Same |
| 02 | Prompt chain with Markdown output | Any chat | Same |
| 03 | Build the Quotation Checker | **Agent Builder**: instructions only, so upload the policy in each chat | Agent Builder, with the policy as agent knowledge |
| 04 | Grounded research with citations | A **Notebook** with the policy files | Same, or Researcher |
| 05 | Analyse the purchase history | Upload the spreadsheet in a chat | **Analyst**, or Copilot in Excel |
| 06 | Memo and deck from templates | Draft in chat or a Page, then paste into the template | Copilot in Word and PowerPoint, from the template |
| 07 | Score the Checker | Run each test quotation with your agent | Same |
| 08 | Connectors and MCP | Look at what your agents can reach | Copilot connectors and Copilot Studio (admin-managed) |
| 09 | Diagnose a wrong citation | A Notebook with both policy versions | Same |

---

## Pick a Model (Module 01)

1. Start a new chat.
2. At the top of the chat, open the model menu. It shows **Auto** (decides how long to think) by default.
3. Choose **Quick response** (answers right away) for the fast model, or **Think deeper** (thinks longer for better answers) for the reasoning model.

The menu may also list other models, such as GPT (OpenAI). You don't need them for this course.

<!-- VERIFY: the options in the model menu on Premium. Basic confirmed in the Module 01 capture, October 2026. -->

---

## Upload Files

Click **+** in the message box and choose your files.

> **If you don't see this:** Copilot takes at most three files per message. For labs with more files, send the policy first in its own message, then the quotations.

---

## Build a Custom Assistant (Modules 03, 07, 10)

1. In the left pane, select **Agents**, then **New agent**.
2. Select **Skip** to go straight to the form.
3. Name it `Quotation Checker` and paste the Checker instructions from the Module 03 prompts page into **Instructions**.
4. Add one or two **Suggested prompts**, such as "Check this quotation".
5. Select **Create**, then test it.

The **Instructions** box shows a counter, up to 8,000 characters. To change the instructions later (Modules 07 and 11), open the agent's editor, select the pencil (**Edit instructions**) next to **Instructions**, make the change and select **Update**.

On **Basic**, agents can use instructions and public websites only, so upload the policy and vendor list in each chat with the agent. On **Premium**, you can also add files or SharePoint as the agent's knowledge.

> **If you don't see this:** your admin may have turned off Agent Builder. Paste the instructions at the start of a normal chat instead.

---

## Ground Answers in Your Files (Modules 04 and 09)

1. In the left pane, select **Notebooks**, then create a new notebook.
2. Select **Add references**, then **Upload files**, and add the policy and the vendor list.
3. Ask your question, and ask for the clause number with every answer.
4. Open the PDF and check the clause says what Copilot claims.

On **Premium**, **Researcher** can also search your organisation's files and the web, with sources.

---

## Analyse a Spreadsheet (Module 05)

- **Basic:** upload `purchase-history.xlsx` in a chat and ask your question. Ask Copilot to show its calculation, and check one figure yourself in Excel.
- **Premium:** use **Analyst**, which runs code on your data, or open the file in Excel and use Copilot there.

> **If you don't see this:** Analyst and Researcher may appear in the left pane on a Basic account, but they need the paid license.

---

## Word and PowerPoint (Module 06)

- **Basic:** draft the memo in chat, select **Edit in Pages**, and export it with **More actions** > **Export** > **Document**. Then copy the text into `sinar-maju-memo.docx`.
- **Premium:** open `sinar-maju-memo.docx` in Word and use Copilot there. In PowerPoint, Copilot can create a deck from a file or template. It follows a template best when the layouts have clear names, which is the difference between `sinar-maju-deck.pptx` and `sinar-maju-deck-bad.pptx`.

> **Caution:** in PowerPoint, creating a presentation from a file can replace the open presentation. Work on a copy.

<!-- VERIFY: the PowerPoint option name for creating a deck from a file or template, on M365 Copilot (Basic) and Premium. -->

---

## Connectors and MCP (Module 08)

Copilot reaches other systems through **Copilot connectors** and through agents built in **Copilot Studio**, which can use MCP servers. Your IT admin sets these up, not you. Module 08 is a mapping exercise, so you don't need to connect anything.
