"use client";

export function VideoPlayer({ src, youtubeUrl, title, poster }: { src?: string | null; youtubeUrl?: string | null; title: string; poster?: string | null }) {
  if (src) return <video controls preload="metadata" poster={poster ?? undefined} className="w-full rounded-2xl" src={src} aria-label={title} />;
  if (youtubeUrl) {
    const match = youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&/]+)/i);
    const id = match?.[1];
    if (id) return <div className="aspect-video overflow-hidden rounded-2xl"><iframe className="h-full w-full" src={`https://www.youtube.com/embed/${id}`} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>;
  }
  return null;
}
