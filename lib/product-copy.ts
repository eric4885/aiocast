/** Single product promise — use across home, tool, results, footer. */
export const productPromise = {
  /** Who + what in one sentence */
  oneLiner:
    "For solo podcasters without an editor: paste one episode's show notes or transcript, get a free SEO blog draft you can publish on your own site.",
  /** Short hero H1 */
  headlineLead: "Paste show notes.",
  headlineAccent: "Get an SEO blog draft.",
  /** Document title — action keyword + product result (home SEO, keep H1 conversion-focused). */
  seoTitle: "Turn a podcast into a blog post — free SEO draft from show notes",
  seoDescription:
    "Turn a podcast into a blog post: paste show notes or a transcript, get a free SEO blog draft for your own site. FAQ and social scripts included.",
  /** GEO / AI citation line — use on tool pages, not as a ranking guarantee */
  geoLine:
    "Structured drafts with clear FAQ blocks help Google — and AI answer engines — surface and cite your podcast content on your domain.",
  /** Supporting line under H1 */
  support:
    "Built for indie hosts — edit the draft, publish on your domain. FAQ and social scripts come with the pack.",
  /** Primary CTA */
  cta: "Generate free blog draft",
  /** What the main output is called */
  primaryOutput: "SEO blog draft",
} as const;

/** Homepage scene entries — clumsy-method situations, not a tool directory. */
export const homeScenes = [
  {
    id: "has-notes",
    title: "I have show notes — I need a blog post",
    description: "Paste your notes or transcript and get an editable SEO blog draft for your own site.",
    href: "/tools/seo-growth-pack#pack-transcript-only",
    cta: "Generate free blog draft",
    primary: true,
  },
  {
    id: "seo-check",
    title: "I'm about to publish — did I miss SEO basics?",
    description: "Tick keyword, title, FAQ, and promotion items before you hit publish. No signup.",
    href: "/resources/podcast-to-blog-seo-checklist",
    cta: "Open SEO checklist",
    primary: false,
  },
  {
    id: "see-example",
    title: "I want to see what a draft looks like first",
    description: "Browse a full podcast-to-blog example: structure, FAQ, and social scripts.",
    href: "/examples/sample-growth-pack",
    cta: "See example draft",
    primary: false,
  },
] as const;
