type FaqItem = { q: string; a: string };

export type EpisodeSchemaInput = {
  title: string;
  summary: string;
  faq: FaqItem[];
  /** ISO date — only include when user provides a real publish date. */
  datePublished?: string;
  /** Host / author display name. */
  authorName?: string;
  /** Canonical episode or blog URL on the publisher's domain. */
  canonicalUrl?: string;
  /** ISO 8601 duration e.g. PT45M — only when user provides real length. */
  duration?: string;
  showName?: string;
};

/**
 * Safe @graph JSON-LD: BlogPosting + PodcastEpisode + FAQPage.
 * Omits duration/url/date when not provided — never invents fields.
 */
export function episodeSeoJsonLd(input: EpisodeSchemaInput): string {
  const title = input.title.trim();
  const summary = input.summary.trim().slice(0, 5000);
  const author = input.authorName?.trim() || "Podcast host";
  const show = input.showName?.trim();
  const date = input.datePublished?.trim();
  const url = input.canonicalUrl?.trim();
  const duration = input.duration?.trim();

  const blogPosting: Record<string, unknown> = {
    "@type": "BlogPosting",
    headline: title,
    description: summary,
    author: { "@type": "Person", name: author },
  };
  if (date) blogPosting.datePublished = date;
  if (url) blogPosting.mainEntityOfPage = url;

  const podcastEpisode: Record<string, unknown> = {
    "@type": "PodcastEpisode",
    name: title,
    description: summary,
  };
  if (date) podcastEpisode.datePublished = date;
  if (url) podcastEpisode.url = url;
  if (duration) podcastEpisode.duration = duration;
  if (show) {
    podcastEpisode.partOfSeries = { "@type": "PodcastSeries", name: show };
  }

  const graph: Record<string, unknown>[] = [blogPosting, podcastEpisode];

  const faqEntity = input.faq
    .filter((item) => item.q.trim() && item.a.trim())
    .slice(0, 6)
    .map((item) => ({
      "@type": "Question",
      name: item.q.trim(),
      acceptedAnswer: { "@type": "Answer", text: item.a.trim() },
    }));

  if (faqEntity.length > 0) {
    graph.push({
      "@type": "FAQPage",
      name: `${title} — FAQ`,
      mainEntity: faqEntity,
    });
  }

  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2);
}
