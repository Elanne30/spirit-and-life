import Link from "next/link";
import { ArrowLeft, ArrowRight, Edit3, Eye, Plus, Video } from "lucide-react";
import { listVideos } from "@/app/lib/video-repository";
import { deleteVideoAction } from "@/app/admin/(protected)/actions/video";

export const dynamic = "force-dynamic";

const destinationLabels: Record<string, string> = { home: "Home", articles: "Articles", reflections: "Reflections", journals: "Journals", resources: "Resources" };

export default async function AdminVideosPage() {
  const videos = await listVideos();
  return (
    <section className="admin-library-page">
      <div className="admin-library-heading video-library-heading">
        <div>
          <p className="eyebrow">Media library</p>
          <h2>Videos</h2>
          <p>Manage hosted videos and YouTube-linked videos for Spirit &amp; Life.</p>
        </div>
        <div className="admin-library-actions">
          <Link className="admin-outline-link" href="/admin"><ArrowLeft size={14} /> Dashboard</Link>
          <Link className="admin-primary-link" href="/admin/videos/new"><Plus size={14} /> Add Video</Link>
        </div>
      </div>

      {videos.length ? <div className="admin-library-grid video-library-grid">
        {videos.map((video) => (
          <article className="admin-library-card video-library-card" key={video.id}>
            <div className="admin-library-image video-card-media">
              {video.thumbnailUrl ? <img src={video.thumbnailUrl} alt="" /> : <span className="admin-icon"><Video size={24} /></span>}
              <span className={`admin-status admin-status-${video.status}`}>{video.status}</span>
            </div>
            <div className="admin-library-card-body">
              <div className="admin-library-card-title"><h3>{video.title}</h3></div>
              {video.description ? <p>{video.description}</p> : <p className="quiet-note">No description</p>}
              <div className="admin-library-meta"><span>{video.duration || "Video"}</span><span>{video.destinations.length ? video.destinations.map((item) => destinationLabels[item] ?? item).join(" · ") : "No destinations"}</span></div>
              <div className="video-card-actions">
                <Link className="button button-secondary" href={`/admin/videos/${video.slug}/edit`}><Edit3 size={14} /> Edit</Link>
                <Link className="button button-secondary" href={`/resources/video/${video.slug}`} target="_blank"><Eye size={14} /> Preview</Link>
                <form action={deleteVideoAction}><input type="hidden" name="id" value={video.id} /><input type="hidden" name="slug" value={video.slug} /><button className="button button-secondary video-delete-button" type="submit">Delete</button></form>
              </div>
            </div>
          </article>
        ))}
      </div> : <div className="admin-empty-state"><Video size={22} /><h2>No videos yet</h2><p>Create your first video when you are ready.</p><Link className="admin-primary-link" href="/admin/videos/new">Add Video <ArrowRight size={14} /></Link></div>}

      <style>{`
        .video-library-heading { align-items: flex-end; }
        .video-library-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .video-library-card { overflow: hidden; }
        .video-card-media { position: relative; aspect-ratio: 16 / 9; overflow: hidden; background: var(--surface-muted); }
        .video-card-media img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .video-card-media .admin-status { position: absolute; top: .75rem; left: .75rem; }
        .video-library-card-body > p { min-height: 3.2rem; }
        .video-card-actions { display: flex; flex-wrap: wrap; gap: .45rem; margin-top: 1rem; padding-top: .85rem; border-top: 1px solid var(--line); }
        .video-card-actions form { margin: 0; }
        .video-card-actions .button { display: inline-flex; align-items: center; gap: .35rem; }
        .video-delete-button { color: #9f3f36; }
        @media (max-width: 1000px) { .video-library-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 680px) { .video-library-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}
