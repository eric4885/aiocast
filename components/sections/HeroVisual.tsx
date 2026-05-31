"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const wavePath =
  "M0 80 Q 40 40 80 80 T 160 80 T 240 60 T 320 85 T 400 50 T 480 80";

function FloatingBadge({
  children,
  className,
  duration,
}: {
  children: ReactNode;
  className?: string;
  duration: number;
}) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -10, 0] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

export function HeroVisual() {
  return (
    <div className="relative mx-auto h-[320px] w-full max-w-xl lg:h-[420px]">
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/15 via-transparent to-accent/20 blur-2xl" />
      <motion.svg
        viewBox="0 0 480 120"
        className="relative h-full w-full text-primary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <defs>
          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <motion.path
          d={wavePath}
          fill="none"
          stroke="url(#waveGrad)"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] as const }}
        />
        <motion.path
          d={wavePath}
          fill="none"
          stroke="rgba(139,92,246,0.35)"
          strokeWidth="8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 1.8,
            ease: [0.22, 1, 0.36, 1] as const,
            delay: 0.1,
          }}
        />
      </motion.svg>

      <FloatingBadge
        duration={4}
        className="absolute left-[8%] top-[12%] flex items-center gap-2 rounded-full border border-border bg-secondary/90 px-3 py-2 text-xs text-muted-foreground shadow-lg"
      >
        <Sparkles className="h-3.5 w-3.5 text-primary" /> Descript
      </FloatingBadge>
      <FloatingBadge
        duration={5}
        className="absolute right-[6%] top-[28%] flex items-center gap-2 rounded-full border border-border bg-secondary/90 px-3 py-2 text-xs text-muted-foreground shadow-lg"
      >
        <Sparkles className="h-3.5 w-3.5 text-accent" /> Riverside
      </FloatingBadge>
      <FloatingBadge
        duration={4.5}
        className="absolute bottom-[18%] left-[22%] flex items-center gap-2 rounded-full border border-border bg-secondary/90 px-3 py-2 text-xs text-muted-foreground shadow-lg"
      >
        <Sparkles className="h-3.5 w-3.5 text-primary" /> ElevenLabs
      </FloatingBadge>
    </div>
  );
}
