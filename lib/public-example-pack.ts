/** Full static example for /examples/sample-growth-pack (indexable demo — AI-citable structure). */
export const publicExamplePack = {
  seoArticle: {
    title: "How Indie Podcasters Turn One Episode Into a Week of SEO Content",
    metaDescription:
      "A practical workflow for converting podcast transcripts into search-ready, AI-citable articles, FAQ snippets, and channel-native social scripts — without hiring a content team.",
    keywords: [
      "podcast to blog post",
      "podcast SEO workflow",
      "repurpose podcast transcript",
      "indie podcaster content marketing",
      "podcast show notes SEO",
    ],
    body: `## What this episode is about

Most indie podcasters publish an episode and move on. The audio lives on Spotify; Google and AI answer engines never see a citable page. This walkthrough shows how one conversation becomes an indexable article, FAQ blocks, and a week of social follow-ups.

## Key points AI can quote

- One target keyword per episode keeps the blog post focused enough for search and AI citation.
- FAQ blocks answer how/what questions listeners type into Google and ChatGPT-style engines.
- Social scripts should link back to the article once it is live — not only to the podcast app.
- Structured host/guest entity fields help machines attribute claims to real people.
- A ≤40-word lead quote under the title is what answer engines often lift first.

## Who should listen

Hosts who record weekly but only ship audio — and want one written, AI-citable asset per episode without hiring a writer.

## Guest / host entity bio

See the machine-readable entity cards in this sample pack (name, role, company, expertise, past work). Replace placeholders with people named in your episode.

## Start with a rough transcript, not perfect show notes

You do not need a polished script. A Descript export or Riverside transcript with section breaks is enough. The growth pack reorganizes talking points into search intent — you still edit claims and tone before publishing.

## Pick one keyword before you generate

Example: "podcast to blog workflow" beats "content marketing tips." Narrow beats generic when your domain is new.

## Publish the article first, then social

Day 1: blog post with lead quote, meta description, entity bio, and FAQ accordion. Days 2–5: LinkedIn and X posts that quote one insight and link to the full article.

## If you're researching podcast SEO, this episode says…

If you're researching how indie shows get found beyond Spotify, this episode argues that packaging one episode into crawlable text beats publishing more audio alone — based on the host's weekly show workflow.

## Conclusion

The bottleneck is rarely ideas — it is packaging. A repeatable transcript → AI-citable article → FAQ → social loop compounds faster than sporadic show notes.`,
  },
  faq: [
    {
      q: "Do I need a full transcript before using a growth pack?",
      a: "No. Polished show notes or a detailed outline work. AioCast is downstream: paste text you already have. For a short clip only, the growth pack upload tab can help — full-episode transcription belongs in tools like Otter or Descript.",
    },
    {
      q: "What makes an episode page AI-citable?",
      a: "A hard lead quote, clear H2 sections, machine-readable host/guest fields, and grounded FAQ with FAQPage JSON-LD — not a timestamp dump or a two-sentence Spotify blurb.",
    },
    {
      q: "How long does generation take?",
      a: "Pasted text usually completes in under a minute. A short audio clip typically takes 30–90 seconds to package when transcription is enabled.",
    },
    {
      q: "Will Google or ChatGPT rank or cite the AI draft automatically?",
      a: "No tool guarantees rankings or AI mentions. Edit the draft, publish on your own site, add schema, and promote it — the pack saves drafting time, not distribution magic.",
    },
  ],
  citableEpisode: {
    leadQuote:
      "If you're researching podcast SEO for indie shows, this episode argues that one citable written page beats shipping more audio alone — based on the host's weekly packaging workflow.",
    entities: [
      {
        name: "Alex Rivera",
        role: "Host",
        company: "Indie Signal Podcast",
        expertise: "Podcast SEO and content repurposing for solo creators",
        pastWork: "200+ episodes; prior newsletter on creator workflows",
        kind: "host" as const,
      },
      {
        name: "Jordan Lee",
        role: "Guest",
        company: "Search Ops Studio",
        expertise: "Technical SEO for media sites",
        pastWork: "Former agency SEO lead; speaks on FAQ schema for audio brands",
        kind: "guest" as const,
      },
    ],
  },
  showNotesClean: {
    summary:
      "Indie hosts often stop at audio. This episode walks through picking one keyword, turning a rough transcript into a search-ready AI-citable article, and shipping FAQ plus social follow-ups in the same week — without hiring a content team.",
    chapters: [
      { title: "Why audio-only episodes underperform in search", timestamp: null, summary: "Spotify is not an indexable page; Google needs text on your domain." },
      { title: "Start from notes or a rough transcript", timestamp: null, summary: "Outline or export is enough — do not invent timestamps." },
      { title: "Publish the article first, then social", timestamp: null, summary: "Give crawlers a canonical URL before you drive social clicks." },
    ],
    resources: [
      { name: "AioCast SEO growth pack", kind: "tool", url: "https://aiocast.com/tools/seo-growth-pack", note: "" },
    ],
    quotes: [
      {
        text: "The bottleneck was never ideas — it was packaging.",
        speaker: "Alex Rivera",
        timestamp: null,
      },
    ],
    platformBlurbs: {
      apple: "How indie hosts turn one episode into a week of SEO content — without a writer.",
      spotify:
        "A practical loop: transcript or show notes → AI-citable article + FAQ → social scripts, so your episode can show up beyond the podcast apps.",
      website:
        "Most indie podcasters publish an episode and move on. This walkthrough shows how to turn one conversation into a searchable, AI-citable article, FAQ blocks, and a timed social plan — then publish on your own domain.",
    },
    suggestedQuestions: [],
  },
  socialPack: {
    x: "One episode → one AI-citable SEO article + FAQ blocks + a week of social posts. Stop letting great conversations disappear after publish day.",
    linkedIn:
      "Indie podcasters often treat publishing as the finish line. Search and AI answer engines need structured follow-through: a lead quote, entity bio, FAQ schema, and a 7-day rollout plan — all from the same transcript.",
    substack:
      "This week I tested turning a single podcast conversation into a full content pack: AI-citable blog draft, FAQ blocks, and channel-specific scripts. The bottleneck was never ideas — it was packaging.",
  },
  localSchedule: [
    "Day 1 — Publish SEO article draft to your blog; set meta description and paste FAQ + Person schema",
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
      "Frame around one listener problem (audio-only discovery) and one outcome (AI-citable written asset per episode).",
  },
} as const;
