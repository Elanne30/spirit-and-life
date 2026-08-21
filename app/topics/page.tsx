import Link from "next/link";
import { getDiscoveryTaxonomy } from "@/app/lib/content-discovery";

export default function TopicsPage() {
  const { topics } = getDiscoveryTaxonomy();
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Explore</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Topics</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">Explore Spirit &amp; Life by the questions and themes that shape Christian thought.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <Link key={topic.slug} href={`/topics/${topic.slug}`} className="rounded-2xl border p-5 transition hover:bg-muted/40">
            <h2 className="font-semibold">{topic.name}</h2>
            {topic.description ? <p className="mt-2 text-sm text-muted-foreground">{topic.description}</p> : null}
          </Link>
        ))}
      </div>
    </main>
  );
}
