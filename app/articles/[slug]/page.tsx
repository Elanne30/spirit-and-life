import { notFound } from "next/navigation";
import { getPublishedArticle } from "@/app/lib/content-drafts";
import { articlePreview } from "@/app/data/article-preview";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const storedArticle = await getPublishedArticle(slug);
  const article = storedArticle ?? (slug === articlePreview.slug ? {
    title: articlePreview.title,
    slug: articlePreview.slug,
    category: articlePreview.category,
    introduction: articlePreview.introduction,
    body: { date: articlePreview.date, readingTime: articlePreview.readingTime, sections: articlePreview.sections },
  } : null);
  if (!article) notFound();
  const sections = Array.isArray(article.body.sections) ? article.body.sections : [];
  return (
    <main className="article-page">
      <article className="article-shell">
        <header className="article-header"><p className="eyebrow">{article.category ?? "Article"}</p><h1>{article.title}</h1>{article.introduction ? <p className="lead">{article.introduction}</p> : null}<p className="article-meta">{typeof article.body.date === "string" ? article.body.date : ""}{typeof article.body.readingTime === "string" && article.body.readingTime ? ` · ${article.body.readingTime}` : ""}</p></header>
        <div className="article-body">
          {sections.map((section, index) => <section key={index}>{typeof section === "object" && section !== null && typeof (section as { heading?: unknown }).heading === "string" && (section as { heading: string }).heading ? <h2>{(section as { heading: string }).heading}</h2> : null}{typeof section === "object" && section !== null && Array.isArray((section as { paragraphs?: unknown }).paragraphs) ? (section as { paragraphs: unknown[] }).paragraphs.filter((paragraph): paragraph is string => typeof paragraph === "string").map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>) : null}</section>)}
        </div>
      </article>
    </main>
  );
}
