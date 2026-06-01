"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ResultError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <Card>
        <CardContent className="space-y-4 p-8 text-center">
          <p className="font-semibold text-rose-300">Could not open your growth pack</p>
          <p className="text-sm text-muted-foreground">
            Something went wrong while loading this page. Try again from your email link, or generate a new pack.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button type="button" onClick={() => reset()}>
              Try again
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/tools/audio-quality-checker">Generate a new pack</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
