import Link from "next/link";
import { notFound } from "next/navigation";
import { getQuestionDiscovery } from "@/app/lib/content-discovery";
import { LibraryPageHero } from "@/app/components/library-page-hero";

export default async function QuestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const discovery = await getQuestionDiscovery(slug);
  if (!discovery) notFound();

  return (
    <main>
      <LibraryPageHero eyebrow="Question" title={discovery.question.question} subtitle="Honest questions deserve careful answers." description={discovery.question.description || "Follow this question through the related topics and series in Spirit & Life."} imageUrl="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1800&q=85" />
      <section className="mx-auto max-w-5xl px-6 py-14 sm:px-8 sm:py-18">
        <Link href="/questions" className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">← All questions</Link>
        <div className="mt-8 rounded-2xl border bg-[color:var(--surface)] p-6 sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--accent)]">Explore this question through</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Related paths of thought</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {discovery.topics.map((topic) => <Link key={topic.slug} href={`/topics/${topic.slug}`} className="rounded-xl border p-5 transition hover:-translate-y-0.5 hover:border-[color:var(--accent)]"><span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Topic</span><h3 className="mt-2 font-serif text-xl">{topic.name}</h3><span className="mt-3 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--accent)]">Explore ↗</span></Link>)}
            {discovery.series ? <Link href={`/series/${discovery.series.slug}`} className="rounded-xl border p-5 transition hover:-translate-y-0.5 hover:border-[color:var(--accent)]"><span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Series</span><h3 className="mt-2 font-serif text-xl">{discovery.series.name}</h3><span className="mt-3 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--accent)]">Read series ↗</span></Link> : null}
          </div>
        </div>
        <section className="mt-6 rounded-2xl border bg-[color:var(--surface)] p-6 sm:p-9">
          <div className="flex items-center justify-between gap-4 border-b pb-4"><h2 className="font-serif text-3xl">Related Articles</h2><span className="text-xs text-muted-foreground">{discovery.articles.length}</span></div>
          <div className="mt-5 space-y-3">{discovery.articles.length ? discovery.articles.map((article) => <Link key={article.id} href={`/articles/${article.slug}`} className="block rounded-xl border p-5 transition hover:-translate-y-0.5 hover:border-[color:var(--accent)]"><span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Article</span><h3 className="mt-2 font-serif text-xl">{article.title}</h3>{article.introduction ? <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{article.introduction}</p> : null}<span className="mt-3 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--accent)]">Read article ↗</span></Link>) : <p className="text-sm text-muted-foreground">Articles linked to this question will appear here automatically.</p>}</div>
        </section>
      </section>
    </main>
  );
}
