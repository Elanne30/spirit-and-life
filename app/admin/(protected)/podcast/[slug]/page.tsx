"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { savePodcastEpisodeAction } from "@/app/admin/(protected)/actions/podcast-manage";

export default function AdminPodcastEpisodePage({ params }: { params: Promise<{ slug: string }> }) {
  const [episode, setEpisode] = useState<any>(null);
  const [coverImage, setCoverImage] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    params.then(async ({ slug }) => {
      try {
        const r = await fetch(`/api/admin/podcast/${encodeURIComponent(slug)}`, { cache: "no-store" });
        if (!r.ok) {
          if (!cancelled) setStatus(r.status === 404 ? "Podcast episode not found." : "Unable to load podcast episode.");
          return;
        }
        const e = await r.json();
        if (!cancelled) {
          setEpisode(e);
          setCoverImage(e.coverImage ?? "");
          setAudioUrl(e.audioUrl ?? "");
        }
      } catch (error) {
        if (!cancelled) setStatus(error instanceof Error ? error.message : "Unable to load episode.");
      }
    });
    return () => { cancelled = true; };
  }, [params]);

  async function uploadFile(file: File, kind: "audio" | "cover") {
    setStatus(`Uploading ${kind === "audio" ? "audio" : "cover image"}…`);
    try {
      const blob = await upload(`podcast/${kind}/${Date.now()}-${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/blob-upload",
      });
      if (kind === "audio") setAudioUrl(blob.url);
      else setCoverImage(blob.url);
      setStatus(`${kind === "audio" ? "Audio" : "Cover image"} uploaded.`);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Upload failed.");
    }
  }

  if (!episode) return <section className="admin-editor-page"><p>{status || "Loading…"}</p></section>;

  return <section className="admin-editor-page"><div className="admin-editor-header"><div><Link className="admin-outline-link" href="/admin/podcast">← Back to Podcast</Link><p className="eyebrow">Edit</p><h1>{episode.title}</h1><p>Update the episode, show notes, audio details, transcript, or connected Spirit &amp; Life material.</p></div></div><article className="admin-editor-card"><form action={async (formData) => { formData.set("coverImage", coverImage); formData.set("audioUrl", audioUrl); const result = await savePodcastEpisodeAction(formData); if (result?.ok === false) { setStatus(result.error); return; } router.push("/admin/podcast"); router.refresh(); }} className="space-y-5"><input type="hidden" name="slug" value={episode.slug}/><input name="title" required defaultValue={episode.title} className="w-full rounded-md border p-3"/><textarea name="description" className="min-h-32 w-full rounded-md border p-3" defaultValue={episode.description}/><div className="grid gap-4 sm:grid-cols-2"><input name="publishedAt" required type="date" defaultValue={episode.publishedAt} className="rounded-md border p-3"/><input name="duration" defaultValue={episode.duration ?? ""} className="rounded-md border p-3"/></div><label className="block text-sm font-medium">Cover image / artwork<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="mt-2 w-full rounded-md border p-3" onChange={e => { const f = e.target.files?.[0]; if (f) void uploadFile(f, "cover"); }}/>{coverImage ? <img className="mt-3 w-full max-w-md rounded-xl" src={coverImage} alt="Podcast cover preview"/> : <span className="mt-2 block text-sm text-muted-foreground">No cover image selected.</span>}</label><label className="block text-sm font-medium">Audio MP3 / audio file<input type="file" accept="audio/mpeg,audio/mp4,audio/wav,audio/x-m4a,audio/aac,audio/ogg" className="mt-2 w-full rounded-md border p-3" onChange={e => { const f = e.target.files?.[0]; if (f) void uploadFile(f, "audio"); }}/></label><input type="hidden" name="coverImage" value={coverImage}/><label className="block text-sm font-medium">YouTube URL<input type="url" name="youtubeUrl" defaultValue={episode.youtubeUrl ?? ""} className="mt-2 w-full rounded-md border p-3"/></label><input name="topicSlugs" defaultValue={episode.topicSlugs.join(", ")} className="w-full rounded-md border p-3" placeholder="Topic slugs, comma-separated"/><input name="seriesSlug" defaultValue={episode.seriesSlug ?? ""} className="w-full rounded-md border p-3" placeholder="Series slug (optional)"/><input name="questionSlugs" defaultValue={episode.questionSlugs.join(", ")} className="w-full rounded-md border p-3"/><input name="articleSlugs" defaultValue={episode.articleSlugs.join(", ")} className="w-full rounded-md border p-3"/><input name="resourceSlugs" defaultValue={episode.resourceSlugs.join(", ")} className="w-full rounded-md border p-3"/><textarea name="transcript" className="min-h-40 w-full rounded-md border p-3" defaultValue={episode.transcript ?? ""}/><div className="rounded-xl border p-4"><p className="text-sm font-medium">Audio file</p>{audioUrl ? <audio className="mt-3 w-full" controls src={audioUrl}/> : <p>No audio file attached.</p>}<p className="mt-2 text-sm text-muted-foreground">Choose a new audio file above to replace the current audio.</p><input type="hidden" name="audioUrl" value={audioUrl}/></div>{status ? <p className="text-sm text-muted-foreground">{status}</p> : null}<button type="submit" className="rounded-md border px-4 py-2">Save changes</button></form></article></section>;
}
