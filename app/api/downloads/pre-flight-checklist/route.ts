import { CHECKLIST_MARKDOWN } from "@/lib/checklist-markdown";

export async function GET() {
  return new Response(`\uFEFF${CHECKLIST_MARKDOWN}`, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": 'attachment; filename="pre-flight-checklist.md"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
