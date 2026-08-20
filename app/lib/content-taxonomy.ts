export type ContentKind = "article" | "reflection" | "journal" | "book" | "study-center";

export type Topic = { slug: string; name: string; description?: string };
export type Series = { slug: string; name: string; description?: string; topicSlugs?: readonly string[] };

export const TOPICS: readonly Topic[] = [
  { slug: "god", name: "God" },
  { slug: "jesus-christ", name: "Jesus Christ" },
  { slug: "scripture", name: "Scripture" },
  { slug: "apologetics", name: "Apologetics" },
  { slug: "philosophy", name: "Philosophy" },
  { slug: "suffering-and-evil", name: "Suffering & Evil" },
  { slug: "faith", name: "Faith" },
  { slug: "prayer", name: "Prayer" },
  { slug: "christian-living", name: "Christian Living" },
  { slug: "theology", name: "Theology" },
  { slug: "church", name: "Church" },
  { slug: "culture", name: "Culture" },
  { slug: "science-and-faith", name: "Science & Faith" },
];

/** Initial editorial series. More can be added without changing the content model. */
export const SERIES: readonly Series[] = [
  {
    slug: "the-problem-of-evil",
    name: "The Problem of Evil",
    description: "A series examining suffering, evil, freedom, and the Christian response.",
    topicSlugs: ["apologetics", "suffering-and-evil", "philosophy", "god"],
  },
];

export function getTopic(slug: string) { return TOPICS.find((topic) => topic.slug === slug) ?? null; }
export function getSeries(slug: string) { return SERIES.find((series) => series.slug === slug) ?? null; }
