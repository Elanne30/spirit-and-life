"use client";

import { useState } from "react";
import { uploadAdminMedia } from "@/app/admin/(protected)/actions/media-upload";
import { createDownloadableResource } from "@/app/admin/(protected)/actions/resources";

export default function NewResourcePage() {
  const [fileUrl, setFileUrl] = useState(""); const [fileName, setFileName] = useState(""); const [status, setStatus] = useState("");
  async function upload(event: React.ChangeEvent<HTMLInputElement>) { const file = event.target.files?.[0]; if (!file) return; setStatus("Uploading file…"); const result = await uploadAdminMedia(file, "document"); if (result.ok) { setFileUrl(result.url); setFileName(file.name); setStatus("File uploaded"); } else setStatus(result.error); }
  async function save(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); setStatus("Saving…"); const result = await createDownloadableResource({ title: String(form.get("title") || ""), description: String(form.get("description") || ""), kind: String(form.get("kind") || "PDF") as "PDF" | "Audio" | "Document", fileUrl, fileName, publishedAt: String(form.get("publishedAt") || "") }); setStatus(result.ok ? "Resource saved" : result.error); }
  return <main className="p-6 max-w-3xl"><p className="text-sm text-muted-foreground">Admin · Downloads</p><h1 className="mt-2 text-3xl font-semibold">New resource</h1><form onSubmit={save} className="mt-8 space-y-5"><input name="title" required className="w-full rounded-md border p-3" placeholder="Resource title" /><textarea name="description" className="min-h-32 w-full rounded-md border p-3" placeholder="Description" /><select name="kind" className="rounded-md border p-3" defaultValue="PDF"><option>PDF</option><option>Document</option><option>Audio</option></select><input name="publishedAt" type="date" className="rounded-md border p-3" /><input type="file" accept=".pdf,.doc,.docx" onChange={upload} />{status ? <p className="text-sm text-muted-foreground">{status}</p> : null}{fileUrl ? <p className="text-sm">Ready: {fileName}</p> : null}<button disabled={!fileUrl} className="rounded-md border px-4 py-2 disabled:opacity-50">Save resource</button></form></main>;
}
