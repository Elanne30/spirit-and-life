import Link from "next/link";
import { COLLECTIONS } from "@/app/lib/collections";

export default function CollectionsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Library</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Collections</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">Curated paths that bring Articles, Reflections, Journals, Books, and Study resources together around a shared question or theme.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">{COLLECTIONS.map((collection) => <Link key={collection.slug} href={`/collections/${collection.slug}`} className="rounded-2xl border p-5 hover:bg-muted/40"><h2 className="font-semibold">{collection.title}</h2><p className="mt-2 text-sm text-muted-foreground">{collection.description}</p></Link>)}</div>
    </main>
  );
}
