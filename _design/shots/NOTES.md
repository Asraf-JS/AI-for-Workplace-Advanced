# Capture notes

Codex adds one line per difference between a README and the screen, and answers every "Check while you're there" item: `- MODULE, step: README says ...; UI shows ...`

- 01-how-llms-behave, 1.2.1 and 1.3.1: README says choose a quick or deeper reasoning option in the model menu (Auto by default); UI shows Auto (Decides how long to think), Quick response (Answers right away), Think deeper (Think longer for better answers), plus GPT (OpenAI); Quick response used for 1.2 and Think deeper for 1.3.

- 02-context-engineering, 2.2: README says one row per requirement from the preceding requirements table; UI shows the 15 original requirements become 30 checklist rows, plus the three requested Grand total (RM), Valid until and Payment terms rows; supplier cells remain empty.

- 02-context-engineering, Product Notes check: README says Gemini has Export to Sheets under a table and Claude may open long JSON in a side panel; UI shows this capture run uses M365 Copilot (Basic); Gemini and Claude were not opened, so both claims remain unverified.

- 03-custom-assistants, retake 3.1.4: README says name the agent, paste instructions and save; UI shows Agent Builder also requires a description before Create is enabled; added a description of the course quotation-checking task.

- 03-custom-assistants, retake 3.3.4: README says Ergoluma is valid on 10 November 2026 and its 50% deposit should produce ESCALATE; UI shows the report labels Validity Fail while its own explanation corrects this to Pass, and returns REVISE for the deposit instead of ESCALATE.

- 03-custom-assistants, retake 3.5.1 and 3.5.2: README says recommend Duduk Selesa after supplier correction to RM47,628.00 and treat Nadira as non-compliant on warranty; UI shows the recommendation selects Nadira and labels it PASS while acknowledging its non-compliant warranty; the Duduk correct-total cell shows RM46,648.00 although the explanation calculates RM47,628.00.

- 03-custom-assistants, retake other-tools instruction-length check: README says check instruction limits in Claude, ChatGPT Projects and Gemini skills; UI shows this retake uses Copilot only; those tools were not opened, so their limits remain unverified.

- 03-custom-assistants, retake preparation: README says create a new Quotation Checker; UI shows the old agent was renamed CCB Quotation Checker with its instructions, description and suggested prompts verified unchanged; a separate new Quotation Checker was created.

- 04-grounded-research, retake 4.2 question 2: README says later answers should give the exact sentence, using the provided follow-up if needed; UI shows the validity answer gave Clause 4.2 but no exact quotation; the provided follow-up returned both exact Clause 4.2 sentences.

- 04-grounded-research, retake 4.2 questions 3 and 5: README says use the provided follow-up when later answers omit exact quotations; UI shows the approval and split-purchase answers needed that follow-up; it returned the correct Clause 3.1 table wording and exact Clause 7.2 text.

- 04-grounded-research, retake 4.3.1: README says open the policy PDF and check each cited clause; UI shows Gemini Notebook opens extracted PDF source text; all five final answers match Clauses 6.2, 4.2, 3.1, 4.5 and 7.2 and are marked Correct.

- 04-grounded-research, retake 4.4: README says say the sources do not cover overseas suppliers and optionally point to Procurement; UI shows the answer says there is no specific overseas policy, adds cited general AVL and SSM requirements, and offers the Procurement contact; it does not claim all listed vendors are Malaysian.

- 04-grounded-research, retake 4.1.2: README says use only procurement-policy-v3.0.pdf and approved-vendor-list.pdf; UI shows the fresh notebook contains exactly those two selected sources; all six retake captures are 1600x900 with account details masked.

- 05-data-analysis, 5.1.2 and 5.1.3: README says check the AI row count against Excel; UI shows Copilot reported 462 data rows and 18 columns; Excel shows Count 355 including the header, so there are 354 data rows; the source has 17 columns.

- 05-data-analysis, 5.2: README says expect 4 duplicate rows, 6 blank departments, 7 supplier-name variants and 8 cancelled rows; UI shows Copilot found the four duplicate PO numbers and seven variants, but reported only 2 blank departments and 7 cancelled rows; its duplicate description also incorrectly called four PO numbers two duplicated PO numbers.

- 05-data-analysis, 5.3: README says 350 unique purchase orders after cleaning and excluding cancellations; UI shows Copilot correctly reports 342 non-cancelled unique orders; the file has 350 unique orders before excluding 8 cancellations; all stated spend totals and top-five supplier totals match.

- 05-data-analysis, 5.3.4 and 5.3.5: README says V003 should match the AI and V005 should be higher in Excel because of a duplicate; UI shows the filtered PivotTable excludes Cancelled and includes Open and Received; V003 is RM966,183.56 and V005 is RM360,296.99 versus the cleaned AI total RM335,418.16.

- 05-data-analysis, code-execution check: README says verify whether Copilot Basic runs code on uploaded spreadsheets; UI shows Copilot Basic shows Coding and executing and exposes executed Python using pandas read_excel, drop_duplicates and grouped sums for this workbook.

- 05-data-analysis, Gemini code-display check: README says verify whether Gemini shows its code in October 2026; UI shows this module was captured in Copilot Basic and Excel; Gemini Chat was not opened, so its code display remains unverified.

- 05-data-analysis, 5.4: README says find the May 2026 courier increase and seasonal paper pattern; UI shows Copilot found the split orders and quotation exceptions but omitted the courier increase; its seasonal answer compared aggregated monthly spend with unequal month coverage instead of the expected ream averages.

- 05-data-analysis, 5.5: README says the chart jump should match the month in the pattern finding; UI shows Copilot generated the titled column chart with labelled axes and a May 2026 increase, then incorrectly said that increase had been identified earlier in its analysis.

- 05-data-analysis, 5.4 verification: README says filter the spreadsheet to a listed PO and check one finding; UI shows Excel was filtered to PO-2026-0071; it shows Total RM12,409.20, one quotation, a blank Contract Ref and Farah Nadiah binti Zulkifli as approver, confirming the reported exception.

- 05-data-analysis, 05-02, 05-08 and 05-09 retake: README says capture the existing answers in light mode; UI shows the saved AIW 05 - purchase history chat was reopened in light mode and the same three answers were captured without resending prompts.

- 05-data-analysis, check while retaking: README says check whether Gemini shows its code; UI shows Gemini was not opened because this retake covers only three existing Copilot answers; Gemini code visibility remains unverified.

- 06-output-templates, 6.1.2: README says select View > Outline View; UI shows PowerPoint for the web has Normal (Tri-pane) View and Slide Sorter but no Outline View; the View ribbon was captured.

- 06-output-templates, 6.2.2: README says select View > Navigation Pane; UI shows Word for the web calls the command View Navigation Pane and shows all six numbered headings.

- 06-output-templates, check while there: accessibility: README says verify the current PowerPoint for Windows command and missing slide titles in the bad deck; UI shows PowerPoint for the web has Review > Check Accessibility; its bad-deck Accessibility Assistant reports Missing slide title - 0 issues; the Windows command and result remain unverified.

- 06-output-templates, 6.3.3: README says download the finished memo and open it in Word with six headings and no placeholders; UI shows Copilot saved a Word file to OneDrive and Open file opened it in Word for the web; its Navigation Pane keeps all six headings and no square-bracket placeholders were found.

- 06-output-templates, 6.4.3: README says download and check the deck layouts; UI shows Copilot saved a four-slide PowerPoint file to OneDrive; Open file opened it in PowerPoint for the web and Home > Slide Layout confirms SM Title, SM Title Only, SM Content and SM Closing on slides 1 to 4.

- 06-output-templates, check while there: returned layouts: README says verify which tools return a PowerPoint file keeping the uploaded template layouts in October 2026; UI shows M365 Copilot (Basic) returned a four-slide .pptx retaining the good template layouts, confirmed in PowerPoint for the web; other tools were not tested.

- 06-output-templates, 6.5.1-2: README says the bad template output usually drifts and has no real slide titles; UI shows Copilot claimed SM layouts in its answer, but the returned four-slide deck has only Office Theme > DEFAULT, all thumbnail labels are Slide, the title wraps into fragments, and the old example title, subtitle and date text remains.

- 06-output-templates, 06-12 and 06-14 retake: README says capture the completed deck answers; UI shows the same good-template and bad-template answers were captured in light mode without resending prompts.

- 06-output-templates, original chat setup: README says start separate chats for the memo, good deck and bad deck; UI shows the original capture run mistakenly kept all three exchanges in one conversation, now named AIW 06 - bad approval deck; both existing deck answers were located by their generated filenames for this retake.

- 06-output-templates, retake checks: accessibility: README says verify the PowerPoint for Windows accessibility command and bad-deck title warnings; UI shows this retake opens only existing Copilot answers; the Windows accessibility check remains unverified.

- 06-output-templates, retake checks: returned layouts: README says verify template layout retention in ChatGPT, Claude and Gemini; UI shows this retake opens only existing Copilot answers; other tools remain untested.

- 07-evaluating-output, 7.4.3: README says save the instructions; UI shows Agent Builder uses Update and confirms Your agent was updated successfully; the agent remains private.

- 07-evaluating-output, 7.2 capture scope: README says run ten cases and score them; UI shows this screenshot run followed the shot list and ran case 01 only; Kertas Lestari returned PASS at RM19,116.00; the ten-case score and regression run were not performed.
