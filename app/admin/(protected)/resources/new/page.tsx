"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { createDownloadableResource } from "@/app/admin/(protected)/actions/resources";

export default function NewResourcePage() {
  const router = useRouter();
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  async function uploadDocument(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setStatus("Uploading file…");
    try {
      const blob = await upload(`downloads/${Date.now()}-${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/blob-upload",
      });
      setFileUrl(blob.url);
      setFileName(file.name);
      setStatus("File uploaded");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "File upload failed.");
    }
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const form = new FormData(event.currentTarget);
    setStatus("Saving…");
    const result = await createDownloadableResource({ title: String(form.get("title") || ""), description: String(form.get("description") || ""), kind: String(form.get("kind") || "PDF") as "PDF" | "Audio" | "Document", fileUrl, fileName, publishedAt: String(form.get("publishedAt") || "") });
    if (result.ok) { setStatus("Resource saved"); router.push("/admin/content"); router.refresh(); } else { setStatus(result.error); setSaving(false); }
  }

  return (
    <section className="admin-editor-page">
      <div className="admin-editor-header"><div><button type="button" className="admin-outline-link" onClick={() => router.push("/admin/content")}>← Back to Content</button><p className="eyebrow">Create</p><h1>New Download</h1><p>Add a downloadable document to the Spirit &amp; Life library.</p></div></div>
      <article className="admin-editor-card"><form onSubmit={save} className="space-y-5"><input name="title" required className="w-full rounded-md border p-3" placeholder="Resource title" /><textarea name="description" className="min-h-32 w-full rounded-md border p-3" placeholder="Description" /><select name="kind" className="rounded-md border p-3" defaultValue="PDF"><option>PDF</option><option>Document</option><option>Audio</option></select><input name="publishedAt" type="date" className="rounded-md border p-3" /><input type="file" accept=".pdf,.doc,.docx,.txt,.rtf" onChange={uploadDocument} />{status ? <p className="text-sm text-muted-foreground">{status}</p> : null}{fileUrl ? <p className="text-sm">Ready: {fileName}</p> : null}<button type="submit" disabled={saving || !fileUrl} className="rounded-md border px-4 py-2 disabled:opacity-50">{saving ? "Saving…" : "Save resource"}</button></form></article>
    </section>
  );
}
