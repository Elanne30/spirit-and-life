"use client";

import { Trash2 } from "lucide-react";
import { deleteContentAction } from "@/app/admin/(protected)/actions/content";
import type { DraftContentType } from "@/app/lib/content-drafts";

export function ContentDeleteForm({ contentType, slug, title }: { contentType: DraftContentType; slug: string; title: string }) {
  return (
    <form
      action={deleteContentAction}
      onSubmit={(event) => {
        if (!window.confirm(`Remove “${title}” from the content system and public website? This cannot be undone from the admin.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="contentType" value={contentType} />
      <input type="hidden" name="slug" value={slug} />
      <button className="admin-icon-button admin-icon-button-danger" type="submit" aria-label={`Remove ${title}`} title="Remove content">
        <Trash2 size={16} />
      </button>
    </form>
  );
}