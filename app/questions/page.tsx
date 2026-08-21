import Link from "next/link";
import { getDiscoveryTaxonomy } from "@/app/lib/content-discovery";
import { LibraryPageHero } from "@/app/components/library-page-hero";

export default function QuestionsPage() {
  const { questions } = getDiscoveryTaxonomy();

  return (
    <main className="bg-[#f7f3eb] text-[#282b28]">
      <LibraryPageHero
        eyebrow="Library"
        title="Questions"
        subtitle="Honest questions. Biblical answers."
        description="Clear, faithful, and thoughtful responses to the questions that shape how we understand God, faith, truth, and life."
        imageUrl="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1800&q=85"
      />
      <section className="mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-16" aria-labelledby="questions-heading">
        <div className="mb-7 flex items-end justify-between gap-4 border-b border-[#cfc8ba] pb-4">
          <h2 id="questions-heading" className="font-serif text-3xl font-semibold sm:text-4xl">Explore Questions</h2>
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b716b]">{questions.length} questions</span>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {questions.map((question, index) => (
            <Link key={question.slug} href={`/questions/${question.slug}`} className="group rounded-xl border border-[#d8d0c2] bg-[#fcfaf5] p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md sm:p-7">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#efe3ce] font-serif text-sm font-semibold text-[#75442d]">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-serif text-2xl font-semibold leading-tight">{question.question}</h3>
                  {question.description ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#6b716b]">{question.description}</p> : null}
                  <span className="mt-5 inline-block border-b border-[#9a5e3a] pb-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#282b28]">Read Answer →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
