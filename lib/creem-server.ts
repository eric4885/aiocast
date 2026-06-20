import { createHmac, timingSafeEqual } from "crypto";
import { publicSiteUrl } from "@/lib/subscribe";

export type CheckoutPlan = "monthly" | "annual";

function apiKey(): string | null {
  return process.env.CREEM_API_KEY?.trim() || null;
}

export function creemEnabled(): boolean {
  return Boolean(apiKey());
}

function apiBase(key: string): string {
  const testMode = process.env.CREEM_TEST_MODE?.trim().toLowerCase();
  if (testMode === "true" || testMode === "1" || key.startsWith("creem_test_")) {
    return "https://test-api.creem.io/v1";
  }
  return "https://api.creem.io/v1";
}

type CreemCheckoutResponse = {
  checkout_url?: string;
  id?: string;
  message?: string;
  error?: string;
};

export async function createProCheckout(opts: {
  plan: CheckoutPlan;
  customerEmail?: string;
}): Promise<{ url: string } | { error: string }> {
  const key = apiKey();
  if (!key) {
    return {
      error: "Payments are not configured yet. Email hello@aiocast.com and we will send a checkout link.",
    };
  }

  const monthlyProduct = process.env.CREEM_PRODUCT_MONTHLY?.trim();
  const annualProduct = process.env.CREEM_PRODUCT_ANNUAL?.trim();
  const productId = opts.plan === "annual" ? annualProduct : monthlyProduct;
  if (!productId) {
    return {
      error: "Creem product IDs missing. Set CREEM_PRODUCT_MONTHLY and CREEM_PRODUCT_ANNUAL.",
    };
  }

  const base = publicSiteUrl().replace(/\/$/, "");
  const body: Record<string, unknown> = {
    product_id: productId,
    success_url: `${base}/pro-toolkit?checkout=success`,
    metadata: { plan: opts.plan, source: "aiocast" },
  };

  if (opts.customerEmail) {
    body.customer = { email: opts.customerEmail };
  }

  if (opts.plan === "monthly") {
    const code = process.env.CREEM_DISCOUNT_FIRST_MONTH?.trim();
    if (code) body.discount_code = code;
  }
  // Annual Early Bird (+2 months) is granted in our backend — no Creem coupon needed.

  const res = await fetch(`${apiBase(key)}/checkouts`, {
    method: "POST",
    headers: {
      "x-api-key": key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = (await res.json()) as CreemCheckoutResponse;
  if (!res.ok) {
    const msg = payload.message || payload.error || `Creem checkout failed (${res.status})`;
    return { error: msg };
  }

  const url = payload.checkout_url;
  if (!url) return { error: "Creem did not return a checkout URL." };
  return { url };
}

export function verifyCreemWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = process.env.CREEM_WEBHOOK_SECRET?.trim();
  if (!secret || !signatureHeader) return false;

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  try {
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(signatureHeader.trim(), "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return expected === signatureHeader.trim();
  }
}

export function productIdToPlan(productId: string): CheckoutPlan {
  const annual = process.env.CREEM_PRODUCT_ANNUAL?.trim();
  return productId === annual ? "annual" : "monthly";
}

export function parsePeriodEnd(iso: unknown): number {
  if (typeof iso !== "string" || !iso) {
    return Date.now() + 365 * 24 * 60 * 60 * 1000;
  }
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : Date.now() + 30 * 24 * 60 * 60 * 1000;
}
