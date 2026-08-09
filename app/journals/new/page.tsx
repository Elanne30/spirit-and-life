import { Suspense } from "react";
import { JournalComposer } from "@/app/journals/new/journal-composer";

export default function NewJournalPage() {
  return (
    <Suspense fallback={<main className="journal-composer-page page-container" />}>
      <JournalComposer />
    </Suspense>
  );
}
