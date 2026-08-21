import Link from "next/link";
import { notFound } from "next/navigation";
import { getQuestionDiscovery } from "@/app/lib/content-discovery";

export default async function QuestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const discovery = getQuestionDiscovery(slug);
  if (!discovery) notFound();
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Link href="/questions" className="text-sm text-muted-foreground hover:underline">← All questions</Link>
      <p className="mt-6 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Question</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">{discovery.question.question}</h1>
      {discovery.question.description ? <p className="mt-5 text-lg text-muted-foreground">{discovery.question.description}</p> : null}
      <div className="mt-10"><h2 className="text-xl font-semibold">Explore this question through</h2><div className="mt-4 flex flex-wrap gap-2">{discovery.topics.map((topic) => <Link key={topic.slug} href={`/topics/${topic.slug}`} className="rounded-full border px-3 py-1.5 text-sm hover:bg-muted/40">{topic.name}</Link>)}{discovery.series ? <Link href={`/series/${discovery.series.slug}`} className="rounded-full border px-3 py-1.5 text-sm hover:bg-muted/40">Series: {discovery.series.name}</Link> : null}</div></div>
    </main>
  );
}
