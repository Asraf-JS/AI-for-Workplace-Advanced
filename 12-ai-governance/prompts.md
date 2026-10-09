# 12 - AI Governance in the Malaysian Context: Prompts

Prompts for a department AI use-case register and one page of AI rules. Hover over a grey box and click the copy icon in its top-right corner.

> **Session guide:** every part runs in the **same chat**.

---

## Part 1: The use-case register

**Session:** new chat | **Grounding:** none

```
I'm building an AI use-case register for the Procurement Department of Sinar Maju Sdn Bhd, an office supplies distributor in Malaysia. These are the AI uses we've built or plan:
1. A Quotation Checker that checks supplier quotations against our procurement policy
2. A policy notebook that answers staff questions from the procurement policy
3. AI analysis of our purchase order history for the Finance Director
4. Approval memos and decks drafted from company templates
5. An n8n workflow that checks incoming quotations and asks the Head of Procurement to approve
6. Drafting replies to customer stock enquiries (Sales asked to borrow the idea)

Make a Markdown table with these columns: Use case, AI tool, Data used, Personal data? (Yes or No), Who sees the output, Human check before use, Owner. Fill in what you can from the list, and write "To confirm" where you're guessing.
```

---

## Part 2: Risk ratings

**Session:** same chat | **Grounding:** none

```
Add a Risk column (Low, Medium or High) using these rules:
- High: uses personal data, or its output is sent outside the company or commits money without a person checking it first
- Medium: uses confidential company data, or a person relies on it to make a decision
- Low: uses public or fictional data, and a person always checks the output
Give one sentence explaining each rating. Then sort the table from High to Low.
```

---

## Part 3: The department's AI rules

**Session:** same chat | **Grounding:** none

```
Now draft one page of AI rules for the Procurement Department. Use these six headings: Approved tools; Data you may use; Checking AI output; Being open about AI use; The use-case register; Reporting problems. Write in plain, direct language, with no more than four short rules under each heading. Take account of Malaysia's Personal Data Protection Act 2010 and its 2024 amendments (Data Protection Officer, breach notification), and the risk ratings in the table above. Don't invent laws or deadlines: if you're unsure, write "Check with our DPO".
```

If it quotes laws or deadlines you can't find:

```
Which of these come from the PDPA text, and which are your suggestions?
```

---

## Part 4: Check against the national principles

**Session:** same chat | **Grounding:** none

```
Map each rule to the principle it supports from Malaysia's National Guidelines on AI Governance and Ethics: fairness; reliability, safety and control; privacy and security; inclusiveness; transparency; accountability; pursuit of human benefit and happiness. Then tell me which principles none of our rules cover, and suggest one rule for each gap.
```
