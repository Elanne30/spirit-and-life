"use client";

import { useActionState } from "react";
import { publishManagedDraftAction } from "@/app/admin/(protected)/actions/content-managed-publish";
import type { ContentDraftActionState } from "@/app/admin/(protected)/actions/content";
import { unpublishManagedDraftAction } from "@/app/admin/(protected)/actions/content-managed-unpublish";

const initialState: ContentDraftActionState = { status: "idle", message: "" };

export function PublishForm({
  draftId,
  status,
  hasUnpublishedChanges,
}: {
  draftId: string;
  status: "draft" | "published";
  hasUnpublishedChanges: boolean;
}) {
  const [state, formAction, isPending] = useActionState(publishManagedDraftAction, initialState);
  const hasPendingPublish = status === "published" && hasUnpublishedChanges;
  const label = hasPendingPublish ? "Publish Changes" : "Publish";
  const confirmMessage = hasPendingPublish
    ? "Publish these changes? The updated version will become visible on the public website."
    : "Publish this content? It will become visible on the public website.";

  if (status === "published" && !hasUnpublishedChanges) {
    return (
      <form
        className="admin-publish-form"
        action={unpublishManagedDraftAction}
        onSubmit={(event) => {
          if (!window.confirm("Unpublish this content? It will disappear from the public website but remain available in the Admin.")) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="draftId" value={draftId} />
        <button className="button button-secondary" type="submit">
          Unpublish
        </button>
      </form>
    );
  }

  return (
    <form
      className="admin-publish-form"
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="draftId" value={draftId} />
      <button className="button button-primary" type="submit" disabled={isPending}>
        {isPending ? "Publishing..." : label}
      </button>
      {state.message ? (
        <p className={state.status === "error" ? "form-error" : "form-note"} role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
