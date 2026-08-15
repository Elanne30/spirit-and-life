import Image from "next/image";
import Link from "next/link";
import { RelatedContent } from "@/app/components/related-content";
import type { Journal } from "@/app/data/journals";
import { ArticleRichTextRenderer } from "@/app/components/article-rich-text-renderer";

// Shared with the admin preview so it never drifts from the public page.
export function JournalArticle({ journal, showBackLink = true }: { journal: Journal; showBackLink?: boolean }) {
  return (
    <main className="journal-detail-page">
      <article className="journal-detail">
        <header className="journal-detail-header page-container detail-header">
          <p className="eyebrow">Journal</p>
          <h1>{journal.title}</h1>
          <div className="journal-meta">
            <span>{journal.date}</span>
            <span>{journal.label}</span>
          </div>
        </header>
        <div className="journal-feature-image page-container">
          <Image
            src={journal.image}
            alt={journal.title}
            width={1280}
            height={853}
            priority
            sizes="(max-width: 1220px) 100vw, 76rem"
          />
        </div>
        <div className="journal-reading-column">
          <p className="journal-introduction">{journal.introduction}</p>
          {journal.richText ? <ArticleRichTextRenderer document={journal.richText} /> : journal.sections.map((section) => (
            <section className="reading-section" key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
          {showBackLink ? (
            <Link className="button button-text" href="/journals">
              Back to Journals
            </Link>
          ) : null}
          <RelatedContent relations={journal} />
        </div>
      </article>
    </main>
  );
}
