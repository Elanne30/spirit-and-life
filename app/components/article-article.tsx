import Image from "next/image";
import Link from "next/link";
import { RelatedContent } from "@/app/components/related-content";
import { ReadingProgress } from "@/app/components/reading-progress";
import { ReadingNavigation } from "@/app/components/reading-navigation";
import { ArticleRichTextRenderer } from "@/app/components/article-rich-text-renderer";
import { listPublishedArticles, type ArticleDraft } from "@/app/lib/content-drafts";
import type { ContentRelations } from "@/app/content/types";

function getRelations(body: Record<string, unknown>): ContentRelations {
  const strings = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  return {
    relatedReflectionSlugs: strings(body.relatedReflectionSlugs),
    relatedJournalSlugs: strings(body.relatedJournalSlugs),
    relatedBookSlugs: strings(body.relatedBookSlugs),
    relatedStudyPlanDates: strings(body.relatedStudyPlanDates),
    relatedQuestionSlugs: strings(body.relatedQuestionSlugs),
    relatedPodcastSlugs: strings(body.relatedPodcastSlugs),
    relatedResourceSlugs: strings(body.relatedResourceSlugs),
  };
}

function hasRichText(value: Record<string, unknown>): value is Record<string, unknown> & { richText: unknown } {
  return "richText" in value && typeof value.richText === "object" && value.richText !== null;
}

export async function ArticleArticle({ article, showBackLink = true }: { article: ArticleDraft; showBackLink?: boolean }) {
  const articles = await listPublishedArticles();
  const index = articles.findIndex((item) => item.slug === article.slug);
  const previous = index > 0 ? articles[index - 1] : undefined;
  const next = index >= 0 && index < articles.length - 1 ? articles[index + 1] : undefined;
  const body = article.body;
  const sections = Array.isArray(body.sections) ? body.sections : [];
  const richText = hasRichText(body) ? body.richText : null;
  const relations = getRelations(body);
  const image = article.image_reference ?? (typeof body.image === "string" ? body.image : "");
  const date = typeof body.date === "string" ? body.date : "";
  const readingTime = typeof body.readingTime === "string" ? body.readingTime : "";
  const scripture = typeof body.scripture === "string" ? body.scripture : "";

  return (
    <main className="journal-detail-page article-detail-page">
      <ReadingProgress />
      <article className="journal-detail article-detail">
        <header className="journal-detail-header page-container detail-header">
          <p className="eyebrow">Article</p>
          <h1>{article.title}</h1>
          <div className="journal-meta">
            <span>{date}</span>
            {readingTime ? <span>{readingTime}</span> : null}
            {article.category ? <span>{article.category}</span> : null}
            {scripture ? <span>{scripture}</span> : null}
          </div>
        </header>
        {image ? <div className="journal-feature-image page-container"><Image src={image} alt={article.title} width={1280} height={853} priority sizes="(max-width: 1220px) 100vw, 76rem" /></div> : null}
        <div className="journal-reading-column">
          {article.introduction ? <p className="journal-introduction">{article.introduction}</p> : null}
          {richText ? <ArticleRichTextRenderer document={richText} /> : sections.map((section, sectionIndex) => (
            <section className="reading-section" key={sectionIndex}>
              {typeof section === "object" && section !== null && typeof (section as { heading?: unknown }).heading === "string" && (section as { heading: string }).heading ? <h2>{(section as { heading: string }).heading}</h2> : null}
              {typeof section === "object" && section !== null && Array.isArray((section as { paragraphs?: unknown }).paragraphs) ? (section as { paragraphs: unknown[] }).paragraphs.filter((paragraph): paragraph is string => typeof paragraph === "string").map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>) : null}
            </section>
          ))}
          <ReadingNavigation previous={previous ? { href: `/articles/${previous.slug}`, title: previous.title } : undefined} next={next ? { href: `/articles/${next.slug}`, title: next.title } : undefined} />
          {showBackLink ? <Link className="button button-text" href="/articles">Back to Articles</Link> : null}
          <RelatedContent relations={relations} scriptureReference={scripture || undefined} />
        </div>
      </article>
    </main>
  );
}
