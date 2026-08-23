"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const destinationMap = {
  "/": "home",
  "/articles": "articles",
  "/reflections": "reflections",
  "/journals": "journals",
  "/books": "books",
  "/podcast": "podcast",
  "/resources": "resources",
  "/topics": "topics",
  "/series": "series",
  "/questions": "questions",
  "/study-center": "study-center",
  "/scripture": "scripture",
  "/about": "about",
} as const;

type VideoSummary = { id: string; title: string; slug: string; description: string | null; thumbnailUrl: string | null; duration: string | null };

export function PublicVideoMount({ pathname }: { pathname: string }) {
  const destination = useMemo(() => destinationMap[pathname as keyof typeof destinationMap], [pathname]);
  const [videos, setVideos] = useState<VideoSummary[]>([]);

  useEffect(() => {
    if (!destination) return;
    let active = true;
    fetch(`/api/videos?destination=${destination}`, { cache: "no-store" })
      .then((response) => response.ok ? response.json() : [])
      .then((data) => { if (active && Array.isArray(data)) setVideos(data); })
      .catch(() => { if (active) setVideos([]); });
    return () => { active = false; };
  }, [destination]);

  if (!destination || !videos.length) return null;
  const heading = destination === "home" ? "Featured video" : "Video material";
  const description = destination === "home" ? "Watch selected video material from Spirit & Life." : "Videos published alongside this section of the library.";

  return (
    <section className="public-video-mount page-container" aria-labelledby="public-video-mount-title">
      <div className="public-video-mount-heading"><div><p className="eyebrow">Media</p><h2 id="public-video-mount-title">{heading}</h2><p>{description}</p></div>{destination !== "home" ? <Link className="section-arrow-link" href="/resources">View resources <span aria-hidden="true">↗</span></Link> : null}</div>
      <div className="public-video-mount-grid">
        {videos.map((video) => <article className="public-video-mount-card" key={video.id}>
          <Link className="public-video-mount-media" href={`/resources/video/${video.slug}`}>
            {video.thumbnailUrl ? <img src={video.thumbnailUrl} alt="" /> : <span aria-hidden="true">▶</span>}
            <span className="public-video-mount-play">Play</span>
          </Link>
          <div className="public-video-mount-body">
            <p className="content-card-label">Video</p>
            <h3><Link href={`/resources/video/${video.slug}`}>{video.title}</Link></h3>
            {video.description ? <p>{video.description}</p> : null}
            <p className="public-video-mount-meta">{video.duration || "Video"}</p>
            <Link className="content-card-link" href={`/resources/video/${video.slug}`}>Watch video →</Link>
          </div>
        </article>)}
      </div>
      <style>{`
        .public-video-mount { width: min(100% - 3rem, 78rem); padding-block: clamp(3.5rem, 7vw, 6rem); }
        .public-video-mount-heading { display: flex; align-items: end; justify-content: space-between; gap: 2rem; margin-bottom: 2rem; }
        .public-video-mount-heading h2 { margin: .25rem 0 .75rem; font-size: clamp(2.4rem, 5vw, 4.4rem); line-height: .95; letter-spacing: -.045em; }
        .public-video-mount-heading > div > p:last-child { max-width: 34rem; margin: 0; color: var(--muted); line-height: 1.65; }
        .public-video-mount-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
        .public-video-mount-card { overflow: hidden; border: 1px solid var(--line); border-radius: .35rem; background: var(--surface); box-shadow: 0 .9rem 2.4rem var(--shadow); }
        .public-video-mount-media { position: relative; display: block; aspect-ratio: 16 / 9; overflow: hidden; background: var(--surface-muted); }
        .public-video-mount-media img { width: 100%; height: 100%; object-fit: cover; transition: transform 350ms ease; }
        .public-video-mount-card:hover .public-video-mount-media img { transform: scale(1.025); }
        .public-video-mount-media > span:first-child { display: grid; place-items: center; width: 100%; height: 100%; color: var(--muted); font-size: 2rem; }
        .public-video-mount-play { position: absolute; left: .75rem; bottom: .75rem; padding: .35rem .6rem; border-radius: 999px; background: var(--surface); color: var(--foreground); font-size: .64rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; }
        .public-video-mount-body { min-height: 12rem; padding: 1.2rem 1.25rem 1.35rem; }
        .public-video-mount-body h3 { margin: .4rem 0 .75rem; font-family: var(--font-serif, Georgia, serif); font-size: clamp(1.55rem, 2.4vw, 2rem); line-height: 1; letter-spacing: -.025em; }
        .public-video-mount-body h3 a { text-decoration: none; }
        .public-video-mount-body > p:not(.content-card-label):not(.public-video-mount-meta) { color: var(--muted); font-size: .82rem; line-height: 1.6; }
        .public-video-mount-meta { margin-top: .8rem; color: var(--muted); font-size: .7rem; }
        .public-video-mount-card .content-card-link { display: inline-block; margin-top: .9rem; color: var(--accent-strong); font-size: .74rem; font-weight: 700; }
        @media (max-width: 900px) { .public-video-mount-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 720px) { .public-video-mount { width: min(100% - 2rem, 40rem); } .public-video-mount-heading { align-items: flex-start; flex-direction: column; } .public-video-mount-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}
