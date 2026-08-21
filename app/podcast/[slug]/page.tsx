import Link from "next/link";
import { notFound } from "next/navigation";
import { getPodcastEpisode } from "@/app/content/podcasts";

export default async function PodcastEpisodePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const episode = getPodcastEpisode(slug);
  if (!episode) notFound();
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Link href="/podcast" className="text-sm text-muted-foreground hover:underline">← Podcast</Link>
      <p className="mt-6 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Podcast Episode</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">{episode.title}</h1>
      <p className="mt-4 text-muted-foreground">{episode.description}</p>
      <div className="mt-8 flex flex-wrap gap-3 text-sm text-muted-foreground"><span>{episode.publishedAt}</span>{episode.duration ? <span>· {episode.duration}</span> : null}</div>
      {episode.audioUrl ? <section className="mt-10 rounded-2xl border p-6"><audio className="w-full" controls preload="metadata" src={episode.audioUrl} /><a className="mt-4 inline-block rounded-full border px-4 py-2 text-sm font-medium hover:bg-muted/40" href={episode.audioUrl} download>Download episode</a></section> : <section className="mt-10 rounded-2xl border p-6 text-sm text-muted-foreground">Audio will be available when the episode is published.</section>}
      {episode.transcript ? <section className="mt-10"><h2 className="text-2xl font-semibold">Transcript</h2><div className="mt-4 whitespace-pre-wrap leading-7 text-muted-foreground">{episode.transcript}</div></section> : null}
    </main>
  );
}
