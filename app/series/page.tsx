import Link from "next/link";
import { getDiscoveryTaxonomy } from "@/app/lib/content-discovery";

export default function SeriesPage() {
  const { series } = getDiscoveryTaxonomy();
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Explore</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Series</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">Follow connected writings around a shared Christian question or theme.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {series.map((item) => <Link key={item.slug} href={`/series/${item.slug}`} className="rounded-2xl border p-5 hover:bg-muted/40"><h2 className="font-semibold">{item.name}</h2>{item.description ? <p className="mt-2 text-sm text-muted-foreground">{item.description}</p> : null}</Link>)}
      </div>
    </main>
  );
}
