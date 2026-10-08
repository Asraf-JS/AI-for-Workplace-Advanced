// Lists the screenshots each chapter's notes refer to, and which are still missing.
//   node _design/check-screenshots.mjs
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
let total = 0, missing = 0;

for (const dir of readdirSync(root).filter((d) => /^\d\d-/.test(d)).sort()) {
  const readme = resolve(root, dir, "README.md");
  if (!existsSync(readme)) continue;
  const refs = [...readFileSync(readme, "utf8").matchAll(/!\[[^\]]*\]\((\.\/images\/[^)\s]+)\)/g)].map((m) => m[1]);
  const gone = refs.filter((r) => !existsSync(resolve(root, dir, r)));
  total += refs.length;
  missing += gone.length;
  console.log(`${dir}: ${refs.length - gone.length}/${refs.length}`);
  for (const g of gone) console.log(`  missing ${g.replace("./", "")}`);
}

console.log(`\n${total - missing} of ${total} screenshots in place.`);
process.exit(missing ? 1 : 0);
