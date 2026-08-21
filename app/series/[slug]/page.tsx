import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeriesDiscovery } from "@/app/lib/content-discovery";

export default async function SeriesDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const discovery = getSeriesDiscovery(slug);
  if (!discovery) notFound();
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <Link href="/series" className="text-sm text-muted-foreground hover:underline">← All series</Link>
      <h1 className="mt-5 text-4xl font-semibold tracking-tight">{discovery.series.name}</h1>
      {discovery.series.description ? <p className="mt-4 max-w-2xl text-muted-foreground">{discovery.series.description}</p> : null}
      <section className="mt-10"><h2 className="text-xl font-semibold">Topics</h2><div className="mt-4 flex flex-wrap gap-2">{discovery.topics.map((topic) => <Link key={topic.slug} href={`/topics/${topic.slug}`} className="rounded-full border px-3 py-1.5 text-sm hover:bg-muted/40">{topic.name}</Link>)}</div></section>
      <section className="mt-10"><h2 className="text-xl font-semibold">Questions</h2><div className="mt-4 space-y-3">{discovery.questions.length ? discovery.questions.map((question) => <Link key={question.slug} href={`/questions/${question.slug}`} className="block rounded-xl border p-4 hover:bg-muted/40">{question.question}</Link>) : <p className="text-muted-foreground">Questions will appear here as they are added.</p>}</div></section>
    </main>
  );
}
