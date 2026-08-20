import { SearchForm } from "@/app/search/search-form";
import { searchContent } from "@/app/content/search";
import { isSearchType, type SearchResult, type SearchType } from "@/app/content/search-types";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const { q: rawQuery = "", type: rawType } = await searchParams;
  const query = rawQuery.trim().slice(0, 160);
  const type: SearchType = isSearchType(rawType) ? rawType : "All";
  let results: SearchResult[] = [];
  let error = "";

  if (query) {
    try {
      results = await searchContent(query, type);
    } catch (searchError) {
      console.error("[search] Search failed.", searchError instanceof Error ? searchError.message : "Unknown error");
      error = "Search is unavailable right now. Please try again.";
    }
  }

  return (
    <main className="search-page">
      <section className="page-container page-intro">
        <p className="eyebrow">The Library</p>
        <h1>Search</h1>
        <p>Search across Articles, Reflections, Journals, Books, Scripture references, and Study Center resources.</p>
      </section>
      <SearchForm key={`${query}-${type}`} initialQuery={query} initialType={type} initialResults={results} error={error} />
    </main>
  );
}
