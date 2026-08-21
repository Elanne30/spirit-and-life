import Link from "next/link";
import { listPodcastEpisodes } from "@/app/lib/podcast-repository";

export default async function PodcastPage() {
  const episodes = await listPodcastEpisodes(true);
  return <main className="mx-auto max-w-5xl px-6 py-16"><p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Listen</p><h1 className="mt-3 text-4xl font-semibold tracking-tight">Podcast</h1><p className="mt-4 max-w-2xl text-muted-foreground">Thoughtful conversations and Christian reflections, with episodes available to listen to and download.</p>{episodes.length === 0 ? <section className="mt-10 rounded-2xl border p-6"><h2 className="font-semibold">Episodes coming soon</h2><p className="mt-2 text-sm text-muted-foreground">The podcast library is ready. Episodes, audio, transcripts, and downloads can be added as they are produced.</p></section> : <div className="mt-10 grid gap-4 sm:grid-cols-2">{episodes.map((episode) => <Link key={episode.slug} href={`/podcast/${episode.slug}`} className="rounded-2xl border p-5 hover:bg-muted/40"><h2 className="font-semibold">{episode.title}</h2><p className="mt-2 text-sm text-muted-foreground">{episode.description}</p></Link>)}</div>}</main>;
}
