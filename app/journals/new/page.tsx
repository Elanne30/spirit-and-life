import { Suspense } from "react";
import type { Metadata } from "next";
import { JournalComposer } from "@/app/journals/new/journal-composer";
import { pageMetadata } from "@/app/content/seo";

export const metadata: Metadata = pageMetadata("New Journal", "Draft a new Spirit & Life journal entry.", "/journals/new");

export default function NewJournalPage() {
  return (
    <Suspense fallback={<main className="journal-composer-page page-container" />}>
      <JournalComposer />
    </Suspense>
  );
}
