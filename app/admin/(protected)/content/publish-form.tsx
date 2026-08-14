"use client";

import { useActionState } from "react";
import { publishDraftAction, type ContentDraftActionState } from "@/app/admin/(protected)/actions/content";

const initialState: ContentDraftActionState = { status: "idle", message: "" };

export function PublishForm({ draftId, status }: { draftId: string; status: "draft" | "published" }) {
  const [state, formAction, isPending] = useActionState(publishDraftAction, initialState);

  if (status === "published" && state.status !== "success") {
    return <p className="form-note" role="status">Published — visible on the public website.</p>;
  }

  return (
    <form
      className="admin-publish-form"
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm("Publish this content? It will become visible on the public website.")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="draftId" value={draftId} />
      <button className="button button-primary" type="submit" disabled={isPending}>
        {isPending ? "Publishing..." : "Publish"}
      </button>
      {state.message ? (
        <p className={state.status === "error" ? "form-error" : "form-note"} role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
