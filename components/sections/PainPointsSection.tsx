"use client";

import { FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Flame, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { containerVariants, itemVariants } from "@/lib/motion";

export function PainPointsSection() {
  const [topic, setTopic] = useState("");
  const [submittedTopic, setSubmittedTopic] = useState("AI tools");
  const [revealed, setRevealed] = useState(false);

  const bestTitle = useMemo(
    () => `2026 Must-Have: ${submittedTopic} That Save 10+ Hours/Week`,
    [submittedTopic],
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = topic.trim();
    if (!trimmed) return;
    setSubmittedTopic(trimmed);
    setRevealed(true);
  };

  return (
    <section className="border-y border-border bg-[#07070c] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-primary">No-signup instant tool</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Title Spark
          </h2>
          <p className="mt-3 text-muted-foreground">
            Enter a topic and get an immediate 3-panel title diagnosis. No registration. No redirect.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 max-w-3xl">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder='Enter a topic, e.g. "AI tools for solopreneurs"'
              className="h-11"
            />
            <Button type="submit" className="h-11 px-6">
              Analyze
            </Button>
          </div>
        </form>

        {revealed && (
          <motion.div
            className="mt-10 space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-lg font-semibold text-foreground">
              Here is what Title Spark found for &quot;{submittedTopic}&quot;
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <motion.div variants={itemVariants}>
                <Card className="h-full border-border/80">
                  <CardContent className="space-y-4 p-6">
                    <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Flame className="h-4 w-4 text-warning" />
                      Best title
                    </p>
                    <p className="text-xl font-semibold leading-snug">{bestTitle}</p>
                    <p className="text-sm text-muted-foreground">Illustrative estimate — not live listen data</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="h-full border-border/80">
                  <CardContent className="space-y-4 p-6">
                    <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      Search data
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>&quot;{submittedTopic.toLowerCase()}&quot; monthly demand: medium-high</p>
                      <p>&quot;tech talk&quot; monthly demand: low</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Related long-tail terms:</p>
                      <ul className="mt-1 list-disc pl-5 text-sm text-muted-foreground">
                        <li>{submittedTopic.toLowerCase()} for freelancers</li>
                        <li>best {submittedTopic.toLowerCase()} 2026</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="h-full border-border/80">
                  <CardContent className="space-y-4 p-6">
                    <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <ShieldAlert className="h-4 w-4 text-warning" />
                      Current title risk check
                    </p>
                    <p className="text-xl font-semibold">&quot;{submittedTopic}&quot;</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>- weak target keyword</li>
                      <li>- no emotional hook</li>
                      <li>- missing specific number</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="flex flex-col items-center justify-between gap-3 p-5 text-center sm:flex-row sm:text-left">
                <p className="text-sm text-muted-foreground">
                  Save full report (5 title variants + competitor scan + optimization tips)
                </p>
                <Button variant="secondary">Save Instantly (Free Signup)</Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  );
}
