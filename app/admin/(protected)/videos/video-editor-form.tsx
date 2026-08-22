"use client";

import { useEffect, useState } from "react";
import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { createVideoAction, updateVideoAction } from "@/app/admin/(protected)/actions/video";
import { VIDEO_DESTINATIONS, type VideoRecord } from "@/app/lib/video-repository";

const destinationLabels: Record<string, string> = { home: "Home", articles: "Articles", reflections: "Reflections", journals: "Journals", resources: "Resources" };

function slugify(value: string) { return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/-+/g, "-").slice(0, 120); }

export function VideoEditorForm({ video }: { video?: VideoRecord }) {
  const router = useRouter();
  const [title, setTitle] = useState(video?.title ?? "");
  const [slug, setSlug] = useState(video?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(video));
  const [videoUrl, setVideoUrl] = useState(video?.videoUrl ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(video?.thumbnailUrl ?? "");
  const [uploadStatus, setUploadStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { if (!slugEdited) setSlug(slugify(title)); }, [title, slugEdited]);

  async function uploadFile(file: File, kind: "video" | "thumbnail") {
    setUploadStatus(`Uploading ${kind === "video" ? "video" : "thumbnail"}…`);
    try {
      const blob = await upload(`videos/${kind}/${Date.now()}-${file.name}`, file, { access: "public", handleUploadUrl: "/api/admin/video-upload" });
      if (kind === "video") setVideoUrl(blob.url); else setThumbnailUrl(blob.url);
      setUploadStatus(`${kind === "video" ? "Video" : "Thumbnail"} uploaded.`);
    } catch (uploadError) { setUploadStatus(uploadError instanceof Error ? uploadError.message : "Upload failed."); }
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError("");
    const form = new FormData(event.currentTarget);
    form.set("videoUrl", videoUrl); form.set("thumbnailUrl", thumbnailUrl);
    const result = video ? await updateVideoAction(form) : await createVideoAction(form);
    if (result.ok) { router.push("/admin/videos"); router.refresh(); }
    else { setError(result.error ?? "Video could not be saved."); setSaving(false); }
  }

  return (
    <form className="admin-form video-editor-form" onSubmit={save}>
      {video ? <><input type="hidden" name="id" value={video.id} /><input type="hidden" name="oldSlug" value={video.slug} /></> : null}
      <label htmlFor="video-title">Video title</label>
      <input id="video-title" name="title" value={title} onChange={(event) => setTitle(event.target.value)} required />
      <label htmlFor="video-slug">Slug</label>
      <input id="video-slug" name="slug" value={slug} onChange={(event) => { setSlugEdited(true); setSlug(slugify(event.target.value)); }} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" maxLength={120} />
      <p className="form-note">The slug follows the title automatically until you edit it.</p>
      <label htmlFor="video-description">Short description</label>
      <textarea id="video-description" name="description" rows={5} defaultValue={video?.description ?? ""} />
      <div className="video-editor-grid">
        <div className="video-upload-field">
          <label htmlFor="video-file">Video file</label>
          <input id="video-file" type="file" accept="video/mp4,video/webm,video/quicktime" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadFile(file, "video"); }} />
          {videoUrl ? <video className="video-editor-preview" controls src={videoUrl} /> : <p className="quiet-note">No hosted video selected.</p>}
          <input type="hidden" name="videoUrl" value={videoUrl} readOnly />
        </div>
        <div className="video-upload-field">
          <label htmlFor="video-thumbnail">Thumbnail / cover artwork</label>
          <input id="video-thumbnail" type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadFile(file, "thumbnail"); }} />
          {thumbnailUrl ? <img className="video-thumbnail-preview" src={thumbnailUrl} alt="Video thumbnail" /> : <p className="quiet-note">No thumbnail selected.</p>}
          <input type="hidden" name="thumbnailUrl" value={thumbnailUrl} readOnly />
        </div>
      </div>
      <label htmlFor="video-youtube">YouTube URL</label>
      <input id="video-youtube" name="youtubeUrl" type="url" defaultValue={video?.youtubeUrl ?? ""} placeholder="https://www.youtube.com/watch?v=..." />
      <label htmlFor="video-duration">Duration</label>
      <input id="video-duration" name="duration" type="text" defaultValue={video?.duration ?? ""} placeholder="12:34" />
      <label htmlFor="video-transcript">Transcript</label>
      <textarea id="video-transcript" name="transcript" rows={9} defaultValue={video?.transcript ?? ""} />
      <div className="video-editor-grid">
        <div><label htmlFor="video-status">Status</label><select id="video-status" name="status" defaultValue={video?.status ?? "draft"}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></div>
        <div><label htmlFor="video-published-at">Publication date</label><input id="video-published-at" name="publishedAt" type="datetime-local" defaultValue={video?.publishedAt ? new Date(video.publishedAt).toISOString().slice(0, 16) : ""} /></div>
      </div>
      <fieldset className="video-destinations">
        <legend>Publish to</legend>
        <p className="form-note">Choose every public section where this video should appear. Additional destinations can be added later without changing the video record.</p>
        <div className="video-destination-grid">{VIDEO_DESTINATIONS.map((destination) => <label className="admin-checkbox" key={destination}><input type="checkbox" name="destination" value={destination} defaultChecked={video?.destinations.includes(destination)} />{destinationLabels[destination]}</label>)}</div>
      </fieldset>
      {uploadStatus ? <p className="form-note" role="status">{uploadStatus}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <div className="video-editor-actions"><button className="button button-primary" type="submit" disabled={saving}>{saving ? "Saving…" : video ? "Save changes" : "Save video"}</button><button className="button button-secondary" type="button" onClick={() => router.push("/admin/videos")} disabled={saving}>Cancel</button></div>
    </form>
  );
}