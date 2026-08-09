"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { StudyEntry } from "@/app/data/study-plan";

export function WeekProgress({ studies, currentDate, showNavigation = true }: { studies: StudyEntry[]; currentDate: string; showNavigation?: boolean }) {
  const readCompleted = () => studies.filter((study) => localStorage.getItem(`spirit-life-completed-${study.date}`) === "true").map((study) => study.date);
  const [completed, setCompleted] = useState<string[]>(() =>
    typeof window === "undefined" ? [] : readCompleted(),
  );

  useEffect(() => {
    const refresh = () => setCompleted(readCompleted());
    window.addEventListener("storage", refresh);
    window.addEventListener("spirit-life-progress-changed", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("spirit-life-progress-changed", refresh);
    };
  }, [studies]);

  const completedCount = completed.length;

  return (
    <>
      <div className="study-progress-label">
        <span>{completedCount} of {studies.length} complete</span>
        <span>{Math.round((completedCount / Math.max(studies.length, 1)) * 100)}%</span>
      </div>
      <div className="study-progress-track" aria-label={`${completedCount} of ${studies.length} studies complete`}>
        <span style={{ width: `${(completedCount / Math.max(studies.length, 1)) * 100}%` }} />
      </div>
      {showNavigation ? <div className="study-week-nav">
        {studies.map((study, index) => {
          const isToday = study.date === currentDate;
          const isComplete = completed.includes(study.date);
          return (
            <Link className={`study-week-day${isToday ? " is-today" : ""}${isComplete ? " is-complete" : ""}`} href={`/study-center/${study.date}`} key={study.date}>
              <span className="study-week-day-number">{String(index + 1).padStart(2, "0")}</span>
              <strong>{study.weekday}</strong>
              <time dateTime={study.date}>{study.date.slice(5).replace("-", "/")}</time>
              <span className="study-week-passage">{study.passage}</span>
              <p>{study.focus}</p>
              {isComplete ? <span className="study-complete-badge">Complete</span> : null}
              {isToday ? <span className="study-today-badge">Today</span> : null}
            </Link>
          );
        })}
      </div> : null}
    </>
  );
}
