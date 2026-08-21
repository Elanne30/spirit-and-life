"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadAdminMedia } from "@/app/admin/(protected)/actions/media-upload";
import { createPodcastEpisodeAction } from "@/app/admin/(protected)/actions/podcast";

export default function NewPodcastEpisodePage() {
  const router = useRouter();
  const [audioUrl, setAudioUrl] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file) return;
    setStatus("Uploading audio…");
    const result = await uploadAdminMedia(file, "audio");
    if (result.ok) { setAudioUrl(result.url); setStatus("Audio uploaded"); } else setStatus(result.error);
  }
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setStatus("Saving episode…");
    const data = new FormData(event.currentTarget); data.set("audioUrl", audioUrl);
    const result = await createPodcastEpisodeAction(data);
    if (result.ok) { setStatus("Episode saved"); router.push("/admin/podcast"); router.refresh(); } else { setStatus(result.error); setSaving(false); }
  }
  return <main className="p-6 max-w-3xl"><p className="text-sm text-muted-foreground">Admin · Podcast</p><h1 className="mt-2 text-3xl font-semibold">New episode</h1><form onSubmit={save} className="mt-8 space-y-5"><input name="title" required className="w-full rounded-md border p-3" placeholder="Episode title" /><input name="slug" className="w-full rounded-md border p-3" placeholder="Slug (optional)" /><textarea name="description" className="min-h-32 w-full rounded-md border p-3" placeholder="Description / show notes" /><div className="grid gap-4 sm:grid-cols-2"><input name="publishedAt" required type="date" className="rounded-md border p-3" /><input name="duration" className="rounded-md border p-3" placeholder="Duration, e.g. 42:18" /></div><input name="transcript" className="w-full rounded-md border p-3" placeholder="Transcript (optional)" /><input type="file" accept="audio/mpeg,audio/mp4,audio/wav,audio/x-m4a" onChange={upload} />{status ? <p className="text-sm text-muted-foreground">{status}</p> : null}{audioUrl ? <audio className="w-full" controls src={audioUrl} /> : null}<button type="submit" disabled={saving || !audioUrl} className="rounded-md border px-4 py-2 disabled:opacity-50">{saving ? "Saving…" : "Save episode"}</button></form></main>;
}
