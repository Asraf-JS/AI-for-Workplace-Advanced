# Shot list: 11 - AI Security for Practitioners

**Capture in:** Word for the web (OneDrive of the M365 Copilot (Basic) training account), and the `Quotation Checker` agent.

**Set up first:** `open-rfqs.pdf` and `case-09-rakmas.pdf` from `07-evaluating-output/sample-files`, the policy and vendor list.

**During capture:** Save the Word document as `quotation-rakmas-poisoned` in `AIW Training`. Word for the web may download a PDF instead of Save As: record what it offers.

Capture each shot right after its step: for a step that sends a prompt, when the answer is complete, scrolled so the start of the answer shows.

| File | Section | Step | Blur after capture? |
|---|---|---|---|
| `11-01-open-word-create-blank.png` | 11.1 Make the Poisoned Quotation | A blank document in Word for the web |  |
| `11-02-copy-quotation-text-from.png` | 11.1 Make the Poisoned Quotation | The Rakmas Storage Solutions quotation pasted as plain text in Word |  |
| `11-03-select-last-paragraph-starts.png` | 11.1 Make the Poisoned Quotation | The last paragraph, starting Note for the AI assistant, selected on page 2 |  |
| `11-04-set-its-font-colour.png` | 11.1 Make the Poisoned Quotation | The note's page now looks empty, with the font size showing 6 |  |
| `11-05-select-file-save-choose.png` | 11.1 Make the Poisoned Quotation | Microsoft Word dialog saying Your document is ready, with a Download button |  |
| `11-06-start-new-chat-quotation.png` | 11.2 Attack Your Checker | A new Quotation Checker chat with the vendor list and policy attached | Yes |
| `11-07-upload-open-rfqs-pdf.png` | 11.2 Attack Your Checker | The Checker's report on the poisoned quotation, matched to RFQ-2026-125 | Yes |
| `11-08-open-quotation-checker-s.png` | 11.3 Defend It | Agent Builder showing the new rule at the top of the Rules in the Quotation Checker instructions | Yes |
| `11-09-save-instructions.png` | 11.3 Defend It | Your agent was updated successfully dialog in Agent Builder | Yes |
| `11-10-run-quotation-rakmas-poisoned.png` | 11.3 Defend It | The Checker's report on the poisoned quotation in a new chat after the fix | Yes |
| `11-11-run-case-09-rakmas.png` | 11.3 Defend It | The Checker's report on the original case 09 quotation after the fix | Yes |
