import { imageManifest, type ImageManifestEntry } from "@/app/data/image-manifest";
import type { ContentRelations, ReflectionCategory } from "@/app/content/types";

export type ContentSection = { heading: string; paragraphs: string[] };

export type Reflection = ImageManifestEntry & ContentRelations & {
  image: string;
  date: string;
  readingTime: string;
  category: ReflectionCategory;
  scripture: string;
  introduction: string;
  sections: ContentSection[];
  featured?: boolean;
};

const reflectionContent: Record<string, Omit<Reflection, keyof ImageManifestEntry | "image">> = {
  "reading-scripture-in-context-why-it-matters": {
    date: "July 15, 2026", readingTime: "6 min read", category: "SCRIPTURE", scripture: "Nehemiah 8:8", featured: true,
    introduction: "Every reader of Scripture faces a simple but profound question: how do we move from an ancient text to faithful understanding? The answer begins with context.",
    sections: [
      { heading: "The Principle of Context", paragraphs: ["When we read any piece of writing, we instinctively consider its context. We read a sentence in light of the paragraph, a paragraph in light of the chapter, and a chapter in light of the whole book. Scripture deserves the same care.", "Yet too often, verses are lifted from their surroundings and treated as self-contained promises or commands. A single phrase, separated from its passage, can be made to say almost anything."] },
      { heading: "Three Layers of Context", paragraphs: ["Historical context asks who the original audience was and what circumstances they faced. A promise given to Israel in the wilderness does not automatically transfer to a modern reader without careful thought.", "Literary context asks how the verse functions within the passage. Is it a command, a description, a poem, a warning? The genre shapes the meaning.", "Theological context asks how the passage fits within the whole counsel of Scripture. We interpret the unclear in light of the clear, and the particular in light of the whole."] },
      { heading: "Why This Matters", paragraphs: ["Faithful application begins with faithful interpretation. When we honour the context, we honour the Author. We resist the temptation to make Scripture say what we want it to say, and we allow it to speak on its own terms.", "This does not make reading harder. It makes it more honest and ultimately more fruitful."] },
    ],
  },
  "the-grace-that-transforms-a-reflection-on-romans-8": {
    date: "June 20, 2026", readingTime: "7 min read", category: "SCRIPTURE", scripture: "Romans 8:28",
    introduction: "Romans 8 is one of the most beloved chapters in all of Scripture, and for good reason. It holds together the weight of human struggle and the breathtaking scope of God's grace.",
    sections: [
      { heading: "No Condemnation", paragraphs: ["The chapter opens with a declaration: There is therefore now no condemnation for those who are in Christ Jesus. This is not a feeling. It is a verdict, secured by Christ's finished work."] },
      { heading: "The Spirit of Life", paragraphs: ["Paul then turns to the present reality of the believer, life in the Spirit. The same Spirit who raised Christ from the dead now dwells in God's people. Grace is not passive; it is active, transforming, and personal."] },
      { heading: "All Things Working Together", paragraphs: ["Perhaps the most quoted verse in the chapter, all things work together for good, is also one of the most misunderstood. Paul is not promising comfort. He is promising purpose. Even suffering is drawn into God's redemptive design for those who love Him."] },
      { heading: "Nothing Can Separate", paragraphs: ["The chapter closes with an unbreakable chain: nothing in all creation can separate us from the love of God in Christ Jesus. Grace has the last word.", "This is not a theology to merely admire. It is a truth to live by."] },
    ],
  },
  "honest-questions-and-faithful-faith": {
    date: "May 10, 2026", readingTime: "5 min read", category: "SCRIPTURE", scripture: "Mark 9:24",
    introduction: "There is a quiet fear in many Christian circles that asking hard questions signals a weak faith. But the opposite is often true. The refusal to ask may be the greater danger.",
    sections: [
      { heading: "Questions in Scripture", paragraphs: ["Scripture is full of questions. The Psalms cry out, How long, O Lord? Habakkuk asks why the wicked prosper. Thomas asks for evidence. None are rebuked for asking. The rebuke comes when questions are dishonest, when we have already decided the answer and simply seek confirmation."] },
      { heading: "Honest vs. Cynical Questions", paragraphs: ["An honest question says: I do not understand, but I want to. A cynical question says: I do not believe, and I dare you to convince me. The difference is not in the words but in the posture of the heart.", "Honest questions draw us toward truth. They require humility, the willingness to be changed by what we find."] },
      { heading: "Faith That Asks", paragraphs: ["Faith is not the absence of questions. It is the decision to bring those questions to God rather than away from Him. A faith that cannot ask is a faith that has not thought. A faith that asks and listens is a faith that grows.", "Bring your questions. Bring them honestly. Truth has nothing to fear from sincere inquiry."] },
    ],
  },
};

export const reflections: Reflection[] = Object.entries(imageManifest)
  .filter(([, entry]) => entry.type === "reflection")
  .map(([filename, entry]) => ({ ...entry, image: `/images/reflections/${filename}`, ...reflectionContent[entry.contentSlug] }));

export function getReflection(slug: string) {
  return reflections.find((reflection) => reflection.contentSlug === slug);
}