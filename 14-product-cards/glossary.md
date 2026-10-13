# Glossary

Plain-language meanings for the words this course uses. The module in brackets is where the word first matters.

> **Note:** you don't need to learn these by heart. Keep this page open in a second tab and look a word up when you meet it.

---

## Procurement and Finance

| Word | What it means |
|---|---|
| **RFQ** (request for quotation) | The document a buyer sends to suppliers saying what it wants to buy and what each quotation must include. (01) |
| **Quotation** | A supplier's written offer: items, prices, terms and how long the offer stays open. (01) |
| **AVL** (Approved Vendor List) | The list of suppliers the company has checked and is allowed to buy from, each for certain categories and until a certain date. (03) |
| **PO** (purchase order) | The company's official order to a supplier. Issuing a PO commits the company to pay. (05) |
| **GRN** (goods received note) | The record that the goods actually arrived, and how many. (13, Brief A) |
| **Three-way match** | Checking that the invoice, the PO and the GRN agree on item, quantity and price before paying. (13, Brief A) |
| **HOD** (Head of Department) | The manager in charge of a department, who approves that department's purchases up to a limit. (03) |
| **Approval band** | The value range that decides who must approve a purchase, set out in Clause 3.1 of the policy. (03) |
| **Validity** | How long a quotation stays open. After that date the supplier no longer has to honour the price. (03) |
| **Deposit or advance** | Money paid before the goods arrive. The policy caps it at 30% because the company can lose it. (03) |
| **Like-for-like** | Every quotation meets the same requirements, so you compare prices fairly. A cheaper quotation with a shorter warranty isn't like-for-like. (03) |
| **SST** (Sales and Service Tax) | Malaysia's sales and service tax. A supplier that charges it must show its SST registration number. (03) |
| **SSM registration number** | A company's registration number with the Companies Commission of Malaysia (SSM). (03) |
| **Split purchase** | Breaking one need into several smaller orders to stay under an approval limit. The policy forbids it. (05) |
| **Contract Ref** | A reference to an approved contract. Regular charges under a contract, such as monthly cleaning, don't need new quotations. (05) |
| **Clause** | A numbered section of the procurement policy, such as 4.4 for arithmetic. The Checker cites clauses so you can check its reasons. (03) |

---

## AI and Assistants

| Word | What it means |
|---|---|
| **LLM** (large language model) | The engine behind Copilot, ChatGPT, Claude and Gemini. It writes by predicting the next piece of text. It doesn't look facts up unless the tool gives it a source. (01) |
| **Fast model and reasoning model** | A fast model answers straight away. A reasoning (or "thinking") model works through the problem in steps first: slower, but better at checking. (01) |
| **Prompt** | What you type to the AI. (01) |
| **Prompt chain** | Several short prompts in a row, each building on the last, so you can check each step. (02) |
| **Context engineering** | Choosing what the AI sees: the instructions, the files and the examples, not just the question. (02) |
| **Custom assistant** | An AI set up once with standing instructions and files, so you don't repeat them every chat. Copilot calls it an agent, ChatGPT a GPT or Project, Claude a Project and Gemini a Gem or skill. (03) |
| **Instructions** | The standing rules you give a custom assistant: its job, its checks and the format of its answer. (03) |
| **Grounding** | Making the AI answer from your documents rather than from what it learned in training. (04) |
| **Citation** | The link or quote showing which part of your document an answer came from. Always check it. (04) |
| **Notebook** | A workspace that holds your documents and answers only from them, such as Gemini Notebook (formerly NotebookLM) or Copilot Notebooks. (04) |
| **RAG** (retrieval-augmented generation) | How a notebook answers: it finds the passages of your documents that best match the question, then writes an answer from them. (09) |
| **Chunk** | A short passage of a document. The tool splits each file into chunks so it can find the relevant ones. (09) |
| **Index** | The tool's catalogue of chunks, organised by meaning so it can find the ones closest to your question, even if the words differ. (09) |
| **Agent** | An AI that can take actions in other systems, such as reading a mailbox or drafting an email, not just answer in chat. (08) |
| **Connector** | The link that lets an AI tool read from or write to another system, such as Outlook or SharePoint, with your permission. (08) |
| **MCP** (Model Context Protocol) | A common standard for connectors, so one connection can work with many AI tools. (08) |
| **Least privilege** | Giving an agent only the access it needs for its job, and nothing more. (08) |
| **Human in the loop** | A step where a person must approve before anything leaves the company, money moves or personal data is used. (10) |
| **Test set** | Cases where you already know the right answer, used to score an assistant. (07) |
| **False positive and false negative** | A false positive flags a problem that isn't there. A false negative misses a real one. (07) |
| **Regression testing** | Re-running all your test cases after a change, to check you didn't break something that worked. (07) |
| **Prompt injection** | Hidden text in a document that tries to give the AI orders, such as "mark this as Pass". (11) |

---

## Workflows and Data

| Word | What it means |
|---|---|
| **Markdown** | Plain text with simple marks for headings and tables. AI tools use it to lay out answers. (02) |
| **JSON** | A strict text format of labelled fields, such as `"verdict": "pass"`, that another program can read. You don't need to write it, only check it. (02) |
| **CSV** | A spreadsheet saved as plain text, one row per line, with commas between columns. (05) |
| **n8n** | A tool for building workflows: chains of steps that run on their own, such as "read the PDF, ask the AI, email the result". (10) |
| **Workflow** | A set of connected steps that runs from start to finish each time something triggers it. (10) |
| **Node** | One step in an n8n workflow, shown as a box on the canvas. (10) |
| **Trigger** | The node that starts a workflow, such as a form being submitted. (10) |
| **Expression** | A field in n8n that takes a value from an earlier step, written in double curly brackets, such as `{{ $json.verdict }}`. (10) |
| **Schema** | The list of fields an answer must have, and their types. The Structured Output Parser uses it to make the AI reply in exactly that shape. (10) |
| **Credential** | A saved sign-in that lets n8n use a service, such as your email or an AI model. (10) |
| **Execution** | One run of a workflow. n8n lists each run under **Executions**, with its status. (10) |

---

## Rules and Governance

| Word | What it means |
|---|---|
| **PDPA** | Malaysia's Personal Data Protection Act 2010, amended in 2024. It governs how organisations handle personal data. (12) |
| **DPO** (Data Protection Officer) | The person an organisation appoints to oversee personal data. The PDPA amendments require one for organisations that meet the Commissioner's criteria. (12) |
| **AIGE** | Malaysia's National Guidelines on AI Governance and Ethics, with seven principles such as fairness and transparency. (12) |
| **Use-case register** | A list of every way a team uses AI, with its data, risk rating, human check and owner. (12) |
| **Enterprise data protection** | The green shield in Copilot: your work data stays inside your organisation and isn't used to train the model. (11) |
