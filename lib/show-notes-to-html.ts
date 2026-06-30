/** Lightweight markdown-ish show notes → HTML for the free converter tool. */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function showNotesToHtmlFragment(body: string): string {
  const trimmed = body.trim();
  if (!trimmed) return "";

  return trimmed
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

export function showNotesToPasteableHtml(title: string, body: string): string {
  const safeTitle = title.trim() || "Episode show notes";
  const fragment = showNotesToHtmlFragment(body);
  if (!fragment) return "";

  return `<article>
  <h1>${escapeHtml(safeTitle)}</h1>
${fragment}
</article>`;
}

export function showNotesToFullHtmlDocument(title: string, body: string): string {
  const pasteable = showNotesToPasteableHtml(title, body);
  if (!pasteable) return "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title.trim() || "Episode show notes")}</title>
  <style>
    body { font-family: Georgia, "Times New Roman", serif; line-height: 1.6; max-width: 720px; margin: 2rem auto; padding: 0 1rem; color: #111; }
    h1 { font-size: 1.75rem; line-height: 1.25; }
    h2 { font-size: 1.25rem; margin-top: 1.75rem; }
    h3 { font-size: 1.05rem; }
    ul { padding-left: 1.25rem; }
  </style>
</head>
<body>
${pasteable}
</body>
</html>`;
}
