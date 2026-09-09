import fs from "fs";
import path from "path";

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name === "page.tsx") out.push(p);
  }
  return out;
}

const suffix = " · AioCast";
const productCopy = fs.readFileSync("lib/product-copy.ts", "utf8");
const seoTitle = productCopy.match(/seoTitle:\s*"([^"]+)"/)?.[1] ?? "";
const seoDesc = productCopy.match(/seoDescription:\s*"([^"]+)"/)?.[1] ?? "";

const rows = [];
for (const f of walk("app")) {
  const s = fs.readFileSync(f, "utf8");
  if (!s.includes("export const metadata")) continue;
  const meta = s.slice(s.indexOf("export const metadata"));

  const abs = meta.match(/title:\s*\{\s*absolute:\s*(?:productPromise\.seoTitle|"([^"]+)")/);
  let title;
  let isAbs = false;
  if (meta.includes("absolute: productPromise.seoTitle")) {
    title = seoTitle;
    isAbs = true;
  } else if (abs?.[1]) {
    title = abs[1];
    isAbs = true;
  } else {
    const t = meta.match(/\btitle:\s*"([^"]+)"/);
    title = t?.[1];
  }
  if (!title) continue;

  let desc;
  if (meta.includes("description: productPromise.seoDescription")) {
    desc = seoDesc;
  } else {
    const d =
      meta.match(/description:\s*"([^"]+)"/) ||
      meta.match(/description:\s*`([^`]+)`/);
    desc = d?.[1]?.replace(/\$\{[^}]+\}/g, "3") ?? null;
  }

  const finalTitle = isAbs ? title : `${title}${suffix}`;
  const tl = [...finalTitle].length;
  const dl = desc ? [...desc].length : 0;
  const tIssue = tl > 60 ? "LONG" : tl < 25 ? "SHORT" : "OK";
  const dIssue = !desc ? "MISS" : dl > 160 ? "LONG" : dl < 70 ? "SHORT" : "OK";

  rows.push({
    path: f.replace(/\\/g, "/"),
    finalTitle,
    tl,
    tIssue,
    dl,
    dIssue,
    desc: desc ?? "",
    isAbs,
  });
}

const flagged = rows.filter((r) => r.tIssue !== "OK" || r.dIssue !== "OK");
console.log("ALL PAGES");
for (const r of rows.sort((a, b) => a.path.localeCompare(b.path))) {
  const mark = r.tIssue === "OK" && r.dIssue === "OK" ? "OK" : "!!";
  console.log(
    `${mark} T${r.tl}/${r.tIssue} D${r.dl}/${r.dIssue} ${r.path.replace("app/", "")}`,
  );
  if (mark === "!!") {
    console.log(`   title: ${r.finalTitle}`);
    if (r.dIssue !== "OK") console.log(`   desc(${r.dl}): ${r.desc.slice(0, 120)}...`);
  }
}
console.log(`\nFlagged: ${flagged.length} / ${rows.length}`);
