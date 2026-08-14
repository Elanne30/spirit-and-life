import { notFound } from "next/navigation";
import { getDraft } from "@/app/lib/content-drafts";
import { DraftEditForm } from "@/app/admin/(protected)/content/draft-edit-form";

export default async function AdminContentDraftEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const draft = await getDraft(id);

  if (!draft) {
    notFound();
  }

  return (
    <section className="admin-stack">
      <article className="admin-card">
        <h2>Edit draft</h2>
        <p>
          Update this {draft.content_type} draft and save your changes.
        </p>
      </article>

      <article className="admin-card">
        <DraftEditForm draft={draft} />
      </article>
    </section>
  );
}