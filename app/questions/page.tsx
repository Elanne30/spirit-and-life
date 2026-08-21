import Link from "next/link";
import { getDiscoveryTaxonomy } from "@/app/lib/content-discovery";

export default function QuestionsPage() {
  const { questions } = getDiscoveryTaxonomy();

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <header className="max-w-3xl border-b pb-10">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Think carefully</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold tracking-tight sm:text-6xl">Questions</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">Start with a difficult question and follow it into Christian thought, Scripture, and related resources.</p>
      </header>
      <section className="mt-10 space-y-px border bg-border" aria-label="Questions">
        {questions.map((question, index) => (
          <Link key={question.slug} href={`/questions/${question.slug}`} className="group grid gap-5 bg-background p-6 transition hover:bg-muted/30 sm:grid-cols-[4rem_1fr_auto] sm:items-center sm:p-7">
            <span className="font-serif text-xl text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Question</p>
              <h2 className="mt-2 font-serif text-2xl font-semibold leading-tight">{question.question}</h2>
              {question.description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{question.description}</p> : null}
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground group-hover:text-foreground">Explore ↗</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
