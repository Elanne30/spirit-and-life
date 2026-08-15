"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { searchTypes, type SearchResult, type SearchType } from "@/app/content/search-types";

function SearchResultItem({ result }: { result: SearchResult }) {
  return (
    <li className="search-result">
      <p className="content-card-label">{result.type}</p>
      <h2><Link href={result.href}>{result.title}</Link></h2>
      {result.meta ? <p className="search-result-meta">{result.meta}</p> : null}
      <p>{result.description}</p>
    </li>
  );
}

export function SearchForm({
  initialQuery,
  initialType,
  initialResults,
  error,
}: {
  initialQuery: string;
  initialType: SearchType;
  initialResults: SearchResult[];
  error: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [selectedType, setSelectedType] = useState(initialType);
  const [isPending, startTransition] = useTransition();
  const hasSubmittedQuery = initialQuery.length > 0;

  function navigate(nextQuery: string, nextType: SearchType) {
    const params = new URLSearchParams();
    const trimmedQuery = nextQuery.trim();
    if (trimmedQuery) params.set("q", trimmedQuery);
    if (nextType !== "All") params.set("type", nextType);
    const href = params.size ? `/search?${params.toString()}` : "/search";
    startTransition(() => router.push(href));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate(query, selectedType);
  }

  return (
    <section className="page-container search-content" aria-labelledby="search-title">
      <h2 id="search-title" className="sr-only">Search Spirit &amp; Life</h2>
      <form className="search-form" onSubmit={handleSubmit} role="search">
        <label htmlFor="site-search">Search the library</label>
        <div className="search-form-field">
          <input id="site-search" name="query" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try Scripture, grace, or prayer" />
          <button className="button button-primary" type="submit" disabled={isPending}>{isPending ? "Searching..." : "Search"}</button>
        </div>
        <div className="search-filter-row" aria-label="Filter search results by content type">
          {searchTypes.map((type) => <button className={`filter-pill${selectedType === type ? " is-active" : ""}`} key={type} type="button" aria-pressed={selectedType === type} onClick={() => { setSelectedType(type); navigate(query, type); }}>{type === "All" ? "All" : `${type}s`}</button>)}
        </div>
      </form>
      {isPending ? <p className="search-status" role="status">Searching the library…</p> : null}
      {hasSubmittedQuery && !isPending && !error ? <p className="search-status" role="status">{initialResults.length} result{initialResults.length === 1 ? "" : "s"} for &ldquo;{initialQuery}&rdquo;</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : initialResults.length ? <ul className="search-results">{initialResults.map((result) => <SearchResultItem key={`${result.type}-${result.href}`} result={result} />)}</ul> : hasSubmittedQuery ? <p className="empty-state">No matching content was found for this search. Try another title, topic, Scripture reference, or content type.</p> : <p className="quiet-note">Search by title, topic, Scripture reference, or content type across the current Spirit &amp; Life library.</p>}
    </section>
  );
}
