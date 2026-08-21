import Link from "next/link";
import { listVideos } from "@/app/lib/video-repository";

export default async function AdminVideosPage() {
  const videos = await listVideos();
  return (
    <section className="admin-library-page">
      <div className="admin-library-header">
        <div><p className="eyebrow">Media</p><h1>Videos</h1><p>Manage hosted videos and YouTube-linked videos for Spirit &amp; Life.</p></div>
        <Link className="admin-primary-link" href="/admin/videos/new">Add Video</Link>
      </div>
      <div className="admin-library-grid">
        {videos.map((video) => (
          <article className="admin-library-card" key={video.id}>
            {video.thumbnailUrl ? <img src={video.thumbnailUrl} alt="" className="admin-library-card-media" /> : null}
            <div className="admin-library-card-body"><p className="eyebrow">{video.status}</p><h2>{video.title}</h2><p>{video.description || "No description"}</p><p className="text-sm text-muted-foreground">{video.destinations.length ? video.destinations.join(" · ") : "No publication destinations"}</p></div>
          </article>
        ))}
      </div>
      {videos.length === 0 ? <div className="admin-empty-state"><h2>No videos yet</h2><p>Create your first video when you are ready.</p></div> : null}
    </section>
  );
}
