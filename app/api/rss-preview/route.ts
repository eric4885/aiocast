import { NextResponse } from "next/server";
import { previewRssFromXml } from "@/lib/rss-feed-preview";

const BLOCKED_HOST = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "metadata.google.internal",
]);

function assertFetchableUrl(raw: string): URL {
  let u: URL;
  try {
    u = new URL(raw.trim());
  } catch {
    throw new Error("Invalid URL");
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new Error("Only http(s) RSS URLs are allowed");
  }
  const host = u.hostname.toLowerCase();
  if (BLOCKED_HOST.has(host) || host.endsWith(".localhost")) {
    throw new Error("That host is not allowed");
  }
  if (/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host)) {
    throw new Error("Private network hosts are not allowed");
  }
  return u;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" } as const, { status: 400 });
  }
  const url = body && typeof body === "object" && typeof (body as Record<string, unknown>).url === "string"
    ? String((body as Record<string, unknown>).url).trim()
    : "";
  if (!url) {
    return NextResponse.json({ ok: false, error: "Missing url" } as const, { status: 400 });
  }

  let fetchUrl: URL;
  try {
    fetchUrl = assertFetchableUrl(url);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Bad URL";
    return NextResponse.json({ ok: false, error: msg } as const, { status: 400 });
  }

  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 14_000);

  try {
    const res = await fetch(fetchUrl.toString(), {
      signal: ac.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "AioCastRSSPreview/1.0 (+https://AioCast.com)",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `Feed returned HTTP ${res.status}` } as const,
        { status: 502 },
      );
    }
    const text = await res.text();
    if (!text || text.length < 40) {
      return NextResponse.json({ ok: false, error: "Empty or too-short response" } as const, { status: 502 });
    }
    if (text.length > 2_500_000) {
      return NextResponse.json({ ok: false, error: "Feed response too large" } as const, { status: 413 });
    }
    const preview = previewRssFromXml(text);
    return NextResponse.json({ ...preview, feedUrl: fetchUrl.toString() } as const);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Fetch failed";
    const aborted = e instanceof Error && e.name === "AbortError";
    return NextResponse.json(
      { ok: false, error: aborted ? "Timed out fetching feed" : msg } as const,
      { status: 502 },
    );
  } finally {
    clearTimeout(t);
  }
}
