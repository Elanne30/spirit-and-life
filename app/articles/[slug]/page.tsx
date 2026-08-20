import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReadingProgress } from "@/app/components/reading-progress";
import { ReadingNavigation } from "@/app/components/reading-navigation";
import { RelatedContent } from "@/app/components/related-content";
import { ArticleRichTextRenderer } from "@/app/components/article-rich-text-renderer";
import { getPublishedArticle, listPublishedArticles } from "@/app/lib/content-drafts";
import type { ContentRelations } from "@/app/content/types";

function hasRichText(value: Record<string, unknown>): value is Record<string, unknown> & { richText: unknown } {
  return "richText" in value && typeof value.richText === "object" && value.richText !== null;
}

function getRelations(body: Record<string, unknown>): ContentRelations {
  const strings = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  return {
    relatedReflectionSlugs: strings(body.relatedReflectionSlugs),
    relatedJournalSlugs: strings(body.relatedJournalSlugs),
    relatedBookSlugs: strings(body.relatedBookSlugs),
    relatedStudyPlanDates: strings(body.relatedStudyPlanDates),
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) notFound();

  const articles = await listPublishedArticles();
  const index = articles.findIndex((item) => item.slug === article.slug);
  const previous = index > 0 ? articles[index - 1] : undefined;
  const next = index >= 0 && index < articles.length - 1 ? articles[index + 1] : undefined;
  const body = article.body;
  const sections = Array.isArray(body.sections) ? body.sections : [];
  const richText = hasRichText(body) ? body.richText : null;
  const relations = getRelations(body);
  const image = article.image_reference ?? (typeof body.image === "string" ? body.image : "");

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
        {image ? <div className="article-detail-hero page-container">
          <Image src={image} alt="" width={1600} height={900} priority sizes="(max-width: 900px) 100vw, 78rem" />
        </div> : null}
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
          <RelatedContent relations={relations} scriptureReference={typeof body.scripture === "string" ? body.scripture : undefined} />
        </div>
      </article>
      <style>{`
        .article-detail-hero { width: min(100% - 3rem, 78rem); margin: 0 auto clamp(2.5rem, 5vw, 4.5rem); overflow: hidden; border: 1px solid var(--line); background: var(--surface-muted); }
        .article-detail-hero img { display: block; width: 100%; height: clamp(18rem, 42vw, 40rem); object-fit: cover; }
        @media (max-width: 720px) { .article-detail-hero { width: min(100% - 2rem, 40rem); } .article-detail-hero img { height: 15rem; } }
      `}</style>
    </main>
  );
}
