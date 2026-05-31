"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { faqItems, testimonials } from "@/lib/data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { containerVariants, itemVariants } from "@/lib/motion";

export function TrustFaqSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-accent">Positioning examples</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Outcomes from audio-to-SEO execution loops
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              The quotes below are illustrative composites for communication design — not verified endorsements. Replace
              with real customers when you have permission.
            </p>
            <motion.div
              className="mt-8 space-y-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {testimonials.map((t) => (
                <motion.div key={t.name} variants={itemVariants}>
                  <Card className="border-border/80">
                    <CardContent className="flex gap-4 p-6">
                      <Image
                        src={t.avatar}
                        alt=""
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full"
                      />
                      <div>
                        <p className="font-semibold">{t.name}</p>
                        <p className="text-sm text-muted-foreground">{t.podcast}</p>
                        <p className="mt-3 text-sm text-foreground">{t.quote}</p>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-primary">
                          {t.metric}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div>
            <p className="text-sm font-semibold text-primary">FAQ</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Straight answers before you ship
            </h2>
            <Accordion type="single" collapsible className="mt-8 w-full">
              {faqItems.map((item, i) => (
                <AccordionItem key={item.q} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-base">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
