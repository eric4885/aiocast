import type { Metadata } from "next";
import { Suspense } from "react";
import { ResultClient } from "./result-client";

export const metadata: Metadata = {
  title: "Your growth pack",
  description: "Generated SEO article, FAQ blocks, social scripts, SRT, and highlights.",
  robots: { index: false, follow: false },
};

export default function ResultPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { token?: string };
}) {
  const token = typeof searchParams?.token === "string" ? searchParams.token : null;

  return (
    <Suspense fallback={<div className="min-h-[40vh]" aria-hidden />}>
      <ResultClient id={params.id} token={token} />
    </Suspense>
  );
}
