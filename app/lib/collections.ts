export type Collection = {
  slug: string;
  title: string;
  description: string;
  topicSlugs: readonly string[];
  seriesSlugs?: readonly string[];
};

export const COLLECTIONS: readonly Collection[] = [
  {
    slug: "when-faith-meets-suffering",
    title: "When Faith Meets Suffering",
    description: "A growing collection for thinking carefully about suffering, evil, faith, and the hope of the Christian message.",
    topicSlugs: ["faith", "suffering-and-evil", "god", "apologetics"],
    seriesSlugs: ["the-problem-of-evil"],
  },
];

export function getCollection(slug: string) {
  return COLLECTIONS.find((collection) => collection.slug === slug) ?? null;
}
