/** Full static example for /examples/sample-growth-pack (indexable demo output). */
export const publicExamplePack = {
  seoArticle: {
    title: "How Indie Podcasters Turn One Episode Into a Week of SEO Content",
    metaDescription:
      "A practical workflow for converting podcast transcripts into search-ready articles, FAQ snippets, and channel-native social scripts — without hiring a content team.",
    keywords: [
      "podcast to blog post",
      "podcast SEO workflow",
      "repurpose podcast transcript",
      "indie podcaster content marketing",
      "podcast show notes SEO",
    ],
    body: `Most indie podcasters publish an episode and move on. The audio lives on Spotify; Google never sees it.

## Who this is for

Hosts who record weekly but only ship audio — and want one written asset per episode without hiring a writer.

## Key takeaways

- One target keyword per episode keeps the blog post focused.
- FAQ blocks answer how/what questions listeners type into search.
- Social scripts should link back to the article once it is live.

## Start with a rough transcript, not perfect show notes

You do not need a polished script. A Descript export or Riverside transcript with section breaks is enough. The growth pack reorganizes talking points into search intent — you still edit claims and tone before publishing.

## Pick one keyword before you generate

Example: "podcast to blog workflow" beats "content marketing tips." Narrow beats generic when your domain is new.

## Publish the article first, then social

Day 1: blog post with meta description and FAQ accordion. Days 2–5: LinkedIn and X posts that quote one insight and link to the full article. This gives Google a canonical URL to index while social drives the first clicks.

## Conclusion

The bottleneck is rarely ideas — it is packaging. A repeatable transcript → article → FAQ → social loop compounds faster than sporadic show notes.`,
  },
  faq: [
    {
      q: "Do I need a full transcript before using a growth pack?",
      a: "No. Polished show notes or a detailed outline work. Audio upload auto-transcribes up to 5 minutes on the free plan.",
    },
    {
      q: "How long does generation take?",
      a: "Pasted text usually completes in under a minute. A 5-minute audio clip typically takes 30–90 seconds to transcribe and package.",
    },
    {
      q: "Will Google rank the AI draft automatically?",
      a: "No tool guarantees rankings. Edit the draft, publish on your own site, add internal links, and promote it — the pack saves drafting time, not distribution magic.",
    },
  ],
  socialPack: {
    x: "One episode → one SEO article + FAQ blocks + a week of social posts. Stop letting great conversations disappear after publish day.",
    linkedIn:
      "Indie podcasters often treat publishing as the finish line. Search and social need structured follow-through: an article draft, snippet-ready FAQs, and a 7-day rollout plan — all from the same transcript.",
    substack:
      "This week I tested turning a single podcast conversation into a full content pack: blog draft, FAQ blocks, and channel-specific scripts. The bottleneck was never ideas — it was packaging.",
  },
  localSchedule: [
    "Day 1 — Publish SEO article draft to your blog; set meta description in your SEO plugin",
    "Day 2 — Post LinkedIn script with one quote and link to the article",
    "Day 3 — Share one FAQ answer as an X post",
    "Day 4 — Substack teaser using the newsletter script",
    "Day 5 — Clip a highlight; reuse SRT for captions",
    "Day 6 — Internal link from an older post to this article",
    "Day 7 — Review Search Console for impressions (if indexed)",
  ],
  seoReport: {
    targetKeyword: "podcast to blog workflow",
    altTitle: "Podcast to Blog: A Weekly SEO Loop for Indie Hosts",
    editorialAngle:
      "Frame around one listener problem (audio-only discovery) and one outcome (searchable written asset per episode).",
  },
} as const;
