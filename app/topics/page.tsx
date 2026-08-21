import Link from "next/link";
import { getDiscoveryTaxonomy } from "@/app/lib/content-discovery";
import { LibraryPageHero } from "@/app/components/library-page-hero";

const topicImages = [
  "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1000&q=85",
];

export default function TopicsPage() {
  const { topics } = getDiscoveryTaxonomy();

  return (
    <main className="bg-[color:var(--background)] text-[color:var(--foreground)] transition-colors duration-200">
      <LibraryPageHero
        eyebrow="Library"
        title="Topics"
        subtitle="Explore truth. Grow deeper."
        description="Study key topics of the Christian faith with clarity, balance, and biblical depth."
        imageUrl="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1800&q=85"
      />
      <section className="mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-16" aria-labelledby="topics-heading">
        <div className="mb-7 flex items-end justify-between gap-4 border-b border-[color:var(--line)] pb-4">
          <h2 id="topics-heading" className="font-serif text-3xl font-semibold text-[color:var(--foreground)] sm:text-4xl">Browse Topics</h2>
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">{topics.length} topics</span>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {topics.map((topic, index) => (
            <Link key={topic.slug} href={`/topics/${topic.slug}`} className="group overflow-hidden rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
              <div className="relative aspect-[16/8] overflow-hidden bg-[color:var(--surface-muted)]">
                <div className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-[1.025]" style={{ backgroundImage: `url(${topicImages[index % topicImages.length]})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent dark:from-black/60" aria-hidden="true" />
                <span className="absolute bottom-3 left-3 rounded-full bg-[color:var(--surface)]/90 px-3 py-1 text-xs font-semibold text-[color:var(--foreground)] backdrop-blur-sm">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="font-serif text-2xl font-semibold leading-tight text-[color:var(--foreground)]">{topic.name}</h3>
                {topic.description ? <p className="mt-3 line-clamp-2 text-sm leading-6 text-[color:var(--muted)]">{topic.description}</p> : null}
                <span className="mt-5 inline-block border-b border-[color:var(--accent)] pb-1 text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--foreground)]">Explore →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
