"use client";

import { useActionState, useState } from "react";
import { createDraftAction } from "@/app/admin/(protected)/actions/content";
import { ReflectionBodyEditor } from "@/app/admin/(protected)/content/reflection-body-editor";
import type { DraftContentType } from "@/app/lib/content-drafts";

const initialContentDraftActionState = {
  status: "idle" as const,
  message: "",
};

type DraftFormProps = {
  initialContentType?: DraftContentType;
};

const reflectionCategories = ["Biblical Studies", "Theology", "Christian Living", "Faith & Life", "Philosophy", "Apologetics", "Church History", "SCRIPTURE"];
const journalCategories = ["Personal", "Faith & Life", "Reflection"];
const bookCategories = ["General", "Theology", "Christian Living", "Philosophy", "Apologetics"];

export function DraftForm({ initialContentType = "reflection" }: DraftFormProps) {
  const [state, formAction, isPending] = useActionState(
    createDraftAction,
    initialContentDraftActionState,
  );

  const contentType = initialContentType;
  const [category, setCategory] = useState(
    contentType === "reflection" ? "Biblical Studies" : contentType === "journal" ? "Personal" : "General",
  );

  const isReflection = contentType === "reflection";
  const isJournal = contentType === "journal";
  const categories = isReflection ? reflectionCategories : isJournal ? journalCategories : bookCategories;

  return (
    <form className="admin-form admin-draft-form admin-writing-workspace" action={formAction}>
      <input type="hidden" name="contentType" value={contentType} />

      <div className="admin-writing-metadata">
        <div className="admin-writing-field admin-writing-field-wide">
          <label htmlFor="draft-title">Title</label>
          <input
            id="draft-title"
            name="title"
            type="text"
            placeholder={isReflection ? "My new reflection" : isJournal ? "My new journal entry" : "Book title"}
            required
          />
        </div>

        <div className="admin-writing-field">
          <label htmlFor="draft-slug">Slug</label>
          <input
            id="draft-slug"
            name="slug"
            type="text"
            placeholder={isReflection ? "my-new-reflection" : isJournal ? "my-new-journal-entry" : "book-title"}
            required
          />
        </div>

        <div className="admin-writing-field">
          <label htmlFor="draft-category">Category</label>
          <select id="draft-category" name="category" value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        <div className="admin-writing-field">
          <label htmlFor="draft-tags">Tags</label>
          <input id="draft-tags" name="tags" type="text" placeholder="Scripture, Faith, Interpretation" />
        </div>

        {isReflection || isJournal ? (
          <>
            <div className="admin-writing-field">
              <label htmlFor="draft-date">Date</label>
              <input id="draft-date" name="date" type="text" placeholder="August 13, 2026" />
            </div>
            {isReflection ? (
              <>
                <div className="admin-writing-field">
                  <label htmlFor="draft-reading-time">Reading time</label>
                  <input id="draft-reading-time" name="readingTime" type="text" placeholder="6 min read" />
                </div>
                <div className="admin-writing-field admin-writing-field-wide">
                  <label htmlFor="draft-scripture">Scripture</label>
                  <input id="draft-scripture" name="scripture" type="text" placeholder="Romans 8:28" />
                </div>
              </>
            ) : (
              <div className="admin-writing-field">
                <label htmlFor="draft-label">Label</label>
                <input id="draft-label" name="label" type="text" placeholder="Personal Journal" />
              </div>
            )}
            <div className="admin-writing-field admin-writing-field-wide">
              <label htmlFor="draft-introduction">Introduction</label>
              <textarea id="draft-introduction" name="introduction" rows={5} placeholder={isReflection ? "Write the introduction to your reflection..." : "Write a short introduction to your journal entry..."} />
            </div>
          </>
        ) : (
          <>
            <div className="admin-writing-field">
              <label htmlFor="draft-subtitle">Subtitle</label>
              <input id="draft-subtitle" name="subtitle" type="text" placeholder="Book subtitle" />
            </div>
            <div className="admin-writing-field">
              <label htmlFor="draft-author">Author</label>
              <input id="draft-author" name="author" type="text" placeholder="Author name" />
            </div>
            <div className="admin-writing-field">
              <label htmlFor="draft-publisher">Publisher</label>
              <input id="draft-publisher" name="publisher" type="text" placeholder="Publisher" />
            </div>
            <div className="admin-writing-field">
              <label htmlFor="draft-expected-publication">Expected publication</label>
              <input id="draft-expected-publication" name="expectedPublication" type="text" placeholder="2026" />
            </div>
            <div className="admin-writing-field">
              <label htmlFor="draft-length">Length</label>
              <input id="draft-length" name="length" type="text" placeholder="320 pages" />
            </div>
            <div className="admin-writing-field admin-writing-field-wide">
              <label htmlFor="draft-table-of-contents">Table of contents</label>
              <textarea id="draft-table-of-contents" name="tableOfContents" rows={6} placeholder="Chapter 1\nChapter 2\nChapter 3" />
            </div>
            <div className="admin-writing-field admin-writing-field-wide">
              <label htmlFor="draft-introduction">Description</label>
              <textarea id="draft-introduction" name="introduction" rows={5} placeholder="Write the book description..." />
            </div>
          </>
        )}

        <label className="admin-checkbox admin-writing-featured" htmlFor="draft-featured">
          <input id="draft-featured" name="featured" type="checkbox" value="yes" />
          {isReflection ? "Feature this reflection" : "Feature this content"}
        </label>
      </div>

      {(isReflection || isJournal) && (
        <section className="admin-writing-editor-section">
          <div className="admin-writing-section-heading">
            <div>
              <p className="eyebrow">Writing</p>
              <h3>{isReflection ? "Reflection body" : "Journal body"}</h3>
            </div>
            <p className="quiet-note">Write freely. The editor uses the full available width and keeps the saved rich-text format.</p>
          </div>
          <ReflectionBodyEditor />
        </section>
      )}

      <div className="admin-draft-actions">
        <button className="button button-secondary" type="submit" name="saveMode" value="draft" disabled={isPending}>
          {isPending ? "Saving..." : "Save draft"}
        </button>
        <button className="button button-primary" type="submit" name="saveMode" value="continue" disabled={isPending}>
          {isPending ? "Saving..." : "Save & continue editing"}
        </button>
      </div>

      {state.message ? <p className={state.status === "error" ? "form-error" : "form-note"} role="status">{state.message}</p> : null}
    </form>
  );
}
