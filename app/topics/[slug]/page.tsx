import Link from "next/link";
import { notFound } from "next/navigation";
import { getTopicDiscovery } from "@/app/lib/content-discovery";

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const discovery = getTopicDiscovery(slug);
  if (!discovery) notFound();
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <Link href="/topics" className="text-sm text-muted-foreground hover:underline">← All topics</Link>
      <h1 className="mt-5 text-4xl font-semibold tracking-tight">{discovery.topic.name}</h1>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <section><h2 className="text-xl font-semibold">Series</h2><div className="mt-4 space-y-3">{discovery.series.length ? discovery.series.map((series) => <Link key={series.slug} href={`/series/${series.slug}`} className="block rounded-xl border p-4 hover:bg-muted/40">{series.name}</Link>) : <p className="text-muted-foreground">No series yet.</p>}</div></section>
        <section><h2 className="text-xl font-semibold">Questions</h2><div className="mt-4 space-y-3">{discovery.questions.length ? discovery.questions.map((question) => <Link key={question.slug} href={`/questions/${question.slug}`} className="block rounded-xl border p-4 hover:bg-muted/40">{question.question}</Link>) : <p className="text-muted-foreground">No questions yet.</p>}</div></section>
      </div>
    </main>
  );
}
