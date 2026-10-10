# Screenshot prompt for Codex

Codex captures the screenshots on Asraf's Windows machine, one per step, following `AGENTS.md` at the repo root (Codex reads it automatically). Start a **fresh Codex session per module** with low reasoning effort and give it the short prompt at the bottom of this page.

## One-time setup

1. Clone the repo and open Codex in it:
   ```
   git clone https://github.com/Asraf-JS/AI-for-Workplace-Advanced
   cd AI-for-Workplace-Advanced
   cd _design && npm install && cd ..
   ```
2. Set the account names Codex may mask (PowerShell, each session):
   ```
   $env:CAPTURE_ACCOUNT = "<the M365 Copilot (Basic) training account>"
   $env:CAPTURE_GOOGLE_ACCOUNT = "<the Google training account>"
   $env:CAPTURE_N8N_ACCOUNT = "<the n8n trial account email>"
   $env:CAPTURE_ONEDRIVE_URL = "<the training account's OneDrive address, https://...-my.sharepoint.com/>"
   $env:CAPTURE_N8N_URL = "<the n8n trial workspace address, https://...app.n8n.cloud/>"
   ```
3. Start the browser headed once and sign in to every site by hand: `node _design/shots/browser-session.mjs --headed`
   - **m365.cloud.microsoft**: the unlicensed training user, which must show **M365 Copilot (Basic)**
   - **notebooklm.google**: the Google training account (Modules 04 and 09)
   - **n8n**: the trial account, with an AI credential added (Module 10)
   - **outlook.office.com**: the same Microsoft 365 training user (Module 10's approval emails)
4. In the training user's OneDrive, create a folder `AIW Training` and upload the Module 05, 06 and 13 files the shot lists name.
5. Close the headed browser. The sign-ins stay in `.capture-profile/`, which git ignores.

## Each module

1. In one terminal: `node _design/shots/browser-session.mjs`
2. In another: `codex -c model_reasoning_effort="low"`
3. Paste the prompt, changing the module name.

| Module | Shots | Captured in | Sends anything? |
|---|---|---|---|
| 01-how-llms-behave | 9 | Copilot | No |
| 02-context-engineering | 7 | Copilot | No |
| 03-custom-assistants | 12 | Copilot, Agent Builder | No |
| 04-grounded-research | 6 | Gemini Notebook | No |
| 05-data-analysis | 9 | Copilot, Excel for the web | No |
| 06-output-templates | 14 | PowerPoint and Word for the web, Copilot | No |
| 07-evaluating-output | 4 | Copilot agent | No |
| 08-agents-connectors-mcp | 5 | Copilot | No |
| 09-rag-fundamentals | 7 | Gemini Notebook | No |
| 10-n8n-agent-workflow | 29 | n8n, Outlook on the web | Approval emails to the training account only |
| 11-ai-security | 11 | Word for the web, Copilot agent | No |
| 12-ai-governance | 5 | Copilot | No |
| 13-capstone | 7 | Copilot, Word for the web | No |

Run them in order: Modules 07 and 11 reuse the Module 03 agent. Check progress any time with `node _design/check-screenshots.mjs`.

## The prompt

```text
Capture module 03-custom-assistants following AGENTS.md. One screenshot per step in _design/shots/03-custom-assistants.md.
```

## After capture

Paste the new `NOTES.md` lines to Claude, with the branch name. Claude then:

1. checks every image, writes the real description and caption for each, and removes the "still to capture" wrappers
2. blurs the answer area of every shot marked "Blur after capture", in both `images/` and `_design/shots/raw/`
3. updates the notes where the UI differs, and clears the VERIFY comments the notes answer
4. adds the red boxes to `_design/shots/annotations.json`, runs `cd book && npm run annotate`, and rebuilds the book
