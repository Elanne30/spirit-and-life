import { getReaderStateStore } from "@/app/state/reader-state";

export type StudyProgressStatus = "not-started" | "in-progress" | "completed";

const readerState = getReaderStateStore();

function hasStoredText(value: string | null) {
  return Boolean(value?.trim());
}

function hasStoredObjectValue(value: Record<string, unknown>) {
  return Object.values(value).some((item) => typeof item === "boolean" ? item : hasStoredText(String(item ?? "")));
}

export function getStudyProgressStatus(date: string): StudyProgressStatus {
  if (typeof window === "undefined") return "not-started";

  const state = readerState.getStudyDayState(date);

  if (state.completed) return "completed";

  const hasProgress = [
    hasStoredText(state.reflection),
    hasStoredObjectValue(state.checklist),
    hasStoredObjectValue(state.journal),
  ].some(Boolean);

  return hasProgress ? "in-progress" : "not-started";
}
