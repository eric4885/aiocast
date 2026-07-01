#!/usr/bin/env node
/** Smoke-check key public routes return HTTP 200 after deploy. Usage: node scripts/smoke-routes.mjs [baseUrl] */
const base = (process.argv[2] ?? process.env.SMOKE_BASE_URL ?? "https://aiocast.com").replace(/\/$/, "");

const paths = [
  "/",
  "/tools/seo-growth-pack",
  "/tools/free-podcast-title-generator",
  "/tools/show-notes-to-html",
  "/guides/podcast-to-blog-post",
  "/guides/show-notes-template",
  "/guides/podcast-faq-for-seo",
  "/examples/sample-growth-pack",
  "/pro-toolkit",
  "/resources/pre-flight-checklist",
  "/sitemap.xml",
];

let failed = 0;

for (const path of paths) {
  const url = `${base}${path}`;
  try {
    const res = await fetch(url, { redirect: "follow" });
    const ok = res.ok;
    console.log(`${ok ? "OK" : "FAIL"} ${res.status} ${url}`);
    if (!ok) failed += 1;
  } catch (err) {
    console.log(`FAIL --- ${url} (${err instanceof Error ? err.message : err})`);
    failed += 1;
  }
}

if (failed > 0) {
  process.exit(1);
}

console.log(`All ${paths.length} routes OK.`);
