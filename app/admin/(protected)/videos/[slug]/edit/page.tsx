import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye, Trash2, Video } from "lucide-react";
import { VideoEditorForm } from "@/app/admin/(protected)/videos/video-editor-form";
import { deleteVideoAction } from "@/app/admin/(protected)/actions/video";
import { getVideoBySlug } from "@/app/lib/video-repository";

export const dynamic = "force-dynamic";

export default async function EditVideoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  if (!video) notFound();

  return (
    <section className="admin-editor-page" style={{ width: "100%", maxWidth: "none", paddingBlock: "1rem 4rem" }}>
      <div className="admin-editor-header" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        <div>
          <Link className="admin-outline-link" href="/admin/videos"><ArrowLeft size={14} /> Back to Videos</Link>
          <div className="admin-heading-with-icon">
            <span className="admin-icon"><Video size={22} /></span>
            <div><p className="eyebrow">Media</p><h1>Edit Video</h1><p>{video.title}</p></div>
          </div>
        </div>
        <div className="video-edit-header-actions">
          <Link className="admin-outline-link" href={`/resources/video/${video.slug}`} target="_blank"><Eye size={14} /> Preview</Link>
          <form action={deleteVideoAction}>
            <input type="hidden" name="id" value={video.id} />
            <input type="hidden" name="slug" value={video.slug} />
            <button className="admin-danger-link" type="submit"><Trash2 size={14} /> Delete</button>
          </form>
        </div>
      </div>
      <article className="admin-editor-card" style={{ width: "100%", maxWidth: "none", padding: "clamp(1rem, 2vw, 2rem)", border: "1px solid var(--line)", background: "var(--surface)", boxShadow: "0 0.45rem 1.25rem var(--shadow)" }}>
        <VideoEditorForm video={video} />
      </article>
      <style>{`
        .video-edit-header-actions { display: flex; align-items: center; flex-wrap: wrap; gap: .6rem; }
        .video-edit-header-actions form { margin: 0; }
        .admin-danger-link { display: inline-flex; align-items: center; gap: .4rem; min-height: 2.25rem; padding: .55rem .8rem; border: 1px solid color-mix(in srgb, #9f3f36 45%, var(--line)); border-radius: .35rem; background: transparent; color: #9f3f36; font: inherit; font-size: .72rem; font-weight: 700; cursor: pointer; }
        .admin-danger-link:hover { background: color-mix(in srgb, #9f3f36 8%, transparent); }
      `}</style>
    </section>
  );
}
