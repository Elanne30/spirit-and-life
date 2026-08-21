export type DownloadableResource = {
  slug: string;
  title: string;
  description: string;
  kind: "PDF" | "Audio" | "Document";
  fileUrl?: string;
  fileName?: string;
  publishedAt: string;
  topicSlugs: readonly string[];
  seriesSlug?: string;
  questionSlugs?: readonly string[];
  relatedHref?: string;
};

export const DOWNLOADABLE_RESOURCES: readonly DownloadableResource[] = [];

export function getDownloadableResource(slug: string) {
  return DOWNLOADABLE_RESOURCES.find((resource) => resource.slug === slug) ?? null;
}
