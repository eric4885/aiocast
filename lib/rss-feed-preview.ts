export type RssPreviewOk = {
  ok: true;
  channelTitle: string | null;
  channelDescription: string | null;
  itemCount: number;
  latestEpisodeTitle: string | null;
  hasItunesTags: boolean;
  score: number;
  tips: string[];
};

export type RssPreviewErr = { ok: false; error: string };

export type RssPreviewResult = RssPreviewOk | RssPreviewErr;

function decodeXmlEntities(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function firstTag(block: string, tag: string): string | null {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = block.match(re);
  if (!m?.[1]) return null;
  return decodeXmlEntities(m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1").trim());
}

/** Lightweight RSS/Atom sniff — no full XML parser; good enough for channel-level preview. */
export function previewRssFromXml(xml: string): RssPreviewOk {
  const isAtom = /<feed[\s>]/i.test(xml) && /<entry[\s>]/i.test(xml);

  let channelBlock = xml;
  if (!isAtom) {
    const ch = xml.match(/<channel[^>]*>([\s\S]*?)<\/channel>/i);
    if (ch?.[1]) channelBlock = ch[1];
  }

  let channelTitle = firstTag(channelBlock, "title");
  if (isAtom && !channelTitle) {
    channelTitle = firstTag(xml, "title");
  }

  const channelDescription =
    firstTag(channelBlock, "description") ?? firstTag(channelBlock, "itunes:summary") ?? firstTag(xml, "subtitle");

  const itemMatches = xml.match(/<item[\s>]/gi);
  const entryMatches = xml.match(/<entry[\s>]/gi);
  const itemCount = (itemMatches?.length ?? 0) + (entryMatches?.length ?? 0);

  let latestEpisodeTitle: string | null = null;
  const firstItem = xml.match(/<item[^>]*>([\s\S]*?)<\/item>/i);
  if (firstItem?.[1]) {
    latestEpisodeTitle = firstTag(firstItem[1], "title");
  } else {
    const firstEntry = xml.match(/<entry[^>]*>([\s\S]*?)<\/entry>/i);
    if (firstEntry?.[1]) latestEpisodeTitle = firstTag(firstEntry[1], "title");
  }

  const hasItunesTags = /<itunes:/i.test(xml);
  const descLen = (channelDescription ?? "").length;

  let score = 36;
  if (channelTitle && channelTitle.length > 2) score += 10;
  if (descLen >= 120) score += 14;
  else if (descLen >= 40) score += 7;
  if (itemCount >= 20) score += 12;
  else if (itemCount >= 5) score += 8;
  else if (itemCount >= 1) score += 4;
  if (hasItunesTags) score += 8;
  if (/<atom:link[^>]*rel=["']self["']/i.test(xml)) score += 4;
  if (/<language>/i.test(xml)) score += 2;

  score = Math.min(91, Math.max(22, Math.round(score)));

  const tips: string[] = [];
  const show = channelTitle ? `"${channelTitle.slice(0, 72)}${channelTitle.length > 72 ? "…" : ""}"` : "your show";

  if (channelTitle) {
    tips.push(
      `Podcast directories often pair ${show} with episode hooks — put your strongest searchable phrase in the first 60 characters of each episode title.`,
    );
  }

  if (latestEpisodeTitle) {
    tips.push(
      `Latest episode title we saw: "${latestEpisodeTitle.slice(0, 88)}${latestEpisodeTitle.length > 88 ? "…" : ""}" — add a number, timeframe, or named audience if those are missing.`,
    );
  } else if (itemCount === 0) {
    tips.push("We could not find `<item>` / `<entry>` entries in the fetched document — double-check the feed URL points to the RSS/XML endpoint.");
  }

  if (!hasItunesTags) {
    tips.push(
      "No Apple Podcasts (`itunes:*`) tags detected in this snapshot — adding `itunes:category`, explicit summary text, and episode-level titles helps directory clarity.",
    );
  }

  if (descLen > 0 && descLen < 80) {
    tips.push(
      "Channel/show description looks short — expand the first sentence with 2–3 phrases listeners actually type into Apple Podcasts / Spotify search.",
    );
  }

  if (tips.length < 3) {
    tips.push(
      `We counted about ${itemCount} episodes in this feed snapshot — keep publishing cadence steady; freshness signals vary by app.`,
    );
  }

  return {
    ok: true,
    channelTitle,
    channelDescription,
    itemCount,
    latestEpisodeTitle,
    hasItunesTags,
    score,
    tips: tips.slice(0, 5),
  };
}
