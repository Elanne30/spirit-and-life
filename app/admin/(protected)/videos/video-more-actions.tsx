"use client";

import { EyeOff, MoreVertical, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { deleteVideoAction } from "@/app/admin/(protected)/actions/video";
import { publishVideoAction, unpublishVideoAction } from "@/app/admin/(protected)/actions/video-status";
import styles from "./video-more-actions.module.css";

export function VideoMoreActions({
  slug,
  title,
  status,
  id,
}: {
  slug: string;
  title: string;
  status: "draft" | "published" | "archived";
  id: string;
}) {
  const [open, setOpen] = useState(false);
  const isPublished = status === "published";

  function requestForm(idValue: string) {
    const element = document.getElementById(idValue);
    if (element instanceof HTMLFormElement) element.requestSubmit();
  }

  function close() {
    setOpen(false);
  }

  function confirmDelete() {
    if (!window.confirm(`Delete “${title}”? This will remove it from the Admin and public website.`)) return;
    close();
    requestForm(`delete-video-${id}`);
  }

  function confirmUnpublish() {
    if (!window.confirm(`Unpublish “${title}”? It will disappear from the public website but remain available in the Admin.`)) return;
    close();
    requestForm(`unpublish-video-${id}`);
  }

  function confirmPublish() {
    if (!window.confirm(`Publish “${title}”? It will become visible on the public website.`)) return;
    close();
    requestForm(`publish-video-${id}`);
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

      <form id={`publish-video-${id}`} action={publishVideoAction} hidden>
        <input type="hidden" name="slug" value={slug} />
      </form>
      <form id={`unpublish-video-${id}`} action={unpublishVideoAction} hidden>
        <input type="hidden" name="slug" value={slug} />
      </form>
      <form id={`delete-video-${id}`} action={deleteVideoAction} hidden>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="slug" value={slug} />
      </form>
    </div>
  );
}
