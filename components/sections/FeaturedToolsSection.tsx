"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarClock, Copy, FileSearch, Gift, MessageSquareDashed, ScrollText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { containerVariants, itemVariants } from "@/lib/motion";

const bundleCards = [
  {
    title: "📄 SEO Blog Post",
    category: "Google-ready",
    icon: FileSearch,
    value: "2,500-word long-form draft with title, meta, H2 structure, and FAQ blocks.",
    detail: "Built for semantic depth and snippet-friendly structure.",
  },
  {
    title: "📱 Social Scripts",
    category: "Your channels",
    icon: MessageSquareDashed,
    value: "Five post angles for X, LinkedIn, and Substack in your own voice.",
    detail: "Hook-first scripts designed to publish fast and drive engagement.",
  },
  {
    title: "📅 7-Day Publish Plan",
    category: "Execution cadence",
    icon: CalendarClock,
    value: "A timezone-aware publishing plan by platform and region.",
    detail: "Turns random posting into a repeatable distribution rhythm.",
  },
];

const aiHintCards = [
  {
    title: "AI answer visibility",
    icon: ScrollText,
    value: "Your podcast claims can be quoted in assistant-style answers.",
  },
  {
    title: "Compounding distribution",
    icon: Gift,
    value: "One upload becomes a reusable weekly asset drop, not a one-time post.",
  },
];

export function FeaturedToolsSection() {
  const [copied, setCopied] = useState<"" | "x" | "linkedin">("");

  const xPost =
    "Most podcasts publish and disappear. We turn one episode URL into a Google-ready article, social scripts, and a 7-day schedule. That is how you compound audience and search traffic.";
  const linkedInPost =
    "Podcasters do not need more editing tools. They need distribution assets. One URL in, then a 3-piece growth pack out: SEO article, social script matrix, and local publishing schedule.";

  const copyPost = async (platform: "x" | "linkedin", content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(platform);
      window.setTimeout(() => setCopied(""), 1200);
    } catch {
      setCopied("");
    }
  };

  return (
    <section className="border-y border-border bg-[#07070c] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">Why this wins</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            You are not buying software. It is like hiring a full-time SEO operator
            for the cost of one meal per month.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Drop one episode in. Pull a complete growth asset bundle out.
          </p>
        </div>

        <motion.div
          className="mt-10 grid gap-4 lg:grid-cols-[1.25fr_1fr]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <Card className="h-full border-primary/35 bg-gradient-to-br from-primary/10 via-background to-accent/10">
              <CardContent className="space-y-4 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                    Asset Drop Preview
                  </p>
                  <span className="rounded-lg bg-primary/15 p-2 text-primary">
                    <Gift className="h-4 w-4" />
                  </span>
                </div>
                <div className="rounded-xl border border-border/70 bg-background/70 p-4">
                  <p className="text-xs text-muted-foreground">Output package</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    SEO Growth Bundle (ready to copy and ship)
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => copyPost("x", xPost)}
                    >
                      <Copy className="mr-2 h-3 w-3" />
                      {copied === "x" ? "Copied for X" : "One-click copy to X"}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => copyPost("linkedin", linkedInPost)}
                    >
                      <Copy className="mr-2 h-3 w-3" />
                      {copied === "linkedin"
                        ? "Copied for LinkedIn"
                        : "One-click copy to LinkedIn"}
                    </Button>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-1 xl:grid-cols-3">
                  {bundleCards.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="rounded-xl border border-border/70 bg-background/60 p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                              {item.category}
                            </p>
                            <h3 className="text-sm font-semibold">{item.title}</h3>
                          </div>
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <p className="mt-2 text-sm text-foreground">{item.value}</p>
                        <p className="mt-2 text-xs text-muted-foreground">{item.detail}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div className="grid gap-4" variants={itemVariants}>
            {aiHintCards.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="border-border/80">
                  <CardContent className="space-y-3 p-6">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                      <Icon className="h-4 w-4" />
                      {item.title}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.value}</p>
                  </CardContent>
                </Card>
              );
            })}
            <Card className="border-primary/35 bg-background/70">
              <CardContent className="p-6">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Psychological promise</p>
                <p className="mt-2 text-sm text-foreground">
                  You upload one file. Traffic assets drop out.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
