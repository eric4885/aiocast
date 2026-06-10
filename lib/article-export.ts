type SeoArticle = {
  title: string;
  metaDescription: string;
  keywords: string[];
  body: string;
};

type FaqItem = { q: string; a: string };

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
      if (block.startsWith("## ")) {
        return `<h2>${escapeHtml(block.slice(3).trim())}</h2>`;
      }
      if (block.startsWith("# ")) {
        return `<h1>${escapeHtml(block.slice(2).trim())}</h1>`;
      }
      return `<p>${escapeHtml(block).replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");
}

export function articleToMarkdown(article: SeoArticle, faq: FaqItem[] = []): string {
  const lines: string[] = [`# ${article.title}`, "", `> ${article.metaDescription}`, ""];
  if (article.keywords.length > 0) {
    lines.push(`**Keywords:** ${article.keywords.join(", ")}`, "");
  }
  lines.push(article.body.trim(), "");
  if (faq.length > 0) {
    lines.push("## FAQ", "");
    for (const item of faq) {
      lines.push(`### ${item.q}`, "", item.a.trim(), "");
    }
  }
  return lines.join("\n").trim() + "\n";
}

export function articleToHtml(article: SeoArticle, faq: FaqItem[] = []): string {
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
</head>
<body>
  <article>
    <h1>${escapeHtml(article.title)}</h1>
    <p><em>${escapeHtml(article.metaDescription)}</em></p>
    ${bodyToHtmlParagraphs(article.body)}
    ${faqHtml}
  </article>
</body>
</html>`;
}

export function articleExportFilename(packId: string, ext: "md" | "html"): string {
  return `aiocast-article-${packId.slice(0, 8)}-${Date.now()}.${ext}`;
}
