# AI for Workplace (Advanced)

Participant site for a two-day advanced course that follows AI for Workplace (Beginner). Trainer: Asraf Jaafar Sidik (independent MCT, Malaysia). Published with GitHub Pages at asraf-js.github.io/AI-for-Workplace-Advanced once the repository is public.

## Read this first

The shared rules for all of Asraf's courses (writing style, repository layout, chapter and prompts skeletons, screenshots, book, git) are in `COURSE-CONVENTIONS.md` in **Asraf-JS/training-book-kit**. Read it before you write or change anything. This file only covers what is specific to this course, and wins where the two differ.

---

## What's different in this course

- **Tool-neutral.** Every lab is a task that works in Microsoft 365 Copilot (Copilot Chat (Basic) and M365 Copilot (Premium)), ChatGPT, Claude and Gemini. Each module README has a **Product Notes** table with one column per tool. Longer how-to guidance per tool goes in `14-product-cards/` (`copilot.md`, `chatgpt.md`, `claude.md`, `gemini.md`).
- **Two days, one layout.** Module folders are `NN-module-name/` at the root, as in the reference layout. The day shows in each module's **Day:** line, the root Modules table and the sidebar's Day 1 and Day 2 sections. `14-product-cards/` sits under Reference, like Extra Practice in the other courses.
- **Scenario company:** Sinar Maju Sdn Bhd (fictional). Participants build one Procurement Quotation Checker on Day 1 and keep improving it, then rebuild it as an n8n workflow with human approval on Day 2.
- **Sample data** is all synthetic and must never be replaced with real company data. Sinar Maju is an office supplies distributor in Petaling Jaya; the participant is a procurement executive. `_design/sample-files/build-sample-files.py` generates every sample file and answer key from one set of figures (`python3 _design/sample-files/build-sample-files.py`, deterministic). Evaluation date: 10 November 2026. Answer keys go to `_trainer/`; never commit them, and send Asraf the updated keys after a change because the container is temporary.
- **What should you see? boxes:** the expected results sit in collapsible boxes in the module notes (Asraf's decision, as in Copilot Chat Basic: full answers, one click away), using the kit's `site/expect-box.html`; the book prints them open. Their figures come from the answer keys: if a figure changes, rebuild the sample files and update the boxes in the same pull request. Module notes must not reveal a seeded problem before the module that finds it.
- **Fictional names:** every company name was web-searched before use (no match found). Do the same for any new name, and tell Asraf to confirm on SSM, which a web search can't fully see.
- **Templates** for Module 06 live in `06-output-templates/sample-files/`: `sinar-maju-deck.pptx` (well-built), `sinar-maju-deck-bad.pptx` (teaching contrast), `sinar-maju-memo.docx`. Built by `_design/templates/build-templates.cjs` (`cd _design/templates && npm install && npm run build`, deterministic). `_design/templates/README.md` lists what makes each deck good or bad; keep it current if you change either deck. The two decks must keep looking alike on screen.
- **Extra tools:** Gemini Notebook (Google renamed NotebookLM to Gemini Notebook in July 2026; say "Gemini Notebook, formerly NotebookLM" on first mention) and n8n (trial account).
- **Product cards** (`14-product-cards/`) were checked against vendor help pages in October 2026. Facts that shape the labs: personal ChatGPT plans can't create new GPTs (use Projects); Gemini personal-account Gems end in November 2026 and become skills (personal account, 18+, Keep Activity on, no PDF references); Claude Projects and file creation are on every plan (Free: 5 Projects). Unconfirmed menu names carry VERIFY comments.

---

## Where things stand

Update this section in the same pull request as the work it describes.

- **Initial scaffold:** 13 module folders in the chapter skeleton (Day line, objectives, topics, lab heading and Product Notes table, all placeholders), stub prompts pages and empty `images/` folders; `14-product-cards/` index; root README in the convention order; Jekyll site files with the kit's lightbox, page-nav, expect-box and side-window snippets; `_design/` with the program flow banner and screenshot checker; `book/` with config and introduction.
- **Program flow and book config are drafts:** the stage names, card descriptions and outputs were written from the lab names. Change them in `_design/program-flow.html` and `programFlow` in `book/book.config.json` together. The book uses the `copilot` palette for now.
- **Sample data generator added:** chair RFQ-2026-118 with three seeded quotations (Modules 01 and 03), procurement policy v3.0 and the superseded v2.1 (Modules 04 and 09), approved vendor list, five open RFQs with ten test quotations (Module 07: 4 pass, 6 fail), and 354 rows of purchase history (Module 05).
- **What should you see? boxes added:** 14 boxes in Modules 01, 03, 04, 05, 06, 07, 09, 10 and 13 (1, 2, 1, 3, 1, 1, 1, 1 and 3). The lab steps aren't written yet, so each box sits at the end of its lab section; move it under the step it checks when the steps are written.
- **Module 06 templates added:** the good deck (8 named layouts, theme fonts and colours, real titles, native table and chart), the bad deck (same look, built on blank slides), and the approval memo (Word styles and placeholders, one page). Module 06 has one What should you see? box, from the chair answer key.
- **Module 10 and 13 files added:** Module 10 has RFQ-2026-131 with four shredder quotations, one per workflow route (approve, revise, reject, escalate), the AVL and policy limits as CSV, and `quotation-approval-starter.json`, a half-built n8n workflow (form upload, PDF text, policy limits, sticky notes for the steps participants build). The starter was written against n8n's source and hasn't been imported into n8n yet: a VERIFY comment in Module 10 says what to check. Module 13 has three capstone briefs (A invoice matching, B stock enquiries, C monthly spend report) with their data, `ai-workflow-canvas.docx`, and `scoring-rubric.md` (public, out of 24). One box in Module 10, three in Module 13.
- **Product cards added:** `copilot.md`, `chatgpt.md`, `claude.md` and `gemini.md`, each with plans, a data setting to check before class, a module-by-module table and click-by-click steps. They're also in the book after Chapter 14. NotebookLM renamed to Gemini Notebook in the README.
- **Day 1 notes and prompts written (Modules 01 to 07):** full chapter skeleton, tool-neutral steps, Product Notes per tool, and the boxes moved under the steps they check. Module 04 gained a box for the question the policy doesn't answer, so there are now 10 boxes on Day 1: 1 in Module 01, 2 each in 03 and 04, 3 in 05, and 1 each in 06 and 07. Times: 40, 50, 70, 55, 55, 60 and 45 minutes (6 h 15 min). The Quotation Checker instructions in Module 03 are reused in Modules 07, 10 and 11: change them there and check those modules. They deliberately leave out a rule about instructions hidden in documents, which participants add in Module 11.
- **Not started:** Day 2 module notes and prompts (Modules 08 to 13), screenshot capture plan (`_design/screenshot-prompt.md`, `_design/shots/`), trainer deck.
- **Repository is private** until the materials are ready.
