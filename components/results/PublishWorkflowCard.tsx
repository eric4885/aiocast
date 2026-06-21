import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export function PublishWorkflowCard() {
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="space-y-4 p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">After you generate</p>
          <p className="mt-1 text-lg font-semibold text-foreground">Your publish workflow</p>
          <p className="mt-2 text-sm text-muted-foreground">
            This pack saves drafting time. Search traffic comes after you publish on <strong className="text-foreground">your own site</strong>{" "}
            and promote the article — rankings usually take weeks, not days. No tool guarantees Google traffic.
          </p>
        </div>
        <ol className="list-decimal space-y-3 pl-5 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Edit &amp; publish the SEO article.</strong> Copy or download below,
            paste into your blog/CMS, set title and meta description, and add the FAQ section.
          </li>
          <li>
            <strong className="text-foreground">Run the 7-day schedule.</strong> Post the social scripts after the
            article is live so every link resolves to your canonical URL.
          </li>
          <li>
            <strong className="text-foreground">Check progress in 1–2 weeks.</strong> In Google Search Console, look for
            impressions on your published URL — clicks often lag further behind.
          </li>
        </ol>
        <p className="text-sm text-muted-foreground">
          Step-by-step guide:{" "}
          <Link href="/guides/podcast-to-blog-post" className="font-medium text-primary underline-offset-4 hover:underline">
            podcast to blog post workflow
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  );
}
