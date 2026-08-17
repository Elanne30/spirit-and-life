"use client";

import { EyeOff, MoreVertical, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { deleteContentAction } from "@/app/admin/(protected)/actions/content";
import { publishContentAction, unpublishContentAction } from "@/app/admin/(protected)/actions/content-publish";
import type { DraftContentType } from "@/app/lib/content-drafts";
import styles from "./content-more-actions.module.css";

export function ContentMoreActions({
  contentType,
  slug,
  title,
  status,
  draftId,
}: {
  contentType: DraftContentType;
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

  function close() {
    setOpen(false);
  }

  function confirmDelete() {
    if (!window.confirm(`Delete “${title}”? This will remove it from the Admin and public website.`)) return;
    close();
    requestForm(`delete-${contentType}-${slug}`);
  }

  function confirmUnpublish() {
    if (!window.confirm(`Unpublish “${title}”? It will disappear from the public website but remain available in the Admin.`)) return;
    close();
    requestForm(`unpublish-${contentType}-${slug}`);
  }

  function confirmPublish() {
    if (!window.confirm(`Publish “${title}”? It will become visible on the public website.`)) return;
    close();
    requestForm(`publish-${contentType}-${slug}`);
  }

  return (
    <div className={styles.root}>
      <button
        className={styles.trigger}
        type="button"
        aria-label={`More options for ${title}`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <MoreVertical size={15} />
      </button>

      {open ? (
        <>
          <button className={styles.backdrop} type="button" aria-label="Close menu" onClick={close} />
          <div className={styles.menu} role="menu">
            {isPublished ? (
              <button className={styles.menuItem} type="button" role="menuitem" onClick={confirmUnpublish}>
                <EyeOff size={14} />
                Unpublish
              </button>
            ) : (
              <button className={styles.menuItem} type="button" role="menuitem" onClick={confirmPublish}>
                <Upload size={14} />
                Publish
              </button>
            )}
            <button className={`${styles.menuItem} ${styles.danger}`} type="button" role="menuitem" onClick={confirmDelete}>
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </>
      ) : null}

      <form id={`publish-${contentType}-${slug}`} action={publishContentAction} hidden>
        <input type="hidden" name="draftId" value={draftId ?? ""} />
        <input type="hidden" name="contentType" value={contentType} />
        <input type="hidden" name="slug" value={slug} />
      </form>
      <form id={`unpublish-${contentType}-${slug}`} action={unpublishContentAction} hidden>
        <input type="hidden" name="draftId" value={draftId ?? ""} />
        <input type="hidden" name="contentType" value={contentType} />
        <input type="hidden" name="slug" value={slug} />
      </form>
      <form id={`delete-${contentType}-${slug}`} action={deleteContentAction} hidden>
        <input type="hidden" name="contentType" value={contentType} />
        <input type="hidden" name="slug" value={slug} />
      </form>
    </div>
  );
}
