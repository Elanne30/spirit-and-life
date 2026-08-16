"use client";

import { useActionState } from "react";
import type { ContentDraft } from "@/app/lib/content-drafts";
import {
  createDraftActionSafe,
  updateDraftActionSafe,
} from "@/app/admin/(protected)/actions/content-save-guard";
import type { ContentDraftActionState } from "@/app/admin/(protected)/actions/content";
import {
  ReflectionBodyEditor,
  type ReflectionSection,
} from "@/app/admin/(protected)/content/reflection-body-editor";

const initialActionState: ContentDraftActionState = {
  status: "idle",
  message: "",
};

function getBodyValue<T>(body: Record<string, unknown>, key: string): T | undefined {
  return body[key] as T | undefined;
}

function getInitialSections(draft: ContentDraft): ReflectionSection[] {
  const value = getBodyValue<unknown[]>(draft.body, "sections");

  if (!Array.isArray(value) || !value.length) {
    return [{ heading: "", paragraphs: [""] }];
  }

  return value
    .filter(
      (section): section is { heading?: unknown; paragraphs?: unknown } =>
        typeof section === "object" && section !== null,
    )
    .map((section) => ({
      heading: typeof section.heading === "string" ? section.heading : "",
      paragraphs: Array.isArray(section.paragraphs)
        ? section.paragraphs.filter(
            (paragraph): paragraph is string => typeof paragraph === "string",
          )
        : [],
    }))
    .map((section) => ({
      ...section,
      paragraphs: section.paragraphs.length ? section.paragraphs : [""],
    }));
}

export function DraftEditForm({ draft }: { draft: ContentDraft }) {
  const [state, formAction, isPending] = useActionState(
    updateDraftActionSafe,
    initialActionState,
  );

  const date = getBodyValue<string>(draft.body, "date") ?? "";
  const readingTime = getBodyValue<string>(draft.body, "readingTime") ?? "";
  const scripture = getBodyValue<string>(draft.body, "scripture") ?? "";
  const featured = getBodyValue<boolean>(draft.body, "featured") ?? false;

  return (
    <form className="admin-form" action={formAction}>
      <input type="hidden" name="draftId" value={draft.id} />

      <label htmlFor="edit-content-type">Content type</label>
      <select
        id="edit-content-type"
        name="contentType"
        defaultValue={draft.content_type}
        required
      >
        <option value="reflection">Reflection</option>
        <option value="journal">Journal</option>
        <option value="book">Book</option>
      </select>

      <label htmlFor="edit-title">Title</label>
      <input
        id="edit-title"
        name="title"
        type="text"
        defaultValue={draft.title}
        required
      />

      <label htmlFor="edit-slug">Slug</label>
      <input
        id="edit-slug"
        name="slug"
        type="text"
        defaultValue={draft.slug}
        required
      />

      <label htmlFor="edit-date">Date</label>
      <input
        id="edit-date"
        name="date"
        type="text"
        defaultValue={date}
      />

      <label htmlFor="edit-reading-time">Reading time</label>
      <input
        id="edit-reading-time"
        name="readingTime"
        type="text"
        defaultValue={readingTime}
      />

      <label htmlFor="edit-category">Category</label>
      <select
        id="edit-category"
        name="category"
        defaultValue={draft.category ?? "Biblical Studies"}
      >
        <option value="Biblical Studies">Biblical Studies</option>
        <option value="Theology">Theology</option>
        <option value="Christian Living">Christian Living</option>
        <option value="Faith & Life">Faith & Life</option>
        <option value="Philosophy">Philosophy</option>
        <option value="Apologetics">Apologetics</option>
        <option value="Church History">Church History</option>
        <option value="SCRIPTURE">SCRIPTURE</option>
      </select>

      <label htmlFor="edit-tags">Tags</label>
      <input
        id="edit-tags"
        name="tags"
        type="text"
        defaultValue={draft.tags.join(", ")}
      />

      <label htmlFor="edit-scripture">Scripture</label>
      <input
        id="edit-scripture"
        name="scripture"
        type="text"
        defaultValue={scripture}
      />

      <label htmlFor="edit-introduction">Introduction</label>
      <textarea
        id="edit-introduction"
        name="introduction"
        rows={6}
        defaultValue={draft.introduction ?? ""}
      />

      <label className="admin-checkbox" htmlFor="edit-featured">
        <input
          id="edit-featured"
          name="featured"
          type="checkbox"
          value="yes"
          defaultChecked={featured}
        />
        Feature this reflection
      </label>

      {draft.content_type === "reflection" || draft.content_type === "journal" ? (
        <ReflectionBodyEditor initialSections={getInitialSections(draft)} initialRichText={getBodyValue(draft.body, "richText")} />
      ) : null}

      <button
        className="button button-primary"
        type="submit"
        disabled={isPending}
      >
        {isPending ? "Saving..." : "Save changes"}
      </button>

      {state.message ? (
        <p
          className={state.status === "error" ? "form-error" : "form-note"}
          role="status"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
