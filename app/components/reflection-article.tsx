import Image from "next/image";
import Link from "next/link";
import { RelatedContent } from "@/app/components/related-content";
import { ReadingProgress } from "@/app/components/reading-progress";
import { ReadingNavigation } from "@/app/components/reading-navigation";
import { listPublishedReflections } from "@/app/content/repository";
import type { Reflection } from "@/app/data/reflections";
import { ArticleRichTextRenderer } from "@/app/components/article-rich-text-renderer";

// Shared with the admin preview so it never drifts from the public page.
export async function ReflectionArticle({ reflection, showBackLink = true }: { reflection: Reflection; showBackLink?: boolean }) {
  const reflections = await listPublishedReflections();
  const index = reflections.findIndex((item) => item.contentSlug === reflection.contentSlug);
  const previous = index > 0 ? reflections[index - 1] : undefined;
  const next = index >= 0 && index < reflections.length - 1 ? reflections[index + 1] : undefined;

  return (
    <main className="reflection-detail-page">
      <ReadingProgress />
      <article className="reflection-detail">
        <header className="reflection-detail-header page-container detail-header">
          <p className="eyebrow">Reflection</p>
          <h1>{reflection.title}</h1>
          <div className="reflection-meta">
            <span>{reflection.date}</span>
            <span>{reflection.readingTime}</span>
            <span>{reflection.category}</span>
            <span>{reflection.scripture}</span>
          </div>
        </header>
        <div className="reflection-feature-image page-container">
          <Image src={reflection.image} alt={reflection.title} width={1280} height={853} priority sizes="(max-width: 1220px) 100vw, 76rem" />
        </div>
        <div className="reflection-reading-column">
          <p className="reflection-introduction">{reflection.introduction}</p>
          {reflection.richText ? <ArticleRichTextRenderer document={reflection.richText} /> : reflection.sections.map((section) => (
            <section className="reading-section" key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
          <ReadingNavigation
            previous={previous ? { href: `/reflections/${previous.contentSlug}`, title: previous.title } : undefined}
            next={next ? { href: `/reflections/${next.contentSlug}`, title: next.title } : undefined}
          />
          {showBackLink ? <Link className="button button-text" href="/reflections">Back to Reflections</Link> : null}
          <RelatedContent relations={reflection} scriptureReference={reflection.scripture} />
        </div>
      </article>
    </main>
  );
}
