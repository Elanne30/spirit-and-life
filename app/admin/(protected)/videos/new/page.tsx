import Link from "next/link";
import { ArrowLeft, Video } from "lucide-react";
import { VideoEditorForm } from "@/app/admin/(protected)/videos/video-editor-form";

export default function NewVideoPage() {
  return (
    <section className="admin-editor-page" style={{ width: "100%", maxWidth: "none", paddingBlock: "1rem 4rem" }}>
      <div className="admin-editor-header" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        <div>
          <Link className="admin-outline-link" href="/admin/videos"><ArrowLeft size={14} /> Back to Videos</Link>
          <div className="admin-heading-with-icon">
            <span className="admin-icon"><Video size={22} /></span>
            <div><p className="eyebrow">Media</p><h1>New Video</h1><p>Create a video without changing the existing content systems.</p></div>
          </div>
        </div>
      </div>
      <article className="admin-editor-card" style={{ width: "100%", maxWidth: "none", padding: "clamp(1rem, 2vw, 2rem)", border: "1px solid var(--line)", background: "var(--surface)", boxShadow: "0 0.45rem 1.25rem var(--shadow)" }}>
        <VideoEditorForm />
      </article>
      <style>{videoEditorStyles}</style>
    </section>
  );
}

const videoEditorStyles = `
  .video-editor-form { max-width: 72rem; }
  .video-editor-form .video-editor-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
  .video-upload-field { min-width: 0; }
  .video-editor-preview, .video-thumbnail-preview { display: block; width: 100%; margin-top: .75rem; border: 1px solid var(--line); border-radius: .45rem; background: var(--surface-muted); }
  .video-editor-preview { max-height: 24rem; object-fit: contain; }
  .video-thumbnail-preview { aspect-ratio: 16 / 9; object-fit: cover; }
  .video-destinations { margin-top: .5rem; padding: 1rem; border: 1px solid var(--line); border-radius: .45rem; }
  .video-destinations legend { padding-inline: .35rem; font-family: var(--font-serif, Georgia, serif); font-size: 1.35rem; }
  .video-destination-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .7rem 1rem; margin-top: .9rem; }
  .video-editor-actions { display: flex; flex-wrap: wrap; gap: .65rem; margin-top: 1.25rem; padding-top: 1.25rem; border-top: 1px solid var(--line); }
  @media (max-width: 720px) { .video-editor-form .video-editor-grid, .video-destination-grid { grid-template-columns: 1fr; } }
`;
