"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { StudyEntry } from "@/app/data/study-plan";
import { getReaderStateStore } from "@/app/state/reader-state";
import { getStudyProgressStatus } from "@/app/study-center/study-state";

type StudyWorkspaceProps = {
  study: StudyEntry;
  previous?: StudyEntry;
  next?: StudyEntry;
};

const readerState = getReaderStateStore();

const checklistItems = [
  "Read the passage slowly and observe what the text says.",
  "Study the context, structure, and meaning of the passage.",
  "Write what this reveals about God, humanity, and obedience.",
  "Bring one honest response to prayer.",
] as const;

const journalFieldDefinitions = [
  { key: "Observation", label: "Observation" },
  { key: "Meaning/context", label: "Meaning/context" },
  { key: "God", label: "God" },
  { key: "Humanity", label: "Humanity" },
  { key: "Sin/desire", label: "Sin/desire" },
  { key: "Grace", label: "Grace" },
  { key: "Obedience", label: "Obedience" },
  { key: "Personal response", label: "Personal response" },
  { key: "Prayer", label: "Prayer" },
  { key: "One sentence to remember", label: "One sentence to remember" },
] as const;

const legacyJournalPromptMap: Record<string, string> = {
  "What does the text say?": "Observation",
  "What does the text mean?": "Meaning/context",
  "What does this reveal about God?": "God",
  "What does this reveal about humanity?": "Humanity",
  "What does this reveal about sin and desire?": "Sin/desire",
  "What does this reveal about grace, mercy, or God's faithfulness?": "Grace",
  "What does this reveal about obedience?": "Obedience",
  "What does this reveal about me?": "Personal response",
  "What am I tempted to resist?": "Personal response",
  "What must I believe?": "Personal response",
  "What must I do?": "Personal response",
  Prayer: "Prayer",
  "One sentence to remember": "One sentence to remember",
};

type JournalResponses = Record<string, string>;

export function StudyWorkspace({ study, previous, next }: StudyWorkspaceProps) {
  const [reflection, setReflection] = useState(() => readerState.getStudyDayState(study.date).reflection);
  const [saved, setSaved] = useState(false);
  const [completed, setCompleted] = useState(() => readerState.getStudyDayState(study.date).completed);
  const [checklist, setChecklist] = useState<Record<string, boolean>>(() => readerState.getStudyDayState(study.date).checklist);
  const [journalResponses, setJournalResponses] = useState<JournalResponses>(() => {
    const stored = readerState.getStudyDayState(study.date).journal;

    return journalFieldDefinitions.reduce<JournalResponses>((responses, field) => {
      const legacyValue = stored[legacyJournalPromptMap[field.key]];
      const storedValue = stored[field.key] ?? legacyValue;

      if (storedValue) {
        responses[field.key] = storedValue;
      }

      return responses;
    }, {});
  });

  useEffect(() => {
    const stored = readerState.getStudyDayState(study.date);
    const frame = window.requestAnimationFrame(() => {
      setReflection(stored.reflection);
      setCompleted(stored.completed);
      setChecklist(stored.checklist);
      setSaved(false);
      setJournalResponses(
        journalFieldDefinitions.reduce<JournalResponses>((responses, field) => {
          const legacyValue = stored.journal[legacyJournalPromptMap[field.key]];
          const storedValue = stored.journal[field.key] ?? legacyValue;

          if (storedValue) {
            responses[field.key] = storedValue;
          }

          return responses;
        }, {}),
      );
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [study.date]);

  function persistReflection(nextValue: string, markSaved = false) {
    readerState.setStudyReflection(study.date, nextValue);
    setReflection(nextValue);
    setSaved(markSaved);
  }

  function saveReflection() {
    persistReflection(reflection, true);
  }

  function toggleComplete() {
    const nextValue = !completed;
    readerState.setStudyCompleted(study.date, nextValue);
    setCompleted(nextValue);
  }

  function toggleChecklistItem(item: string) {
    const nextChecklist = { ...checklist, [item]: !checklist[item] };
    readerState.setStudyChecklist(study.date, nextChecklist);
    setChecklist(nextChecklist);
  }

  function updateJournalResponse(prompt: string, value: string) {
    const nextResponses = { ...journalResponses, [prompt]: value };
    readerState.setStudyJournal(study.date, nextResponses);
    setJournalResponses(nextResponses);
  }

  const journalHref = `/journals/new?studyDate=${encodeURIComponent(study.date)}&week=${encodeURIComponent(study.weekTitle ?? "")}&passage=${encodeURIComponent(study.passage)}`;
  const progressStatus = getStudyProgressStatus(study.date);

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
        <p className={`study-workspace-status is-${progressStatus}`} role="status">
          {progressStatus.replace("-", " ")}
        </p>
      </header>

      <section className="study-workspace-passage" aria-labelledby="study-passage-title">
        <p className="eyebrow">Passage</p>
        <h2 id="study-passage-title">{study.passage}</h2>
        <p>{study.focus}</p>
      </section>

      <section className="study-workspace-checklist" aria-labelledby="study-checklist-title">
        <div>
          <p className="eyebrow">Today&apos;s movement</p>
          <h2 id="study-checklist-title">A simple path through the study.</h2>
          <p>{Object.values(checklist).filter(Boolean).length} of {checklistItems.length} steps complete.</p>
        </div>
        <ul>
          {checklistItems.map((item) => (
            <li key={item} className={checklist[item] ? "is-complete" : ""}>
              <label>
                <input type="checkbox" checked={Boolean(checklist[item])} onChange={() => toggleChecklistItem(item)} />
                <span>{item}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="study-workspace-reflection" aria-labelledby="study-reflection-title">
        <p className="eyebrow">Reflection</p>
        <h2 id="study-reflection-title">{study.reflection}</h2>
        <label htmlFor="reflection-response">Your response</label>
        <textarea
          id="reflection-response"
          value={reflection}
          onChange={(event) => persistReflection(event.target.value)}
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

      <section className="study-workspace-journal" aria-labelledby="study-journal-title">
        <div className="study-workspace-section-heading">
          <p className="eyebrow">Study journal</p>
          <h2 id="study-journal-title">Stay with the text.</h2>
          <p>Use these prompts to move from observation to understanding, prayer, and obedience.</p>
        </div>
        <div className="study-journal-fields">
          {journalFieldDefinitions.map((field) => (
            <label key={field.key}>
              <span>{field.label}</span>
              <textarea
                value={journalResponses[field.key] ?? ""}
                onChange={(event) => updateJournalResponse(field.key, event.target.value)}
                rows={field.key === "One sentence to remember" ? 3 : 4}
              />
            </label>
          ))}
        </div>
        <label className="study-known-truth">
          <span>I know this, but what would it mean for me to actually live it?</span>
          <textarea
            value={journalResponses["I know this, but"] ?? ""}
            onChange={(event) => updateJournalResponse("I know this, but", event.target.value)}
            rows={4}
          />
        </label>
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
