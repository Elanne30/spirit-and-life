import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeriesDiscovery } from "@/app/lib/content-discovery";
import { LibraryPageHero } from "@/app/components/library-page-hero";

export default async function SeriesDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const discovery = getSeriesDiscovery(slug);
  if (!discovery) notFound();

  return (
    <main>
      <LibraryPageHero eyebrow="Series" title={discovery.series.name} subtitle="Connected writing around a shared Christian question." description={discovery.series.description || "Follow the connected questions, themes, and resources in this series."} imageUrl="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1800&q=85" />
      <section className="mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-18">
        <Link href="/series" className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">← All series</Link>
        <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="rounded-2xl border bg-[color:var(--surface)] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--accent)]">Themes</p>
            <h2 className="mt-3 font-serif text-3xl">Topics in this series</h2>
            <div className="mt-6 flex flex-wrap gap-2">{discovery.topics.map((topic) => <Link key={topic.slug} href={`/topics/${topic.slug}`} className="rounded-full border px-3 py-2 text-sm transition hover:border-[color:var(--accent)]">{topic.name}</Link>)}</div>
          </section>
          <section className="rounded-2xl border bg-[color:var(--surface)] p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 border-b pb-4"><h2 className="font-serif text-3xl">Questions</h2><span className="text-xs text-muted-foreground">{discovery.questions.length}</span></div>
            <div className="mt-5 space-y-3">{discovery.questions.length ? discovery.questions.map((question) => <Link key={question.slug} href={`/questions/${question.slug}`} className="block rounded-xl border p-5 transition hover:-translate-y-0.5 hover:border-[color:var(--accent)]"><span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Question</span><h3 className="mt-2 font-serif text-xl">{question.question}</h3><span className="mt-3 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--accent)]">Explore ↗</span></Link>) : <p className="text-sm text-muted-foreground">Questions will appear here as they are added.</p>}</div>
          </section>
        </div>
      </section>
    </main>
  );
}
