"use client";
import { useState } from "react";
import { setResourcePublished } from "@/app/admin/(protected)/actions/resources";
export function ResourceStatusActions({ slug, published }: { slug: string; published: boolean }) { const [busy, setBusy] = useState(false); async function change() { setBusy(true); const result = await setResourcePublished(slug, !published); if (result.ok) window.location.reload(); else setBusy(false); } return <div className="mt-8"><button type="button" className="admin-outline-link" disabled={busy} onClick={change}>{busy ? "Saving…" : published ? "Unpublish" : "Publish"}</button></div>; }
