import Link from "next/link";
import { getDiscoveryTaxonomy } from "@/app/lib/content-discovery";

export default function TopicsPage() {
  const { topics } = getDiscoveryTaxonomy();

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <header className="max-w-3xl border-b pb-10">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Explore the library</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold tracking-tight sm:text-6xl">Topics</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">Explore Spirit &amp; Life through the themes and questions that shape Christian thought.</p>
      </header>
      <section className="mt-10 grid gap-px border bg-border sm:grid-cols-2 lg:grid-cols-3" aria-label="Topics">
        {topics.map((topic, index) => (
          <Link key={topic.slug} href={`/topics/${topic.slug}`} className="group min-h-48 bg-background p-6 transition hover:bg-muted/30 sm:p-7">
            <div className="flex justify-between text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"><span>Topic</span><span>{String(index + 1).padStart(2, "0")}</span></div>
            <h2 className="mt-9 font-serif text-2xl font-semibold leading-tight">{topic.name}</h2>
            {topic.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{topic.description}</p> : null}
            <span className="mt-6 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground group-hover:text-foreground">Explore ↗</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
