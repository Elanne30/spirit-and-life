import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/app/content/seo";
import { listPublishedArticles } from "@/app/lib/content-drafts";

export const metadata: Metadata = pageMetadata("Articles", "Long-form writing on faith, philosophy, apologetics, theology, and hard questions.", "/articles");

export default async function ArticlesPage() {
  const articles = await listPublishedArticles();
  return (
    <main className="articles-page">
      <section className="articles-introduction page-container page-intro">
        <div className="articles-introduction-copy">
          <p className="eyebrow">The Library</p>
          <h1>Articles</h1>
          <p>Long-form writing for philosophy, spirituality, theology, apologetics, and the hard questions of life.</p>
        </div>
      </section>

      <section className="article-library page-container library-section" aria-label="Article library">
        {articles.length ? <div className="article-grid">
          {articles.map((article) => (
            <article className="article-card" key={article.id}>
              {typeof article.body.image === "string" && article.body.image ? (
                <Link className="article-card-image" href={`/articles/${article.slug}`}>
                  <Image src={article.body.image} alt={article.title} width={1280} height={853} sizes="(max-width: 720px) 100vw, 50vw" />
                </Link>
              ) : null}
              <div className="article-card-body">
                <p className="content-card-label">{article.category ?? "Article"}</p>
                <h2><Link href={`/articles/${article.slug}`}>{article.title}</Link></h2>
                {article.introduction ? <p>{article.introduction}</p> : null}
                <p className="card-reading-time">{typeof article.body.date === "string" ? article.body.date : ""}{typeof article.body.readingTime === "string" && article.body.readingTime ? ` · ${article.body.readingTime}` : ""}</p>
                <Link className="content-card-link" href={`/articles/${article.slug}`}>Read Article →</Link>
              </div>
            </article>
          ))}
        </div> : <p className="empty-state">Articles will appear here when they are published.</p>}
      </section>

      <style>{`
        .articles-page { background: var(--background); padding-bottom: clamp(4rem, 8vw, 7rem); }
        .articles-page .articles-introduction { position: relative; isolation: isolate; width: min(100% - 3rem, 78rem); max-width: none; min-height: 31rem; display: flex; align-items: center; overflow: hidden; padding: clamp(4.5rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem); border-bottom: 1px solid var(--line); }
        .articles-page .articles-introduction::before { position: absolute; z-index: -2; inset: 0; content: ""; background: linear-gradient(90deg, color-mix(in srgb, var(--background) 91%, transparent) 0%, color-mix(in srgb, var(--background) 68%, transparent) 46%, color-mix(in srgb, var(--background) 28%, transparent) 100%), url("/images/articles/articles-library-hero.svg") center / cover no-repeat; opacity: .92; }
        .articles-page .articles-introduction::after { position: absolute; z-index: -1; inset: 0; content: ""; background: linear-gradient(180deg, color-mix(in srgb, var(--background) 5%, transparent), color-mix(in srgb, var(--background) 35%, transparent)); pointer-events: none; }
        .articles-page .articles-introduction-copy { width: min(100%, 45rem); }
        .articles-page .articles-introduction .eyebrow { margin-bottom: 1.1rem; }
        .articles-page .articles-introduction h1 { max-width: 18ch; margin: .2rem 0 1.2rem; font-size: clamp(3.7rem, 8vw, 6.8rem); line-height: .88; letter-spacing: -.055em; }
        .articles-page .articles-introduction > .articles-introduction-copy > p:last-child { max-width: 40rem; margin: 0; color: var(--muted); font-size: 1rem; line-height: 1.7; }
        .articles-page .article-library { padding-top: clamp(2rem, 4vw, 3rem); }
        .articles-page .article-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; align-items: start; }
        .articles-page .article-card { overflow: hidden; min-width: 0; border: 1px solid var(--line); border-radius: .2rem; background: var(--surface); box-shadow: 0 1rem 2.5rem var(--shadow); transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease; }
        .articles-page .article-card:hover { transform: translateY(-.3rem); border-color: color-mix(in srgb, var(--accent) 52%, var(--line)); box-shadow: 0 1.5rem 3rem var(--shadow); }
        .articles-page .article-card-image { display: block; aspect-ratio: 16 / 9; overflow: hidden; background: var(--surface-muted); }
        .articles-page .article-card-image img { width: 100%; height: 100%; display: block; object-fit: cover; filter: saturate(.82) contrast(1.05); transition: transform 450ms ease; }
        .articles-page .article-card:hover .article-card-image img { transform: scale(1.025); }
        .articles-page .article-card-body { min-height: 15rem; padding: 1.35rem 1.35rem 1.5rem; }
        .articles-page .article-card-body h2 { margin: .45rem 0 .8rem; font-size: clamp(1.65rem, 2.3vw, 2.25rem); line-height: 1; letter-spacing: -.03em; }
        .articles-page .article-card-body h2 a { text-decoration: none; }
        .articles-page .article-card-body > p:not(.content-card-label):not(.card-reading-time) { margin-bottom: 1rem; color: var(--muted); line-height: 1.65; }
        .articles-page .card-reading-time { margin-bottom: 0; color: var(--muted); font-size: .7rem; }
        .articles-page .content-card-link { display: inline-block; margin-top: 1rem; color: var(--accent-strong); font-size: .74rem; font-weight: 700; }
        .articles-page .empty-state { padding-block: 4rem; color: var(--muted); text-align: center; }
        @media (max-width: 900px) { .articles-page .article-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 720px) {
          .articles-page .articles-introduction, .articles-page .article-library { width: min(100% - 2rem, 40rem); }
          .articles-page .articles-introduction { min-height: 25rem; padding-block: 4rem 3.5rem; }
          .articles-page .articles-introduction::before { background: linear-gradient(180deg, color-mix(in srgb, var(--background) 94%, transparent), color-mix(in srgb, var(--background) 64%, transparent)), url("/images/articles/articles-library-hero.svg") center / cover no-repeat; opacity: .7; }
          .articles-page .articles-introduction h1 { font-size: clamp(3.3rem, 15vw, 5.2rem); }
          .articles-page .article-grid { grid-template-columns: 1fr; max-width: 34rem; margin-inline: auto; }
          .articles-page .article-card-body { min-height: auto; padding: 1.2rem; }
        }
      `}</style>
    </main>
  );
}
