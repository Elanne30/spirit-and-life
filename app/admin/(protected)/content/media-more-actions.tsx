"use client";

import { EyeOff, MoreVertical, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { setPodcastEpisodeStatusAction, deletePodcastEpisodeAction } from "@/app/admin/(protected)/actions/podcast-manage";
import { setDownloadableResourceStatusAction, deleteDownloadableResourceAction } from "@/app/admin/(protected)/actions/resource-manage";
import styles from "./content-more-actions.module.css";

export function MediaMoreActions({ kind, slug, title, status }: { kind: "podcast" | "download"; slug: string; title: string; status: "draft" | "published" }) {
  const [open, setOpen] = useState(false);
  const isPublished = status === "published";
  const prefix = `${kind}-${slug}`;
  function submit(id: string) { const form = document.getElementById(id); if (form instanceof HTMLFormElement) form.requestSubmit(); setOpen(false); }
  function confirm(action: "publish" | "unpublish" | "delete") { const label = action === "publish" ? "Publish" : action === "unpublish" ? "Unpublish" : "Delete"; if (!window.confirm(`${label} “${title}”?`)) return; submit(`${prefix}-${action}`); }
  return <div className={styles.root}><button className={styles.trigger} type="button" aria-label={`More options for ${title}`} aria-expanded={open} onClick={() => setOpen((v) => !v)}><MoreVertical size={15} /></button>{open ? <><button className={styles.backdrop} type="button" aria-label="Close menu" onClick={() => setOpen(false)} /><div className={styles.menu} role="menu">{isPublished ? <button className={styles.menuItem} type="button" onClick={() => confirm("unpublish")}><EyeOff size={14} />Unpublish</button> : <button className={styles.menuItem} type="button" onClick={() => confirm("publish")}><Upload size={14} />Publish</button>}<button className={`${styles.menuItem} ${styles.danger}`} type="button" onClick={() => confirm("delete")}><Trash2 size={14} />Delete</button></div></> : null}<form id={`${prefix}-publish`} action={kind === "podcast" ? setPodcastEpisodeStatusAction : setDownloadableResourceStatusAction} hidden><input name="slug" value={slug} readOnly /><input name="status" value="published" readOnly /></form><form id={`${prefix}-unpublish`} action={kind === "podcast" ? setPodcastEpisodeStatusAction : setDownloadableResourceStatusAction} hidden><input name="slug" value={slug} readOnly /><input name="status" value="draft" readOnly /></form><form id={`${prefix}-delete`} action={kind === "podcast" ? deletePodcastEpisodeAction : deleteDownloadableResourceAction} hidden><input name="slug" value={slug} readOnly /></form></div>;
}
