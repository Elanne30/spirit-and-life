import { imageManifest, type ImageManifestEntry } from "@/app/data/image-manifest";
import type { ContentSection } from "@/app/data/reflections";

export type Journal = ImageManifestEntry & {
  image: string;
  date: string;
  label: string;
  introduction: string;
  sections: ContentSection[];
};

const journalContent: Record<string, Omit<Journal, keyof ImageManifestEntry | "image">> = {
  "on-slowing-down-to-read": {
    date: "July 1, 2026", label: "JOURNAL ENTRY", introduction: "There is a difference between reading and reading. The first consumes. The second absorbs.",
    sections: [
      { heading: "The Discipline of Slow Reading", paragraphs: ["We live in an age that rewards speed. But Scripture was not written for speed. It was written for attention. When we rush through a passage, we may finish it, but we rarely meet it.", "Slow reading is not about intelligence. It is about posture. It is the decision to let a text speak before we speak about it."] },
      { heading: "A Simple Practice", paragraphs: ["Try reading a single chapter three times. The first time, simply follow the flow. The second time, notice the structure. The third time, listen for what surprises you.", "You will find that depth was always there, waiting for a reader who would stay long enough to find it."] },
    ],
  },
  "notes-from-morning-prayer": {
    date: "June 15, 2026", label: "JOURNAL ENTRY", introduction: "For several months I have been waking early to pray. I do not say this to commend myself. I say it because the practice has taught me something I did not expect.",
    sections: [
      { heading: "The Gift of Showing Up", paragraphs: ["Most mornings, I do not feel particularly spiritual. I am tired. My mind wanders. The prayers feel ordinary. But I show up anyway.", "And something has happened in the showing up. Not drama. Not fireworks. Just a slow, quiet settling, a sense that God is not far away, and that faithfulness is built in small, ordinary mornings more than in great dramatic moments."] },
      { heading: "Grace in the Ordinary", paragraphs: ["Grace, I am learning, is not only for the great crises. It is for the ordinary Tuesdays. It is for the tired mornings. It is for the prayers that feel like nothing and yet are everything.", "Show up. That is most of it."] },
    ],
  },
};

export const journals: Journal[] = Object.entries(imageManifest)
  .filter(([, entry]) => entry.type === "journal")
  .map(([filename, entry]) => ({ ...entry, image: `/images/journals/${filename}`, ...journalContent[entry.contentSlug] }));

export function getJournal(slug: string) {
  return journals.find((journal) => journal.contentSlug === slug);
}