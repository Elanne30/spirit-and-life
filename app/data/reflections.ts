import { imageManifest, type ImageManifestEntry } from "@/app/data/image-manifest";

export type Reflection = ImageManifestEntry & {
  image: string;
  scriptureReference?: string;
};

export const reflections: Reflection[] = Object.entries(imageManifest)
  .filter(([, entry]) => entry.type === "reflection")
  .map(([filename, entry]) => ({
    ...entry,
    image: `/images/reflections/${filename}`,
    ...(entry.contentSlug ===
    "the-grace-that-transforms-a-reflection-on-romans-8"
      ? { scriptureReference: "Romans 8" }
      : {}),
  }));

export function getReflection(slug: string) {
  return reflections.find((reflection) => reflection.contentSlug === slug);
}
