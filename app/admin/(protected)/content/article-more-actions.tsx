"use client";

import { EyeOff, MoreVertical, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { deleteArticleAction, publishArticleAction, unpublishArticleAction } from "@/app/admin/(protected)/actions/article-content";
import styles from "./content-more-actions.module.css";

export function ArticleMoreActions({
  slug,
  title,
  status,
  draftId,
}: {
  slug: string;
  title: string;
  status: "static" | "draft" | "published";
  draftId?: string;
}) {
  const [open, setOpen] = useState(false);
  const isPublished = status === "published" || status === "static";

  function requestForm(id: string) {
    const element = document.getElementById(id);
    if (element instanceof HTMLFormElement) element.requestSubmit();
  }

  function close() { setOpen(false); }

  function confirmUnpublish() {
    if (!window.confirm(`Unpublish “${title}”? It will disappear from the public website but remain available in the Admin.`)) return;
    close();
    requestForm(`unpublish-article-${slug}`);
  }

  function confirmPublish() {
    if (!window.confirm(`Publish “${title}”? It will become visible on the public website.`)) return;
    close();
    requestForm(`publish-article-${slug}`);
  }

  function confirmDelete() {
    if (!window.confirm(`Delete “${title}”? This will remove it from the Admin and public website.`)) return;
    close();
    requestForm(`delete-article-${slug}`);
  }

  return (
    <div className={styles.root}>
      <button className={styles.trigger} type="button" aria-label={`More options for ${title}`} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <MoreVertical size={15} />
      </button>
      {open ? (
        <>
          <button className={styles.backdrop} type="button" aria-label="Close menu" onClick={close} />
          <div className={styles.menu} role="menu">
            {isPublished ? (
              <button className={styles.menuItem} type="button" role="menuitem" onClick={confirmUnpublish}><EyeOff size={14} />Unpublish</button>
            ) : (
              <button className={styles.menuItem} type="button" role="menuitem" onClick={confirmPublish}><Upload size={14} />Publish</button>
            )}
            <button className={`${styles.menuItem} ${styles.danger}`} type="button" role="menuitem" onClick={confirmDelete}><Trash2 size={14} />Delete</button>
          </div>
        </>
      ) : null}
      <form id={`publish-article-${slug}`} action={publishArticleAction} hidden><input type="hidden" name="draftId" value={draftId ?? ""} /></form>
      <form id={`unpublish-article-${slug}`} action={unpublishArticleAction} hidden><input type="hidden" name="draftId" value={draftId ?? ""} /></form>
      <form id={`delete-article-${slug}`} action={deleteArticleAction} hidden><input type="hidden" name="slug" value={slug} /></form>
    </div>
  );
}
