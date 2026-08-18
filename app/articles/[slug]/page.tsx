import Link from "next/link";
import { notFound } from "next/navigation";
import { ReadingProgress } from "@/app/components/reading-progress";
import { ReadingNavigation } from "@/app/components/reading-navigation";
import { ArticleRichTextRenderer } from "@/app/components/article-rich-text-renderer";
import { getPublishedArticle, listPublishedArticles } from "@/app/lib/content-drafts";
import { articlePreview } from "@/app/data/article-preview";

function hasRichText(value: Record<string, unknown>): value is Record<string, unknown> & { richText: Parameters<typeof ArticleRichTextRenderer>["document"] } {
  return "richText" in value && typeof value.richText === "object" && value.richText !== null;
}

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

  const articles = await listPublishedArticles();
  const index = articles.findIndex((item) => item.slug === article.slug);
  const previous = index > 0 ? articles[index - 1] : undefined;
  const next = index >= 0 && index < articles.length - 1 ? articles[index + 1] : undefined;
  const body = article.body;
  const sections = Array.isArray(body.sections) ? body.sections : [];
  const richText = hasRichText(body) ? body.richText : null;

  return (
    <main className="reflection-detail-page article-detail-page">
      <ReadingProgress />
      <article className="reflection-detail article-detail">
        <header className="reflection-detail-header page-container detail-header">
          <p className="eyebrow">Article</p>
          <h1>{article.title}</h1>
          <div className="reflection-meta article-meta">
            <span>{typeof body.date === "string" ? body.date : ""}</span>
            <span>{typeof body.readingTime === "string" ? body.readingTime : ""}</span>
            <span>{article.category ?? "Article"}</span>
          </div>
        </header>
        <div className="article-reading-column reflection-reading-column">
          {article.introduction ? <p className="reflection-introduction">{article.introduction}</p> : null}
          {richText ? <ArticleRichTextRenderer document={richText} /> : sections.map((section, index) => (
            <section className="reading-section" key={index}>
              {typeof section === "object" && section !== null && typeof (section as { heading?: unknown }).heading === "string" && (section as { heading: string }).heading ? <h2>{(section as { heading: string }).heading}</h2> : null}
              {typeof section === "object" && section !== null && Array.isArray((section as { paragraphs?: unknown }).paragraphs) ? (section as { paragraphs: unknown[] }).paragraphs.filter((paragraph): paragraph is string => typeof paragraph === "string").map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>) : null}
            </section>
          ))}
          <ReadingNavigation previous={previous ? { href: `/articles/${previous.slug}`, title: previous.title } : undefined} next={next ? { href: `/articles/${next.slug}`, title: next.title } : undefined} />
          <Link className="button button-text" href="/articles">Back to Articles</Link>
        </div>
      </article>
    </main>
  );
}
