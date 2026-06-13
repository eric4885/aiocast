import type { Metadata } from "next";
import Link from "next/link";
import { GuideLayout } from "@/components/guides/GuideLayout";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Podcast show notes template — what to include before SEO",
  description:
    "A minimal show notes outline that makes transcript-to-blog repurposing faster. Free recording checklist included.",
  alternates: { canonical: `${siteConfig.url}/guides/show-notes-template` },
  openGraph: {
    title: "Podcast show notes template",
    url: `${siteConfig.url}/guides/show-notes-template`,
  },
};

export default function ShowNotesTemplateGuidePage() {
  return (
    <GuideLayout
      title="Podcast show notes template (SEO-ready outline)"
      description="Better inputs produce better SEO drafts. You do not need a novel — this outline is enough to feed a growth pack or your own writing."
    >
      <h2>Copy-paste outline</h2>
      <pre className="overflow-x-auto rounded-lg border border-border bg-secondary/40 p-4 text-sm text-foreground/90">{`Episode title:
One-sentence hook (who this is for + outcome):

3–5 bullet takeaways:
-
-
-

Topics covered (H2 seeds):
-
-

Guest / links mentioned:
-

One listener question this episode answers:`}</pre>

      <h2>Why each field matters</h2>
      <ul>
        <li>
          <strong>Hook</strong> — becomes meta description fodder; keep under ~155 characters when you adapt it.
        </li>
        <li>
          <strong>Takeaways</strong> — map directly to FAQ questions and social hooks.
        </li>
        <li>
          <strong>Topics covered</strong> — seed H2 headings for the blog post (rename before publish).
        </li>
        <li>
          <strong>Listener question</strong> — pick one for your primary keyword angle.
        </li>
      </ul>

      <h2>Before you record</h2>
      <p>
        Clean audio means cleaner transcripts. Use our{" "}
        <Link href="/resources/pre-flight-checklist" className="text-primary hover:underline">
          pre-flight recording checklist
        </Link>{" "}
        for gain staging, backups, and room noise — especially if you plan to upload audio for auto-transcription.
      </p>

      <h2>From outline to full pack</h2>
      <p>
        Paste this outline (or a full transcript) into the{" "}
        <Link href="/tools/seo-growth-pack" className="text-primary hover:underline">
          Generate SEO pack
        </Link>{" "}
        tool. Pasted text is the fastest path; audio up to 5 minutes works when you do not have notes yet.
      </p>
    </GuideLayout>
  );
}
