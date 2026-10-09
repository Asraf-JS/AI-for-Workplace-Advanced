// Helpers for the per-module capture scripts (_design/shots/MODULE.mjs).
// Copilot helpers come from the Copilot Chat Basic course; openSite() covers Gemini Notebook,
// n8n and Office for the web.
import { chromium } from "playwright";
import { mkdirSync, copyFileSync, appendFileSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const statePath = resolve(root, ".capture-profile/aiw-capture-state.json");
export const state = existsSync(statePath) ? JSON.parse(readFileSync(statePath, "utf8")) : {};
const COPILOT = "https://m365.cloud.microsoft/chat";
const ACCOUNTS = [process.env.CAPTURE_ACCOUNT, process.env.CAPTURE_GOOGLE_ACCOUNT, process.env.CAPTURE_N8N_ACCOUNT].filter(Boolean);

export function remember(key, value) { state[key] = value; writeFileSync(statePath, JSON.stringify(state, null, 2)); }

export function note(module, step, readme, ui) {
  const line = `- ${module}, ${step}: README says ${readme}; UI shows ${ui}.`;
  const file = resolve(root, "_design/shots/NOTES.md");
  if (!readFileSync(file, "utf8").includes(line)) appendFileSync(file, `\n${line}\n`);
  console.log("NOTE", step);
}

async function connect() {
  const browser = await chromium.connectOverCDP("http://127.0.0.1:9223");
  const context = browser.contexts()[0];
  context.setDefaultTimeout(15000);
  return { browser, context };
}

// Copilot app, checked to be M365 Copilot (Basic).
export async function attach() {
  const { browser, context } = await connect();
  const page = context.pages().find(p => p.url().includes("m365.cloud.microsoft/chat")) || await context.newPage();
  page.on("dialog", d => d.accept());
  await page.setViewportSize({ width: 1600, height: 900 });
  if (!page.url().includes("m365.cloud.microsoft/chat")) await page.goto(COPILOT, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2000);
  const acct = process.env.CAPTURE_ACCOUNT || "(no CAPTURE_ACCOUNT set)";
  if (page.url().includes("login.microsoftonline.com") && await page.getByText(acct, { exact: true }).count()) await page.getByText(acct, { exact: true }).click();
  if (!await page.getByRole("textbox", { name: "Canvas", exact: true, includeHidden: true }).count())
    await page.getByText(/^M365 Copilot \((?:Basic|Premium)\)\s*$/).first().waitFor({ timeout: 60000 });
  if ((await page.locator("body").innerText()).includes("M365 Copilot (Premium)")) throw Error("STOP_WHOLE_RUN: M365 Copilot (Premium)");
  return { browser, context, page };
}

// Any other site in the same signed-in profile: Gemini Notebook, n8n, Office for the web, Outlook.
export async function openSite(url, match = url) {
  const { browser, context } = await connect();
  const page = context.pages().find(p => p.url().includes(match)) || await context.newPage();
  page.on("dialog", d => d.accept());
  await page.setViewportSize({ width: 1600, height: 900 });
  if (!page.url().includes(match)) await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2500);
  if (/accounts\.google\.com|login\.microsoftonline\.com|\/signin/.test(page.url())) throw Error("SIGN_IN_NEEDED: " + url);
  return { browser, context, page };
}

export async function stable(page) {
  let last = "";
  for (let i = 0; i < 12; i++) {
    const text = await page.locator("body").innerText();
    if (text === last) { await page.waitForTimeout(600); return; }
    last = text; await page.waitForTimeout(600);
  }
}

// Masks avatars, account names and any Copilot chat not named "AIW ..." in the left pane.
export async function capture(page, module, name, { hover = false, mask = [] } = {}) {
  if (page.viewportSize()?.width !== 1600 || page.viewportSize()?.height !== 900) await page.setViewportSize({ width: 1600, height: 900 });
  if (!hover) await page.mouse.move(1550, 880);
  await stable(page); await page.waitForTimeout(800);
  const masks = page.frames().flatMap(f => [
    f.getByRole("button", { name: /Work account|Account manager|Your profile|Google Account/i, includeHidden: true }),
    f.locator('#mectrl_main_trigger,[data-tid="me-control-mini-avatar"],.fx-Avatar,.fui-Avatar,a[aria-label^="Google Account"],img.gb_Q,[data-test-id="main-sidebar-user-menu"]'),
    ...ACCOUNTS.map(a => f.getByText(a, { exact: false })),
    f.locator(".fai-CopilotNavSubItem").filter({ hasNotText: /^(AIW|Quotation Checker)/ }),
  ]);
  const dir = resolve(root, module, "images");
  mkdirSync(dir, { recursive: true }); mkdirSync(resolve(root, "_design/shots/raw"), { recursive: true });
  const path = resolve(dir, name);
  await page.screenshot({ path, mask: [...masks, ...mask], maskColor: "#ffffff" });
  copyFileSync(path, resolve(root, "_design/shots/raw", name));
  console.log("SAVED", name);
}

// Sends a prompt in the Copilot app and waits for the whole answer.
export async function send(page, prompt) {
  prompt = prompt.replaceAll("[your name]", "Daniel Wong Kah Leong");
  const stop = page.getByRole("button", { name: /^Stop/i }).first();
  await stop.waitFor({ state: "hidden", timeout: 180000 });
  const box = page.getByRole("textbox", { name: /^Message (Copilot|Quotation Checker)$/ });
  await box.fill(""); await box.focus();
  await page.keyboard.insertText(prompt); await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await stop.waitFor({ state: "visible", timeout: 15000 }).catch(() => {});
  await stop.waitFor({ state: "hidden", timeout: 240000 });
  await page.waitForTimeout(2500);
  await page.waitForFunction(p => {
    const us = [...document.querySelectorAll(".fai-UserMessage")], u = us[us.length - 1];
    const es = document.querySelectorAll(".fai-CopilotMessage"), e = es[es.length - 1];
    return u && u.innerText.replaceAll("\r", "").includes(p.replaceAll("\r", "")) && e && e.querySelector('[data-testid="CopyButtonTestId"]');
  }, prompt, { timeout: 240000 });
  await stable(page);
  console.log("PROMPT_DONE", prompt.slice(0, 65));
}

// Reopens a saved chat (by state key) or starts a new one.
export async function newChat(page, key) {
  if (key && state[key]) {
    await page.goto(state[key], { waitUntil: "domcontentloaded" });
    await page.getByRole("textbox", { name: /^Message (Copilot|Quotation Checker)$/ }).waitFor({ timeout: 60000 });
    await page.waitForTimeout(2500); return false;
  }
  await page.getByText("New chat", { exact: true }).first().click(); await stable(page); return true;
}

export async function lastAnswer(page) {
  await page.getByRole("button", { name: "Copy Response", exact: true }).last().scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
}

export async function debug(page) {
  await page.screenshot({ path: resolve(root, "_design/shots/debug-run.png"), mask: [page.getByRole("button", { name: /Work account|Google Account/i, includeHidden: true })], maskColor: "#ffffff" });
  console.log("TAIL", (await page.locator("body").innerText()).slice(-2200));
}
