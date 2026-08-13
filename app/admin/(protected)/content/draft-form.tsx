"use client";

import { useActionState, useState } from "react";
import { createDraftAction } from "@/app/admin/(protected)/actions/content";
import { ReflectionBodyEditor } from "@/app/admin/(protected)/content/reflection-body-editor";

const initialContentDraftActionState = {
  status: "idle" as const,
  message: "",
};

export function DraftForm() {
  const [state, formAction, isPending] = useActionState(
    createDraftAction,
    initialContentDraftActionState,
  );
  const [contentType, setContentType] = useState("reflection");

  return (
    <form className="admin-form" action={formAction}>
      <label htmlFor="draft-content-type">Content type</label>
      <select
        id="draft-content-type"
        name="contentType"
        value={contentType}
        onChange={(event) => setContentType(event.target.value)}
        required
      >
        <option value="reflection">Reflection</option>
        <option value="journal">Journal</option>
        <option value="book">Book</option>
      </select>

      <label htmlFor="draft-title">Title</label>
      <input
        id="draft-title"
        name="title"
        type="text"
        placeholder="My new reflection"
        required
      />

      <label htmlFor="draft-slug">Slug</label>
      <input
        id="draft-slug"
        name="slug"
        type="text"
        placeholder="my-new-reflection"
        required
      />

      <label htmlFor="draft-date">Date</label>
      <input
        id="draft-date"
        name="date"
        type="text"
        placeholder="August 13, 2026"
      />

      <label htmlFor="draft-reading-time">Reading time</label>
      <input
        id="draft-reading-time"
        name="readingTime"
        type="text"
        placeholder="6 min read"
      />

      <label htmlFor="draft-category">Category</label>
      <select
        id="draft-category"
        name="category"
        defaultValue="Biblical Studies"
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

      <label htmlFor="draft-tags">Tags</label>
      <input
        id="draft-tags"
        name="tags"
        type="text"
        placeholder="Scripture, Faith, Interpretation"
      />

      <label htmlFor="draft-scripture">Scripture</label>
      <input
        id="draft-scripture"
        name="scripture"
        type="text"
        placeholder="Romans 8:28"
      />

      <label htmlFor="draft-introduction">Introduction</label>
      <textarea
        id="draft-introduction"
        name="introduction"
        rows={6}
        placeholder="Write the introduction to your reflection..."
      />

      <label className="admin-checkbox" htmlFor="draft-featured">
        <input
          id="draft-featured"
          name="featured"
          type="checkbox"
          value="yes"
        />
        Feature this reflection
      </label>

      {contentType === "reflection" ? <ReflectionBodyEditor /> : null}

      <button
        className="button button-primary"
        type="submit"
        disabled={isPending}
      >
        {isPending ? "Saving..." : "Save draft"}
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
