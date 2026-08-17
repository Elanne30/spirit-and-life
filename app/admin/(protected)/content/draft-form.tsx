"use client";

import { useActionState, useState } from "react";
import { createDraftActionSafe } from "@/app/admin/(protected)/actions/content-save-guard";
import { ReflectionBodyEditor } from "@/app/admin/(protected)/content/reflection-body-editor";
import type { DraftContentType } from "@/app/lib/content-drafts";

const initialContentDraftActionState = { status: "idle" as const, message: "" };
type DraftFormProps = { initialContentType?: DraftContentType };

function slugifyTitle(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/-+/g, "-").slice(0, 120).replace(/-+$/g, "");
}

function normalizeSlugInput(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120).replace(/-+$/g, "");
}

export function DraftForm({ initialContentType = "reflection" }: DraftFormProps) {
  const [state, formAction, isPending] = useActionState(createDraftActionSafe, initialContentDraftActionState);
  const contentType = initialContentType;
  const [category, setCategory] = useState(contentType === "reflection" ? "Biblical Studies" : contentType === "journal" ? "Personal" : "General");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const isReflection = contentType === "reflection";
  const isJournal = contentType === "journal";
  const isBook = contentType === "book";

  return (
    <form className="admin-form admin-draft-form" action={formAction} style={{ gridTemplateColumns: "minmax(0, 1fr)" }}>
      <input type="hidden" name="contentType" value={contentType} />

      <div className="admin-draft-column" style={{ gridColumn: "1 / -1", width: "100%" }}>
        <h3>{isReflection ? "Reflection Information" : isJournal ? "Journal Information" : "Book Information"}</h3>
        <label htmlFor="draft-title">Title</label>
        <input id="draft-title" name="title" type="text" value={title} onChange={(event) => { const nextTitle = event.target.value; setTitle(nextTitle); if (!slugEdited) setSlug(slugifyTitle(nextTitle)); }} placeholder={isReflection ? "My new reflection" : isJournal ? "My new journal entry" : "Book title"} required />

        <label htmlFor="draft-slug">Slug</label>
        <input id="draft-slug" name="slug" type="text" value={slug} onChange={(event) => { setSlugEdited(true); setSlug(normalizeSlugInput(event.target.value)); }} placeholder={isReflection ? "my-new-reflection" : isJournal ? "my-new-journal-entry" : "book-title"} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" maxLength={120} />
        <p className="form-note">Use lowercase letters, numbers, and single hyphens. The slug is generated from your title until you edit it.</p>

        {isReflection || isJournal ? (
          <>
            <label htmlFor="draft-date">Date</label>
            <input id="draft-date" name="date" type="text" placeholder="August 13, 2026" />
            {isReflection ? (
              <>
                <label htmlFor="draft-reading-time">Reading time</label>
                <input id="draft-reading-time" name="readingTime" type="text" placeholder="6 min read" />
                <label htmlFor="draft-scripture">Scripture</label>
                <input id="draft-scripture" name="scripture" type="text" placeholder="Romans 8:28" />
              </>
            ) : (
              <div><label htmlFor="draft-label">Label</label><input id="draft-label" name="label" type="text" placeholder="Personal Journal" /></div>
            )}
          </>
        ) : (
          <>
            <label htmlFor="draft-subtitle">Subtitle</label>
            <input id="draft-subtitle" name="subtitle" type="text" placeholder="Book subtitle" />
            <label htmlFor="draft-author">Author</label>
            <input id="draft-author" name="author" type="text" placeholder="Author name" />
            <label htmlFor="draft-publisher">Publisher</label>
            <input id="draft-publisher" name="publisher" type="text" placeholder="Publisher" />
            <label htmlFor="draft-expected-publication">Expected publication</label>
            <input id="draft-expected-publication" name="expectedPublication" type="text" placeholder="2026" />
            <label htmlFor="draft-length">Length</label>
            <input id="draft-length" name="length" type="text" placeholder="320 pages" />
            <label htmlFor="draft-description">Description</label>
            <textarea id="draft-description" name="introduction" rows={7} placeholder="Write a description of the book..." />
            <label htmlFor="draft-table-of-contents">Table of contents</label>
            <textarea id="draft-table-of-contents" name="tableOfContents" rows={8} placeholder={"Chapter 1\nChapter 2\nChapter 3"} />
            <label htmlFor="draft-book-cover">Book cover</label>
            <input id="draft-book-cover" name="image" type="text" placeholder="/images/books/book-cover.jpg" />
            <p className="form-note">Upload Book Cover is available from the editor after the draft is created. You can enter an existing cover path here if one is already available.</p>
          </>
        )}

        <label htmlFor="draft-category">Category</label>
        <select id="draft-category" name="category" value={category} onChange={(event) => setCategory(event.target.value)}>
          {isReflection ? (<><option value="Biblical Studies">Biblical Studies</option><option value="Theology">Theology</option><option value="Christian Living">Christian Living</option><option value="Faith & Life">Faith & Life</option><option value="Philosophy">Philosophy</option><option value="Apologetics">Apologetics</option><option value="Church History">Church History</option><option value="SCRIPTURE">SCRIPTURE</option></>) : isJournal ? (<><option value="Personal">Personal</option><option value="Faith & Life">Faith & Life</option><option value="Reflection">Reflection</option></>) : (<><option value="General">General</option><option value="Theology">Theology</option><option value="Christian Living">Christian Living</option><option value="Philosophy">Philosophy</option><option value="Apologetics">Apologetics</option></>)}
        </select>

        <label htmlFor="draft-tags">Tags</label>
        <input id="draft-tags" name="tags" type="text" placeholder="Scripture, Faith, Interpretation" />

        {(isReflection || isJournal) ? (<><label htmlFor="draft-introduction">Introduction</label><textarea id="draft-introduction" name="introduction" rows={6} placeholder={isReflection ? "Write the introduction to your reflection..." : "Write a short introduction to your journal entry..."} /></>) : null}

        <label className="admin-checkbox" htmlFor="draft-featured"><input id="draft-featured" name="featured" type="checkbox" value="yes" />{isReflection ? "Feature this reflection" : "Feature this content"}</label>
      </div>

      <div className="admin-draft-column admin-structure-column" style={{ gridColumn: "1 / -1", width: "100%", maxWidth: "none" }}>
        <h3>Content Structure</h3>
        {isReflection || isJournal ? <ReflectionBodyEditor /> : <p className="quiet-note">Rich body content is available for reflections and journals. Books retain their existing book fields.</p>}
      </div>

      <div className="admin-draft-actions" style={{ gridColumn: "1 / -1", width: "100%" }}>
        <button className="button button-secondary" type="submit" name="saveMode" value="draft" disabled={isPending}>{isPending ? "Saving..." : "Save draft"}</button>
        <button className="button button-primary" type="submit" name="saveMode" value="continue" disabled={isPending}>{isPending ? "Saving..." : "Save & continue editing"}</button>
      </div>

      {state.message ? <p className={state.status === "error" ? "form-error" : "form-note"} role="status" style={{ gridColumn: "1 / -1" }}>{state.message}</p> : null}
    </form>
  );
}
