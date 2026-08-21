export const searchTypes = ["All", "Article", "Reflection", "Journal", "Book", "Scripture", "Study Center", "Topic", "Series", "Question"] as const;

export type SearchType = (typeof searchTypes)[number];

export type SearchResult = {
  type: Exclude<SearchType, "All">;
  title: string;
  description: string;
  href: string;
  meta?: string;
};

export function isSearchType(value: string | undefined): value is SearchType {
  return Boolean(value && searchTypes.includes(value as SearchType));
}
