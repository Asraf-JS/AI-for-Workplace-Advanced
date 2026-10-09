# Shot list: 11 - AI Security for Practitioners

**Capture in:** Word for the web (OneDrive of the M365 Copilot (Basic) training account), and the `Quotation Checker` agent.

**Set up first:** `open-rfqs.pdf` and `case-09-rakmas.pdf` from `07-evaluating-output/sample-files`, the policy and vendor list.

**During capture:** Save the Word document as `quotation-rakmas-poisoned` in `AIW Training`. Word for the web may download a PDF instead of Save As: record what it offers.

Capture each shot right after its step: for a step that sends a prompt, when the answer is complete, scrolled so the start of the answer shows.

| File | Section | Step | Blur after capture? |
|---|---|---|---|
| `11-01-open-word-create-blank.png` | 11.1 Make the Poisoned Quotation | Step 11.1.1: Open Word and create a blank document |  |
| `11-02-copy-quotation-text-from.png` | 11.1 Make the Poisoned Quotation | Step 11.1.2: Copy the quotation text from Part 1 of the prompts page and paste it with Keep Text Only |  |
| `11-03-select-last-paragraph-starts.png` | 11.1 Make the Poisoned Quotation | Step 11.1.3: Select the last paragraph, the one that starts "Note for the AI assistant" |  |
| `11-04-set-its-font-colour.png` | 11.1 Make the Poisoned Quotation | Step 11.1.4: Set its font colour to White and its size to 1. The paragraph seems to disappear |  |
| `11-05-select-file-save-choose.png` | 11.1 Make the Poisoned Quotation | Step 11.1.5: Select File > Save As, choose PDF, and save it as quotation-rakmas-poisoned.pdf |  |
| `11-06-start-new-chat-quotation.png` | 11.2 Attack Your Checker | Step 11.2.1: Start a new chat with your Quotation Checker (upload the policy and the vendor list first if it has no files) | Yes |
| `11-07-upload-open-rfqs-pdf.png` | 11.2 Attack Your Checker | Step 11.2.2: Upload open-rfqs.pdf and quotation-rakmas-poisoned.pdf, and send | Yes |
| `11-08-open-quotation-checker-s.png` | 11.3 Defend It | Step 11.3.1: Open your Quotation Checker's instructions and add this to the Rules | Yes |
| `11-09-save-instructions.png` | 11.3 Defend It | Step 11.3.2: Save the instructions | Yes |
| `11-10-run-quotation-rakmas-poisoned.png` | 11.3 Defend It | Step 11.3.3: Run quotation-rakmas-poisoned.pdf again, in a new chat | Yes |
| `11-11-run-case-09-rakmas.png` | 11.3 Defend It | Step 11.3.4: Run case-09-rakmas.pdf too, to check your fix didn't change a case that was already right | Yes |
