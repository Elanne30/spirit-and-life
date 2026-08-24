import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ReadingProgress } from "@/app/components/reading-progress";
import { ReadingNavigation } from "@/app/components/reading-navigation";
import { RelatedContent } from "@/app/components/related-content";
import { ArticleRichTextRenderer } from "@/app/components/article-rich-text-renderer";
import { getPublishedArticle, listPublishedArticles } from "@/app/lib/content-drafts";
import { getSeries, getTopic } from "@/app/lib/content-taxonomy";
import { getSeriesDiscovery } from "@/app/lib/content-discovery";
import { studies } from "@/app/data/study-plan";
import type { ContentRelations } from "@/app/content/types";
import { articleMetadata, articleStructuredData } from "@/app/content/seo";

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

function articleTopics(article: { topics?: string[]; body: Record<string, unknown> }) {
  const direct = article.topics ?? [];
  if (direct.length) return direct;
  const bodyTopics = article.body.topics;
  return Array.isArray(bodyTopics) ? bodyTopics.filter((value): value is string => typeof value === "string") : [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  return article
    ? articleMetadata(article.title, article.introduction ?? "", `/articles/${article.slug}`, article.image_reference ?? undefined)
    : articleMetadata("Articles", "Thoughtful writing from Spirit & Life.", "/articles");
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) notFound();

  const articles = await listPublishedArticles();
  const seriesSlug = article.series ?? (typeof article.body.series === "string" ? article.body.series : null);
  const seriesDiscovery = seriesSlug ? await getSeriesDiscovery(seriesSlug) : null;
  const navigationArticles = seriesDiscovery?.articles?.length ? seriesDiscovery.articles : articles;
  const index = navigationArticles.findIndex((item) => item.slug === article.slug);
  const previous = index > 0 ? navigationArticles[index - 1] : undefined;
  const next = index >= 0 && index < navigationArticles.length - 1 ? navigationArticles[index + 1] : undefined;

  const body = article.body;
  const sections = Array.isArray(body.sections) ? body.sections : [];
  const richText = hasRichText(body) ? body.richText : null;
  const relations = getRelations(body);
  const assignedLectures = (relations.relatedStudyPlanDates ?? [])
    .map((date) => studies.find((study) => study.date === date))
    .filter((study): study is (typeof studies)[number] => Boolean(study));
  const image = article.image_reference ?? (typeof body.image === "string" ? body.image : "");
  const structuredData = articleStructuredData({
    title: article.title,
    description: article.introduction ?? "",
    path: `/articles/${article.slug}`,
    image: image || "/images/social-image/social-image-logo.jpg",
    date: typeof body.date === "string" ? body.date : "",
  });
  const series = seriesSlug ? getSeries(seriesSlug) : null;
  const topics = articleTopics(article).map(getTopic).filter((topic): topic is NonNullable<ReturnType<typeof getTopic>> => Boolean(topic));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
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
            {(series || topics.length) ? <div className="mt-5 flex flex-wrap items-center gap-2" aria-label="Article relationships">
              {series ? <Link href={`/series/${series.slug}`} className="rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] hover:border-[color:var(--accent)]">Series: {series.name}</Link> : null}
              {topics.map((topic) => <Link key={topic.slug} href={`/topics/${topic.slug}`} className="rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] hover:border-[color:var(--accent)]">{topic.name}</Link>)}
            </div> : null}
          </header>
          {image ? <div className="article-detail-hero page-container">
            <Image src={image} alt={article.title} width={1600} height={900} priority sizes="(max-width: 900px) 100vw, 78rem" />
          </div> : null}
          <div className="article-reading-column reflection-reading-column">
            {article.introduction ? <p className="reflection-introduction">{article.introduction}</p> : null}
            {assignedLectures.length ? <section className="reading-section article-assigned-lecture" aria-labelledby="assigned-lecture-title">
              <p className="eyebrow">Assigned lecture</p>
              <h2 id="assigned-lecture-title">Study assignment</h2>
              {assignedLectures.map((study) => <div key={study.date}><p><strong>{study.weekday}, {study.date}</strong></p><p>{study.passage}</p><p>{study.focus}</p><Link className="button button-text" href={`/study-center/${study.date}`}>Open lecture →</Link></div>)}
            </section> : null}
            {richText ? <ArticleRichTextRenderer document={richText} /> : sections.map((section, sectionIndex) => (
              <section className="reading-section" key={sectionIndex}>
                {typeof section === "object" && section !== null && typeof (section as { heading?: unknown }).heading === "string" && (section as { heading: string }).heading ? <h2>{(section as { heading: string }).heading}</h2> : null}
                {typeof section === "object" && section !== null && Array.isArray((section as { paragraphs?: unknown }).paragraphs) ? (section as { paragraphs: unknown[] }).paragraphs.filter((paragraph): paragraph is string => typeof paragraph === "string").map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>) : null}
              </section>
            ))}
            <ReadingNavigation previous={previous ? { href: `/articles/${previous.slug}`, title: previous.title } : undefined} next={next ? { href: `/articles/${next.slug}`, title: next.title } : undefined} />
            {series ? <Link className="button button-text" href={`/series/${series.slug}`}>Back to {series.name} →</Link> : <Link className="button button-text" href="/articles">Back to Articles</Link>}
            <RelatedContent relations={relations} scriptureReference={typeof body.scripture === "string" ? body.scripture : undefined} />
          </div>
        </article>
        <style>{`
          .article-detail-hero { width: min(100% - 3rem, 78rem); margin: 0 auto clamp(2.5rem, 5vw, 4.5rem); overflow: hidden; border: 1px solid var(--line); background: var(--surface-muted); }
          .article-detail-hero img { display: block; width: 100%; height: clamp(18rem, 42vw, 40rem); object-fit: cover; }
          @media (max-width: 720px) { .article-detail-hero { width: min(100% - 2rem, 40rem); } .article-detail-hero img { height: 15rem; } }
        `}</style>
      </main>
    </>
  );
}
