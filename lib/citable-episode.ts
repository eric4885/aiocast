/** AI-citable episode page fields — structural difference vs generic AI blog drafts. */

export type CitableEntity = {
  name: string;
  role: string;
  company: string;
  expertise: string;
  pastWork: string;
  kind: "host" | "guest" | "other";
};

export type CitableEpisode = {
  /** ≤40-word hard takeaway for AI engines to quote. */
  leadQuote: string;
  entities: CitableEntity[];
};

const ENTITY_KEYS = ["name", "role", "company", "expertise", "pastWork"] as const;

function asKind(raw: unknown): CitableEntity["kind"] {
  const v = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (v === "guest") return "guest";
  if (v === "host") return "host";
  return "other";
}

function normalizeEntity(raw: unknown): CitableEntity | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const row = raw as Record<string, unknown>;
  const name = String(row.name ?? "").trim();
  if (!name) return null;
  return {
    name,
    role: String(row.role ?? "").trim(),
    company: String(row.company ?? "").trim(),
    expertise: String(row.expertise ?? "").trim(),
    pastWork: String(row.pastWork ?? row.past_work ?? "").trim(),
    kind: asKind(row.kind ?? row.type),
  };
}

/** Cap lead quote around ~40 words without cutting mid-word awkwardly. */
export function clampLeadQuote(text: string, maxWords = 40): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (!flat) return "";
  const words = flat.split(" ");
  if (words.length <= maxWords) return flat;
  return `${words.slice(0, maxWords).join(" ")}…`;
}

export function normalizeCitableEpisode(raw: unknown): CitableEpisode | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const row = raw as Record<string, unknown>;
  const leadQuote = clampLeadQuote(String(row.leadQuote ?? row.lead_quote ?? ""));
  const entities = Array.isArray(row.entities)
    ? row.entities.map(normalizeEntity).filter((e): e is CitableEntity => e !== null).slice(0, 4)
    : [];
  if (!leadQuote && entities.length === 0) return null;
  return { leadQuote, entities };
}

export function defaultCitableEpisode(opts: {
  title: string;
  metaDescription: string;
  transcript: string;
}): CitableEpisode {
  const topic = opts.title.replace(/^how to\s+/i, "").slice(0, 60).trim() || "this topic";
  const claim =
    opts.metaDescription.replace(/\s+/g, " ").trim().slice(0, 120) ||
    "one grounded takeaway from the conversation is worth publishing as indexable text";
  const leadQuote = clampLeadQuote(
    `If you're researching ${topic}, this episode argues that ${claim} — based on the hosts' episode notes.`,
  );

  return {
    leadQuote,
    entities: [
      {
        name: "Host",
        role: "Podcast host",
        company: "",
        expertise: "Episode topic (replace with real expertise from your notes)",
        pastWork: "Add past shows, books, or roles mentioned in the source",
        kind: "host",
      },
    ],
  };
}

export function entityHasMachineFields(entity: CitableEntity): boolean {
  return ENTITY_KEYS.some((k) => Boolean(entity[k]?.trim()));
}

/** Person nodes for @graph — one per entity with a name. */
export function personNodesFromEntities(entities: CitableEntity[]): Record<string, unknown>[] {
  return entities
    .filter((e) => e.name.trim())
    .map((e) => {
      const node: Record<string, unknown> = {
        "@type": "Person",
        name: e.name.trim(),
      };
      if (e.role.trim()) node.jobTitle = e.role.trim();
      if (e.company.trim()) {
        node.worksFor = { "@type": "Organization", name: e.company.trim() };
      }
      const knows = [e.expertise, e.pastWork].map((s) => s.trim()).filter(Boolean);
      if (knows.length > 0) node.description = knows.join(". ");
      if (e.kind === "host" || e.kind === "guest") {
        node.additionalType = e.kind === "host" ? "PodcastHost" : "PodcastGuest";
      }
      return node;
    });
}

export function personsJsonLd(entities: CitableEntity[]): string {
  const people = personNodesFromEntities(entities);
  if (people.length === 0) {
    return JSON.stringify({ "@context": "https://schema.org", "@graph": [] }, null, 2);
  }
  return JSON.stringify({ "@context": "https://schema.org", "@graph": people }, null, 2);
}

export function citableEntitiesToMarkdown(
  entities: CitableEntity[],
  heading = "Guest / host entity bio",
): string {
  if (entities.length === 0) return "";
  const lines: string[] = [`## ${heading}`, ""];
  for (const e of entities) {
    lines.push(`### ${e.name}${e.kind !== "other" ? ` (${e.kind})` : ""}`, "");
    lines.push(`- **Role:** ${e.role || "—"}`);
    lines.push(`- **Company:** ${e.company || "—"}`);
    lines.push(`- **Expertise:** ${e.expertise || "—"}`);
    lines.push(`- **Past work:** ${e.pastWork || "—"}`, "");
  }
  return lines.join("\n");
}
