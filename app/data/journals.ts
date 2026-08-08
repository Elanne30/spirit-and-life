import { imageManifest, type ImageManifestEntry } from "@/app/data/image-manifest";

export type Journal = ImageManifestEntry & {
  image: string;
};

export const journals: Journal[] = Object.entries(imageManifest)
  .filter(([, entry]) => entry.type === "journal")
  .map(([filename, entry]) => ({
    ...entry,
    image: `/images/journals/${filename}`,
  }));

export function getJournal(slug: string) {
  return journals.find((journal) => journal.contentSlug === slug);
}
