"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pageVariants } from "@/lib/motion";

export function HeroHome() {
  const router = useRouter();
  const [url, setUrl] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      router.push("/tools/seo-growth-pack");
      return;
    }
    router.push("/tools/seo-growth-pack?mode=audio");
  };

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-hero bg-grid-subtle">
      <div className="mx-auto max-w-5xl px-4 pb-20 pt-16 sm:px-6 lg:pb-24 lg:pt-20">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          initial="hidden"
          animate="visible"
          variants={pageVariants}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent sm:text-sm">
            Audio To SEO Growth Pack
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-[58px]">
            Stop publishing episodes that disappear.
            <span className="block text-primary">Turn every episode URL into search assets.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Paste your podcast URL and generate three packaged assets: 📄 SEO Blog Post · 📱 Social Scripts · 📅 7-Day
            Publish Plan.
          </p>

          <form onSubmit={handleSubmit} className="mx-auto mt-7 max-w-3xl">
            <div className="rounded-2xl border border-primary/40 bg-background/85 p-3 shadow-[0_16px_44px_rgba(26,26,46,0.45)] ring-1 ring-primary/20">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste your podcast episode URL..."
                    className="h-12 border-primary/30 bg-background pl-9"
                  />
                </div>
                <Button type="submit" size="lg" className="h-12 px-7">
                  Generate My SEO Pack
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">
            1 free trial run. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
