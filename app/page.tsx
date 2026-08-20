import { Button } from "@/app/components/button";
import { SectionHeading } from "@/app/components/section-heading";
import { getFeaturedBook } from "@/app/content/featured";
import { listPublishedJournals, listPublishedReflections } from "@/app/content/repository";
import { listPublishedArticles } from "@/app/lib/content-drafts";
import { getStudyByDate } from "@/app/data/study-plan";
import { siteConfig } from "@/app/content/site-config";
import Link from "next/link";
import Image from "next/image";
import { HomeNewsletterSection } from "@/app/home-newsletter-section";

export default async function Home() {
  const [articles, reflections, journals, featuredBook] = await Promise.all([
    listPublishedArticles(),
    listPublishedReflections(),
    listPublishedJournals(),
    getFeaturedBook(),
  ]);
  const homepageReflections = [
    ...reflections.filter((reflection) => reflection.featured),
    ...reflections.filter((reflection) => !reflection.featured),
  ].slice(0, 2);
  const featuredArticle = articles.find((article) => article.body.featured === true) ?? articles[0];
  const featuredJournal = journals[0];
  const todayStudy = getStudyByDate(new Date().toISOString().slice(0, 10));

  const libraryEntries = [
    { number: "01", title: "Articles", description: "Long-form writing on faith, philosophy, apologetics, theology, and hard questions.", href: "/articles", action: "Read articles" },
    { number: "02", title: "Reflections", description: "Thoughtful writing on Scripture, theology, philosophy, and Christian living.", href: "/reflections", action: "Read reflections" },
    { number: "03", title: "Journals", description: "Personal observations and lessons gathered through study, work, faith, and life.", href: "/journals", action: "Read the journal" },
    { number: "04", title: "Books", description: "Longer works exploring biblical themes, difficult questions, and the life of faith.", href: "/books", action: "Browse the books" },
  ];

  return (
    <div className="site-frame home-page">
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-backdrop" />
          <div className="hero-copy">
            <Image className="hero-logo" src={siteConfig.brand.logo} alt="Spirit & Life" width={616} height={496} priority />
            <p className="eyebrow">A place to read, think, and grow</p>
            <h1 id="hero-title">Spirit &amp; Life</h1>
            <h2 className="hero-thesis">Thoughtful Writing. Honest Questions. Timeless Truth.</h2>
            <p className="hero-introduction">Scripture, careful reasoning, and honest reflection for people who want to take faith seriously and think deeply about what they believe.</p>
            <div className="hero-actions">
              <Button href="/reflections">Begin Reading</Button>
              <Button href="/study-center" variant="secondary">Study Scripture</Button>
            </div>
            <Link className="hero-scroll-link" href="#explore">Explore the library <span aria-hidden="true">↓</span></Link>
          </div>
          <div className="hero-side-note" aria-hidden="true">
            <span>Spirit &amp; Life</span>
            <span>Read slowly. Think carefully.</span>
          </div>
        </section>

        <section className="foundation-section page-container" id="explore" aria-labelledby="library-title">
          <div className="home-section-intro">
            <div>
              <p className="eyebrow">Choose how you want to read</p>
              <h2 id="library-title">A growing library of thought.</h2>
            </div>
            <p>Different forms of writing, one purpose: to help you read carefully, ask honest questions, and keep moving toward truth.</p>
          </div>
          <div className="editorial-entry-grid">
            {libraryEntries.map((entry) => (
              <Link className="editorial-entry" href={entry.href} key={entry.number}>
                <span className="editorial-entry-number">{entry.number}</span>
                <div className="editorial-entry-body">
                  <h3>{entry.title}</h3>
                  <p>{entry.description}</p>
                </div>
                <span className="editorial-entry-action">{entry.action} <span aria-hidden="true">↗</span></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-feature page-container" aria-labelledby="featured-writing-title">
          <div className="home-section-intro home-feature-intro">
            <div>
              <p className="eyebrow">Featured writing</p>
              <h2 id="featured-writing-title">One of each, to begin.</h2>
            </div>
            <Link className="section-arrow-link" href="/articles">View all articles <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="home-writing-grid">
            {featuredArticle ? <article className="home-writing-card home-article-card">
              {typeof featuredArticle.body.image === "string" && featuredArticle.body.image ? <Link className="home-writing-card-image" href={`/articles/${featuredArticle.slug}`}>
                <Image src={featuredArticle.body.image} alt={featuredArticle.title} width={1280} height={853} sizes="(max-width: 720px) 100vw, 33vw" />
              </Link> : null}
              <div className="home-writing-card-body">
                <p className="content-card-label">Article · {featuredArticle.category ?? "Article"}</p>
                <h3><Link href={`/articles/${featuredArticle.slug}`}>{featuredArticle.title}</Link></h3>
                {featuredArticle.introduction ? <p>{featuredArticle.introduction}</p> : null}
                <p className="home-card-meta-single">{typeof featuredArticle.body.date === "string" ? featuredArticle.body.date : ""}{typeof featuredArticle.body.readingTime === "string" && featuredArticle.body.readingTime ? ` · ${featuredArticle.body.readingTime}` : ""}</p>
                <Link className="content-card-link" href={`/articles/${featuredArticle.slug}`}>Read article <span aria-hidden="true">→</span></Link>
              </div>
            </article> : <article className="home-writing-card"><div className="home-writing-card-body"><p className="empty-state">Articles will appear here when one is published.</p></div></article>}

            {homepageReflections[0] ? <article className="home-writing-card home-reflection-feature-card">
              <Link className="home-writing-card-image" href={`/reflections/${homepageReflections[0].contentSlug}`}>
                <Image src={homepageReflections[0].image} alt={homepageReflections[0].title} width={1280} height={853} sizes="(max-width: 720px) 100vw, 33vw" />
              </Link>
              <div className="home-writing-card-body">
                <p className="content-card-label">Reflection · {homepageReflections[0].category}</p>
                <h3><Link href={`/reflections/${homepageReflections[0].contentSlug}`}>{homepageReflections[0].title}</Link></h3>
                <p className="scripture-reference">{homepageReflections[0].scripture}</p>
                <p>{homepageReflections[0].introduction}</p>
                <Link className="content-card-link" href={`/reflections/${homepageReflections[0].contentSlug}`}>Read reflection <span aria-hidden="true">→</span></Link>
              </div>
            </article> : null}

            {featuredJournal ? <article className="home-writing-card home-journal-feature-card">
              <Link className="home-writing-card-image" href={`/journals/${featuredJournal.contentSlug}`}>
                <Image src={featuredJournal.image} alt={featuredJournal.title} width={1280} height={853} sizes="(max-width: 720px) 100vw, 33vw" />
              </Link>
              <div className="home-writing-card-body">
                <p className="content-card-label">Journal · {featuredJournal.date}</p>
                <h3><Link href={`/journals/${featuredJournal.contentSlug}`}>{featuredJournal.title}</Link></h3>
                <p>{featuredJournal.introduction}</p>
                <Link className="content-card-link" href={`/journals/${featuredJournal.contentSlug}`}>Read entry <span aria-hidden="true">→</span></Link>
              </div>
            </article> : null}
          </div>
        </section>

        <section className="home-companion-section page-container" aria-label="Journal and today’s study">
          <article className="home-companion-panel home-study-panel">
            <div className="home-panel-heading"><p className="eyebrow">Today&apos;s Study</p><span aria-hidden="true">01</span></div>
            <h2>Stay with the text.</h2>
            {todayStudy ? <div className="home-study-card">
              <p className="content-card-label">{todayStudy.weekday} · {todayStudy.date}</p>
              <h3>{todayStudy.weekTitle}</h3>
              <p className="scripture-reference">{todayStudy.passage}</p>
              <p>{todayStudy.focus}</p>
              <div className="home-study-prompt"><span>Today&apos;s question</span><p>{todayStudy.reflection}</p></div>
              <Link className="content-card-link" href={`/study-center/${todayStudy.date}`}>Begin today&apos;s study <span aria-hidden="true">→</span></Link>
            </div> : <p className="empty-state">Today&apos;s study will appear here when a Study Center entry is available.</p>}
          </article>
          <article className="home-companion-panel home-journal-panel">
            <div className="home-panel-heading"><p className="eyebrow">Keep reading</p><span aria-hidden="true">02</span></div>
            <h2>There is more to explore.</h2>
            <p className="home-companion-copy">Move between Articles, Reflections, Journals and Books, or continue with Scripture in the Study Center.</p>
            <div className="home-companion-links">
              <Link href="/articles">Articles <span aria-hidden="true">↗</span></Link>
              <Link href="/reflections">Reflections <span aria-hidden="true">↗</span></Link>
              <Link href="/journals">Journals <span aria-hidden="true">↗</span></Link>
              <Link href="/books">Books <span aria-hidden="true">↗</span></Link>
              <Link href="/study-center">Study Center <span aria-hidden="true">↗</span></Link>
            </div>
          </article>
        </section>

        {featuredBook ? <section className="home-feature home-book-feature page-container" aria-labelledby="featured-book-title">
          <div className="home-section-intro">
            <div><p className="eyebrow">From the library</p><h2 id="featured-book-title">Read beyond the page.</h2></div>
            <Link className="section-arrow-link" href="/books">Explore books <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="feature-split feature-split-book">
            <div className="book-cover-wrap">
              {featuredBook.cover ? <Image src={featuredBook.cover} alt={featuredBook.title} width={700} height={960} sizes="(max-width: 760px) 70vw, 22rem" /> : <div className="book-cover-placeholder"><span>Spirit &amp; Life</span></div>}
            </div>
            <div className="feature-copy">
              <p className="book-feature-number">04 / BOOK</p>
              <h3>{featuredBook.title}</h3>
              <p className="eyebrow">{featuredBook.category ?? "Book"}</p>
              <p>{featuredBook.description ?? "A growing collection of careful, Scripture-centered writing for readers who want to think deeply and live faithfully."}</p>
              <Button href="/books">Explore the library</Button>
            </div>
          </div>
        </section> : <section className="home-feature home-book-feature page-container"><SectionHeading eyebrow="From the library" title="Read beyond the page." /><p className="empty-state">Featured books will appear here when they are added to the library.</p></section>}

        <HomeNewsletterSection />
      </main>

      <style>{`
        .home-page { --home-width: min(100% - 3rem, 78rem); background: var(--background); }
        .home-page .hero { position: relative; min-height: min(760px, 92vh); display: flex; align-items: center; overflow: hidden; padding: clamp(5rem, 9vw, 8rem) max(1.5rem, calc((100% - 78rem) / 2)); border-bottom: 1px solid var(--line); }
        .home-page .hero::after { content: ""; position: absolute; inset: auto 0 0; height: 28%; background: linear-gradient(to top, color-mix(in srgb, var(--background) 18%, transparent), transparent); pointer-events: none; }
        .home-page .hero-copy { position: relative; z-index: 2; width: min(100%, 78rem); margin-inline: auto; padding-right: min(43%, 32rem); text-align: left; }
        .home-page .hero-logo { width: 4.25rem; height: 3.5rem; margin: 0 0 1.35rem; object-fit: contain; }
        .home-page .hero h1 { margin: 0 0 .75rem; font-size: clamp(4rem, 8vw, 7.5rem); letter-spacing: -.055em; line-height: .86; }
        .home-page .hero-thesis { max-width: 34rem; margin: 0 0 1.35rem; font-family: var(--font-serif, Georgia, serif); font-size: clamp(1.55rem, 2.6vw, 2.45rem); font-weight: 400; line-height: 1.08; letter-spacing: -.025em; }
        .home-page .hero-introduction { max-width: 34rem; margin: 0; font-size: clamp(1rem, 1.35vw, 1.14rem); line-height: 1.65; }
        .home-page .hero-actions { justify-content: flex-start; margin-top: 2rem; gap: .75rem; }
        .home-page .hero-scroll-link { display: inline-flex; align-items: center; gap: .65rem; margin-top: 2.5rem; color: inherit; font-size: .74rem; font-weight: 700; letter-spacing: .13em; text-transform: uppercase; opacity: .72; }
        .home-page .hero-scroll-link span { font-size: 1rem; }
        .home-page .hero-side-note { position: absolute; z-index: 2; right: max(1.5rem, calc((100% - 78rem) / 2)); bottom: 2.25rem; display: grid; gap: .35rem; max-width: 11rem; color: var(--muted); font-size: .68rem; letter-spacing: .1em; line-height: 1.4; text-align: right; text-transform: uppercase; }
        .home-page .foundation-section, .home-page .home-feature, .home-page .home-companion-section { width: var(--home-width); }
        .home-page .foundation-section { padding-block: clamp(5.5rem, 9vw, 8rem); }
        .home-page .home-section-intro { display: flex; align-items: end; justify-content: space-between; gap: 2rem; margin-bottom: 2.75rem; }
        .home-page .home-section-intro > div { max-width: 48rem; }
        .home-page .home-section-intro h2 { margin: 0; font-size: clamp(2.5rem, 5vw, 4.8rem); line-height: .94; letter-spacing: -.045em; }
        .home-page .home-section-intro > p { max-width: 27rem; margin: 0 0 .2rem; color: var(--muted); line-height: 1.7; }
        .home-page .editorial-entry-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: 1px solid var(--line); }
        .home-page .editorial-entry { position: relative; display: grid; grid-template-columns: 2.4rem minmax(0, 1fr); gap: 1rem; min-height: 15.5rem; padding: 1.5rem 1.4rem 1.4rem; color: inherit; border-bottom: 1px solid var(--line); transition: background .25s ease, transform .25s ease; }
        .home-page .editorial-entry:nth-child(odd) { border-right: 1px solid var(--line); }
        .home-page .editorial-entry:hover { background: color-mix(in srgb, var(--surface) 70%, transparent); transform: translateY(-2px); }
        .home-page .editorial-entry-number { color: var(--accent); font-size: .7rem; font-weight: 800; letter-spacing: .1em; }
        .home-page .editorial-entry-body h3 { margin: 0 0 .7rem; font-size: clamp(1.8rem, 3vw, 2.7rem); line-height: .96; letter-spacing: -.035em; }
        .home-page .editorial-entry-body p { max-width: 29rem; margin: 0; color: var(--muted); line-height: 1.65; }
        .home-page .editorial-entry-action { position: absolute; right: 1.4rem; bottom: 1.35rem; color: var(--accent); font-size: .7rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
        .home-page .home-feature { padding-block: clamp(5rem, 8vw, 7rem); border-top: 1px solid var(--line); }
        .home-page .home-feature-intro { align-items: center; }
        .home-page .section-arrow-link { flex: 0 0 auto; color: var(--accent); font-size: .75rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
        .home-page .home-writing-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.25rem; align-items: stretch; }
        .home-page .home-writing-card { overflow: hidden; min-width: 0; border: 1px solid var(--line); border-radius: .18rem; background: var(--surface); box-shadow: 0 1rem 2.4rem var(--shadow); }
        .home-page .home-writing-card-image { display: block; aspect-ratio: 16 / 9; overflow: hidden; background: var(--surface-muted); }
        .home-page .home-writing-card-image img { width: 100%; height: 100%; display: block; object-fit: cover; transition: transform 500ms ease; }
        .home-page .home-writing-card:hover img { transform: scale(1.035); }
        .home-page .home-writing-card-body { min-height: 15rem; padding: 1.5rem; }
        .home-page .home-writing-card-body h3 { margin: .45rem 0 .8rem; font-size: clamp(1.55rem, 2.6vw, 2.35rem); line-height: .98; letter-spacing: -.03em; }
        .home-page .home-writing-card-body > p:not(.content-card-label):not(.home-card-meta-single):not(.scripture-reference) { color: var(--muted); line-height: 1.65; }
        .home-page .home-card-meta-single { margin-top: .85rem; color: var(--muted); font-size: .7rem; }
        .home-page .content-card-link { display: inline-flex; gap: .4rem; align-items: center; margin-top: 1rem; font-size: .72rem; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; }
        .home-page .home-companion-section { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; padding-block: 0 clamp(5rem, 8vw, 7rem); }
        .home-page .home-companion-panel { min-width: 0; padding: clamp(1.35rem, 2.5vw, 2rem); border: 1px solid var(--line); background: color-mix(in srgb, var(--background) 72%, var(--surface)); }
        .home-page .home-panel-heading { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
        .home-page .home-panel-heading > span { color: var(--accent); font-size: .7rem; font-weight: 800; }
        .home-page .home-companion-panel > h2 { max-width: 25rem; margin: 0 0 1.5rem; font-size: clamp(2rem, 3.5vw, 3.3rem); line-height: .94; letter-spacing: -.04em; }
        .home-page .home-study-panel { display: flex; flex-direction: column; }
        .home-page .home-study-card { flex: 1; padding: clamp(1.35rem, 2.5vw, 2rem); overflow: hidden; border: 1px solid var(--line); border-radius: .18rem; background: var(--surface); box-shadow: none; }
        .home-page .home-study-prompt { margin: 1.5rem 0; padding: 1rem 0 0; border-top: 1px solid var(--line); }
        .home-page .home-study-prompt > span { color: var(--accent); font-size: .68rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
        .home-page .home-study-prompt p { margin: .55rem 0 0; font-family: var(--font-serif, Georgia, serif); font-size: 1.08rem; line-height: 1.5; }
        .home-page .home-companion-copy { max-width: 34rem; color: var(--muted); line-height: 1.7; }
        .home-page .home-companion-links { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); margin-top: 1.5rem; border-top: 1px solid var(--line); }
        .home-page .home-companion-links a { display: flex; justify-content: space-between; gap: 1rem; padding: .9rem 0; color: inherit; border-bottom: 1px solid var(--line); font-size: .8rem; font-weight: 700; }
        .home-page .home-companion-links a:nth-child(odd) { padding-right: 1rem; border-right: 1px solid var(--line); }
        .home-page .home-companion-links a:nth-child(even) { padding-left: 1rem; }
        .home-page .home-book-feature { padding-top: clamp(5rem, 8vw, 7rem); }
        .home-page .feature-split-book { display: grid; grid-template-columns: minmax(11rem, 18rem) minmax(0, 1fr); align-items: center; gap: clamp(2rem, 6vw, 5rem); padding: clamp(1.5rem, 3vw, 2.75rem); border: 1px solid var(--line); background: var(--surface); box-shadow: 0 1rem 2.5rem var(--shadow); }
        .home-page .book-cover-wrap { display: flex; justify-content: center; }
        .home-page .book-cover-wrap img { width: min(100%, 18rem); height: auto; display: block; box-shadow: 0 1.2rem 2.5rem rgba(0,0,0,.32); }
        .home-page .book-feature-number { margin-bottom: 1rem; color: var(--accent); font-size: .7rem; font-weight: 800; letter-spacing: .12em; }
        .home-page .feature-copy h3 { margin-bottom: .8rem; font-size: clamp(2.2rem, 4.5vw, 4.4rem); line-height: .92; letter-spacing: -.05em; }
        .home-page .feature-copy > p:not(.eyebrow):not(.book-feature-number) { max-width: 42rem; margin-bottom: 1.5rem; color: var(--muted); line-height: 1.7; }
        .home-page .newsletter-section { width: var(--home-width); margin-inline: auto; padding-block: clamp(3.5rem, 6vw, 5rem); }
        @media (max-width: 900px) {
          .home-page .hero-copy { padding-right: 22%; }
          .home-page .editorial-entry-grid { grid-template-columns: 1fr; }
          .home-page .editorial-entry:nth-child(odd) { border-right: 0; }
          .home-page .home-writing-grid, .home-page .home-companion-section { grid-template-columns: 1fr; }
        }
        @media (max-width: 720px) {
          .home-page { --home-width: min(100% - 1.5rem, 44rem); }
          .home-page .hero { min-height: auto; padding-block: 4rem 4.5rem; background-position: 62% center; }
          .home-page .hero-copy { padding-right: 0; text-align: center; }
          .home-page .hero-logo { width: 4rem; height: 3.25rem; margin-inline: auto; }
          .home-page .hero-thesis, .home-page .hero-introduction { margin-inline: auto; }
          .home-page .hero-actions { justify-content: center; }
          .home-page .hero-scroll-link { justify-content: center; }
          .home-page .hero-side-note { display: none; }
          .home-page .home-section-intro { display: block; }
          .home-page .home-section-intro > p { margin-top: 1rem; }
          .home-page .section-arrow-link { display: inline-block; margin-top: 1.25rem; }
          .home-page .editorial-entry { min-height: 13rem; }
          .home-page .feature-split-book { grid-template-columns: 1fr; gap: 2rem; }
          .home-page .book-cover-wrap img { width: min(68vw, 17rem); }
          .home-page .feature-copy { text-align: center; }
          .home-page .feature-copy .eyebrow { margin-top: 1rem; }
          .home-page .home-companion-panel { padding: 1.2rem; }
          .home-page .home-companion-links { grid-template-columns: 1fr; }
          .home-page .home-companion-links a:nth-child(odd) { padding-right: 0; border-right: 0; }
          .home-page .home-companion-links a:nth-child(even) { padding-left: 0; }
        }
        @media (max-width: 480px) {
          .home-page .hero h1 { font-size: clamp(3.4rem, 17vw, 5rem); }
          .home-page .hero-actions .button { width: 100%; }
          .home-page .home-writing-card-body, .home-page .home-study-card { padding: 1.2rem; }
          .home-page .editorial-entry-action { position: static; grid-column: 2; margin-top: .75rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .home-page .editorial-entry, .home-page .home-writing-card-image img { transition: none; }
        }
      `}</style>
    </div>
  );
}