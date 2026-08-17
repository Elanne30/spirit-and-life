import Image from "next/image";
import Link from "next/link";
import { RelatedContent } from "@/app/components/related-content";
import { ReadingProgress } from "@/app/components/reading-progress";
import { ReadingNavigation } from "@/app/components/reading-navigation";
import { listPublishedJournals } from "@/app/content/repository";
import type { Journal } from "@/app/data/journals";
import { ArticleRichTextRenderer } from "@/app/components/article-rich-text-renderer";

// Shared with the admin preview so it never drifts from the public page.
export async function JournalArticle({ journal, showBackLink = true }: { journal: Journal; showBackLink?: boolean }) {
  const journals = await listPublishedJournals();
  const index = journals.findIndex((item) => item.contentSlug === journal.contentSlug);
  const previous = index > 0 ? journals[index - 1] : undefined;
  const next = index >= 0 && index < journals.length - 1 ? journals[index + 1] : undefined;

  return (
    <main className="journal-detail-page">
      <ReadingProgress />
      <article className="journal-detail">
        <header className="journal-detail-header page-container detail-header">
          <p className="eyebrow">Journal</p>
          <h1>{journal.title}</h1>
          <div className="journal-meta"><span>{journal.date}</span><span>{journal.label}</span></div>
        </header>
        <div className="journal-feature-image page-container">
          <Image src={journal.image} alt={journal.title} width={1280} height={853} priority sizes="(max-width: 1220px) 100vw, 76rem" />
        </div>
        <div className="journal-reading-column">
          <p className="journal-introduction">{journal.introduction}</p>
          {journal.richText ? <ArticleRichTextRenderer document={journal.richText} /> : journal.sections.map((section) => (
            <section className="reading-section" key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
          <ReadingNavigation
            previous={previous ? { href: `/journals/${previous.contentSlug}`, title: previous.title } : undefined}
            next={next ? { href: `/journals/${next.contentSlug}`, title: next.title } : undefined}
          />
          {showBackLink ? <Link className="button button-text" href="/journals">Back to Journals</Link> : null}
          <RelatedContent relations={journal} />
        </div>
      </article>
    </main>
  );
}
