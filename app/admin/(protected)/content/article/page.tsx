import Link from "next/link";
import { listArticleDrafts } from "@/app/lib/content-drafts";

function statusLabel(status: "draft" | "published", changed: boolean) {
  if (status === "draft") return "Draft";
  return changed ? "Published · unpublished changes" : "Published";
}

export default async function ArticleAdminPage() {
  const articles = await listArticleDrafts();
  return (
    <section className="admin-stack">
      <article className="admin-card">
        <div className="admin-header-row">
          <div><p className="eyebrow">Content library</p><h2>Articles</h2><p>Write, edit and publish articles without changing the existing Reflection, Journal or Book editors.</p></div>
          <Link className="button button-primary" href="/admin/content/article/new">New Article</Link>
        </div>
      </article>
      <article className="admin-card">
        <div className="admin-library-grid">
          {articles.map((article) => (
            <Link className="admin-library-card" href={`/admin/content/article/${article.slug}`} key={article.id}>
              <div className="admin-library-card-body">
                <div className="admin-library-card-title"><h3>{article.title}</h3><span className={`admin-status admin-status-${article.status}`}>{statusLabel(article.status, article.has_unpublished_changes)}</span></div>
                <p>{article.category ?? "Article"}</p>
                <div className="admin-library-meta"><span>{typeof article.body.date === "string" ? article.body.date : "No date"}</span>{typeof article.body.readingTime === "string" && article.body.readingTime ? <span>{article.body.readingTime}</span> : null}</div>
              </div>
            </Link>
          ))}
        </div>
        {!articles.length ? <p className="quiet-note">No articles have been created yet.</p> : null}
      </article>
    </section>
  );
}
