import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPodcastEpisodeBySlug } from "@/app/lib/podcast-repository";
import { LibraryPageHero } from "@/app/components/library-page-hero";

export default async function PodcastEpisodePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const episode = await getPodcastEpisodeBySlug(slug);
  if (!episode || episode.status !== "published") notFound();

  return (
    <main className="bg-[color:var(--background)] text-[color:var(--foreground)] transition-colors duration-200">
      <LibraryPageHero
        eyebrow="Podcast Episode"
        title={episode.title}
        subtitle="Listen, reflect, and return to the conversation."
        description={episode.description || "A Spirit & Life conversation for thoughtful Christian reflection."}
        imageUrl={episode.coverImage || "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1800&q=85"}
        actions={episode.audioUrl ? [{ label: "Play episode", href: "#player", primary: true }] : undefined}
      />

      <section className="mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-18">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.75fr)] lg:items-start">
          <div>
            <Link href="/podcast" className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)] hover:text-[color:var(--foreground)]">← Back to podcast</Link>
            <div className="mt-7 overflow-hidden rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] shadow-sm">
              {episode.coverImage ? (
                <div className="relative aspect-[16/9]">
                  <Image src={episode.coverImage} alt="" fill sizes="(max-width: 1024px) 100vw, 65vw" className="object-cover" />
                </div>
              ) : null}
              <div id="player" className="p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4 border-b border-[color:var(--line)] pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--accent)]">Now playing</p>
                    <p className="mt-1 font-serif text-xl text-[color:var(--foreground)]">{episode.title}</p>
                  </div>
                  <div className="text-right text-xs text-[color:var(--muted)]">
                    <div>{episode.publishedAt}</div>
                    {episode.duration ? <div className="mt-1">{episode.duration}</div> : null}
                  </div>
                </div>
                {episode.audioUrl ? (
                  <audio className="mt-6 w-full" controls preload="metadata" src={episode.audioUrl} />
                ) : (
                  <p className="mt-6 text-sm text-[color:var(--muted)]">Audio will be available when the episode is published.</p>
                )}
                {episode.audioUrl ? <a className="mt-5 inline-flex min-h-10 items-center rounded-md border border-[color:var(--line)] px-4 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--accent)]" href={episode.audioUrl} download>Download episode</a> : null}
              </div>
            </div>
          </div>

          {episode.transcript ? (
            <aside className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--accent)]">Transcript</p>
              <h2 className="mt-3 font-serif text-3xl text-[color:var(--foreground)]">Read along</h2>
              <div className="mt-6 max-h-[38rem] overflow-auto whitespace-pre-wrap border-t border-[color:var(--line)] pt-6 text-sm leading-7 text-[color:var(--muted)]">{episode.transcript}</div>
            </aside>
          ) : (
            <aside className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--accent)]">About this episode</p>
              <h2 className="mt-3 font-serif text-3xl text-[color:var(--foreground)]">Listen at your pace</h2>
              <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">Stay with the conversation here or download the audio for later listening.</p>
            </aside>
          )}
        </div>
      </section>
    </main>
  );
}
