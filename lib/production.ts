export function assertProductionReady() {
  if (process.env.NODE_ENV !== "production") return;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "";
  if (!siteUrl || siteUrl.includes("localhost")) {
    console.error(
      "[aiocast] NEXT_PUBLIC_SITE_URL must be your production HTTPS URL (e.g. https://aiocast.com).",
    );
  }

  if (!process.env.RESEND_API_KEY?.trim()) {
    console.error("[aiocast] RESEND_API_KEY is required in production for transactional email.");
  }
}
