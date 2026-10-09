# 06 - Controlling Output with Word and PowerPoint Templates

The Quotation Checker has done its job: Duduk Selesa is the recommended supplier, once it corrects its total. Now the Head of Procurement wants an approval memo on the company template, and a short deck for the approval meeting. In this module you get AI to fill Sinar Maju's templates, and see why a well-built template matters as much as the prompt.

> **Prompts:** every prompt you need is in the steps, with a Copy button. The [prompts page](./prompts.md) has them all on one page too.

**Day:** 1

**Estimated time:** 60 minutes

**Your result:** An approval memo on the Sinar Maju template, a four-slide approval deck, and a side-by-side comparison of what happened with the good and the bad deck template.

---

## What You Will Learn

- Explain what makes a Word or PowerPoint template work well with AI: styles, named layouts and placeholders
- Check a template's structure in Word and PowerPoint
- Get AI to fill a template without changing its look
- Spot the formatting problems AI output brings with it, and fix them

---

## Before You Begin

Download **[sample-files.zip](./sample-files.zip)** and extract it. It holds:

| File | What it is |
|---|---|
| `sinar-maju-deck.pptx` | Sinar Maju's presentation template |
| `sinar-maju-deck-bad.pptx` | Another version of the same template |
| `sinar-maju-memo.docx` | Sinar Maju's approval memo template |

You need desktop Word and PowerPoint, and the results from Module 03. If you don't have them, the prompts give you the facts.

---

## Topics

**Why templates.** A template keeps every memo and deck on-brand without anyone thinking about fonts. It also tells an AI tool where things go, if it's built properly.

**What a well-built template has.** In PowerPoint: a slide master with **named layouts**, and **placeholders** for the title and content, so a new slide knows where its title goes. In Word: **styles** (Title, Heading 1, Normal) instead of text formatted by hand, and placeholder text that's clearly meant to be replaced.

**What AI does with a badly built one.** If every slide is a blank layout with loose text boxes, there's nothing for the AI to follow. It copies what it can see, positions drift, fonts change, and the slides have no real titles, which also makes them harder to use with a screen reader.

**The finishing pass.** Even with a good template, check the output: numbers, names, line breaks in tables, and anything that spills off a slide.

---

## 6.1 Look Under the Hood of the Two Decks

1. Open `sinar-maju-deck.pptx` in PowerPoint. Select **Home** > **Layout** and look at the list of layouts.
2. Select **View** > **Outline View**. Every slide's title shows in the outline.
3. Select **Review** > **Check Accessibility**.
4. Close it and do the same three things with `sinar-maju-deck-bad.pptx`.
5. Note what's different. On screen, the two decks look almost the same.

<!-- VERIFY: the Check Accessibility command location in current PowerPoint for Windows, and that it reports missing slide titles for the bad deck. -->

---

## 6.2 Look at the Memo's Styles

1. Open `sinar-maju-memo.docx` in Word.
2. Select **View** > **Navigation Pane**. The numbered headings are there because they use the **Heading 1** style.
3. Click into the grey text in square brackets. Those are placeholders: everything the AI (or you) must replace.

---

## 6.3 Fill the Memo

1. Start a new chat in your AI tool and upload `sinar-maju-memo.docx`.
2. Copy the prompt below, replace `[your name]` with your own name, and send it. It includes the facts from Module 03, so it works even if you don't have that chat any more.

   ```
   Fill in the attached approval memo template for this purchase. Keep the template exactly as it is: the same headings, tables, styles and layout. Replace every placeholder in square brackets, and add nothing outside the template's sections.

   Facts:
   - To: Rozita binti Mohd Ariff, Head of Procurement. From: [your name], Procurement Executive. Date: 10 November 2026.
   - Purchase: 120 ergonomic mesh office chairs for resale, RFQ-2026-118.
   - Duduk Selesa Furnishings Sdn Bhd, DSF/QT/26/1043, 21 October 2026, valid until 20 December 2026. Printed total RM46,548.00, but line 1 should be RM43,800.00 (120 x RM365.00), so the correct total is RM47,628.00 (Clause 4.4). Meets the RFQ otherwise.
   - Kerusi Nadira Trading, KNT-2610-077, 22 October 2026, valid until 6 December 2026, RM43,416.00. Warranty is 3 years on the frame and 1 year on the mechanism and gas lift; the RFQ asks for 5 years on all three (Clause 4.3).
   - Ergoluma Seating Sdn Bhd, ELS/Q/2026/0388, 23 October 2026, valid until 22 November 2026, RM48,481.20. Asks for a 50% deposit; the limit is 30% (Clause 6.2).
   - Recommendation: Duduk Selesa, subject to a revised quotation at RM47,628.00.
   - Approval: RM5,000 to RM50,000 band under Clause 3.1, so the HOD and the Head of Procurement approve.

   Give me the finished memo as a Word file I can download.
   ```

3. Download the file and open it in Word. Check the Navigation Pane still shows the six headings, and that no grey placeholder text is left.

> **If you don't see this:** if your tool can't return a Word file, ask for the memo text section by section, and paste each section into the template yourself with **Paste** > **Keep Text Only**. That keeps the template's styles.

---

## 6.4 Make the Deck from the Good Template

1. Start a new chat and upload `sinar-maju-deck.pptx`.
2. Send:

   ```
   Create a four-slide approval deck using the attached template and its layouts. Keep the template's fonts, colours and footer, and don't add any of your own.
   Slide 1 (SM Title): "Approval: 120 Ergonomic Chairs for Resale", subtitle "RFQ-2026-118 recommendation", date 10 November 2026.
   Slide 2 (SM Title Only, with a table): the three quotations compared: supplier, correct total (RM), warranty, payment terms, verdict.
   Slide 3 (SM Content): the recommendation, Duduk Selesa at RM47,628.00 after a revised quotation, in up to four bullets.
   Slide 4 (SM Closing): the decision needed from the Head of Procurement, and by when.
   Remove the template's example slides. Give me the finished deck as a PowerPoint file.
   ```

3. Download it and open it in PowerPoint. Check each slide's layout (**Home** > **Layout**), the figures, and that nothing spills off a slide.

---

## 6.5 Do It Again with the Bad Template

1. Start a new chat, upload `sinar-maju-deck-bad.pptx`, and send the same prompt as in 6.4 (it still names the layouts, which this file doesn't have).
2. Open the result next to the deck from 6.4. Compare the titles, fonts, positions and the table.

<details markdown="1">
<summary>What should you see?</summary>

The memo should fill the template without changing its look: the same headings, tables and fonts, with every grey placeholder replaced.

| Field | Expected |
|---|---|
| Subject | Approval to purchase 120 ergonomic mesh office chairs for resale |
| Reference | RFQ-2026-118 |
| Quotations received | Duduk Selesa (DSF/QT/26/1043), Kerusi Nadira (KNT-2610-077), Ergoluma (ELS/Q/2026/0388) |
| Recommended supplier | Duduk Selesa, subject to a revised quotation |
| Total including tax | RM47,628.00 (the corrected figure, not the printed RM46,548.00) |
| Approval required | HOD and Head of Procurement (Clause 3.1, RM5,000 to RM50,000) |

The evaluation should name the three problems: Duduk Selesa's arithmetic (4.4), Kerusi Nadira's shorter warranty (4.3) and Ergoluma's 50% deposit (6.2).

For the deck: new slides made from `sinar-maju-deck.pptx` should use its layouts and keep its fonts and colours. Slides made from `sinar-maju-deck-bad.pptx` usually drift: titles move, fonts change, and the slides have no real titles.

</details>

> **Key point:** the prompt was the same. The difference came from the template. If your team's AI output always needs fixing, look at the template before you rewrite the prompt.

---

## Product Notes

| Copilot Chat (Basic) | M365 Copilot (Premium) | ChatGPT | Claude | Gemini |
|---|---|---|---|---|
| No Copilot in Word or PowerPoint on Copilot Chat (Basic). Draft the memo in chat or a Page and paste it into the template. M365 Copilot (Basic) has standard access in the apps | Copilot in Word fills the memo in place. In PowerPoint, create a deck from the template file; work on a copy, as it can replace the open deck | Ask for a downloadable file, or use ChatGPT for Word and PowerPoint (limited on Free) | Turn on file creation under **Settings** > **Capabilities**. Claude returns a new .docx or .pptx | Workspace: Gemini in Docs and Slides. Personal: draft in chat and paste into the template |

<!-- VERIFY: which tools return a .pptx that keeps the uploaded template's layouts, October 2026. -->

---

## Independent Practice

Open a template you use at work (or one from PowerPoint's **File** > **New**). Check its layouts and its titles with Outline View and Check Accessibility. Would an AI tool find what it needs in it?

---

## Troubleshooting

| Symptom | What to check |
|---|---|
| The memo comes back in a different font | The tool rebuilt the document instead of filling it. Paste the text into the template with **Keep Text Only** |
| Grey placeholder text is left in the memo | Ask: "List every placeholder you didn't replace, then replace it." |
| The deck ignores the template's layouts | Name the layout for each slide in the prompt, as in 6.4 |
| Text spills off a slide | Ask for fewer, shorter bullets, or move detail to the speaker notes |
| A figure in the deck is different from the memo | The AI retyped it. Check each figure against the facts in 6.3 |

---

## Lesson Summary

AI fills a template well when the template is built well: styles in Word, named layouts and placeholders in PowerPoint. The same prompt on a badly built template gives drifting, untitled slides. Check every figure after the AI has filled the template, the same as you would a colleague's draft.

**Check yourself:** A colleague says "the AI keeps changing our fonts". What would you look at first in their template?
