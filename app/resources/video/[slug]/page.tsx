import Link from "next/link";
import { notFound } from "next/navigation";
import { getVideoBySlug } from "@/app/lib/video-repository";

function youtubeEmbedUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.hostname === "youtu.be") return `https://www.youtube.com/embed/${url.pathname.slice(1)}`;
    const id = url.searchParams.get("v");
    if (id) return `https://www.youtube.com/embed/${id}`;
    if (url.pathname.startsWith("/embed/")) return `https://www.youtube.com${url.pathname}`;
  } catch {}
  return null;
}

export const dynamic = "force-dynamic";

export default async function PublicVideoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  if (!video || video.status !== "published") notFound();
  const youtube = video.youtubeUrl ? youtubeEmbedUrl(video.youtubeUrl) : null;

  return (
    <main className="public-video-page">
      <section className="public-video-shell page-container">
        <div className="public-video-heading">
          <p className="eyebrow">Video</p>
          <h1>{video.title}</h1>
          {video.description ? <p>{video.description}</p> : null}
          <div className="public-video-meta"><span>{video.duration || "Video"}</span><span>{video.publishedAt ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(video.publishedAt)) : ""}</span></div>
        </div>

        <div className="public-video-player">
          {video.videoUrl ? <video controls playsInline preload="metadata" poster={video.thumbnailUrl ?? undefined} src={video.videoUrl} /> : youtube ? <iframe src={youtube} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /> : video.thumbnailUrl ? <img src={video.thumbnailUrl} alt={video.title} /> : <div className="public-video-placeholder">Video unavailable.</div>}
        </div>

        <div className="public-video-actions">
          {video.videoUrl ? <a className="button button-secondary" href={video.videoUrl} download>Download video</a> : null}
          {video.youtubeUrl ? <a className="button button-secondary" href={video.youtubeUrl} target="_blank" rel="noreferrer">Watch on YouTube</a> : null}
          <Link className="button button-text" href="/resources">Back to Resources →</Link>
        </div>

        {video.transcript ? <section className="public-video-transcript"><p className="eyebrow">Transcript</p><div>{video.transcript.split(/\n{2,}/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></section> : null}
      </section>
      <style>{`
        .public-video-page { min-height: 60vh; padding-block: clamp(3rem, 7vw, 6rem); background: var(--background); }
        .public-video-shell { width: min(100% - 3rem, 78rem); }
        .public-video-heading { max-width: 58rem; margin-bottom: 2rem; }
        .public-video-heading h1 { margin: .35rem 0 1rem; font-size: clamp(2.8rem, 6vw, 5.6rem); line-height: .92; letter-spacing: -.05em; }
        .public-video-heading > p:not(.eyebrow) { max-width: 46rem; color: var(--muted); line-height: 1.7; }
        .public-video-meta { display: flex; flex-wrap: wrap; gap: .8rem 1.4rem; margin-top: 1.1rem; color: var(--muted); font-size: .74rem; }
        .public-video-player { overflow: hidden; border: 1px solid var(--line); background: #050505; box-shadow: 0 1.2rem 3rem var(--shadow); }
        .public-video-player video, .public-video-player iframe, .public-video-player img { display: block; width: 100%; aspect-ratio: 16 / 9; border: 0; object-fit: contain; }
        .public-video-player iframe { background: #050505; }
        .public-video-placeholder { display: grid; place-items: center; aspect-ratio: 16 / 9; color: white; }
        .public-video-actions { display: flex; flex-wrap: wrap; align-items: center; gap: .65rem; margin-top: 1rem; }
        .public-video-transcript { max-width: 58rem; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--line); }
        .public-video-transcript div { color: var(--muted); line-height: 1.8; }
      `}</style>
    </main>
  );
}
