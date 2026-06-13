import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { publicExamplePack } from "@/lib/public-example-pack";

function renderBody(body: string) {
  return body.split(/\n\n+/).map((block, i) => {
    const trimmed = block.trim();
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={i} className="mt-6 text-lg font-semibold text-foreground">
          {trimmed.slice(3)}
        </h2>
      );
    }
    if (trimmed.startsWith("- ")) {
      const items = trimmed.split("\n").filter((l) => l.startsWith("- "));
      return (
        <ul key={i} className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
          {items.map((item) => (
            <li key={item}>{item.slice(2)}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {trimmed}
      </p>
    );
  });
}

export function PublicPackPreview() {
  const pack = publicExamplePack;
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4 p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Example output · SEO article</p>
          <p className="text-xl font-bold text-foreground">{pack.seoArticle.title}</p>
          <p className="text-sm text-muted-foreground">{pack.seoArticle.metaDescription}</p>
          {pack.seoArticle.keywords.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Keywords: {pack.seoArticle.keywords.join(", ")}
            </p>
          )}
          <div className="rounded-lg border border-border bg-background/40 p-4">{renderBody(pack.seoArticle.body)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 p-6">
          <p className="font-semibold">FAQ blocks</p>
          {pack.faq.map((f) => (
            <div key={f.q} className="rounded-lg border border-border p-3">
              <p className="text-sm font-medium">{f.q}</p>
              <p className="mt-1 text-sm text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-6">
          <p className="font-semibold">Social scripts</p>
          {(["x", "linkedIn", "substack"] as const).map((key) => (
            <div key={key} className="rounded-lg border border-border bg-background/40 p-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {key === "x" ? "X" : key === "linkedIn" ? "LinkedIn" : "Substack"}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{pack.socialPack[key]}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 p-6">
          <p className="font-semibold">7-day publish schedule</p>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            {pack.localSchedule.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2 p-6">
          <p className="font-semibold">SEO report (editorial hints)</p>
          <p className="text-sm text-muted-foreground">Target keyword: {pack.seoReport.targetKeyword}</p>
          <p className="text-sm text-muted-foreground">Alt title: {pack.seoReport.altTitle}</p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground/85">Editorial angle hint:</span>{" "}
            {pack.seoReport.editorialAngle}
          </p>
          <p className="text-xs text-muted-foreground">
            Editorial hints only — not live search volume, ranking, or competitor data.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col items-center gap-3 pb-4 sm:flex-row sm:justify-center">
        <Button size="lg" asChild>
          <Link href="/tools/seo-growth-pack">Generate your own pack</Link>
        </Button>
        <Button size="lg" variant="secondary" asChild>
          <Link href="/guides/podcast-to-blog-post">Read the workflow guide</Link>
        </Button>
      </div>
    </div>
  );
}
