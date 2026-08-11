"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { getReaderStateStore } from "@/app/state/reader-state";

const readerState = getReaderStateStore();

export function JournalComposer() {
  const searchParams = useSearchParams();
  const studyDate = searchParams.get("studyDate") ?? "";
  const week = searchParams.get("week") ?? "";
  const passage = searchParams.get("passage") ?? "";
  const [body, setBody] = useState("");
  const [saved, setSaved] = useState(false);

  function saveEntry() {
    readerState.saveJournalDraft({ body, studyDate, week, passage });
    setSaved(true);
  }

  return (
    <main className="journal-composer-page page-container">
      <div className="journal-composer">
        <Link className="study-back-link" href="/journals">Back to Journals</Link>
        <p className="eyebrow">Journal Entry</p>
        <h1>Write from the study.</h1>
        <p className="journal-composer-context">{studyDate} · {week} · {passage}</p>
        <label htmlFor="journal-body">Your entry</label>
        <textarea id="journal-body" rows={14} value={body} onChange={(event) => { setBody(event.target.value); setSaved(false); }} placeholder="Write what you want to carry forward from this study." />
        <div className="study-workspace-actions">
          <button className="button button-primary" type="button" onClick={saveEntry}>Save journal entry</button>
          {saved ? <span className="study-saved-note" role="status">Journal entry saved on this device</span> : null}
        </div>
      </div>
    </main>
  );
}