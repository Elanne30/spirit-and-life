"use client";
/* eslint-disable @next/next/no-img-element */

import { useActionState, useState } from "react";
import type { ContentDraft } from "@/app/lib/content-drafts";
import { updateDraftAction, uploadContentImageAction, type ContentDraftActionState } from "@/app/admin/(protected)/actions/content";
import { ReflectionBodyEditor, type ReflectionSection } from "@/app/admin/(protected)/content/reflection-body-editor";

const initialState: ContentDraftActionState = { status: "idle", message: "" };

const reflectionCategories = ["Biblical Studies", "Theology", "Christian Living", "Faith & Life", "Philosophy", "Apologetics", "Church History", "SCRIPTURE"];
const contentCategoryOptions = ["Biblical Studies", "Theology", "Christian Living", "Faith & Life", "Philosophy", "Apologetics", "Church History"];

function getBodyValue<T>(body: Record<string, unknown>, key: string): T | undefined {
  return body[key] as T | undefined;
}

function getInitialSections(draft: ContentDraft): ReflectionSection[] {
  const value = getBodyValue<unknown[]>(draft.body, "sections");

  if (!Array.isArray(value) || !value.length) {
    return [{ heading: "", paragraphs: [""] }];
  }

  return value
    .filter((section): section is { heading?: unknown; paragraphs?: unknown } => typeof section === "object" && section !== null)
    .map((section) => ({
      heading: typeof section.heading === "string" ? section.heading : "",
      paragraphs: Array.isArray(section.paragraphs) ? section.paragraphs.filter((paragraph): paragraph is string => typeof paragraph === "string") : [],
    }))
    .map((section) => ({ ...section, paragraphs: section.paragraphs.length ? section.paragraphs : [""] }));
}

export function ContentEditForm({ draft }: { draft: ContentDraft }) {
  const [state, formAction, isPending] = useActionState(updateDraftAction, initialState);
  const [uploadState, uploadAction, isUploading] = useActionState(uploadContentImageAction, initialState);
  const [preview, setPreview] = useState(draft.image_reference ?? "");

  const date = getBodyValue<string>(draft.body, "date") ?? "";
  const readingTime = getBodyValue<string>(draft.body, "readingTime") ?? "";
  const scripture = getBodyValue<string>(draft.body, "scripture") ?? "";
  const label = getBodyValue<string>(draft.body, "label") ?? "";
  const subtitle = getBodyValue<string>(draft.body, "subtitle") ?? "";
  const expectedPublication = getBodyValue<string>(draft.body, "expectedPublication") ?? "";
  const author = getBodyValue<string>(draft.body, "author") ?? "";
  const publisher = getBodyValue<string>(draft.body, "publisher") ?? "";
  const length = getBodyValue<string>(draft.body, "length") ?? "";
  const tableOfContents = getBodyValue<string[]>(draft.body, "tableOfContents") ?? [];
  const featured = getBodyValue<boolean>(draft.body, "featured") ?? false;
  const categoryOptions = draft.content_type === "reflection" ? reflectionCategories : contentCategoryOptions;

  return (
    <>
      <div className="admin-image-control">
        <p className="admin-form-label">Current image</p>
        {preview ? <img className="admin-image-preview" src={preview} alt="Current content image" /> : <p className="quiet-note">No image selected.</p>}
        <form action={uploadAction} className="admin-image-upload-form">
          <input type="hidden" name="draftId" value={draft.id} />
          <label className="button button-secondary" htmlFor="edit-image-upload">{preview ? "Change image" : "Upload image"}</label>
          <input id="edit-image-upload" name="image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => { const file = event.target.files?.[0]; if (file) setPreview(URL.createObjectURL(file)); }} />
          <button className="button button-primary" type="submit" disabled={isUploading}>{isUploading ? "Uploading..." : "Upload and save image"}</button>
          {uploadState.message ? <p className={uploadState.status === "error" ? "form-error" : "form-note"} role="status">{uploadState.message}</p> : null}
        </form>
      </div>
      <form className="admin-form" action={formAction}>
      <input type="hidden" name="draftId" value={draft.id} />
      <input type="hidden" name="contentType" value={draft.content_type} />

      <label htmlFor="edit-title">Title</label>
      <input id="edit-title" name="title" type="text" defaultValue={draft.title} required />

      <label htmlFor="edit-slug">Slug</label>
      <input id="edit-slug" name="slug" type="text" defaultValue={draft.slug} required />

      <label htmlFor="edit-category">Category</label>
      <select id="edit-category" name="category" defaultValue={draft.category ?? categoryOptions[0]}>
        {categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}
      </select>

      <label htmlFor="edit-image">Image path</label>
      <input id="edit-image" name="imageReference" type="text" defaultValue={draft.image_reference ?? ""} placeholder="/images/reflections/example.jpg" />

      <label htmlFor="edit-tags">Tags</label>
      <input id="edit-tags" name="tags" type="text" defaultValue={draft.tags.join(", ")} placeholder="Scripture, Faith, Interpretation" />

      <label htmlFor="edit-introduction">{draft.content_type === "book" ? "Description" : "Introduction"}</label>
      <textarea id="edit-introduction" name="introduction" rows={6} defaultValue={draft.introduction ?? ""} />

      {draft.content_type === "reflection" ? (
        <>
          <label htmlFor="edit-date">Date</label>
          <input id="edit-date" name="date" type="text" defaultValue={date} placeholder="August 13, 2026" />

          <label htmlFor="edit-reading-time">Reading time</label>
          <input id="edit-reading-time" name="readingTime" type="text" defaultValue={readingTime} placeholder="6 min read" />

          <label htmlFor="edit-scripture">Scripture</label>
          <input id="edit-scripture" name="scripture" type="text" defaultValue={scripture} placeholder="Romans 8:28" />

          <ReflectionBodyEditor initialSections={getInitialSections(draft)} initialRichText={getBodyValue(draft.body, "richText")} />
        </>
      ) : null}

      {draft.content_type === "journal" ? (
        <>
          <label htmlFor="edit-date">Date</label>
          <input id="edit-date" name="date" type="text" defaultValue={date} placeholder="August 13, 2026" />

          <label htmlFor="edit-label">Label</label>
          <input id="edit-label" name="label" type="text" defaultValue={label || "JOURNAL ENTRY"} />

          <ReflectionBodyEditor initialSections={getInitialSections(draft)} initialRichText={getBodyValue(draft.body, "richText")} />
        </>
      ) : null}

      {draft.content_type === "book" ? (
        <>
          <label htmlFor="edit-subtitle">Subtitle</label>
          <input id="edit-subtitle" name="subtitle" type="text" defaultValue={subtitle} />

          <label htmlFor="edit-expected-publication">Expected publication</label>
          <input id="edit-expected-publication" name="expectedPublication" type="text" defaultValue={expectedPublication} />

          <label htmlFor="edit-author">Author</label>
          <input id="edit-author" name="author" type="text" defaultValue={author} />

          <label htmlFor="edit-publisher">Publisher/site label</label>
          <input id="edit-publisher" name="publisher" type="text" defaultValue={publisher} />

          <label htmlFor="edit-length">Length</label>
          <input id="edit-length" name="length" type="text" defaultValue={length} placeholder="180 pages" />

          <label htmlFor="edit-toc">Table of contents (one entry per line)</label>
          <textarea id="edit-toc" name="tableOfContents" rows={6} defaultValue={tableOfContents.join("\n")} />
        </>
      ) : null}

      <label className="admin-checkbox" htmlFor="edit-featured">
        <input id="edit-featured" name="featured" type="checkbox" value="yes" defaultChecked={featured} />
        Feature this content
      </label>

      <button className="button button-primary" type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save changes"}
      </button>

      {state.message ? (
        <p className={state.status === "error" ? "form-error" : "form-note"} role="status">
          {state.message}
        </p>
      ) : null}
    </form>
    </>
  );
}
