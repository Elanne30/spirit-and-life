import Link from "next/link";
import { getDiscoveryTaxonomy } from "@/app/lib/content-discovery";

export default function SeriesPage() {
  const { series } = getDiscoveryTaxonomy();

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <header className="max-w-3xl border-b pb-10">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Explore the library</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold tracking-tight sm:text-6xl">Series</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">Follow connected writings around a shared Christian question or theme.</p>
      </header>
      <section className="mt-10 grid gap-5 sm:grid-cols-2" aria-label="Series">
        {series.map((item, index) => (
          <Link key={item.slug} href={`/series/${item.slug}`} className="group border bg-background p-6 transition hover:-translate-y-0.5 hover:bg-muted/20 sm:p-7">
            <div className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"><span>Series</span><span>{String(index + 1).padStart(2, "0")}</span></div>
            <div className="mt-10 min-h-28">
              <h2 className="font-serif text-2xl font-semibold leading-tight">{item.name}</h2>
              {item.description ? <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{item.description}</p> : null}
            </div>
            <span className="mt-6 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground group-hover:text-foreground">Read series ↗</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
