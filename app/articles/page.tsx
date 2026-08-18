import Link from "next/link";
import { listPublishedArticles } from "@/app/lib/content-drafts";
import { articlePreview } from "@/app/data/article-preview";

export default async function ArticlesPage() {
  const articles = await listPublishedArticles();
  const previewArticles = process.env.VERCEL_ENV === "preview" && !articles.some((article) => article.slug === articlePreview.slug)
    ? [{ id: "preview-article", title: articlePreview.title, slug: articlePreview.slug, category: articlePreview.category, introduction: articlePreview.introduction, body: { date: articlePreview.date, readingTime: articlePreview.readingTime } }, ...articles]
    : articles;
  return (
    <main className="content-page">
      <header className="page-header"><p className="eyebrow">Spirit &amp; Life</p><h1>Articles</h1><p>Thoughtful writing on faith, Scripture, Christian living and related questions.</p></header>
      <section className="content-grid" aria-label="Articles">
        {previewArticles.map((article) => <article className="content-card" key={article.id}><p className="content-card-label">{article.category ?? "Article"}</p><h2><Link href={`/articles/${article.slug}`}>{article.title}</Link></h2>{article.introduction ? <p>{article.introduction}</p> : null}<p className="content-card-meta">{typeof article.body.date === "string" ? article.body.date : ""}{typeof article.body.readingTime === "string" && article.body.readingTime ? ` · ${article.body.readingTime}` : ""}</p></article>)}
      </section>
      {!previewArticles.length ? <p className="quiet-note">Articles will appear here after they are published.</p> : null}
    </main>
  );
}
