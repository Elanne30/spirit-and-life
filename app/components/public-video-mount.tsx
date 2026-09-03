"use client";

import { useEffect, useMemo, useState } from "react";
import { VideoPlayer } from "@/app/components/video-player";

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

type VideoSummary = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  videoUrl: string | null;
  youtubeUrl: string | null;
  thumbnailUrl: string | null;
  duration: string | null;
};

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

  return (
    <section className={`public-video-mount page-container ${destination === "home" ? "public-video-mount-home" : ""}`} aria-label="Video">
      <div className="public-video-mount-grid">
        {videos.map((video) => (
          <article className="public-video-mount-card" key={video.id}>
            <div className="public-video-mount-media">
              <VideoPlayer src={video.videoUrl} youtubeUrl={video.youtubeUrl} title={video.title} poster={video.thumbnailUrl} />
            </div>
            <div className="public-video-mount-body">
              <p className="content-card-label">Video</p>
              <h3>{video.title}</h3>
              {video.description ? <p>{video.description}</p> : null}
              {video.duration ? <p className="public-video-mount-meta">{video.duration}</p> : null}
            </div>
          </article>
        ))}
      </div>
      <style>{`
        .public-video-mount { width: min(100% - 3rem, 78rem); padding-block: clamp(3.5rem, 7vw, 6rem); }
        .public-video-mount-home { padding-block: clamp(3.5rem, 6vw, 5.5rem); }
        .public-video-mount-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
        .public-video-mount-card { overflow: hidden; border: 1px solid var(--line); border-radius: .35rem; background: var(--surface); box-shadow: 0 .9rem 2.4rem var(--shadow); }
        .public-video-mount-media { aspect-ratio: 16 / 9; overflow: hidden; background: var(--surface-muted); }
        .public-video-mount-media > div { width: 100%; height: 100%; }
        .public-video-mount-media video, .public-video-mount-media iframe { display: block; width: 100%; height: 100%; border: 0; }
        .public-video-mount-body { min-height: 8rem; padding: 1.2rem 1.25rem 1.35rem; }
        .public-video-mount-body h3 { margin: .4rem 0 .75rem; font-family: var(--font-serif, Georgia, serif); font-size: clamp(1.45rem, 2.3vw, 2rem); line-height: 1; letter-spacing: -.025em; }
        .public-video-mount-body > p:not(.content-card-label):not(.public-video-mount-meta) { color: var(--muted); font-size: .82rem; line-height: 1.6; }
        .public-video-mount-meta { margin-top: .8rem; color: var(--muted); font-size: .7rem; }
        @media (max-width: 900px) { .public-video-mount-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 720px) { .public-video-mount { width: min(100% - 2rem, 40rem); } .public-video-mount-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}
