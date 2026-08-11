"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { StudyEntry } from "@/app/data/study-plan";
import { getReaderStateStore } from "@/app/state/reader-state";
import { getStudyProgressStatus, type StudyProgressStatus } from "@/app/study-center/study-state";

const readerState = getReaderStateStore();

export function WeekProgress({ studies, currentDate, showNavigation = true }: { studies: StudyEntry[]; currentDate: string; showNavigation?: boolean }) {
  const navRef = useRef<HTMLDivElement>(null);
  const [statuses, setStatuses] = useState<Record<string, StudyProgressStatus>>(() =>
    typeof window === "undefined" ? {} : Object.fromEntries(studies.map((study) => [study.date, getStudyProgressStatus(study.date)])),
  );

  useEffect(() => {
    const refresh = () => setStatuses(Object.fromEntries(studies.map((study) => [study.date, getStudyProgressStatus(study.date)])));

    return readerState.subscribeToStudyProgress(refresh);
  }, [studies]);

  /* Scroll the today card into view on first render */
  useEffect(() => {
    const nav = navRef.current;
    const todayCard = nav?.querySelector<HTMLElement>(".is-today");
    if (nav && todayCard) {
      const offset = todayCard.offsetLeft - nav.clientWidth / 2 + todayCard.clientWidth / 2;
      nav.scrollLeft = Math.max(0, offset);
    }
  }, []);

  const completedCount = studies.filter((study) => statuses[study.date] === "completed").length;
  const inProgressCount = studies.filter((study) => statuses[study.date] === "in-progress").length;

  return (
    <>
      <div className="study-progress-label">
        <span>{completedCount} of {studies.length} complete{inProgressCount ? ` · ${inProgressCount} in progress` : ""}</span>
        <span>{Math.round((completedCount / Math.max(studies.length, 1)) * 100)}%</span>
      </div>
      <div className="study-progress-track" aria-label={`${completedCount} of ${studies.length} studies complete`}>
        <span style={{ width: `${(completedCount / Math.max(studies.length, 1)) * 100}%` }} />
      </div>
      {showNavigation ? <div ref={navRef} className="study-week-nav" aria-label="Current week studies">
        {studies.map((study, index) => {
          const isToday = study.date === currentDate;
          const status = statuses[study.date] ?? "not-started";
          return (
            <Link className={`study-week-day${isToday ? " is-today" : ""}${status === "completed" ? " is-complete" : ""}${status === "in-progress" ? " is-in-progress" : ""}`} href={`/study-center/${study.date}`} key={study.date}>
              <span className="study-week-day-number">{String(index + 1).padStart(2, "0")}</span>
              <strong>{study.weekday}</strong>
              <time dateTime={study.date}>{study.date.slice(5).replace("-", "/")}</time>
              <span className="study-week-passage">{study.passage}</span>
              <p>{study.focus}</p>
              {status !== "not-started" ? <span className="study-progress-badge">{status === "completed" ? "Complete" : "In progress"}</span> : null}
              {isToday ? <span className="study-today-badge">Today</span> : null}
            </Link>
          );
        })}
      </div> : null}
    </>
  );
}
