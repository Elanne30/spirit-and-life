import { imageManifest, type ImageManifestEntry } from "@/app/data/image-manifest";

export type Book = ImageManifestEntry & {
  cover?: string;
  status: "Coming Soon";
  subtitle?: string;
  expectedPublication?: string;
  author?: string;
  description?: string;
  publisher?: string;
  length?: string;
  tableOfContents?: string[];
};

const verifiedBookDetails: Record<string, Omit<Book, keyof ImageManifestEntry | "cover">> = {
  "from-perfection-to-corruption": {
    status: "Coming Soon",
    subtitle: "Before Eden: The Hidden Origin of Evil",
    expectedPublication: "December 2026",
    description: "What if the story of evil did not begin in Eden? This book invites readers to examine Scripture with fresh attention, exploring the events that precede humanity's fall and the larger biblical account surrounding creation, rebellion, free will, and redemption.\n\nWritten with reverence for Scripture and a commitment to careful reasoning, it seeks to encourage readers to think deeply about God's purposes while keeping Christ at the center of the biblical story.",
  },
  "thy-word-is-truth-a-journey-through-john-17": {
    status: "Coming Soon",
    author: "Oluwaseun",
    description: "A reflective study of Christ's high priestly prayer in John 17, exploring themes of truth, unity, and mission. This book walks through the passage verse by verse, drawing out its theological depth and practical application for believers today.",
    publisher: "Spirit & Life",
    length: "180 pages",
    tableOfContents: ["Introduction — Why John 17 Matters", "Chapter 1 — The Hour Has Come", "Chapter 2 — Glory Before the World Was", "Chapter 3 — Keep Them in Your Name", "Chapter 4 — Sanctified by the Truth", "Chapter 5 — That They May Be One", "Chapter 6 — Sent into the World", "Chapter 7 — The Love With Which You Loved Me", "Conclusion — Thy Word Is Truth"],
  },
};

const booksFromManifest: Book[] = Object.entries(imageManifest)
  .filter(([, entry]) => entry.type === "book")
  .map(([filename, entry]) => ({
    ...entry,
    cover: `/images/books/${filename}`,
    ...verifiedBookDetails[entry.contentSlug],
  }));

export const books: Book[] = [
  ...booksFromManifest,
  {
    type: "book",
    contentSlug: "thy-word-is-truth-a-journey-through-john-17",
    title: "Thy Word Is Truth: A Journey Through John 17",
    status: "Coming Soon",
    author: "Oluwaseun",
  },
];

export function getBook(slug: string) {
  return books.find((book) => book.contentSlug === slug);
}
