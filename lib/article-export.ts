type SeoArticle = {
  title: string;
  metaDescription: string;
  keywords: string[];
  body: string;
};

type FaqItem = { q: string; a: string };

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

function bodyToHtmlParagraphs(body: string): string {
  return body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
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
      if (block.split("\n").every((line) => /^[-*]\s+/.test(line.trim()))) {
        const items = block
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => `<li>${escapeHtml(line.replace(/^[-*]\s+/, ""))}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }
      return `<p>${escapeHtml(block).replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");
}

export function articleToMarkdown(article: SeoArticle, faq: FaqItem[] = []): string {
  const body = stripDuplicateLeadingTitle(article.body, article.title);
  const lines: string[] = [`# ${article.title}`, "", `> ${article.metaDescription}`, ""];
  if (article.keywords.length > 0) {
    lines.push(`**Keywords:** ${article.keywords.join(", ")}`, "");
  }
  lines.push(body, "");
  if (faq.length > 0) {
    lines.push("## FAQ", "");
    for (const item of faq) {
      lines.push(`### ${item.q}`, "", item.a.trim(), "");
    }
  }
  return lines.join("\n").trim() + "\n";
}

export function articleToHtml(article: SeoArticle, faq: FaqItem[] = []): string {
  const body = stripDuplicateLeadingTitle(article.body, article.title);
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
  </style>
</head>
<body>
  <article>
    <h1>${escapeHtml(article.title)}</h1>
    <p><em>${escapeHtml(article.metaDescription)}</em></p>
    ${bodyToHtmlParagraphs(body)}
    ${faqHtml}
  </article>
</body>
</html>`;
}

/** Clipboard export: article only (no FAQ), single title, Markdown. */
export function articleForClipboard(article: SeoArticle): string {
  return articleToMarkdown(article, []);
}

export function articleExportFilename(packId: string, ext: "md" | "html"): string {
  return `aiocast-article-${packId.slice(0, 8)}-${Date.now()}.${ext}`;
}
