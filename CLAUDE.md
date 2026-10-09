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
- **Extra tools:** NotebookLM (Google account) and n8n (trial account).

---

## Where things stand

Update this section in the same pull request as the work it describes.

- **Initial scaffold:** 13 module folders in the chapter skeleton (Day line, objectives, topics, lab heading and Product Notes table, all placeholders), stub prompts pages and empty `images/` folders; `14-product-cards/` index; root README in the convention order; Jekyll site files with the kit's lightbox, page-nav, expect-box and side-window snippets; `_design/` with the program flow banner and screenshot checker; `book/` with config and introduction.
- **Program flow and book config are drafts:** the stage names, card descriptions and outputs were written from the lab names. Change them in `_design/program-flow.html` and `programFlow` in `book/book.config.json` together. The book uses the `copilot` palette for now.
- **Sample data generator added:** chair RFQ-2026-118 with three seeded quotations (Modules 01 and 03), procurement policy v3.0 and the superseded v2.1 (Modules 04 and 09), approved vendor list, five open RFQs with ten test quotations (Module 07: 4 pass, 6 fail), and 354 rows of purchase history (Module 05). Modules 10 and 13 have no files yet.
- **What should you see? boxes added:** 10 boxes in Modules 01, 03, 04, 05, 06, 07 and 09 (1, 2, 1, 3, 1, 1 and 1). The lab steps aren't written yet, so each box sits at the end of its lab section; move it under the step it checks when the steps are written.
- **Module 06 templates added:** the good deck (8 named layouts, theme fonts and colours, real titles, native table and chart), the bad deck (same look, built on blank slides), and the approval memo (Word styles and placeholders, one page). Module 06 has one What should you see? box, from the chair answer key.
- **Not started:** module notes and prompts, product cards, Module 10 and 13 files, screenshot capture plan (`_design/screenshot-prompt.md`, `_design/shots/`), trainer deck.
- **Repository is private** until the materials are ready.
