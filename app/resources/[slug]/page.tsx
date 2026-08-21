import Link from "next/link";
import { notFound } from "next/navigation";
import { getDownloadableResourceBySlug } from "@/app/lib/resource-repository";
import { LibraryPageHero } from "@/app/components/library-page-hero";

export default async function ResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = await getDownloadableResourceBySlug(slug);
  if (!resource || resource.status !== "published") notFound();

  return (
    <main>
      <LibraryPageHero eyebrow={resource.kind} title={resource.title} subtitle="A Spirit & Life resource for careful reading and reflection." description={resource.description || "A resource prepared to help you think, learn, and reflect."} imageUrl="https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1800&q=85" actions={[{ label: `Download ${resource.kind}`, href: resource.fileUrl, primary: true }]} />
      <section className="mx-auto max-w-5xl px-6 py-14 sm:px-8 sm:py-18">
        <Link href="/resources" className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">← All resources</Link>
        <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-2xl border bg-[color:var(--surface)] p-6 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--accent)]">About this resource</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Read, listen, or keep it for later.</h2>
            <p className="mt-5 leading-7 text-muted-foreground">{resource.description}</p>
          </article>
          <aside className="rounded-2xl border bg-[color:var(--surface)] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">File</p>
            <p className="mt-3 break-words font-serif text-2xl">{resource.fileName || resource.title}</p>
            <a href={resource.fileUrl} download={resource.fileName ?? undefined} className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--on-accent)] transition hover:bg-[color:var(--accent-strong)]">Download {resource.kind}</a>
          </aside>
        </div>
      </section>
    </main>
  );
}
