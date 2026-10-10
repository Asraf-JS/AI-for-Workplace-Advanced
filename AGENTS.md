# Screenshot capture rules for Codex

This repo is a training site for a two-day AI course. Your job is to capture screenshots on Asraf's Windows machine: one screenshot per step, as listed. Claude reviews every screenshot afterwards, writes the captions, blurs answers and adds the red boxes, so keep your work to capturing and recording what you saw. Keep output short.

## Each run

Asraf names one module, for example `03-custom-assistants`. MODULE means that name.

1. `git checkout main`, `git pull origin main`, `git checkout -b shots/MODULE`. If `shots/MODULE` already exists on origin, stop and say so. For a retake, Asraf names the files: use `shots/MODULE-retake` and capture only those.
2. Read only `MODULE/README.md`, `MODULE/prompts.md` and `_design/shots/MODULE.md`. Don't read other modules.
3. Capture every shot listed in `_design/shots/MODULE.md`, in order, one per step, following the numbered steps in the README.
4. Run `node _design/check-screenshots.mjs`.
5. `git add MODULE/images _design/shots`, commit `Add MODULE screenshots`, `git push -u origin shots/MODULE`. Never push to `main`. Don't open pull requests.
6. Reply with only: files saved, shots skipped, and the `NOTES.md` lines you added.

## Saving tokens

- Build on `_design/shots/run-helpers.mjs`: `attach` (Copilot app), `openSite` (any other site), `newChat`, `send`, `capture`, `stable`, `note`, `remember`. Write one short script per module, `_design/shots/MODULE.mjs`, that imports it. Don't rediscover page layouts.
- Never print page HTML or the accessibility tree. When a locator fails, read the first error line, fix that locator, and rerun from the failing step. Use `debug()` only after two failed fixes.
- Don't open saved screenshots to check them. Rely on the waits in `send()` and `stable()`.
- Don't summarise between steps.

## Browser

- Start the browser with `node _design/shots/browser-session.mjs` in its own terminal: headless Edge, persistent profile `./.capture-profile`, viewport 1600x900, deviceScaleFactor 1. Never open two browsers on the same profile.
- Accounts come from `$env:CAPTURE_ACCOUNT` (Microsoft 365), `$env:CAPTURE_GOOGLE_ACCOUNT` and `$env:CAPTURE_N8N_ACCOUNT`. Never write an email address into a committed file.
- If a site needs sign-in (`openSite` throws `SIGN_IN_NEEDED`), stop the headless browser, run `node _design/shots/browser-session.mjs --headed`, and wait up to 5 minutes for Asraf to sign in. Never type a password.
- Google won't sign in to the capture profile, so Gemini Notebook runs in Asraf's regular Edge. There, ask Asraf to upload files (say which ones) and wait for "uploaded".
- `capture()` masks avatars, the account names and any Copilot chat not named `AIW ...`. Mask anything else personal too.

## Where each module is captured

The shot list says which site. In short: the Copilot app for chat steps, Gemini Notebook (notebooklm.google) for Modules 04 and 09, n8n for Module 10, Word, PowerPoint and Excel for the web (OneDrive folder `AIW Training`) for Office steps, and Outlook on the web for Module 10's approval emails.

- In the Copilot app, read the label under the account name at the bottom left. It must read **M365 Copilot (Basic)**. If it reads **M365 Copilot (Premium)**, stop. Researcher, Analyst or a Cowork tab may be visible: never open them, and don't stop because of them.
- Rename every Copilot chat you create `AIW NN - topic`, so the masks leave it visible.

## Capturing

- One screenshot per listed step, taken right after that step. For a step that sends a prompt, wait until the answer is complete and scroll so the start of the answer shows.
- Send prompts exactly as written in `MODULE/prompts.md`. The only change allowed is replacing `[your name]` with `Daniel Wong Kah Leong`. Don't change a prompt to make the answer fit.
- Each image line in the README sits inside a `<!-- Screenshot still to capture ... -->` comment. Capture it and leave the comment for Claude to remove.
- Close pop-ups that aren't part of the step before capturing: feedback surveys, "What's new" boxes, tips and banners. Move the mouse pointer off the page. Capture in light mode: if a page shows dark, call `page.emulateMedia({ colorScheme: "light" })`.
- If a file, chat or notebook from another course shows (Teratai Holdings, Pinnacle Komputer and so on), stop and ask before capturing.
- Wait for animations to finish, answers to complete (Stop button gone) and menus to open fully.
- Skip a shot headless Playwright can't show (a desktop app, a download dialog) and add a `NOTES.md` line saying it needs a manual capture.
- Copilot takes at most three files per message. Send the policy first, then the rest.
- Save each screenshot to both `MODULE/images/` and `_design/shots/raw/`, overwriting.
- Shots marked "Blur after capture" show answers. Capture them normally: Claude blurs them.

## Never

- Send email to anyone but the signed-in Outlook account. Module 10's emails must start with `[AIW TRAINING]`. Click **Approve** only on emails that workflow sent.
- Share a chat, notebook, agent, workflow or document.
- Change an account, privacy or organisation setting. In Gemini, don't touch Keep Activity.
- Delete the agent `Quotation Checker`, the notebooks `Sinar Maju procurement policy` and `Procurement policy, both versions`, or the workflow `AIW Quotation approval`. Reuse them.
- Upload anything except the course's own sample files.
- Edit README files, `prompts.md` files, `annotations.json`, the shot lists or this file.
- Show real people's names, emails, chats or files other than Asraf's training accounts. Stop and ask instead.

## NOTES.md

Add one line to `_design/shots/NOTES.md` for each difference between the README and the screen: `- MODULE, step: README says ...; UI shows ...`. Answer every item under "Check while you're there" in `_design/shots/MODULE.md` with one line, even when the README is right.

## Order

Capture modules in order, 01 to 13. Module 07 and 11 reuse the Module 03 agent. Module 09 is a new notebook, separate from Module 04's.
