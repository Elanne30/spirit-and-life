import Link from "next/link";
import { books } from "@/app/data/books";
import { journals } from "@/app/data/journals";
import { reflections } from "@/app/data/reflections";
import { studies } from "@/app/data/study-plan";
import type { ContentRelations } from "@/app/content/types";

type RelatedItem = {
  href: string;
  label: string;
  title: string;
  description?: string;
};

type RelatedContentProps = {
  relations: ContentRelations;
};

export function RelatedContent({ relations }: RelatedContentProps) {
  const relatedItems: RelatedItem[] = [
    ...(relations.relatedReflectionSlugs ?? [])
      .map((slug) => reflections.find((reflection) => reflection.contentSlug === slug))
      .filter((reflection): reflection is (typeof reflections)[number] => Boolean(reflection))
      .map((reflection) => ({ href: `/reflections/${reflection.contentSlug}`, label: "Reflection", title: reflection.title, description: reflection.introduction })),
    ...(relations.relatedJournalSlugs ?? [])
      .map((slug) => journals.find((journal) => journal.contentSlug === slug))
      .filter((journal): journal is (typeof journals)[number] => Boolean(journal))
      .map((journal) => ({ href: `/journals/${journal.contentSlug}`, label: "Journal", title: journal.title, description: journal.introduction })),
    ...(relations.relatedBookSlugs ?? [])
      .map((slug) => books.find((book) => book.contentSlug === slug))
      .filter((book): book is (typeof books)[number] => Boolean(book))
      .map((book) => ({ href: `/books/${book.contentSlug}`, label: "Book", title: book.title, description: book.description?.split("\n\n")[0] })),
    ...(relations.relatedStudyPlanDates ?? [])
      .map((date) => studies.find((study) => study.date === date))
      .filter((study): study is (typeof studies)[number] => Boolean(study))
      .map((study) => ({ href: `/study-center/${study.date}`, label: "Study Plan", title: `${study.weekday}, ${study.date}`, description: study.focus })),
  ];

  if (relatedItems.length === 0) {
    return null;
  }

  return (
    <section className="related-content" aria-labelledby="related-content-title">
      <p className="eyebrow">Continue exploring</p>
      <h2 id="related-content-title">Related material</h2>
      <div className="related-content-grid">
        {relatedItems.map((item) => (
          <article className="related-content-card" key={item.href}>
            <p className="content-card-label">{item.label}</p>
            <h3><Link href={item.href}>{item.title}</Link></h3>
            {item.description ? <p>{item.description}</p> : null}
            <Link className="content-card-link" href={item.href}>Open {item.label} →</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
