import { JOURNAL_DRAFTS_STORAGE_KEY, type JournalDraft } from "@/app/data/journal-drafts";

export type StudyChecklistState = Record<string, boolean>;
export type StudyJournalState = Record<string, string>;

export type StudyDayState = {
  reflection: string;
  completed: boolean;
  checklist: StudyChecklistState;
  journal: StudyJournalState;
};

export type ReaderBookmark = {
  id: string;
  href: string;
  title: string;
  createdAt: string;
};

export type ReadingHistoryEntry = {
  href: string;
  title: string;
  visitedAt: string;
};

export type SavedNote = {
  id: string;
  href: string;
  body: string;
  savedAt: string;
};

export type CreateJournalDraftInput = {
  body: string;
  studyDate: string;
  week: string;
  passage: string;
};

export type ReaderStateStore = {
  getStudyDayState: (date: string) => StudyDayState;
  setStudyReflection: (date: string, value: string) => void;
  setStudyCompleted: (date: string, completed: boolean) => void;
  setStudyChecklist: (date: string, checklist: StudyChecklistState) => void;
  setStudyJournal: (date: string, journal: StudyJournalState) => void;
  getJournalDrafts: () => JournalDraft[];
  saveJournalDraft: (draft: CreateJournalDraftInput) => JournalDraft;
  subscribeToStudyProgress: (onStoreChange: () => void) => () => void;
};

const progressChangedEvent = "spirit-life-progress-changed";
const reflectionKey = (date: string) => `spirit-life-reflection-${date}`;
const completionKey = (date: string) => `spirit-life-completed-${date}`;
const checklistKey = (date: string) => `spirit-life-checklist-${date}`;
const journalKey = (date: string) => `spirit-life-journal-${date}`;

function isBrowser() {
  return typeof window !== "undefined";
}

function notifyStudyProgressChanged() {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new Event(progressChangedEvent));
}

function readStoredObject<T>(raw: string | null, fallback: T): T {
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function localStore(): ReaderStateStore {
  return {
    getStudyDayState(date) {
      if (!isBrowser()) {
        return { reflection: "", completed: false, checklist: {}, journal: {} };
      }

      return {
        reflection: window.localStorage.getItem(reflectionKey(date)) ?? "",
        completed: window.localStorage.getItem(completionKey(date)) === "true",
        checklist: readStoredObject<StudyChecklistState>(window.localStorage.getItem(checklistKey(date)), {}),
        journal: readStoredObject<StudyJournalState>(window.localStorage.getItem(journalKey(date)), {}),
      };
    },

    setStudyReflection(date, value) {
      if (!isBrowser()) {
        return;
      }

      window.localStorage.setItem(reflectionKey(date), value);
      notifyStudyProgressChanged();
    },

    setStudyCompleted(date, completed) {
      if (!isBrowser()) {
        return;
      }

      window.localStorage.setItem(completionKey(date), String(completed));
      notifyStudyProgressChanged();
    },

    setStudyChecklist(date, checklist) {
      if (!isBrowser()) {
        return;
      }

      window.localStorage.setItem(checklistKey(date), JSON.stringify(checklist));
      notifyStudyProgressChanged();
    },

    setStudyJournal(date, journal) {
      if (!isBrowser()) {
        return;
      }

      window.localStorage.setItem(journalKey(date), JSON.stringify(journal));
      notifyStudyProgressChanged();
    },

    getJournalDrafts() {
      if (!isBrowser()) {
        return [];
      }

      return readStoredObject<JournalDraft[]>(window.localStorage.getItem(JOURNAL_DRAFTS_STORAGE_KEY), []);
    },

    saveJournalDraft(draft) {
      const nextDraft: JournalDraft = {
        ...draft,
        savedAt: new Date().toISOString(),
      };

      if (!isBrowser()) {
        return nextDraft;
      }

      const entries = this.getJournalDrafts();
      entries.push(nextDraft);
      window.localStorage.setItem(JOURNAL_DRAFTS_STORAGE_KEY, JSON.stringify(entries));
      return nextDraft;
    },

    subscribeToStudyProgress(onStoreChange) {
      if (!isBrowser()) {
        return () => {};
      }

      const onStorage = () => onStoreChange();
      const onProgress = () => onStoreChange();

      window.addEventListener("storage", onStorage);
      window.addEventListener(progressChangedEvent, onProgress);

      return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener(progressChangedEvent, onProgress);
      };
    },
  };
}

const readerStateStore = localStore();

export function getReaderStateStore() {
  return readerStateStore;
}