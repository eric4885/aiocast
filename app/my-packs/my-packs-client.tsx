"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type PackRow = {
  id: string;
  title: string;
  createdAt: number;
  resultUrl: string;
};

export function MyPacksClient() {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [requesting, setRequesting] = useState(false);

  const [packs, setPacks] = useState<PackRow[] | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [loadingList, setLoadingList] = useState(Boolean(tokenFromUrl));

  useEffect(() => {
    if (!tokenFromUrl) return;

    let cancelled = false;
    const load = async () => {
      setLoadingList(true);
      setListError(null);
      try {
        const qs = new URLSearchParams({ token: tokenFromUrl });
        const res = await fetch(`/api/my-packs?${qs.toString()}`);
        const payload = (await res.json()) as {
          ok?: boolean;
          error?: string;
          packs?: PackRow[];
        };
        if (cancelled) return;
        if (!res.ok || !payload.ok || !payload.packs) {
          setListError(payload.error ?? "Could not load packs.");
          setPacks(null);
          return;
        }
        setPacks(payload.packs);
      } catch {
        if (!cancelled) {
          setListError("Could not load packs. Check your connection.");
        }
      } finally {
        if (!cancelled) setLoadingList(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [tokenFromUrl]);

  const requestLink = async () => {
    if (!email.trim()) return;
    setRequesting(true);
    setRequestError(null);
    try {
      const res = await fetch("/api/my-packs-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const payload = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !payload.ok) {
        setRequestError(payload.error ?? "Could not send email.");
        return;
      }
      setRequestSent(true);
    } catch {
      setRequestError("Could not send email. Try again.");
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <p className="text-sm text-muted-foreground">
        <Link href="/" className="text-primary hover:underline">
          ← Back home
        </Link>
      </p>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">Find my packs</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Enter the email you used when generating a pack. We&apos;ll send a private link that lists every pack tied to
        that address (last 20). Links expire after 24 hours.
      </p>

      {!tokenFromUrl && (
        <Card className="mt-8">
          <CardContent className="space-y-4 p-6">
            {requestSent ? (
              <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                Check your inbox — we sent a link to {email.trim()}. It expires in 24 hours.
              </p>
            ) : (
              <>
                <label htmlFor="my-packs-email" className="text-sm font-semibold">
                  Email address
                </label>
                <Input
                  id="my-packs-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                <Button disabled={!email.trim() || requesting} onClick={() => void requestLink()}>
                  {requesting ? "Sending…" : "Email me my pack links"}
                </Button>
                {requestError && (
                  <p className="text-sm text-rose-300" role="alert">
                    {requestError}
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {tokenFromUrl && loadingList && (
        <Card className="mt-8">
          <CardContent className="p-6 text-sm text-muted-foreground">Loading your packs…</CardContent>
        </Card>
      )}

      {tokenFromUrl && listError && (
        <Card className="mt-8">
          <CardContent className="space-y-4 p-6">
            <p className="text-sm text-rose-300">{listError}</p>
            <Button asChild variant="secondary">
              <Link href="/my-packs">Request a new link</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {tokenFromUrl && packs && (
        <Card className="mt-8">
          <CardContent className="space-y-4 p-6">
            {packs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No packs found for this email yet. Generate a pack and include your email for backup delivery.
              </p>
            ) : (
              <ul className="space-y-3">
                {packs.map((pack) => (
                  <li key={pack.id} className="rounded-lg border border-border p-4">
                    <p className="font-semibold">{pack.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(pack.createdAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                    <Button asChild size="sm" className="mt-3" variant="secondary">
                      <a href={pack.resultUrl}>Open pack</a>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            <Button asChild variant="secondary">
              <Link href="/tools/seo-growth-pack">Generate a new pack</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <p className="mt-8 text-xs text-muted-foreground">
        Tip: Always use the same email at generation time or on the result page backup form so packs appear here.
      </p>
    </div>
  );
}
