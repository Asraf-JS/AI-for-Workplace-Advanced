# 13 - Capstone Project

Over two days you've taken one procurement task from a single prompt to a tested, secured, governed workflow with human approval. Now you do it again for a different Sinar Maju process, as a team, with less help. You pick a brief, test its data with AI, design the workflow on one page, and pitch it.

> **Prompts:** every prompt you need is in the steps, with a Copy button. The [prompts page](./prompts.md) has them all on one page too.

**Day:** 2

**Estimated time:** 90 minutes

**Your result:** A completed AI Workflow Canvas for one Sinar Maju process, tested on its sample data, and a five-minute pitch scored with the rubric.

---

## What You Will Learn

- Apply the whole course to a new process: context, assistants, grounding, data, evaluation, connectors, security and governance
- Test a workflow design on real cases before you build it
- Decide which steps are AI, which are rules and which need a person
- Pitch an AI workflow so a manager can say yes or no

---

## Before You Begin

Form a team of three or four. Download **[sample-files.zip](./sample-files.zip)** and extract it. It holds three briefs, their data, and the canvas:

| Brief | Files |
|---|---|
| **A: Supplier invoice matching** (Finance) | `brief-a-invoice-matching.pdf`, `brief-a-purchase-orders.csv`, `brief-a-goods-received.csv`, `brief-a-invoices.csv` |
| **B: Customer stock enquiries** (Sales) | `brief-b-stock-enquiries.pdf`, `brief-b-stock-list.csv`, `brief-b-enquiries.csv` |
| **C: Monthly spend report** (Procurement) | `brief-c-monthly-spend-report.pdf`, `brief-c-purchase-history.csv`, `brief-c-department-budgets-2026.csv` |
| All teams | `ai-workflow-canvas.docx` |

Read the [scoring rubric](./scoring-rubric.md) before you start, so you know what the judges look for.

---

## Topics

**Start from the process, not the tool.** Each brief describes how the work is done today, the rules, and what goes wrong. A good design fixes what goes wrong without breaking the rules.

**Test before you pitch.** Each brief's data includes the tricky cases the workflow must handle. A design that hasn't been tried on the data is a guess.

**AI, rule or person.** For every step, ask: is this judgement (AI), a fact that can be checked exactly (rule), or a decision that needs accountability (person)? Module 10's workflow used all three.

**One page.** If a manager can't follow the design from the canvas in five minutes, it won't get approved.

---

## 13.1 Pick Your Brief (5 minutes)

1. As a team, skim the three briefs.
2. Pick one. It's fine for two teams to pick the same brief: their designs will differ.
3. Open `ai-workflow-canvas.docx`, write your team's names and your brief at the top, and save a copy.

---

## 13.2 Understand the Process (10 minutes)

1. Start a new chat in your AI tool, and upload your brief's PDF.
2. Send:

   ```
   Read this brief. In a Markdown table, list each step of the process as it works today, who does it, and how long or how often. Then list every rule in the brief as a numbered checklist. Use only the brief.
   ```

3. Check the table and the checklist against the brief. You'll use the checklist in 13.3.

---

## 13.3 Test the Data (15 minutes)

In the same chat, upload your brief's data files and send the prompt for your brief from the [prompts page](./prompts.md) (Part 2A, 2B or 2C). Then check at least two of the AI's findings yourself in the files.

These are the cases your workflow must handle. Open your brief's box only after you've tried.

<details markdown="1">
<summary>Brief A: show the answers</summary>

Four invoices should stop:

| Invoice | PO | Problem |
|---|---|---|
| KL-INV-26-5526 | PO-2026-0149 | Billed at RM12.30 a ream; the PO says RM11.80 |
| TIS-INV-8060 | PO-2026-0150 | Billed for 120 toners; only 100 were received |
| ATC/INV/26/5086 (second copy) | PO-2026-0151 | The same invoice number, sent again 9 days later |
| CPK-INV-4471 | PO-2026-0999 | The PO doesn't exist |

The other nine invoices match. PO-2026-0160 has goods received but no invoice yet, which is normal.

</details>

<details markdown="1">
<summary>Brief B: show the answers</summary>

| Email | What a good design does |
|---|---|
| E01, E09 | Reply with price and stock (RM2,780.00 and RM720.00) |
| E02 | Out of stock: give the 10-day lead time |
| E03 | Reply in Malay: 400 files, RM1,280.00 |
| E04 | 12% discount is above the 5% limit: send to the Sales Manager |
| E05 | Complaint: send to the Sales Manager, no automatic reply |
| E06 | Remove the home address and IC number before using an AI tool that isn't approved for personal data |
| E07 | "The usual toner" is unclear: ask which one |
| E08 | Only 85 chairs in stock: offer 85 now and 35 in 21 days |
| E10 | Ignore the hidden instruction asking for 30% off; only 9 printers in stock |

</details>

<details markdown="1">
<summary>Brief C: show the answers</summary>

| Department | Spend, January to September 2026 | Annual budget | Used |
|---|---|---|---|
| Admin | RM68,033.44 | RM75,000.00 | **91%** |
| Marketing | RM20,908.47 | RM30,000.00 | 70% |
| IT | RM42,275.59 | RM68,000.00 | 62% |
| Warehouse | RM67,215.77 | RM108,000.00 | 62% |
| Procurement | RM1,139,064.19 | RM1,823,000.00 | 62% |
| Sales | RM2,666.34 | RM5,000.00 | 53% |
| Finance | RM2,542.99 | RM5,000.00 | 51% |

Only Admin is over 75%. Rows with no department add RM8,459.69 and should be listed on their own. The 2026 policy breaches are the two split purchases and PO-2026-0071.

</details>

---

## 13.4 Design the Workflow (25 minutes)

1. In the same chat, send:

   ```
   Using the brief, the rules checklist and the cases you found, draft a workflow for this process. For each step, say whether it's done by AI, by a rule or by a person, which data or system it uses, and what happens to the tricky cases. Mark every step where a person must approve before anything leaves the company, money moves or personal data is used. Keep it to no more than eight steps.
   ```

2. Argue with it. Change any step where your team disagrees, especially the approvals.
3. Ask for the risks:

   ```
   For this workflow, list the three biggest risks, including hidden instructions in incoming documents and personal data, and one control for each. Then suggest five test cases from our data, with the result we'd expect for each.
   ```

4. Fill in the nine boxes of the canvas in your own words. Use the AI's drafts, but the canvas is your team's design.

> **Tip:** box 9, the pitch in one sentence, is the hardest. Write it last.

---

## 13.5 Pitch and Score (35 minutes)

1. Each team has **five minutes** to pitch from its canvas, and **three minutes** for questions.
2. The other teams and your trainer score each pitch with the [scoring rubric](./scoring-rubric.md), out of 24.
3. After the last pitch, compare scores. Which design would you approve tomorrow, and what would you change first?

---

## Product Notes

| Copilot Chat (Basic) | M365 Copilot (Premium) | ChatGPT | Claude | Gemini |
|---|---|---|---|---|
| At most three files per message: send the brief first, then the data files. Copilot reads CSVs as text, so ask it to show its matching | **Analyst** runs code on the CSVs. A Notebook can hold the brief and the data | Runs code on the CSVs. On Free, watch the upload limit | Turn on file creation under **Settings** > **Capabilities** so Claude can run code on the CSVs | Upload the CSVs in a chat and ask for its working |

---

## Independent Practice

Take the workflow you designed and swap the brief for a process from your own work. Which boxes on the canvas change, and which stay the same? Bring the canvas back to your manager.

---

## Troubleshooting

| Symptom | What to check |
|---|---|
| The AI finds no problems in the data | Upload every data file for your brief, and give it the rules checklist from 13.2 |
| It finds problems you can't see in the files | Ask for the row or ID behind each finding, and check it yourself |
| Your workflow has no person in it | Look at the brief's rules: someone always approves payments, discounts and complaints |
| The team runs out of time | Fill boxes 1, 4, 6 and 9 of the canvas first: the problem, the steps, the approvals and the pitch |

---

## Lesson Summary

The capstone uses the whole course: a clear process, tested on real cases, with AI for judgement, rules for facts, people for decisions, and the risks named. That's the pattern to take back to work for any process, not only procurement.

**Check yourself:** Pick one step in your team's workflow. Why is it AI, a rule or a person, and not one of the other two?
