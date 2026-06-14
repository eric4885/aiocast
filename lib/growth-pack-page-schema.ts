import { growthPackAppJsonLd } from "@/lib/growth-pack-app-schema";
import { growthPackFaqJsonLd } from "@/lib/growth-pack-faq-schema";

/** Combined JSON-LD for the SEO growth pack tool page (@graph — validator-safe). */
export function growthPackPageJsonLd() {
  const faq = growthPackFaqJsonLd() as Record<string, unknown>;
  const app = growthPackAppJsonLd() as Record<string, unknown>;
  delete faq["@context"];
  delete app["@context"];
  return {
    "@context": "https://schema.org",
    "@graph": [faq, app],
  };
}
