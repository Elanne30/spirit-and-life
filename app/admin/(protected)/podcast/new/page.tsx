"use client";

import { useState } from "react";
import { uploadAdminMedia } from "@/app/admin/(protected)/actions/media-upload";

export default function NewPodcastEpisodePage() {
  const [audioUrl, setAudioUrl] = useState("");
  const [status, setStatus] = useState("");
  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file) return;
    setStatus("Uploading audio…");
    const result = await uploadAdminMedia(file, "audio");
    if (result.ok) { setAudioUrl(result.url); setStatus("Audio uploaded"); } else setStatus(result.error);
  }
  return <main className="p-6 max-w-3xl"><p className="text-sm text-muted-foreground">Admin · Podcast</p><h1 className="mt-2 text-3xl font-semibold">New episode</h1><div className="mt-8 space-y-5"><input className="w-full rounded-md border p-3" placeholder="Episode title" /><textarea className="min-h-32 w-full rounded-md border p-3" placeholder="Description / show notes" /><input type="date" className="rounded-md border p-3" /><input type="file" accept="audio/*" onChange={upload} />{status ? <p className="text-sm text-muted-foreground">{status}</p> : null}{audioUrl ? <audio className="w-full" controls src={audioUrl} /> : null}<button disabled={!audioUrl} className="rounded-md border px-4 py-2 disabled:opacity-50">Save episode</button></div></main>;
}
