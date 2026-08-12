import { DraftForm } from "@/app/admin/(protected)/content/draft-form";
import { listDrafts } from "@/app/lib/content-drafts";

export default async function AdminContentPage() {
  const drafts = await listDrafts();

  return (
    <section className="admin-stack">
      <article className="admin-card">
        <h2>Content management status</h2>
        <p>Reflections, journals, and books are currently stored in typed source files and rendered as static routes.</p>
        <p>New admin drafts are stored separately and remain private until a future publishing phase.</p>
      </article>

      <article className="admin-card">
        <h2>Create draft</h2>
        <DraftForm />
      </article>

      <article className="admin-card">
        <h2>Saved drafts</h2>
        {drafts.length ? (
          <ul className="admin-list">
            {drafts.map((draft) => (
              <li key={draft.id}>
                <strong>{draft.title}</strong> - {draft.content_type} - <span>{draft.slug}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="quiet-note">No drafts saved yet.</p>
        )}
      </article>
    </section>
  );
}
