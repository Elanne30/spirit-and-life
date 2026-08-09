export type ContentImageType = "reflection" | "journal" | "book";

export type ImageManifestEntry = {
  type: ContentImageType;
  contentSlug: string;
  title: string;
};

export const imageManifest = {
  "The grace that transforms_reflection on romans 8.jpg": {
    type: "reflection",
    contentSlug: "the-grace-that-transforms-a-reflection-on-romans-8",
    title: "The Grace That Transforms: Reflections on Romans 8",
  },
  "Reading_scripture_in_context_why_it_matters.jpg": {
    type: "reflection",
    contentSlug: "reading-scripture-in-context-why-it-matters",
    title: "Reading Scripture in Context: Why It Matters",
  },
  "honest questions and faithful truths.jpg": {
    type: "reflection",
    contentSlug: "honest-questions-and-faithful-faith",
    title: "Honest Questions and Faithful Faith",
  },
  "on slowing down to read.jpg": {
    type: "journal",
    contentSlug: "on-slowing-down-to-read",
    title: "On Slowing Down to Read",
  },
  "notes from morning prayer.jpg": {
    type: "journal",
    contentSlug: "notes-from-morning-prayer",
    title: "Notes from Morning Prayer",
  },
  "From perfection to corruption.jpg": {
    type: "book",
    contentSlug: "from-perfection-to-corruption",
    title: "From Perfection to Corruption",
  },
} satisfies Record<string, ImageManifestEntry>;