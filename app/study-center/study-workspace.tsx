"use client";

import Link from "next/link";
import { useState } from "react";
import type { StudyEntry } from "@/app/data/study-plan";

type StudyWorkspaceProps = {
  study: StudyEntry;
  previous?: StudyEntry;
  next?: StudyEntry;
};

const reflectionKey = (date: string) => `spirit-life-reflection-${date}`;
const completionKey = (date: string) => `spirit-life-completed-${date}`;
const storedValue = (key: string) =>
  typeof window === "undefined" ? null : window.localStorage.getItem(key);

export function StudyWorkspace({ study, previous, next }: StudyWorkspaceProps) {
  const [reflection, setReflection] = useState(() => storedValue(reflectionKey(study.date)) ?? "");
  const [saved, setSaved] = useState(false);
  const [completed, setCompleted] = useState(
    () => storedValue(completionKey(study.date)) === "true",
  );

  function saveReflection() {
    localStorage.setItem(reflectionKey(study.date), reflection);
    setSaved(true);
  }

  function toggleComplete() {
    const nextValue = !completed;
    localStorage.setItem(completionKey(study.date), String(nextValue));
    setCompleted(nextValue);
    window.dispatchEvent(new Event("spirit-life-progress-changed"));
  }

  const journalHref = `/journals/new?studyDate=${encodeURIComponent(study.date)}&week=${encodeURIComponent(study.weekTitle ?? "")}&passage=${encodeURIComponent(study.passage)}`;

  return (
    <div className="study-workspace">
      <div className="study-workspace-topline">
        <Link className="study-back-link" href="/study-center">Back to Study Center</Link>
        <span>{study.weekday} · {study.date}</span>
      </div>
      <header className="study-workspace-header">
        <p className="eyebrow">Week {study.week}</p>
        <h1>{study.weekTitle}</h1>
        <p className="study-workspace-movement">{study.movement}</p>
      </header>

      <section className="study-workspace-passage" aria-labelledby="study-passage-title">
        <p className="eyebrow">Passage</p>
        <h2 id="study-passage-title">{study.passage}</h2>
        <p>{study.focus}</p>
      </section>

      <section className="study-workspace-reflection" aria-labelledby="study-reflection-title">
        <p className="eyebrow">Reflection</p>
        <h2 id="study-reflection-title">{study.reflection}</h2>
        <label htmlFor="reflection-response">Your response</label>
        <textarea
          id="reflection-response"
          value={reflection}
          onChange={(event) => {
            setReflection(event.target.value);
            setSaved(false);
          }}
          placeholder="Write what you are noticing, considering, or praying through."
          rows={8}
        />
        <div className="study-workspace-actions">
          <button className="button button-primary" type="button" onClick={saveReflection}>
            Save reflection
          </button>
          {saved ? <span className="study-saved-note" role="status">Reflection saved</span> : null}
        </div>
      </section>

      <section className="study-workspace-response" aria-labelledby="study-response-title">
        <div>
          <p className="eyebrow">Continue the response</p>
          <h2 id="study-response-title">Carry this study into your journal.</h2>
          <p>Your new entry will begin with this study date, week, and passage.</p>
        </div>
        <Link className="button button-secondary" href={journalHref}>Write in Journal</Link>
      </section>

      <section className="study-workspace-completion">
        <div>
          <p className="eyebrow">Study progress</p>
          <h2>{completed ? "Study complete" : "Stay with today&apos;s work."}</h2>
          <p>{completed ? "This completion is saved on this device." : "Mark this study complete when you have finished your reading and response."}</p>
        </div>
        <button className={`button ${completed ? "button-secondary" : "button-primary"}`} type="button" onClick={toggleComplete}>
          {completed ? "Mark incomplete" : "Mark study complete"}
        </button>
      </section>

      <nav className="study-workspace-navigation" aria-label="Study navigation">
        {previous ? <Link className="button button-text" href={`/study-center/${previous.date}`}>Previous study</Link> : <span />}
        {next ? <Link className="button button-text" href={`/study-center/${next.date}`}>Next study</Link> : <span />}
      </nav>
    </div>
  );
}
