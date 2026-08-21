"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { createVideoAction } from "@/app/admin/(protected)/actions/video";

export default function NewVideoPage() {
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  async function uploadFile(file: File, kind: "video" | "thumbnail") {
    setStatus(`Uploading ${kind}…`);
    try {
      const blob = await upload(`videos/${kind}/${Date.now()}-${file.name}`, file, { access: "public", handleUploadUrl: "/api/admin/blob-upload" });
      kind === "video" ? setVideoUrl(blob.url) : setThumbnailUrl(blob.url);
      setStatus(`${kind === "video" ? "Video" : "Thumbnail"} uploaded.`);
    } catch (error) { setStatus(error instanceof Error ? error.message : "Upload failed."); }
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setStatus("Saving video…");
    const data = new FormData(event.currentTarget); data.set("videoUrl", videoUrl); data.set("thumbnailUrl", thumbnailUrl);
    const result = await createVideoAction(data);
    if (result.ok) { router.push("/admin/videos"); router.refresh(); } else { setStatus(result.error); setSaving(false); }
  }

  return <section className="admin-editor-page"><div className="admin-editor-header"><div><button className="admin-outline-link" type="button" onClick={() => router.push("/admin/videos")}>← Back to Videos</button><p className="eyebrow">Create</p><h1>New Video</h1><p>Add a hosted video or connect a YouTube video to the Spirit &amp; Life library.</p></div></div><article className="admin-editor-card"><form onSubmit={save} className="space-y-5"><input name="title" required className="w-full rounded-md border p-3" placeholder="Video title" /><input name="slug" required className="w-full rounded-md border p-3" placeholder="Slug" /><textarea name="description" className="min-h-28 w-full rounded-md border p-3" placeholder="Short description (optional)" /><div className="grid gap-4 sm:grid-cols-2"><div><label className="block text-sm mb-2">Video file (optional)</label><input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "video")} /></div><div><label className="block text-sm mb-2">Thumbnail (optional)</label><input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "thumbnail")} /></div></div><input name="youtubeUrl" type="url" className="w-full rounded-md border p-3" placeholder="YouTube URL (optional)" /><textarea name="transcript" className="min-h-32 w-full rounded-md border p-3" placeholder="Transcript (optional)" /><div className="grid gap-4 sm:grid-cols-2"><select name="status" className="rounded-md border p-3"><option value="draft">Draft</option><option value="published">Published</option></select><input name="publishedAt" type="date" className="rounded-md border p-3" /></div><fieldset><legend className="mb-2 text-sm">Publish to</legend><div className="grid gap-2 sm:grid-cols-2"><label><input type="checkbox" value="home" name="destination" /> Home</label><label><input type="checkbox" value="articles" name="destination" /> Articles</label><label><input type="checkbox" value="reflections" name="destination" /> Reflections</label><label><input type="checkbox" value="journals" name="destination" /> Journals</label><label><input type="checkbox" value="resources" name="destination" /> Resources</label></div></fieldset><input type="hidden" name="destinations" value="" />{status ? <p className="text-sm text-muted-foreground">{status}</p> : null}{videoUrl ? <video className="w-full rounded-md" controls src={videoUrl} /> : null}<button type="submit" disabled={saving} className="rounded-md border px-4 py-2 disabled:opacity-50">{saving ? "Saving…" : "Save video"}</button></form></article></section>;
}
