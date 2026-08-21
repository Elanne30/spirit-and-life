import Link from "next/link";
import { getDiscoveryTaxonomy } from "@/app/lib/content-discovery";

export default function QuestionsPage() {
  const { questions } = getDiscoveryTaxonomy();
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Ask</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Questions</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">Start with a difficult question and follow it into Christian thought and resources.</p>
      <div className="mt-10 space-y-3">{questions.map((question) => <Link key={question.slug} href={`/questions/${question.slug}`} className="block rounded-2xl border p-5 hover:bg-muted/40"><h2 className="font-semibold">{question.question}</h2>{question.description ? <p className="mt-2 text-sm text-muted-foreground">{question.description}</p> : null}</Link>)}</div>
    </main>
  );
}
