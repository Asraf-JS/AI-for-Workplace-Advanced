# 08 - AI Agents, Connectors and MCP

Day 1's Quotation Checker reads what you give it and writes a report. It can't open the procurement mailbox, look up the vendor list in the procurement system or email a supplier. An **agent** can, through **connectors**. Before you build one this afternoon, you map exactly which systems it would need, what it would do in each, and where a person must say yes.

> **Prompts:** every prompt you need is in the steps, with a Copy button. The [prompts page](./prompts.md) has them all on one page too.

**Day:** 2

**Estimated time:** 45 minutes

**Your result:** A systems map for Sinar Maju's quotation approval process: every step, the system it touches, whether an agent would read or write there, and where a person approves.

---

## What You Will Learn

- Explain the difference between an assistant and an agent
- Describe what a connector does, and what MCP (Model Context Protocol) adds
- Tell read access from write access, and why it matters
- Map a business process to the systems an agent would need
- Decide where a person must approve before an agent acts

---

## Before You Begin

No files to download. Open your AI tool, and the [product card](../14-product-cards/) for it, which shows where its connectors are.

---

## Topics

**Assistant and agent.** An assistant answers and drafts. An agent also **acts**: it can search a mailbox, update a spreadsheet or send an email, using tools you give it. The more it can do, the more carefully you decide what it may do alone.

**Connectors.** A connector links an AI tool to another system, such as Outlook, Google Drive or SharePoint, so it can read from it or write to it with your permission. Each tool calls them something different: connectors in Copilot and Claude, apps in ChatGPT, connected apps in Gemini.

**MCP.** The Model Context Protocol is a common standard for connectors. A system that offers an **MCP server** can be plugged into any AI tool that supports MCP, a bit like USB-C for AI. It describes the **tools** an AI may call (such as "search vendors" or "create draft purchase order") and the data it may read.

**Read and write.** Reading the vendor list is low risk. Creating a purchase order or emailing a supplier changes something in the real world. Give an agent the least access it needs (least privilege), and put a person between the agent and any write that matters.

---

## 8.1 Describe the Process Today

1. Start a new chat in your AI tool.
2. Send:

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

3. Check the table against the seven steps. Fix anything the AI added or changed.

---

## 8.2 Mark Read, Write and Approval

In the same chat, send:

```
Add four columns to the table: Could an agent do this? (Yes, Partly or No), Read or write?, What could go wrong if the agent got it wrong?, Must a person approve first? (Yes or No). For any step that sends something outside the company, or commits money, the answer to the last column must be Yes.
```

Now go through the table yourself and change anything you disagree with. This is where your judgement matters more than the AI's.

---

## 8.3 Name the Connectors

1. Open your AI tool's connector list (see the [product card](../14-product-cards/)) and look at what it can connect to today.
2. In the same chat, send:

   ```
   Add a last column, Connector needed. For each step, name the kind of connector the agent would need (for example "mailbox: read", "shared drive: write", "procurement system: read via MCP server"). Then list, under the table, every connector the agent would need, and whether it needs read access, write access or both.
   ```

3. Compare the list with what your tool actually offers. Which connectors exist? Which would IT have to build, for example as an MCP server for the procurement system?

<details markdown="1">
<summary>What should you see?</summary>

Your map will differ in the details. A sound one looks something like this:

| Step | Agent? | Read or write | Person approves first? | Connector |
|---|---|---|---|---|
| 1. Receive quotations | Yes | Read | No | Mailbox: read |
| 2. Save the PDF | Yes | Write (internal) | No | Shared drive: write |
| 3. Check the vendor list | Yes | Read | No | Procurement system: read |
| 4. Check against policy and RFQ | Yes (the Quotation Checker) | Read | No, but a person checks the report | None: files only |
| 5. Ask the supplier for a revision | Partly: drafts the email | Write (external) | **Yes** | Mailbox: send |
| 6. Approval memo | Partly: drafts the memo | Write (internal) | **Yes**: this *is* the approval | Mailbox or approval system |
| 7. Purchase order | Partly: drafts the PO | Write (external, commits money) | **Yes** | Procurement system: write, mailbox: send |

The pattern to look for: the agent reads freely, drafts anything, and stops for a person before anything leaves the company or commits money. That's the workflow you build in Module 10.

</details>

---

## 8.4 Spot the Riskiest Connector

With the person next to you, agree on the **one** connector in your map that would worry you most, and write one sentence on how you'd limit it (for example, "drafts only, a person presses Send").

---

## Product Notes

| Copilot Chat (Basic) | M365 Copilot (Premium) | ChatGPT | Claude | Gemini |
|---|---|---|---|---|
| Basic agents reach public websites only. Connectors to work systems need the paid license and your admin | **Copilot connectors** and agents built in **Copilot Studio**, which can use MCP servers. Your IT admin sets them up | **Settings** > **Apps**. Your own MCP servers need developer mode (full access on Business, Enterprise and Edu) | **Customize** > **Connectors**: a reviewed directory, plus custom connectors to MCP servers (one on Free) | Connected apps such as Gmail and Drive. On Workspace, your admin decides |

---

## Independent Practice

Map one process from your own work the same way: steps, systems, read or write, and where a person must approve. Which step would you never let an agent do alone?

---

## Troubleshooting

| Symptom | What to check |
|---|---|
| The AI says an agent can do every step | Ask: "Which of these steps send something outside the company or commit money? Mark them as needing a person's approval." |
| The table loses columns | Ask it to show the whole table again with all the columns |
| You can't find connectors in your tool | Your plan or your admin may not allow them. Use the product card and work from what the tool lists |

---

## Lesson Summary

An agent is an assistant with hands: connectors let it read and change other systems, and MCP is a common way to build those connectors. Map the process before you build: which systems, read or write, and where a person approves. The rule of thumb is that agents read and draft, and people approve anything that leaves the company or spends money.

**Check yourself:** Why is "read the vendor list" safe for an agent to do alone, but "email the purchase order" isn't?
