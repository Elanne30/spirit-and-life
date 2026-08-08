import { imageManifest, type ImageManifestEntry } from "@/app/data/image-manifest";

export type Book = ImageManifestEntry & {
  cover?: string;
  status: "Coming Soon";
  subtitle?: string;
  expectedPublication?: string;
  author?: string;
};

const verifiedBookDetails: Record<string, Omit<Book, keyof ImageManifestEntry | "cover">> = {
  "from-perfection-to-corruption": {
    status: "Coming Soon",
    subtitle: "Before Eden: The Hidden Origin of Evil",
    expectedPublication: "December 2026",
  },
  "thy-word-is-truth-a-journey-through-john-17": {
    status: "Coming Soon",
    author: "Oluwaseun",
  },
};

export const books: Book[] = Object.entries(imageManifest)
  .filter(([, entry]) => entry.type === "book")
  .map(([filename, entry]) => ({
    ...entry,
    cover: `/images/books/${filename}`,
    ...verifiedBookDetails[entry.contentSlug],
  }));

export function getBook(slug: string) {
  return books.find((book) => book.contentSlug === slug);
}
