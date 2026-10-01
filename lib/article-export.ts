import {
  citableEntitiesToMarkdown,
  type CitableEpisode,
} from "@/lib/citable-episode";

type SeoArticle = {
  title: string;
  metaDescription: string;
  keywords: string[];
  body: string;
};

type FaqItem = { q: string; a: string };

export type ArticleExportOptions = {
  faq?: FaqItem[];
  citable?: CitableEpisode | null;
};

const ATTRIBUTION_MARKDOWN =
  "\n\n---\n\n_Draft generated with [AioCast](https://aiocast.com) — podcast-to-SEO workflow. Remove this line before publishing if you prefer._\n";

const ATTRIBUTION_HTML = `
  <footer style="margin-top:2.5rem;padding-top:1rem;border-top:1px solid #ddd;color:#666;font-size:0.85rem;">
    <p>Draft generated with <a href="https://aiocast.com">AioCast</a> — podcast-to-SEO workflow. Remove this footer before publishing if you prefer.</p>
  </footer>`;

function normalizeHeading(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

/** AI body often starts with `# Title` — strip when we already emit title in exports. */
export function stripDuplicateLeadingTitle(body: string, title: string): string {
  const normalizedTitle = normalizeHeading(title);
  const lines = body.trim().split("\n");

  while (lines.length > 0) {
    const line = lines[0]?.trim() ?? "";
    if (!line) {
      lines.shift();
      continue;
    }
    const h1 = line.match(/^#\s+(.+)$/);
    if (h1 && normalizeHeading(h1[1]) === normalizedTitle) {
      lines.shift();
      continue;
    }
    break;
  }

  return lines.join("\n").trim();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Split a markdown body into HTML — headings stay on their own even if AI omitted blank lines. */
function bodyToHtmlParagraphs(body: string): string {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const blocks: string[] = [];
  let buf: string[] = [];

  const flush = () => {
    const text = buf.join("\n").trim();
    buf = [];
    if (text) blocks.push(text);
  };

  for (const rawLine of lines) {
    const line = rawLine;
    const trimmed = line.trim();
    const isHeading = /^#{1,3}\s+\S/.test(trimmed);
    if (isHeading) {
      flush();
      blocks.push(trimmed);
      continue;
    }
    if (!trimmed) {
      flush();
      continue;
    }
    buf.push(line);
  }
  flush();

  return blocks
    .map((block) => {
      if (block.startsWith("### ")) {
        return `<h3>${escapeHtml(block.slice(4).trim())}</h3>`;
      }
      if (block.startsWith("## ")) {
        return `<h2>${escapeHtml(block.slice(3).trim())}</h2>`;
      }
      if (block.startsWith("# ")) {
        return `<h2>${escapeHtml(block.slice(2).trim())}</h2>`;
      }
      const listLines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      if (listLines.length > 0 && listLines.every((l) => /^[-*]\s+/.test(l))) {
        const items = listLines
          .map((l) => `<li>${escapeHtml(l.replace(/^[-*]\s+/, ""))}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }
      return `<p>${escapeHtml(block).replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");
}

function entitiesHtml(citable: CitableEpisode): string {
  if (citable.entities.length === 0) return "";
  const cards = citable.entities
    .map((e) => {
      const rows = [
        ["Role", e.role],
        ["Company", e.company],
        ["Expertise", e.expertise],
        ["Past work", e.pastWork],
      ]
        .filter(([, v]) => v.trim())
        .map(([k, v]) => `<li><strong>${escapeHtml(k)}:</strong> ${escapeHtml(v)}</li>`)
        .join("");
      return `<article class="entity-card"><h3>${escapeHtml(e.name)}${
        e.kind !== "other" ? ` <span>(${escapeHtml(e.kind)})</span>` : ""
      }</h3><ul>${rows || "<li>—</li>"}</ul></article>`;
    })
    .join("\n");
  return `<section><h2>Guest / host entity bio</h2>\n${cards}</section>`;
}

export function articleToMarkdown(
  article: SeoArticle,
  faq: FaqItem[] = [],
  citable?: CitableEpisode | null,
): string {
  const body = stripDuplicateLeadingTitle(article.body, article.title);
  const lines: string[] = [`# ${article.title}`, ""];
  if (citable?.leadQuote) {
    lines.push(`> ${citable.leadQuote}`, "");
  } else {
    lines.push(`> ${article.metaDescription}`, "");
  }
  if (article.keywords.length > 0) {
    lines.push(`**Keywords:** ${article.keywords.join(", ")}`, "");
  }
  lines.push(body, "");
  if (citable && citable.entities.length > 0 && !/##\s+Guest\s*\/\s*host entity bio/i.test(body)) {
    lines.push(citableEntitiesToMarkdown(citable.entities).trim(), "");
  }
  if (faq.length > 0) {
    lines.push("## FAQ", "");
    for (const item of faq) {
      lines.push(`### ${item.q}`, "", item.a.trim(), "");
    }
  }
  return lines.join("\n").trim() + ATTRIBUTION_MARKDOWN;
}

export function articleToHtml(
  article: SeoArticle,
  faq: FaqItem[] = [],
  citable?: CitableEpisode | null,
): string {
  const body = stripDuplicateLeadingTitle(article.body, article.title);
  const lead =
    citable?.leadQuote?.trim() ||
    article.metaDescription.trim() ||
    "";
  const leadHtml = lead
    ? `<blockquote style="border-left:3px solid #333;margin:1rem 0;padding:0.5rem 1rem;color:#333;font-size:1.05rem;">${escapeHtml(lead)}</blockquote>`
    : "";
  const entityBlock =
    citable && citable.entities.length > 0 && !/##\s+Guest\s*\/\s*host entity bio/i.test(body)
      ? entitiesHtml(citable)
      : "";
  const faqHtml =
    faq.length > 0
      ? `<section><h2>FAQ</h2>${faq
          .map(
            (item) =>
              `<article><h3>${escapeHtml(item.q)}</h3><p>${escapeHtml(item.a).replace(/\n/g, "<br />")}</p></article>`,
          )
          .join("\n")}</section>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(article.title)}</title>
  <meta name="description" content="${escapeHtml(article.metaDescription)}" />
  <style>
    body { font-family: Georgia, "Times New Roman", serif; line-height: 1.6; max-width: 720px; margin: 2rem auto; padding: 0 1rem; color: #111; }
    h1 { font-size: 1.75rem; line-height: 1.25; }
    h2 { font-size: 1.25rem; margin-top: 1.75rem; }
    h3 { font-size: 1.05rem; }
    em { color: #444; }
    ul { padding-left: 1.25rem; }
    .entity-card { border: 1px solid #ddd; border-radius: 8px; padding: 0.75rem 1rem; margin: 0.75rem 0; }
  </style>
</head>
<body>
  <article>
    <h1>${escapeHtml(article.title)}</h1>
    ${leadHtml}
    ${bodyToHtmlParagraphs(body)}
    ${entityBlock}
    ${faqHtml}
  </article>
  ${ATTRIBUTION_HTML}
</body>
</html>`;
}

/** Clipboard export: article + lead quote (no FAQ), single title, Markdown. */
export function articleForClipboard(article: SeoArticle, citable?: CitableEpisode | null): string {
  return articleToMarkdown(article, [], citable);
}

export function articleExportFilename(packId: string, ext: "md" | "html"): string {
  return `aiocast-article-${packId.slice(0, 8)}-${Date.now()}.${ext}`;
}
