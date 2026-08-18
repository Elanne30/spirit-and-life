import Link from "next/link";
import { ArticleForm } from "@/app/admin/(protected)/content/article-form";

export default function NewArticlePage() {
  return (
    <section className="admin-editor-page">
      <div className="admin-editor-header"><div><Link className="admin-outline-link" href="/admin/content/article">← Back to Articles</Link><p className="eyebrow">Create</p><h1>New Article</h1><p>Write an article for the Spirit &amp; Life library.</p></div></div>
      <article className="admin-editor-card"><ArticleForm /></article>
    </section>
  );
}
