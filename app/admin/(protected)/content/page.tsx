export default function AdminContentPage() {
  return (
    <section className="admin-stack">
      <article className="admin-card">
        <h2>Content management status</h2>
        <p>Reflections, journals, and books are currently stored in typed source files and rendered as static routes.</p>
        <p>This is stable for the live site, so a full database migration is intentionally deferred to avoid breaking current URLs, slugs, and SEO.</p>
      </article>

      <article className="admin-card">
        <h2>Planned workflow foundation</h2>
        <ul className="admin-list">
          <li>Create draft</li>
          <li>Edit draft</li>
          <li>Preview</li>
          <li>Publish</li>
          <li>Trigger communication only on explicit publish</li>
        </ul>
        <p>Draft and publish controls will be implemented in a follow-up phase with a safe migration plan that preserves existing content and routes.</p>
      </article>
    </section>
  );
}
