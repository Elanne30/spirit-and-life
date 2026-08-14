import { SearchForm } from "@/app/search/search-form";

export default function SearchPage() {
  return (
    <main className="search-page">
      <section className="page-container page-intro">
        <p className="eyebrow">The Library</p>
        <h1>Search</h1>
        <p>Search across Reflections, Journals, Books, Scripture references, and Study Center resources.</p>
      </section>
      <SearchForm />
    </main>
  );
}
