export const siteConfig = {
  name: "AioCast.com",
  tagline: "Turn podcast audio into SEO growth assets.",
  url: "https://aiocast.com",
  contactEmail: "hello@aiocast.com",
  /** Bump when Privacy or Terms materially change (shown on those pages). */
  legalLastUpdated: "May 2026",
  /** Full profile URLs — optional env overrides. Empty = footer hides icons (no generic platform home links). */
  social: {
    x: process.env.NEXT_PUBLIC_SOCIAL_X?.trim() ?? "",
    linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN?.trim() ?? "",
    youtube: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE?.trim() ?? "",
  },
};

export const featuredTools = [
  {
    name: "Descript",
    category: "Editing",
    icon: "/icons/descript.svg",
    saving: "Save ~5 hrs per episode",
    bestFor: "Filler removal, multi-track edits",
    price: "Free tier available - Pro $12/mo",
  },
  {
    name: "Riverside",
    category: "Recording",
    icon: "/icons/riverside.svg",
    saving: "4K local recording",
    bestFor: "Remote interviews, reliable audio",
    price: "Free 2 hrs/mo - Pro $15/mo",
  },
  {
    name: "ElevenLabs",
    category: "Voice",
    icon: "/icons/elevenlabs.svg",
    saving: "Clone your voice with AI",
    bestFor: "Trailers, multilingual versions",
    price: "Free 10k chars/mo",
  },
  {
    name: "OpusClip",
    category: "Repurpose",
    icon: "/icons/opusclip.svg",
    saving: "Shorts in minutes",
    bestFor: "Highlights for TikTok & Reels",
    price: "Plans from $9/mo",
  },
  {
    name: "Buzzsprout",
    category: "Hosting",
    icon: "/icons/buzzsprout.svg",
    saving: "One-click RSS & stats",
    bestFor: "Distribution without the busywork",
    price: "From $12/mo",
  },
  {
    name: "Adobe Podcast",
    category: "Enhance",
    icon: "/icons/adobe-podcast.svg",
    saving: "AI speech enhancement",
    bestFor: "Noise & room tone cleanup",
    price: "Free (beta)",
  },
];

export const faqItems = [
  {
    q: "Do I need to change my current recording stack?",
    a: "No. Keep your current recorder/host. AioCast.com sits on top to convert finished audio into SEO and distribution assets.",
  },
  {
    q: "I am a complete beginner - can I follow along?",
    a: "The workflow uses your transcript and context prompts. You still review tone and claims, but the first draft is aligned to your voice and intent.",
  },
  {
    q: "How is this different from recording/hosting/video tools?",
    a: "You get one coherent operating system: templates, parameters, SOPs, and troubleshooting tied to real publishing constraints - not isolated tips.",
  },
];

export const testimonials = [
  {
    name: "Jordan Lee",
    podcast: "Signal & Noise Weekly",
    avatar: "/images/avatar-1.svg",
    quote:
      "Converted each episode into a weekly SEO post and saw steady search impressions within 5 weeks.",
    metric: "-26% turnaround time",
  },
  {
    name: "Maya Chen",
    podcast: "Indie Builders FM",
    avatar: "/images/avatar-2.svg",
    quote:
      "The social script bundle removed blank-page time. We now publish on three channels after every episode.",
    metric: "+10x perceived audio quality",
  },
  {
    name: "Alex Rivera",
    podcast: "Creative Ops Daily",
    avatar: "/images/avatar-3.svg",
    quote:
      "Localized scheduling stopped random posting. We now run a reliable weekly publishing cadence by timezone.",
    metric: "Weekly execution loop established",
  },
];

export const comparisonRows = [
  {
    feature: "Filler word removal",
    descript: "Yes - One-click",
    adobe: "Yes - Automatic",
    audacity: "No - Manual",
    pick: "Descript",
  },
  {
    feature: "Multi-track editing",
    descript: "Yes - Visual timeline",
    adobe: "No - Single-track focus",
    audacity: "Yes - Powerful but complex",
    pick: "Descript",
  },
  {
    feature: "Price",
    descript: "$12/mo Pro",
    adobe: "Free",
    audacity: "Free",
    pick: "Adobe (tight budget)",
  },
  {
    feature: "Learning curve",
    descript: "~1 hour",
    adobe: "~30 minutes",
    audacity: "~10+ hours",
    pick: "Descript",
  },
];

export type AudioAnalysisStatus = "good" | "warning" | "bad";

export interface AudioAnalysisResult {
  overallScore: number;
  dimensions: {
    noiseFloor: {
      score: number;
      value: string;
      status: AudioAnalysisStatus;
      suggestion: string;
    };
    volumeConsistency: {
      score: number;
      value: string;
      status: AudioAnalysisStatus;
      suggestion: string;
    };
    clarity: {
      score: number;
      value: string;
      status: AudioAnalysisStatus;
      suggestion: string;
    };
    plosives: {
      score: number;
      value: string;
      status: AudioAnalysisStatus;
      suggestion: string;
    };
  };
  recommendedTools: string[];
  emailCapture: boolean;
}


