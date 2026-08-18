"use client";

import { useActionState, useState } from "react";
import { createArticleAction, updateArticleAction, type ArticleActionState } from "@/app/admin/(protected)/actions/article-content";
import type { ArticleDraft } from "@/app/lib/content-drafts";

const initialState: ArticleActionState = { status: "idle", message: "" };

type Props = { draft?: ArticleDraft };

function initialBody(draft?: ArticleDraft) {
  const sections = Array.isArray(draft?.body.sections) ? draft?.body.sections : [];
  return sections
    .flatMap((section) => (typeof section === "object" && section !== null && Array.isArray((section as { paragraphs?: unknown }).paragraphs) ? (section as { paragraphs: unknown[] }).paragraphs : []))
    .filter((paragraph): paragraph is string => typeof paragraph === "string")
    .join("\n\n");
}

export function ArticleForm({ draft }: Props) {
  const action = draft ? updateArticleAction : createArticleAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [title, setTitle] = useState(draft?.title ?? "");
  const [slug, setSlug] = useState(draft?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(draft));
  const [body, setBody] = useState(initialBody(draft));

  function makeSlug(value: string) {
    return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120);
  }

  return (
    <form action={formAction} className="admin-form">
      {draft ? <input type="hidden" name="draftId" value={draft.id} /> : null}
      <label htmlFor="article-title">Title</label>
      <input id="article-title" name="title" value={title} onChange={(event) => { const value = event.target.value; setTitle(value); if (!slugEdited) setSlug(makeSlug(value)); }} required />

      <label htmlFor="article-slug">Slug</label>
      <input id="article-slug" name="slug" value={slug} onChange={(event) => { setSlugEdited(true); setSlug(makeSlug(event.target.value)); }} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" maxLength={120} />
      <p className="form-note">The slug follows the title until you edit it yourself.</p>

      <label htmlFor="article-category">Category</label>
      <select id="article-category" name="category" defaultValue={draft?.category ?? "Christian Living"}>
        <option>Biblical Studies</option><option>Theology</option><option>Christian Living</option><option>Faith &amp; Life</option><option>Philosophy</option><option>Apologetics</option><option>Church History</option>
      </select>

      <div className="admin-form-grid">
        <div><label htmlFor="article-date">Date</label><input id="article-date" name="date" defaultValue={typeof draft?.body.date === "string" ? draft.body.date : ""} placeholder="August 18, 2026" /></div>
        <div><label htmlFor="article-reading-time">Reading time</label><input id="article-reading-time" name="readingTime" defaultValue={typeof draft?.body.readingTime === "string" ? draft.body.readingTime : ""} placeholder="6 min read" /></div>
      </div>

      <label htmlFor="article-introduction">Introduction</label>
      <textarea id="article-introduction" name="introduction" rows={5} defaultValue={draft?.introduction ?? ""} />

      <label htmlFor="article-tags">Tags</label>
      <input id="article-tags" name="tags" defaultValue={draft?.tags.join(", ") ?? ""} placeholder="Faith, Scripture, Christian Living" />

      <label htmlFor="article-body">Article body</label>
      <textarea id="article-body" rows={24} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Write the article here..." />
      <input type="hidden" name="sections" value={JSON.stringify([{ heading: "", paragraphs: body.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean) }])} />

      <label className="admin-checkbox"><input name="featured" type="checkbox" value="yes" defaultChecked={draft?.body.featured === true} /> Feature this article</label>
      {!draft ? <input type="hidden" name="saveMode" value="draft" /> : null}
      <button className="button button-primary" type="submit" disabled={pending}>{pending ? "Saving..." : draft ? "Save Article" : "Save Article Draft"}</button>
      {state.message ? <p className={state.status === "error" ? "form-error" : "form-note"} role="status">{state.message}</p> : null}
    </form>
  );
}
