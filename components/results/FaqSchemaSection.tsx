"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Copy, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EarlyBirdBadge } from "@/components/pricing/EarlyBirdBadge";
import { faqJsonLd } from "@/lib/faq-schema";

type FaqItem = { q: string; a: string };

type Props = {
  articleTitle: string;
  faq: FaqItem[];
  defaultEmail?: string;
};

export function FaqSchemaSection({ articleTitle, faq, defaultEmail = "" }: Props) {
  const [email, setEmail] = useState(defaultEmail);
  const [isPro, setIsPro] = useState<boolean | null>(null);
  const [earlyBird, setEarlyBird] = useState(false);
  const [checking, setChecking] = useState(false);
  const [copied, setCopied] = useState(false);

  const schema = faqJsonLd(articleTitle, faq);

  const checkPro = useCallback(async () => {
    const trimmed = email.trim();
    if (!trimmed.includes("@")) {
      setIsPro(false);
      return;
    }
    setChecking(true);
    try {
      const qs = new URLSearchParams({ email: trimmed });
      const res = await fetch(`/api/pro/status?${qs.toString()}`);
      const payload = (await res.json()) as { pro?: boolean; earlyBird?: boolean };
      setIsPro(Boolean(payload.pro));
      setEarlyBird(Boolean(payload.earlyBird));
    } catch {
      setIsPro(false);
    } finally {
      setChecking(false);
    }
  }, [email]);

  const copySchema = async () => {
    try {
      await navigator.clipboard.writeText(schema);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="rounded-lg border border-border bg-background/40 p-4 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">FAQ JSON-LD (Pro)</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Paste into your CMS or theme for FAQ rich results and clearer AI citations.
          </p>
        </div>
        {isPro ? (
          <Button size="sm" variant="secondary" onClick={() => void copySchema()}>
            <Copy className="mr-2 h-4 w-4" />
            {copied ? "Copied" : "Copy schema"}
          </Button>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" aria-hidden />
            Pro feature
          </span>
        )}
      </div>

      {isPro !== true && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1">
            <label htmlFor="faq-pro-email" className="text-xs font-medium text-muted-foreground">
              Pro email
            </label>
            <Input
              id="faq-pro-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsPro(null);
                setEarlyBird(false);
              }}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <Button size="sm" variant="secondary" disabled={checking} onClick={() => void checkPro()}>
            {checking ? "Checking…" : "Unlock"}
          </Button>
        </div>
      )}

      {isPro === false && (
        <p className="text-xs text-muted-foreground">
          No active Pro on this email.{" "}
          <Link href="/pro-toolkit" className="font-medium text-primary underline-offset-4 hover:underline">
            Upgrade from $1.90 first month
          </Link>
        </p>
      )}

      {isPro && earlyBird && <EarlyBirdBadge />}

      {isPro && (
        <pre className="max-h-40 overflow-auto rounded-md border border-border bg-background p-3 text-[11px] text-muted-foreground">
          {schema}
        </pre>
      )}
    </div>
  );
}
