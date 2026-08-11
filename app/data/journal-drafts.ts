export const JOURNAL_DRAFTS_STORAGE_KEY = "spirit-life-journal-drafts";

export type JournalDraft = {
  body: string;
  studyDate: string;
  week: string;
  passage: string;
  savedAt: string;
};
