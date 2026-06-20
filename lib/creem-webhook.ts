import {
  productIdToPlan,
  parsePeriodEnd,
  type CheckoutPlan,
} from "@/lib/creem-server";
import {
  setProBySubscriptionId,
  setProCanceled,
  setProActive,
  type ProPlan,
} from "@/lib/pro-subscription";
import { activateProWithEarlyBird, monthsFromNow } from "@/lib/pro-early-bird";
type CreemCustomer = { email?: string; id?: string };
type CreemProduct = { id?: string; billing_period?: string };
type CreemSubscription = {
  id?: string;
  status?: string;
  product?: CreemProduct | string;
  customer?: CreemCustomer | string;
  current_period_end_date?: string;
  metadata?: Record<string, unknown>;
};

type CreemWebhookPayload = {
  eventType?: string;
  object?: CreemSubscription & {
    subscription?: CreemSubscription;
    customer?: CreemCustomer;
    product?: CreemProduct | string;
    metadata?: Record<string, unknown>;
  };
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function customerEmailFrom(obj: Record<string, unknown>): string {
  const customer = asRecord(obj.customer);
  const email = customer?.email;
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function subscriptionFromPayload(payload: CreemWebhookPayload): CreemSubscription | null {
  const root = payload.object;
  if (!root || typeof root !== "object") return null;
  const rec = root as Record<string, unknown>;

  if (rec.object === "subscription" || (typeof rec.id === "string" && rec.id.startsWith("sub_"))) {
    return root as CreemSubscription;
  }

  if (rec.subscription && typeof rec.subscription === "object") {
    return rec.subscription as CreemSubscription;
  }

  return null;
}

function productIdFromSubscription(sub: CreemSubscription): string {
  if (typeof sub.product === "string") return sub.product;
  if (sub.product && typeof sub.product === "object" && sub.product.id) return sub.product.id;
  return "";
}

function planFromSubscription(sub: CreemSubscription): ProPlan {
  const meta = sub.metadata;
  if (meta && typeof meta.plan === "string") {
    return meta.plan === "annual" ? "annual" : "monthly";
  }
  const productId = productIdFromSubscription(sub);
  if (productId) return productIdToPlan(productId) as ProPlan;
  if (sub.product && typeof sub.product === "object" && sub.product.billing_period?.includes("year")) {
    return "annual";
  }
  return "monthly";
}

export async function handleCreemWebhookEvent(payload: CreemWebhookPayload): Promise<void> {
  const eventType = payload.eventType;
  if (!eventType) return;

  const root = asRecord(payload.object);

  if (eventType === "checkout.completed" && root) {
    const email = customerEmailFrom(root);
    const nestedSub = asRecord(root.subscription) as CreemSubscription | null;
    if (email && nestedSub?.id) {
      const sub: CreemSubscription = {
        ...nestedSub,
        customer: nestedSub.customer ?? (asRecord(root.customer) as CreemCustomer),
        metadata: nestedSub.metadata ?? (asRecord(root.metadata) ?? undefined),
      };
      await activateFromSubscription(sub, email);
    } else if (email) {
      const meta = asRecord(root.metadata);
      const plan: CheckoutPlan = meta?.plan === "annual" ? "annual" : "monthly";
      if (plan === "annual") {
        await activateProWithEarlyBird(email, {
          plan: "annual",
          creemPeriodEnd: monthsFromNow(12),
        });
      } else {
        await setProActive(email, {
          plan: "monthly",
          currentPeriodEnd: monthsFromNow(1),
        });
      }
    }
    return;
  }

  const sub = subscriptionFromPayload(payload);
  if (!sub?.id) return;

  const email =
    (sub.customer && typeof sub.customer === "object" ? sub.customer.email?.trim().toLowerCase() : "") ||
    (root ? customerEmailFrom(root) : "");

  if (eventType === "subscription.paid" || eventType === "subscription.active") {
    if (email) await activateFromSubscription(sub, email);
    return;
  }

  if (
    eventType === "subscription.canceled" ||
    eventType === "subscription.expired" ||
    eventType === "subscription.past_due"
  ) {
    const updated = await setProBySubscriptionId(sub.id, {
      status: "canceled",
      currentPeriodEnd: Date.now(),
    });
    if (!updated && email) await setProCanceled(email);
  }
}

async function activateFromSubscription(sub: CreemSubscription, email: string) {
  const customerId =
    sub.customer && typeof sub.customer === "object" ? sub.customer.id : undefined;
  const plan = planFromSubscription(sub);
  const creemEnd = parsePeriodEnd(sub.current_period_end_date);

  await activateProWithEarlyBird(email, {
    plan,
    creemPeriodEnd: plan === "annual" ? creemEnd : creemEnd,
    creemCustomerId: customerId,
    creemSubscriptionId: sub.id,
  });
}
