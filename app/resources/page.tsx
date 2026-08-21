import Link from "next/link";
import { listDownloadableResources } from "@/app/lib/resource-repository";
import { LibraryPageHero } from "@/app/components/library-page-hero";

const resourceImages = [
  "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1000&q=85",
];

export default async function ResourcesPage() {
  const resources = await listDownloadableResources(true);

  return (
    <main className="bg-[color:var(--background)] text-[color:var(--foreground)] transition-colors duration-200">
      <LibraryPageHero
        eyebrow="Library"
        title="Resources"
        subtitle="Helpful materials for your growth."
        description="Articles, studies, guides, audio, and other materials to support your study, reflection, and walk with God."
        imageUrl="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1800&q=85"
      />
      <section className="mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-16" aria-labelledby="resources-heading">
        <div className="mb-7 flex items-end justify-between gap-4 border-b border-[color:var(--line)] pb-4">
          <h2 id="resources-heading" className="font-serif text-3xl font-semibold text-[color:var(--foreground)] sm:text-4xl">All Resources</h2>
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">{resources.length} resources</span>
        </div>

        {resources.length === 0 ? (
          <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] p-7 shadow-sm sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">The library is ready</p>
            <h3 className="mt-3 font-serif text-3xl font-semibold text-[color:var(--foreground)]">Resources coming soon</h3>
            <p className="mt-3 max-w-xl text-[color:var(--muted)]">The resource library is ready for studies, essays, audio, and other material to be published.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {resources.map((resource, index) => (
              <Link key={resource.slug} href={`/resources/${resource.slug}`} className="group overflow-hidden rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
                <div className="relative aspect-[16/8] overflow-hidden bg-[color:var(--surface-muted)]">
                  <div className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-[1.025]" style={{ backgroundImage: `url(${resourceImages[index % resourceImages.length]})` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent dark:from-black/60" aria-hidden="true" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-[color:var(--surface)]/90 px-3 py-1 text-xs font-semibold text-[color:var(--foreground)] backdrop-blur-sm">{String(index + 1).padStart(2, "0")}</span>
                  <span className="absolute right-3 top-3 rounded-full bg-black/55 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">{resource.kind}</span>
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="font-serif text-2xl font-semibold leading-tight text-[color:var(--foreground)]">{resource.title}</h3>
                  {resource.description ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-[color:var(--muted)]">{resource.description}</p> : null}
                  <span className="mt-5 inline-block border-b border-[color:var(--accent)] pb-1 text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--foreground)]">View Resource →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
