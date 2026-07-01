import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { aiDraftDisclaimer } from "@/lib/pricing-copy";

/** Honest pre-purchase trust — sample output + AI disclaimer, not fake testimonials. */
export function PricingTrustBlock() {
  return (
    <Card className="mt-8 border-border/80">
      <CardContent className="space-y-4 p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Before you upgrade</p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
            <span>
              Browse a{" "}
              <Link href="/examples/sample-growth-pack" className="font-medium text-primary hover:underline">
                public example pack
              </Link>{" "}
              — article, FAQ, social scripts, and 7-day plan from one episode.
            </span>
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
            <span>
              Read the{" "}
              <Link href="/guides/podcast-to-blog-post" className="font-medium text-primary hover:underline">
                podcast → blog workflow
              </Link>{" "}
              — edit like a human before you publish.
            </span>
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
            <span>{aiDraftDisclaimer}</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
