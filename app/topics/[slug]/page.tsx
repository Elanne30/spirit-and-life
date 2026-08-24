import Link from "next/link";
import { notFound } from "next/navigation";
import { getTopicDiscovery } from "@/app/lib/content-discovery";
import { LibraryPageHero } from "@/app/components/library-page-hero";

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const discovery = await getTopicDiscovery(slug);
  if (!discovery) notFound();

  return (
    <main>
      <LibraryPageHero eyebrow="Topic" title={discovery.topic.name} subtitle="A place to think carefully about what matters." description={discovery.topic.description || `Explore Spirit & Life writings, questions, and connected series around ${discovery.topic.name}.`} imageUrl="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1800&q=85" />
      <section className="mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-18">
        <Link href="/topics" className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">← All topics</Link>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border bg-[color:var(--surface)] p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 border-b pb-4"><h2 className="font-serif text-3xl">Series</h2><span className="text-xs text-muted-foreground">{discovery.series.length}</span></div>
            <div className="mt-5 space-y-3">{discovery.series.length ? discovery.series.map((series) => <Link key={series.slug} href={`/series/${series.slug}`} className="group block rounded-xl border p-5 transition hover:-translate-y-0.5 hover:border-[color:var(--accent)]"><span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Series</span><h3 className="mt-2 font-serif text-xl">{series.name}</h3><span className="mt-3 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--accent)]">Read series ↗</span></Link>) : <p className="text-sm text-muted-foreground">No series yet.</p>}</div>
          </section>
          <section className="rounded-2xl border bg-[color:var(--surface)] p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 border-b pb-4"><h2 className="font-serif text-3xl">Questions</h2><span className="text-xs text-muted-foreground">{discovery.questions.length}</span></div>
            <div className="mt-5 space-y-3">{discovery.questions.length ? discovery.questions.map((question) => <Link key={question.slug} href={`/questions/${question.slug}`} className="block rounded-xl border p-5 transition hover:-translate-y-0.5 hover:border-[color:var(--accent)]"><span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Question</span><h3 className="mt-2 font-serif text-xl">{question.question}</h3><span className="mt-3 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--accent)]">Explore ↗</span></Link>) : <p className="text-sm text-muted-foreground">No questions yet.</p>}</div>
          </section>
        </div>
        <section className="mt-6 rounded-2xl border bg-[color:var(--surface)] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4 border-b pb-4"><h2 className="font-serif text-3xl">Articles</h2><span className="text-xs text-muted-foreground">{discovery.articles.length}</span></div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">{discovery.articles.length ? discovery.articles.map((article) => <Link key={article.id} href={`/articles/${article.slug}`} className="block rounded-xl border p-5 transition hover:-translate-y-0.5 hover:border-[color:var(--accent)]"><span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Article</span><h3 className="mt-2 font-serif text-xl">{article.title}</h3>{article.introduction ? <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{article.introduction}</p> : null}<span className="mt-3 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--accent)]">Read article ↗</span></Link>) : <p className="text-sm text-muted-foreground">Published articles tagged with this topic will appear here automatically.</p>}</div>
        </section>
      </section>
    </main>
  );
}
