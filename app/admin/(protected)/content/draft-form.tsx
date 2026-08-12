"use client";

import { useActionState } from "react";
import { createDraftAction, initialContentDraftActionState } from "@/app/admin/(protected)/actions/content";

export function DraftForm() {
  const [state, formAction, isPending] = useActionState(createDraftAction, initialContentDraftActionState);

  return (
    <form className="admin-form" action={formAction}>
      <label htmlFor="draft-content-type">Content type</label>
      <select id="draft-content-type" name="contentType" defaultValue="reflection" required>
        <option value="reflection">Reflection</option>
        <option value="journal">Journal</option>
        <option value="book">Book</option>
      </select>

      <label htmlFor="draft-title">Title</label>
      <input id="draft-title" name="title" type="text" required />

      <label htmlFor="draft-slug">Slug</label>
      <input id="draft-slug" name="slug" type="text" placeholder="my-new-draft" required />

      <button className="button button-primary" type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save draft"}
      </button>
      {state.message ? <p className={state.status === "error" ? "form-error" : "form-note"} role="status">{state.message}</p> : null}
    </form>
  );
}