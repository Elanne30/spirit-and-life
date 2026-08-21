import Link from "next/link";
import { listDownloadableResources } from "@/app/lib/resource-repository";

export default async function ResourcesPage() {
  const resources = await listDownloadableResources(true);

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <header className="max-w-3xl border-b pb-10">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Library</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold tracking-tight sm:text-6xl">Resources</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">Downloadable studies, essays, audio, and other useful material from Spirit &amp; Life.</p>
      </header>

      {resources.length === 0 ? (
        <section className="mt-10 border p-7 sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">The library is ready</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold">Resources coming soon</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">The resource library is ready for studies, essays, audio, and other material to be published.</p>
        </section>
      ) : (
        <section className="mt-10 grid gap-5 sm:grid-cols-2" aria-label="Resources">
          {resources.map((resource, index) => (
            <Link key={resource.slug} href={`/resources/${resource.slug}`} className="group border bg-background p-6 transition hover:-translate-y-0.5 hover:bg-muted/20 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{resource.kind}</span>
                <span className="font-serif text-sm text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="mt-10 min-h-28">
                <h2 className="font-serif text-2xl font-semibold leading-tight group-hover:text-foreground">{resource.title}</h2>
                {resource.description ? <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{resource.description}</p> : null}
              </div>
              <span className="mt-6 inline-block border-b border-foreground/30 pb-1 text-xs font-semibold uppercase tracking-[0.12em]">View resource ↗</span>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
