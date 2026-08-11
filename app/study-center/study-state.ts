export type StudyProgressStatus = "not-started" | "in-progress" | "completed";

const reflectionKey = (date: string) => `spirit-life-reflection-${date}`;
const completionKey = (date: string) => `spirit-life-completed-${date}`;
const checklistKey = (date: string) => `spirit-life-checklist-${date}`;
const journalKey = (date: string) => `spirit-life-journal-${date}`;

function hasStoredText(value: string | null) {
  return Boolean(value?.trim());
}

function hasStoredObjectValue(value: string | null) {
  if (!value) return false;

  try {
    const stored = JSON.parse(value) as Record<string, unknown>;
    return Object.values(stored).some((item) => typeof item === "boolean" ? item : hasStoredText(String(item ?? "")));
  } catch {
    return false;
  }
}

export function getStudyProgressStatus(date: string): StudyProgressStatus {
  if (typeof window === "undefined") return "not-started";
  if (window.localStorage.getItem(completionKey(date)) === "true") return "completed";

  const reflection = window.localStorage.getItem(reflectionKey(date));
  const checklist = window.localStorage.getItem(checklistKey(date));
  const journal = window.localStorage.getItem(journalKey(date));

  const hasProgress = [
    hasStoredText(reflection),
    hasStoredObjectValue(checklist),
    hasStoredObjectValue(journal),
  ].some(Boolean);

  return hasProgress ? "in-progress" : "not-started";
}
