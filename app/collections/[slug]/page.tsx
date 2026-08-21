import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection } from "@/app/lib/collections";
import { getTopic, getSeries } from "@/app/lib/content-taxonomy";

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();
  const topics = collection.topicSlugs.map(getTopic).filter(Boolean);
  const series = (collection.seriesSlugs ?? []).map(getSeries).filter(Boolean);
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <Link href="/collections" className="text-sm text-muted-foreground hover:underline">← All collections</Link>
      <h1 className="mt-5 text-4xl font-semibold tracking-tight">{collection.title}</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">{collection.description}</p>
      <section className="mt-10"><h2 className="text-xl font-semibold">Explore by topic</h2><div className="mt-4 flex flex-wrap gap-2">{topics.map((topic) => topic ? <Link key={topic.slug} href={`/topics/${topic.slug}`} className="rounded-full border px-3 py-1.5 text-sm hover:bg-muted/40">{topic.name}</Link> : null)}</div></section>
      {series.length ? <section className="mt-10"><h2 className="text-xl font-semibold">Related series</h2><div className="mt-4 space-y-3">{series.map((item) => item ? <Link key={item.slug} href={`/series/${item.slug}`} className="block rounded-xl border p-4 hover:bg-muted/40"><h3 className="font-semibold">{item.name}</h3><p className="mt-1 text-sm text-muted-foreground">{item.description}</p></Link> : null)}</div></section> : null}
      <section className="mt-10 rounded-2xl border p-6"><h2 className="text-xl font-semibold">The collection will grow with the library</h2><p className="mt-2 text-muted-foreground">As content is tagged with these topics and series, it can be surfaced here without changing the collection itself.</p></section>
    </main>
  );
}
