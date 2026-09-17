/** Static example shown on the SEO growth pack tool page. */
export const samplePack = {
  seoArticle: {
    title: "How Indie Podcasters Turn One Episode Into a Week of SEO Content",
    metaDescription:
      "A practical workflow for converting podcast transcripts into search-ready articles, FAQ snippets, and channel-native social scripts — without hiring a content team.",
    body: `Most indie podcasters publish an episode and move on. The audio lives on Spotify; Google never sees it.

The fix is a repeatable content loop: transcript → structured article → FAQ blocks → social scripts → a timed publish calendar.

In this example episode, the host walks through picking one target keyword per episode, drafting H2 sections from natural talking points, and repurposing quotes for X and LinkedIn without sounding like a press release.

Key takeaway: you do not need perfect show notes on day one. A rough transcript plus clear section breaks is enough for a solid first draft you can edit in twenty minutes.`,
  },
  faq: [
    {
      q: "Do I need a full transcript before using a growth pack?",
      a: "No. Polished show notes or a detailed outline work. Paste text you already have — AioCast does not replace full-episode transcription tools.",
    },
    {
      q: "How long does generation take?",
      a: "Pasted text usually completes in under a minute.",
    },
  ],
  showNotesClean: {
    summary:
      "Turn one indie podcast episode into a searchable article, FAQ, and social follow-ups — starting from notes or a transcript you already have.",
    chapters: [
      { title: "Audio-only discovery problem", timestamp: null, summary: "Why app-only blurbs do not rank." },
      { title: "Keyword + outline before generate", timestamp: null, summary: "One intent per episode." },
    ],
    resources: [],
    quotes: [],
    platformBlurbs: {
      apple: "One episode → a week of SEO content for indie hosts.",
      spotify: "Paste notes or a transcript, get an article + FAQ + social scripts for your own site.",
      website:
        "A practical packaging loop for solo hosts: structured show notes, blog draft, FAQ, and a 7-day publish plan.",
    },
  },
  socialPack: {
    x: "One episode → one SEO article + FAQ blocks + a week of social posts. Stop letting great conversations disappear after publish day. 🎙️",
    linkedIn:
      "Indie podcasters often treat publishing as the finish line. Search and social need structured follow-through: an article draft, snippet-ready FAQs, and a 7-day rollout plan — all from the same transcript.",
    substack:
      "This week I tested turning a single podcast conversation into a full content pack: blog draft, FAQ blocks, and channel-specific scripts. The bottleneck was never ideas — it was packaging.",
  },
  localSchedule: [
    "Day 1 — Publish SEO article draft to blog",
    "Day 2 — Post LinkedIn thread from social script",
    "Day 3 — Share FAQ snippet on X",
    "Day 4 — Newsletter teaser via Substack script",
    "Day 5 — Repost top quote as short-form clip hook",
  ],
};
