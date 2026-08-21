"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { createPodcastEpisodeAction } from "@/app/admin/(protected)/actions/podcast";

export default function NewPodcastEpisodePage() {
  const router = useRouter();
  const [audioUrl, setAudioUrl] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  async function uploadAudio(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setStatus("Uploading audio…");
    try {
      const blob = await upload(`podcast/${Date.now()}-${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/blob-upload",
      });
      setAudioUrl(blob.url);
      setStatus("Audio uploaded");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Audio upload failed.");
    }
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus("Saving episode…");
    const data = new FormData(event.currentTarget);
    data.set("audioUrl", audioUrl);
    const result = await createPodcastEpisodeAction(data);
    if (result.ok) {
      setStatus("Episode saved");
      router.push("/admin/podcast");
      router.refresh();
    } else {
      setStatus(result.error);
      setSaving(false);
    }
  }

  return (
    <section className="admin-editor-page">
      <div className="admin-editor-header"><div><button type="button" className="admin-outline-link" onClick={() => router.push("/admin/content")}>← Back to Content</button><p className="eyebrow">Create</p><h1>New Podcast Episode</h1><p>Add an audio episode to the Spirit &amp; Life library.</p></div></div>
      <article className="admin-editor-card"><form onSubmit={save} className="space-y-5"><input name="title" required className="w-full rounded-md border p-3" placeholder="Episode title" /><input name="slug" className="w-full rounded-md border p-3" placeholder="Slug (optional)" /><textarea name="description" className="min-h-32 w-full rounded-md border p-3" placeholder="Description / show notes" /><div className="grid gap-4 sm:grid-cols-2"><input name="publishedAt" required type="date" className="rounded-md border p-3" /><input name="duration" className="rounded-md border p-3" placeholder="Duration, e.g. 42:18" /></div><textarea name="transcript" className="min-h-32 w-full rounded-md border p-3" placeholder="Transcript (optional)" /><input type="file" accept="audio/mpeg,audio/mp4,audio/wav,audio/x-m4a,audio/aac,audio/ogg" onChange={uploadAudio} />{status ? <p className="text-sm text-muted-foreground">{status}</p> : null}{audioUrl ? <audio className="w-full" controls src={audioUrl} /> : null}<button type="submit" disabled={saving || !audioUrl} className="rounded-md border px-4 py-2 disabled:opacity-50">{saving ? "Saving…" : "Save episode"}</button></form></article>
    </section>
  );
}
