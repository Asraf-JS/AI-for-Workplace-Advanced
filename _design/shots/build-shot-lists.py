"""Builds the per-module shot lists in _design/shots/ from the image lines in the module READMEs.

    python3 _design/shots/build-shot-lists.py

Run it again whenever you add, rename or remove an image line in a README.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
COPILOT = "the M365 Copilot (Basic) training account"

# Where each module is captured, what to set up first, and what to keep for later modules.
MODULES = {
    "01": dict(tools=f"Copilot app ({COPILOT})",
               setup="The two PDFs from `01-how-llms-behave/sample-files`.",
               during="Rename each chat `AIW 01 - ...`. For 1.2 choose the quickest model option in the model menu at the top of the chat; for 1.3 the deepest reasoning option. Record the option names in NOTES.md."),
    "02": dict(tools=f"Copilot app ({COPILOT})",
               setup="`rfq-2026-118.pdf` from `01-how-llms-behave/sample-files`.",
               during="Steps 2.1 to 2.3 run in one chat, renamed `AIW 02 - requirements chain`. 2.4 is a new chat."),
    "03": dict(tools=f"Copilot app, Agent Builder ({COPILOT})",
               setup="All six files from `03-custom-assistants/sample-files`.",
               during="Create a new agent with Agents > New agent > Skip, named `Quotation Checker`, and keep it: Modules 07 and 11 reuse it. If an agent named `Quotation Checker` already exists before 3.1, stop and ask. Copilot Basic agents can't hold files, so upload the policy and the vendor list first in every chat with the agent and wait for Ready. For 03-07, scroll to the Arithmetic row of the report; for 03-12, scroll to what must happen before a purchase order."),
    "04": dict(tools="Gemini Notebook, formerly NotebookLM (notebooklm.google), signed in with the Google training account",
               setup="`procurement-policy-v3.0.pdf` and `approved-vendor-list.pdf` from `04-grounded-research/sample-files`.",
               during="Create the notebook `Sinar Maju procurement policy` once. Send the five questions in 4.2 one after another in the same notebook; capture the answers to the first question for the 4.2 shot."),
    "05": dict(tools=f"Copilot app ({COPILOT}), and Excel for the web for 5.1 step 3 and 5.3",
               setup="`purchase-history.xlsx` uploaded to the training account's OneDrive folder `AIW Training`, and to the Copilot chat.",
               during="One chat for 5.1 to 5.5, renamed `AIW 05 - purchase history`. Build the PivotTable in Excel for the web on a copy of the file."),
    "06": dict(tools=f"PowerPoint for the web and Word for the web (OneDrive of {COPILOT}), and the Copilot app",
               setup="The three files from `06-output-templates/sample-files` uploaded to the OneDrive folder `AIW Training`.",
               during="6.1 and 6.2 run in PowerPoint and Word for the web: record any command the README names that the web app doesn't have (Outline View, Check Accessibility, Navigation Pane). In 6.3 replace `[your name]` with `Daniel Wong Kah Leong`. If Copilot can't return a file, capture its answer and add a NOTES.md line."),
    "07": dict(tools=f"Copilot app, the `Quotation Checker` agent ({COPILOT})",
               setup="`open-rfqs.pdf`, `case-01-kertas-lestari.pdf`, the policy and the vendor list from `07-evaluating-output/sample-files`.",
               during="Capture 7.2 with case 01 only. For 7.4, open the agent's instructions, add the first example rule, capture, and save."),
    "08": dict(tools=f"Copilot app ({COPILOT})",
               setup="Nothing to upload.",
               during="8.1 to 8.3 in one chat, renamed `AIW 08 - systems map`. For 8.3 step 1, capture where Copilot lists what an agent can connect to, without connecting anything."),
    "09": dict(tools="Gemini Notebook (notebooklm.google), Google training account",
               setup="Both policy PDFs from `09-rag-fundamentals/sample-files`.",
               during="Create the notebook `Procurement policy, both versions`. For 9.1 step 3, open page 1 of `procurement-policy-v2.1.pdf` in the browser's PDF viewer. For 9.5, capture Fix A."),
    "10": dict(tools="n8n (the trial account Asraf signs in to by hand), and Outlook on the web for the approval emails",
               setup="The files from `10-n8n-agent-workflow/sample-files`. An AI credential in n8n set up by Asraf beforehand.",
               during="Name the workflow `AIW Quotation approval`. Emails go only to the signed-in Outlook account, subject starting `[AIW TRAINING]`. Click Approve only on emails sent by this workflow. Capture 10.7 with the four quotations in the README's order."),
    "11": dict(tools=f"Word for the web (OneDrive of {COPILOT}), and the `Quotation Checker` agent",
               setup="`open-rfqs.pdf` and `case-09-rakmas.pdf` from `07-evaluating-output/sample-files`, the policy and vendor list.",
               during="Save the Word document as `quotation-rakmas-poisoned` in `AIW Training`. Word for the web may download a PDF instead of Save As: record what it offers."),
    "12": dict(tools=f"Copilot app ({COPILOT})",
               setup="Nothing to upload.",
               during="12.1 to 12.4 in one chat, renamed `AIW 12 - governance`."),
    "13": dict(tools=f"Copilot app ({COPILOT}), and Word for the web for the canvas",
               setup="Brief A's PDF and its three CSV files, and `ai-workflow-canvas.docx`, from `13-capstone/sample-files`.",
               during="Capture with Brief A. One chat for 13.2 to 13.4, renamed `AIW 13 - capstone brief A`. Upload the canvas to `AIW Training` and open it in Word for the web for 13.1 step 3."),
}

# Sections whose shots show a seeded problem or an answer. Claude blurs the answer area after capture.
SPOILERS = {"1.3", "3.3", "3.4", "3.5", "5.2", "5.3", "5.4", "5.5", "7.2", "9.2", "9.3", "10.7", "11.2", "11.3", "13.3", "13.4"}


def main():
    for d in sorted(ROOT.glob("[01][0-9]-*")):
        mod = d.name[:2]
        if mod not in MODULES:
            continue
        text = (d / "README.md").read_text()
        title = text.split("\n", 1)[0].lstrip("# ")
        rows, section = [], ""
        lines = text.split("\n")
        for i, l in enumerate(lines):
            if l.startswith("## "):
                section = l[3:]
            m = re.match(r"\s*!\[([^\]]*)\]\(\./images/([^)]+)\)", l)
            if m:
                sec_no = section.split(" ", 1)[0]
                rows.append((m.group(2), section, m.group(1), "Yes" if sec_no in SPOILERS else ""))
        verify = re.findall(r"<!-- VERIFY: (.*?) -->", text, re.S)
        meta = MODULES[mod]
        out = [f"# Shot list: {title}", "",
               f"**Capture in:** {meta['tools']}.", "",
               f"**Set up first:** {meta['setup']}", "",
               f"**During capture:** {meta['during']}", "",
               "Capture each shot right after its step: for a step that sends a prompt, when the answer is complete, scrolled so the start of the answer shows.", "",
               "| File | Section | Step | Blur after capture? |", "|---|---|---|---|"]
        out += [f"| `{f}` | {s} | {a} | {b} |" for f, s, a, b in rows]
        if verify:
            out += ["", "## Check while you're there", ""] + [f"- {' '.join(v.split())}" for v in verify]
        (ROOT / "_design" / "shots" / f"{d.name}.md").write_text("\n".join(out) + "\n")
        print(f"{d.name}: {len(rows)} shots, {len(verify)} checks")


if __name__ == "__main__":
    main()
