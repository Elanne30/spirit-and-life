import Link from "next/link";
import { notFound } from "next/navigation";
import { getPodcastEpisodeBySlug } from "@/app/lib/podcast-repository";
import { PodcastStatusActions } from "@/app/admin/(protected)/podcast/status-actions";

export default async function AdminPodcastEpisodePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const episode = await getPodcastEpisodeBySlug(slug);
  if (!episode) notFound();
  return <section className="admin-editor-page"><div className="admin-editor-header"><div><Link className="admin-outline-link" href="/admin/podcast">← Back to Podcast</Link><p className="eyebrow">Podcast episode</p><h1>{episode.title}</h1><p>{episode.description}</p></div></div><article className="admin-editor-card"><div className="admin-library-meta"><span>{episode.publishedAt}</span><span className={`admin-status admin-status-${episode.status}`}>{episode.status === "published" ? "Published" : "Draft"}</span></div>{episode.audioUrl ? <audio className="mt-6 w-full" controls src={episode.audioUrl} /> : <p className="quiet-note">No audio file attached.</p>} {episode.transcript ? <div className="mt-6 whitespace-pre-wrap leading-7">{episode.transcript}</div> : null}<PodcastStatusActions slug={episode.slug} published={episode.status === "published"} /></article></section>;
}
