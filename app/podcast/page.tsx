import Link from "next/link";
import Image from "next/image";
import { listPodcastEpisodes } from "@/app/lib/podcast-repository";

export default async function PodcastPage() {
  const episodes = await listPodcastEpisodes(true);

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <header className="max-w-3xl border-b pb-10">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Listen</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold tracking-tight sm:text-6xl">Podcast</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">Thoughtful conversations and Christian reflections, with episodes available to listen to, read, and revisit.</p>
      </header>

      {episodes.length > 0 ? (
        <section className="mt-10 grid gap-5 sm:grid-cols-2" aria-label="Podcast episodes">
          {episodes.map((episode, index) => (
            <Link key={episode.slug} href={`/podcast/${episode.slug}`} className="group overflow-hidden border bg-background transition hover:-translate-y-0.5 hover:bg-muted/20">
              <div className="relative aspect-[16/9] overflow-hidden bg-muted/30">
                {episode.coverImage ? (
                  <Image src={episode.coverImage} alt="" fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover transition duration-500 group-hover:scale-[1.025]" />
                ) : (
                  <div className="flex h-full items-center justify-center font-serif text-4xl text-muted-foreground">S&amp;L</div>
                )}
                <span className="absolute left-4 top-4 border bg-background/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em]">Episode {String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="p-6 sm:p-7">
                <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  <span>{episode.duration || "Podcast"}</span>
                  <span>Listen ↗</span>
                </div>
                <h2 className="mt-4 font-serif text-2xl font-semibold leading-tight">{episode.title}</h2>
                {episode.description ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{episode.description}</p> : null}
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <section className="mt-10 border p-7 sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Podcast library</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold">Episodes coming soon</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">The podcast library is ready for episodes, audio, transcripts, and related resources to be added.</p>
        </section>
      )}
    </main>
  );
}
