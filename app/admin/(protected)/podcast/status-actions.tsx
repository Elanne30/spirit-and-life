"use client";

import { useState } from "react";
import { setPodcastPublished } from "@/app/admin/(protected)/actions/podcast-status";

export function PodcastStatusActions({ slug, published }: { slug: string; published: boolean }) { const [busy, setBusy] = useState(false); const [message, setMessage] = useState(""); async function change() { setBusy(true); const result = await setPodcastPublished(slug, !published); setMessage(result.ok ? (!published ? "Published" : "Unpublished") : result.error); setBusy(false); if (result.ok) window.location.reload(); } return <div className="mt-8 flex items-center gap-3"><button type="button" className="admin-outline-link" disabled={busy} onClick={change}>{busy ? "Saving…" : published ? "Unpublish" : "Publish"}</button>{message ? <span className="quiet-note">{message}</span> : null}</div>; }
