import Link from "next/link";
import Image from "next/image";
import { listPodcastEpisodes } from "@/app/lib/podcast-repository";

export default async function PodcastPage() {
  const episodes = await listPodcastEpisodes(true);
  const featured = episodes[0];
  const remaining = episodes.slice(1);

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <header className="max-w-3xl border-b pb-10">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Listen</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold tracking-tight sm:text-6xl">Podcast</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">Thoughtful conversations and Christian reflections, with episodes available to listen to, read, and revisit.</p>
      </header>

      {featured ? (
        <>
          <Link href={`/podcast/${featured.slug}`} className="group mt-10 grid overflow-hidden border sm:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)]">
            <div className="relative min-h-72 bg-muted/30 sm:min-h-96">
              {featured.coverImage ? <Image src={featured.coverImage} alt="" fill sizes="(max-width: 640px) 100vw, 52vw" className="object-cover transition duration-300 group-hover:scale-[1.02]" /> : <div className="flex h-full items-center justify-center font-serif text-5xl text-muted-foreground">S&amp;L</div>}
            </div>
            <div className="flex flex-col justify-between p-7 sm:p-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Latest episode</p>
                <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight sm:text-4xl">{featured.title}</h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{featured.description}</p>
              </div>
              <span className="mt-8 text-xs font-semibold uppercase tracking-[0.13em]">Listen to episode ↗</span>
            </div>
          </Link>

          {remaining.length > 0 ? (
            <section className="mt-12" aria-labelledby="episodes-heading">
              <div className="mb-5 flex items-end justify-between border-b pb-4"><h2 id="episodes-heading" className="font-serif text-3xl font-semibold">All episodes</h2><span className="text-xs uppercase tracking-[0.13em] text-muted-foreground">{episodes.length} episodes</span></div>
              <div className="grid gap-px border bg-border sm:grid-cols-2 lg:grid-cols-3">
                {remaining.map((episode, index) => (
                  <Link key={episode.slug} href={`/podcast/${episode.slug}`} className="group bg-background p-6 transition hover:bg-muted/30">
                    <p className="text-xs font-semibold uppercase tracking-[0.13em] text-muted-foreground">Episode {String(index + 2).padStart(2, "0")}</p>
                    <h3 className="mt-8 font-serif text-2xl font-semibold leading-tight">{episode.title}</h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{episode.description}</p>
                    <span className="mt-7 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground group-hover:text-foreground">Listen ↗</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </>
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
