# 08 - AI Agents, Connectors and MCP: Prompts

Prompts for mapping Sinar Maju's quotation process to the systems an agent would need. Hover over a grey box and click the copy icon in its top-right corner.

> **Session guide:** every part runs in the **same chat**.

---

## Part 1: The process today

**Session:** new chat | **Grounding:** none

```
Here's how Sinar Maju's Procurement Department handles a quotation today:
1. Suppliers email quotations as PDFs to the procurement mailbox (procurement@sinarmaju.example).
2. A procurement executive saves each PDF to the RFQ's folder in the shared drive.
3. They check the supplier is on the Approved Vendor List in the procurement system.
4. They check the quotation against the Procurement Policy and the RFQ, and note problems in a comparison spreadsheet.
5. If a quotation has a problem, they email the supplier asking for a revised quotation.
6. They write an approval memo and send it to the Head of Procurement, who approves or rejects it.
7. Once approved, they create the purchase order in the procurement system and email it to the supplier.

Turn this into a Markdown table with one row per step and these columns: Step, Who does it today, System, Data used.
```

---

## Part 2: Read, write and approval

**Session:** same chat | **Grounding:** none

```
Add four columns to the table: Could an agent do this? (Yes, Partly or No), Read or write?, What could go wrong if the agent got it wrong?, Must a person approve first? (Yes or No). For any step that sends something outside the company, or commits money, the answer to the last column must be Yes.
```

---

## Part 3: Connectors

**Session:** same chat | **Grounding:** none

```
Add a last column, Connector needed. For each step, name the kind of connector the agent would need (for example "mailbox: read", "shared drive: write", "procurement system: read via MCP server"). Then list, under the table, every connector the agent would need, and whether it needs read access, write access or both.
```

If every step is marked safe for an agent alone:

```
Which of these steps send something outside the company or commit money? Mark them as needing a person's approval.
```
