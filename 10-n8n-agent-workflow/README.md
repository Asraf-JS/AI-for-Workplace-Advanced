# 10 - Building an AI Agent Workflow in n8n

_One short paragraph on where this module sits in the course, to be added._

> **Prompts:** every prompt you need is in the steps, with a Copy button. The [prompts page](./prompts.md) has them all on one page too.

**Day:** 2

**Estimated time:** _TBA_

**Your result:** _To be added_

---

## What You Will Learn

_To be added_

---

## Before You Begin

_To be added_

---

## Topics

_To be added_

---

## 10.1 Lab: Quotation approval workflow with human approval

_Steps to be added._

<!-- Move each box below to sit after the step it checks once the steps are written. Figures come from the answer keys in _trainer/: if a figure changes, rebuild the sample files and update these boxes in the same pull request. -->

<!-- VERIFY: import quotation-approval-starter.json into an n8n trial account (Workflows > Import from File). Check the three nodes connect, the form shows a PDF upload field, and Read the PDF text finds the file (binary field Quotation_PDF). Built against n8n's source in October 2026, not tested in n8n itself. -->

<details markdown="1">
<summary>Show the answers</summary>

Each quotation should take a different route through your workflow:

| Quotation | Route | Clause | Why |
|---|---|---|---|
| Alat Tulis Cendana | Send for approval | 3.1 | Meets the RFQ and the policy. RM39,852.00, so the HOD and the Head of Procurement approve |
| Kodbar Nusa | Ask for a revised quotation | 4.4 | Subtotal printed as RM36,800.00; the lines add up to RM36,080.00. Correct total RM38,966.40, not RM39,744.00 |
| Hancur Rapi Supplies | Reject and start supplier registration | 5.1 | Not on the Approved Vendor List, though it's the cheapest |
| Imbas Teraju | Escalate to the Finance Director | 6.2 | Asks for a 40% deposit; the limit is 30% |

Nothing should reach a supplier, or be approved, until a person clicks Approve in the Send and Wait step.

</details>

---

## Product Notes

| Copilot Chat (Basic) | M365 Copilot (Premium) | ChatGPT | Claude | Gemini |
|---|---|---|---|---|
| _TBA_ | _TBA_ | _TBA_ | _TBA_ | _TBA_ |

---

## Independent Practice

_To be added_

---

## Troubleshooting

| Symptom | What to check |
|---|---|
| _TBA_ | _TBA_ |

---

## Lesson Summary

_To be added_
