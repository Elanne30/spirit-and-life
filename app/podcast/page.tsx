import Link from "next/link";
import Image from "next/image";
import { listPodcastEpisodes } from "@/app/lib/podcast-repository";
import { LibraryPageHero } from "@/app/components/library-page-hero";

export default async function PodcastPage() {
  const episodes = await listPodcastEpisodes(true);

  return (
    <main className="bg-[color:var(--background)] text-[color:var(--foreground)] transition-colors duration-200">
      <LibraryPageHero
        eyebrow="Podcast"
        title="Spirit & Life Podcast"
        subtitle="Sound teaching for a deeper walk with God."
        description="Thoughtful conversations and Christian reflections to strengthen faith, encourage careful thinking, and help you keep growing in Christ."
        imageUrl="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1800&q=85"
        actions={[{ label: "Listen Now", href: "#latest-episodes", primary: true }, { label: "Browse Episodes", href: "#latest-episodes" }]}
      />

      <section id="latest-episodes" className="mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-16" aria-labelledby="latest-episodes-heading">
        <div className="mb-7 flex items-end justify-between gap-4 border-b border-[color:var(--line)] pb-4">
          <h2 id="latest-episodes-heading" className="font-serif text-3xl font-semibold text-[color:var(--foreground)] sm:text-4xl">Latest Episodes</h2>
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">{episodes.length} episodes</span>
        </div>

        {episodes.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {episodes.map((episode, index) => (
              <Link key={episode.slug} href={`/podcast/${episode.slug}`} className="group overflow-hidden rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
                <div className="relative aspect-[16/9] overflow-hidden bg-[color:var(--surface-muted)]">
                  {episode.coverImage ? (
                    <Image src={episode.coverImage} alt="" fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover transition duration-500 group-hover:scale-[1.025]" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[color:var(--surface-muted)] font-serif text-4xl text-[color:var(--muted)]">S&amp;L</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent dark:from-black/60" aria-hidden="true" />
                  <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">{episode.duration || `Episode ${String(index + 1).padStart(2, "0")}`}</span>
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.12em] text-[color:var(--muted)]">
                    <span>Episode {String(index + 1).padStart(2, "0")}</span>
                    <span className="text-[color:var(--accent)]">Listen Now →</span>
                  </div>
                  <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-[color:var(--foreground)]">{episode.title}</h3>
                  {episode.description ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-[color:var(--muted)]">{episode.description}</p> : null}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] p-7 shadow-sm sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--muted)]">Podcast library</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-[color:var(--foreground)]">Episodes coming soon</h2>
            <p className="mt-3 max-w-xl text-[color:var(--muted)]">The podcast library is ready for episodes, audio, transcripts, and related resources to be added.</p>
          </div>
        )}
      </section>
    </main>
  );
}
