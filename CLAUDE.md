# AI for Workplace (Advanced)

Participant site for a two-day advanced course that follows AI for Workplace (Beginner). Trainer: Asraf Jaafar Sidik (independent MCT, Malaysia). Published with GitHub Pages at asraf-js.github.io/AI-for-Workplace-Advanced once the repository is public.

## Read this first

The shared rules for all of Asraf's courses (writing style, repository layout, chapter and prompts skeletons, screenshots, book, git) are in `COURSE-CONVENTIONS.md` in **Asraf-JS/training-book-kit**. Read it before you write or change anything. This file only covers what is specific to this course, and wins where the two differ.

---

## What's different in this course

- **Tool-neutral.** Every lab is a task that works in Microsoft 365 Copilot (Copilot Chat (Basic) and M365 Copilot (Premium)), ChatGPT, Claude and Gemini. Each module README has a **Product Notes** table with one column per tool. Longer how-to guidance per tool goes in `14-product-cards/` (`copilot.md`, `chatgpt.md`, `claude.md`, `gemini.md`).
- **Two days, one layout.** Module folders are `NN-module-name/` at the root, as in the reference layout. The day shows in each module's **Day:** line, the root Modules table and the sidebar's Day 1 and Day 2 sections. `14-product-cards/` sits under Reference, like Extra Practice in the other courses.
- **Scenario company:** Sinar Maju Sdn Bhd (fictional). Participants build one Procurement Quotation Checker on Day 1 and keep improving it, then rebuild it as an n8n workflow with human approval on Day 2.
- **Sample data** is all synthetic and must never be replaced with real company data. Its source and generator script go in `_design/sample-files/`; generated files go to each module's `sample-files/` plus a zip; answer keys go to `_trainer/`.
- **Templates** for Module 06 live in `06-output-templates/sample-files/`: `sinar-maju-deck.pptx` (well-built), `sinar-maju-deck-bad.pptx` (teaching contrast), `sinar-maju-memo.docx`.
- **Extra tools:** NotebookLM (Google account) and n8n (trial account).

---

## Where things stand

Update this section in the same pull request as the work it describes.

- **Initial scaffold:** 13 module folders in the chapter skeleton (Day line, objectives, topics, lab heading and Product Notes table, all placeholders), stub prompts pages and empty `images/` folders; `14-product-cards/` index; root README in the convention order; Jekyll site files with the kit's lightbox, page-nav, expect-box and side-window snippets; `_design/` with the program flow banner and screenshot checker; `book/` with config and introduction.
- **Program flow and book config are drafts:** the stage names, card descriptions and outputs were written from the lab names. Change them in `_design/program-flow.html` and `programFlow` in `book/book.config.json` together. The book uses the `copilot` palette for now.
- **Not started:** module notes and prompts, product cards, sample data and its generator, Module 06 templates, screenshot capture plan (`_design/screenshot-prompt.md`, `_design/shots/`), trainer deck.
- **Repository is private** until the materials are ready.
