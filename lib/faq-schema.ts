type FaqItem = { q: string; a: string };

/** FAQPage JSON-LD for CMS paste or <script type="application/ld+json">. */
export function faqJsonLd(articleTitle: string, faq: FaqItem[]): string {
  const mainEntity = faq
    .filter((item) => item.q.trim() && item.a.trim())
    .map((item) => ({
      "@type": "Question",
      name: item.q.trim(),
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a.trim(),
      },
    }));

  const payload = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: `${articleTitle.trim()} — FAQ`,
    mainEntity,
  };

  return JSON.stringify(payload, null, 2);
}
