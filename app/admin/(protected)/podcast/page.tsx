import Link from "next/link";
import { PODCAST_EPISODES } from "@/app/content/podcasts";

export default function AdminPodcastPage() {
  return <main className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Admin</p><h1 className="text-3xl font-semibold">Podcast</h1></div><Link href="/admin/podcast/new" className="rounded-md border px-4 py-2 text-sm">New episode</Link></div><div className="mt-8 space-y-3">{PODCAST_EPISODES.length === 0 ? <div className="rounded-xl border p-5 text-sm text-muted-foreground">No episodes yet. Create your first episode to add audio, show notes, transcript, topics, and download information.</div> : PODCAST_EPISODES.map((episode) => <Link key={episode.slug} href={`/admin/podcast/${episode.slug}`} className="block rounded-xl border p-5 hover:bg-muted/40"><h2 className="font-semibold">{episode.title}</h2><p className="mt-1 text-sm text-muted-foreground">{episode.publishedAt}</p></Link>)}</div></main>;
}
