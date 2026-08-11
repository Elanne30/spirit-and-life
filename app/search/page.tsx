"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { searchContent, type SearchResult } from "@/app/content/search";

function SearchResultItem({ result }: { result: SearchResult }) {
  return (
    <li className="search-result">
      <p className="content-card-label">{result.type}</p>
      <h2><Link href={result.href}>{result.title}</Link></h2>
      <p>{result.description}</p>
    </li>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const results = searchContent(submittedQuery);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedQuery(query);
  }

  return (
    <main className="search-page">
      <section className="page-container page-intro">
        <p className="eyebrow">The Library</p>
        <h1>Search</h1>
        <p>Search across Reflections, Journals, Books, and Scripture references.</p>
      </section>
      <section className="page-container search-content" aria-labelledby="search-title">
        <h2 id="search-title" className="sr-only">Search Spirit &amp; Life</h2>
        <form className="search-form" onSubmit={handleSubmit} role="search">
          <label htmlFor="site-search">Search the library</label>
          <div className="search-form-field">
            <input id="site-search" name="query" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try Scripture, grace, or prayer" />
            <button className="button button-primary" type="submit">Search</button>
          </div>
        </form>
        {submittedQuery ? <p className="search-status" role="status">{results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{submittedQuery}&rdquo;</p> : null}
        {results.length ? <ul className="search-results">{results.map((result) => <SearchResultItem key={`${result.type}-${result.href}`} result={result} />)}</ul> : submittedQuery ? <p className="empty-state">No matching content was found. Try another search.</p> : <p className="quiet-note">Search is ready for the current library and can be extended as new content types are added.</p>}
      </section>
    </main>
  );
}
