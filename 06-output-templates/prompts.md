# 06 - Controlling Output with Word and PowerPoint Templates: Prompts

Prompts for filling Sinar Maju's memo and deck templates. Download [sample-files.zip](./sample-files.zip) first. Hover over a grey box and click the copy icon in its top-right corner.

---

## Part 1: Fill the memo

**Session:** new chat | **Grounding:** uploaded file (`sinar-maju-memo.docx`)

Replace `[your name]` with your own name before you send it.

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

If placeholders are left:

```
List every placeholder you didn't replace, then replace it.
```

---

## Part 2: The deck from the good template

**Session:** new chat | **Grounding:** uploaded file (`sinar-maju-deck.pptx`)

```
Create a four-slide approval deck using the attached template and its layouts. Keep the template's fonts, colours and footer, and don't add any of your own.
Slide 1 (SM Title): "Approval: 120 Ergonomic Chairs for Resale", subtitle "RFQ-2026-118 recommendation", date 10 November 2026.
Slide 2 (SM Title Only, with a table): the three quotations compared: supplier, correct total (RM), warranty, payment terms, verdict.
Slide 3 (SM Content): the recommendation, Duduk Selesa at RM47,628.00 after a revised quotation, in up to four bullets.
Slide 4 (SM Closing): the decision needed from the Head of Procurement, and by when.
Remove the template's example slides. Give me the finished deck as a PowerPoint file.
```

---

## Part 3: The same deck from the bad template

**Session:** new chat | **Grounding:** uploaded file (`sinar-maju-deck-bad.pptx`)

Send the Part 2 prompt again, unchanged.
