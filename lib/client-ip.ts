/**
 * Best-effort client IP for rate limits.
 * On Cloudflare (production), prefer CF-Connecting-IP — do not trust
 * leftmost X-Forwarded-For (clients can spoof it).
 */
export function getClientIp(req: Request): string {
  const cf = req.headers.get("cf-connecting-ip")?.trim();
  if (cf) return cf;

  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    // Without CF, prefer the last hop (usually appended by a trusted proxy).
    // Spoofable if the edge is not Cloudflare — local/dev only in practice.
    if (parts.length > 0) return parts[parts.length - 1]!;
  }

  return "unknown";
}
