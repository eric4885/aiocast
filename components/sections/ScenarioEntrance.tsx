"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarClock, FileText, MessageSquareText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { containerVariants, itemVariants } from "@/lib/motion";

const scenarios = [
  {
    title: "Audio → SEO article",
    description:
      "Generate a search-intent article draft with H2 structure, meta copy, FAQ blocks, and internal link hints.",
    href: "/ai-podcast-editing-stack",
    cta: "Open tool → Content OS",
    pill: "Tool",
    tags: ["Intent map", "Meta pack", "FAQ schema"],
    icon: FileText,
    topBar: "from-primary via-indigo-400 to-accent",
  },
  {
    title: "Audio → social scripts",
    description:
      "Turn one episode into post-ready scripts for X, LinkedIn, newsletter intros, and short captions.",
    href: "/podcast-to-short-video",
    cta: "Preview workflow →",
    pill: "Coming soon",
    tags: ["Hook variants", "Thread outline", "CTA copy"],
    icon: MessageSquareText,
    topBar: "from-accent via-fuchsia-400 to-primary",
  },
  {
    title: "Localized publish plan",
    description:
      "Get timezone-aware posting recommendations so your weekly content loop runs predictably across regions.",
    href: "/remote-recording-setup",
    cta: "Read playbook →",
    pill: "Blog",
    tags: ["Timezone", "Cadence", "Channel fit"],
    icon: CalendarClock,
    topBar: "from-slate-500 via-primary to-slate-700",
  },
];

export function ScenarioEntrance() {
  return (
    <section className="relative py-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-accent">Pick your output</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Three growth workflows
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Keep the same audio input, choose a different growth output pack.
            </p>
          </div>
        </div>

        <motion.div
          className="mt-10 grid gap-4 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {scenarios.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.title} variants={itemVariants}>
                <div className="group relative h-full">
                  <Card className="relative h-full overflow-hidden border-border/80">
                    <div className={`h-1.5 w-full bg-gradient-to-r ${s.topBar}`} />
                    <CardContent className="space-y-5 p-6">
                      <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <Icon className="h-6 w-6" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-xl font-semibold">{s.title}</h3>
                            <Badge className="bg-secondary text-[10px] uppercase tracking-wide text-muted-foreground">
                              {s.pill}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{s.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {s.tags.map((t) => (
                          <Badge key={t}>{t}</Badge>
                        ))}
                      </div>
                      <Button variant="secondary" className="w-full" asChild>
                        <Link href={s.href}>
                          {s.cta}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
