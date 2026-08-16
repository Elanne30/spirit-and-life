import { Button } from "@/app/components/button";
import { ContentCard } from "@/app/components/content-card";
import { SectionHeading } from "@/app/components/section-heading";
import { getFeaturedBook } from "@/app/content/featured";
import { listPublishedJournals, listPublishedReflections } from "@/app/content/repository";
import { getStudyByDate } from "@/app/data/study-plan";
import { siteConfig } from "@/app/content/site-config";
import Link from "next/link";
import Image from "next/image";
import { HomeNewsletterSection } from "@/app/home-newsletter-section";

export default async function Home() {
  const [reflections, journals, featuredBook] = await Promise.all([
    listPublishedReflections(),
    listPublishedJournals(),
    getFeaturedBook(),
  ]);
  const homepageReflections = [
    ...reflections.filter((reflection) => reflection.featured),
    ...reflections.filter((reflection) => !reflection.featured),
  ].slice(0, 2);
  const featuredJournal = journals[0];
  const todayStudy = getStudyByDate(new Date().toISOString().slice(0, 10));

  return (
    <div className="site-frame home-page">
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-backdrop" />
          <div className="hero-copy">
            <Image
              className="hero-logo"
              src={siteConfig.brand.logo}
              alt="Spirit & Life"
              width={616}
              height={496}
              priority
            />
            <p className="eyebrow">Thoughtful Writing. Honest Questions. Timeless Truth.</p>
            <h1 id="hero-title">Spirit &amp; Life</h1>
            <p className="hero-introduction">Welcome to Spirit &amp; Life, a place where Scripture, thoughtful reflection, and careful reasoning come together.</p>
            <p className="hero-supporting">Here I share reflections, journals, biblical studies, and books written to encourage faith, deepen understanding, and cultivate a lifelong pursuit of truth.</p>
            <p className="hero-supporting">Whether you are reading quietly, studying carefully, or wrestling with difficult questions, I hope you will find resources here that encourage thoughtful engagement with God&apos;s Word.</p>
            <div className="hero-actions">
              <Button href="/reflections">Begin Reading</Button>
              <Button href="/study-center" variant="secondary">
                Enter Study Center
              </Button>
            </div>
          </div>
        </section>

        <section className="foundation-section page-container" id="explore">
          <SectionHeading
            eyebrow="What you will find here"
            title="A Growing Digital Library"
            description="Each section of Spirit & Life serves a distinct purpose within a connected reading experience."
          />
          <div className="content-grid">
            <ContentCard label="01" title="Reflections" href="/reflections" action="Explore Reflections">
              Thoughtful articles exploring Scripture, theology, philosophy, and Christian living.
            </ContentCard>
            <ContentCard label="02" title="Journals" href="/journals" action="Read Journals">
              Personal observations, lessons, and reflections gathered through study and life.
            </ContentCard>
            <ContentCard label="03" title="Books" href="/books" action="Browse Books">
              Published and future writing projects exploring important biblical themes and questions.
            </ContentCard>
            <ContentCard label="04" title="Study Center" href="/study-center" action="Open Study Center">
              Guided Bible study plans and structured learning resources.
            </ContentCard>
          </div>
        </section>

        <section className="home-feature page-container" aria-labelledby="home-reflections-title">
          <SectionHeading eyebrow="Reflections" title="A place to begin" />
          {homepageReflections.length ? <><div className="reflection-grid home-reflection-grid">
            {homepageReflections.map((reflection) => (
              <article className="reflection-card" key={reflection.contentSlug}>
                <Link className="reflection-card-image" href={`/reflections/${reflection.contentSlug}`}>
                  <Image src={reflection.image} alt={reflection.title} width={1280} height={853} sizes="(max-width: 720px) 100vw, 50vw" />
                </Link>
                <div className="reflection-card-body">
                  <p className="content-card-label">{reflection.category}</p>
                  <h2 id={reflection === homepageReflections[0] ? "home-reflections-title" : undefined}><Link href={`/reflections/${reflection.contentSlug}`}>{reflection.title}</Link></h2>
                  <p className="scripture-reference">{reflection.scripture}</p>
                  <p>{reflection.introduction}</p>
                  <p className="card-reading-time">{reflection.readingTime}</p>
                  <Link className="content-card-link" href={`/reflections/${reflection.contentSlug}`}>Read More →</Link>
                </div>
              </article>
            ))}
          </div><Link className="quiet-link" href="/reflections">View All Reflections <span aria-hidden="true">→</span></Link></> : <p className="empty-state">Reflections will appear here when they are published.</p>}
        </section>

        <section className="home-companion-section page-container" aria-label="Journal and today’s study">
          <article className="home-companion-panel">
            <p className="eyebrow">Journal</p>
            <h2>From the journal</h2>
            {featuredJournal ? <article className="journal-card">
              <Link className="journal-card-image" href={`/journals/${featuredJournal.contentSlug}`}>
                <Image src={featuredJournal.image} alt={featuredJournal.title} width={1280} height={853} sizes="(max-width: 720px) 100vw, 50vw" />
              </Link>
              <div className="journal-card-body">
                <p className="content-card-label">{featuredJournal.date}</p>
                <h3><Link href={`/journals/${featuredJournal.contentSlug}`}>{featuredJournal.title}</Link></h3>
                <p>{featuredJournal.introduction}</p>
                <Link className="content-card-link" href={`/journals/${featuredJournal.contentSlug}`}>Read Entry →</Link>
              </div>
            </article> : <p className="empty-state">Journal entries will appear here when they are published.</p>}
          </article>
          <article className="home-companion-panel home-study-panel">
            <p className="eyebrow">Today&apos;s Study</p>
            <h2>Stay with the text.</h2>
            {todayStudy ? <div className="home-study-card">
              <p className="content-card-label">{todayStudy.weekday}</p>
              <p className="home-study-date">{todayStudy.date}</p>
              <h3>{todayStudy.weekTitle}</h3>
              <p className="scripture-reference">{todayStudy.passage}</p>
              <p>{todayStudy.focus}</p>
              <Link className="content-card-link" href={`/study-center/${todayStudy.date}`}>Begin Today&apos;s Study →</Link>
            </div> : <p className="empty-state">Today&apos;s study will appear here when a Study Center entry is available.</p>}
          </article>
        </section>

        {featuredBook ? <section className="home-feature home-book-feature page-container" aria-labelledby="featured-book-title">
          <SectionHeading eyebrow="Featured Book" title="From the Library" />
          <div className="feature-split feature-split-book">
            <div className="book-cover-wrap">
              {featuredBook.cover ? <Image src={featuredBook.cover} alt={featuredBook.title} width={700} height={960} sizes="(max-width: 760px) 70vw, 22rem" /> : <div className="book-cover-placeholder"><span>Spirit &amp; Life</span></div>}
            </div>
            <div className="feature-copy">
              <h2 id="featured-book-title">{featuredBook.title}</h2>
              <p className="eyebrow">{featuredBook.category ?? "Book"}</p>
              <p>{featuredBook.description ?? "A growing collection of careful, Scripture-centered writing for readers who want to think deeply and live faithfully."}</p>
              <Button href={`/books/${featuredBook.contentSlug}`}>Learn More</Button>
            </div>
          </div>
        </section> : <section className="home-feature home-book-feature page-container"><SectionHeading eyebrow="Featured Book" title="From the Library" /><p className="empty-state">Featured books will appear here when they are added to the library.</p></section>}

        <HomeNewsletterSection />
      </main>

      <style>{`
        /* Homepage visual layer only. Content, links, data flow and existing functionality remain unchanged. */
        .home-page {
          --home-width: min(100% - 3rem, 78rem);
          background: var(--background);
        }

        .home-page .hero {
          min-height: clamp(38rem, 78vh, 48rem);
          padding: clamp(4rem, 8vw, 7rem) max(1.5rem, calc((100% - 78rem) / 2));
          background-position: center;
          border-bottom: 1px solid var(--line);
        }

        .home-page .hero-copy {
          width: min(100%, 78rem);
          margin-inline: auto;
          padding-right: min(48%, 34rem);
          text-align: left;
        }

        .home-page .hero-logo {
          width: 5rem;
          height: 4rem;
          margin: 0 0 1.5rem;
          object-fit: contain;
        }

        .home-page .hero h1 {
          margin-bottom: 1.35rem;
          font-size: clamp(4rem, 7vw, 6.8rem);
          line-height: .9;
        }

        .home-page .hero-introduction {
          max-width: 38rem;
          margin: 0 0 1.25rem;
          font-size: clamp(1rem, 1.4vw, 1.18rem);
          line-height: 1.55;
        }

        .home-page .hero-supporting {
          max-width: 37rem;
          margin: 0 0 .8rem;
          color: color-mix(in srgb, #fffaf2 72%, transparent);
          font-size: .92rem;
          line-height: 1.65;
        }

        html[data-theme="light"] .home-page .hero-supporting {
          color: color-mix(in srgb, var(--foreground) 72%, transparent);
        }

        .home-page .hero-actions {
          justify-content: flex-start;
          margin-top: 1.75rem;
          gap: .8rem;
        }

        .home-page .foundation-section,
        .home-page .home-feature,
        .home-page .home-companion-section {
          width: var(--home-width);
        }

        .home-page .foundation-section {
          padding-block: clamp(5rem, 8vw, 7rem);
          border-top: 0;
        }

        .home-page .section-heading {
          margin-bottom: 2.75rem;
        }

        .home-page .section-heading h2 {
          font-size: clamp(2.35rem, 4.5vw, 4rem);
        }

        .home-page .content-grid {
          gap: 1rem;
          border: 0;
        }

        .home-page .content-card {
          min-height: 13.5rem;
          padding: 1.6rem 1.45rem !important;
          border: 1px solid var(--line) !important;
          border-radius: .2rem;
          background: var(--surface);
          box-shadow: 0 .8rem 2rem var(--shadow);
        }

        .home-page .content-card:hover {
          border-color: color-mix(in srgb, var(--accent) 48%, var(--line)) !important;
          transform: translateY(-.2rem);
        }

        .home-page .content-card h3 {
          margin-bottom: .85rem;
          font-size: 1.85rem;
        }

        .home-page .home-feature {
          padding-block: clamp(4.5rem, 7vw, 6rem);
          border-top: 1px solid var(--line);
        }

        .home-page .home-reflection-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.25rem;
        }

        .home-page .reflection-card,
        .home-page .journal-card,
        .home-page .home-study-card {
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: .2rem;
          background: var(--surface);
          box-shadow: 0 1rem 2.4rem var(--shadow);
        }

        .home-page .reflection-card-image,
        .home-page .journal-card-image {
          display: block;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: var(--surface-muted);
        }

        .home-page .reflection-card-image img,
        .home-page .journal-card-image img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform 400ms ease;
        }

        .home-page .reflection-card:hover img,
        .home-page .journal-card:hover img {
          transform: scale(1.025);
        }

        .home-page .reflection-card-body,
        .home-page .journal-card-body {
          padding: 1.5rem;
        }

        .home-page .reflection-card-body h2,
        .home-page .journal-card-body h3,
        .home-page .home-study-card h3 {
          margin-bottom: .85rem;
          font-size: clamp(1.55rem, 2.4vw, 2.2rem);
          line-height: 1.05;
        }

        .home-page .reflection-card-body > p:not(.content-card-label):not(.scripture-reference):not(.card-reading-time),
        .home-page .journal-card-body > p:not(.content-card-label),
        .home-page .home-study-card > p:not(.content-card-label):not(.home-study-date):not(.scripture-reference) {
          color: var(--muted);
        }

        .home-page .quiet-link {
          display: block;
          width: fit-content;
          margin: 1.5rem auto 0;
          color: var(--accent);
          font-size: .82rem;
          font-weight: 700;
        }

        .home-page .home-companion-section {
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(0, .92fr);
          gap: 1.25rem;
          padding-block: 0 clamp(4.5rem, 7vw, 6rem);
        }

        .home-page .home-companion-panel {
          min-width: 0;
          padding: 1.75rem;
          border: 1px solid var(--line);
          border-radius: .2rem;
          background: color-mix(in srgb, var(--background) 72%, var(--surface));
        }

        .home-page .home-companion-panel > h2 {
          margin-bottom: 1.5rem;
          font-size: clamp(2rem, 3.5vw, 3rem);
          line-height: .98;
        }

        .home-page .journal-card {
          box-shadow: none;
        }

        .home-page .home-study-panel {
          display: flex;
          flex-direction: column;
        }

        .home-page .home-study-card {
          flex: 1;
          padding: 1.6rem;
          box-shadow: none;
        }

        .home-page .home-study-date {
          margin-top: -.5rem;
          color: var(--muted);
          font-size: .82rem;
        }

        .home-page .home-book-feature {
          padding-top: clamp(4.5rem, 7vw, 6rem);
        }

        .home-page .feature-split-book {
          display: grid;
          grid-template-columns: minmax(11rem, 18rem) minmax(0, 1fr);
          align-items: center;
          gap: clamp(2rem, 6vw, 5rem);
          padding: clamp(1.5rem, 3vw, 2.75rem);
          border: 1px solid var(--line);
          border-radius: .2rem;
          background: var(--surface);
          box-shadow: 0 1rem 2.5rem var(--shadow);
        }

        .home-page .book-cover-wrap {
          display: flex;
          justify-content: center;
        }

        .home-page .book-cover-wrap img {
          width: min(100%, 18rem);
          height: auto;
          display: block;
          box-shadow: 0 1.2rem 2.5rem rgba(0,0,0,.32);
        }

        .home-page .feature-copy h2 {
          margin-bottom: .8rem;
          font-size: clamp(2rem, 4vw, 3.7rem);
          line-height: .98;
        }

        .home-page .feature-copy > p:not(.eyebrow) {
          max-width: 42rem;
          margin-bottom: 1.5rem;
          color: var(--muted);
        }

        .home-page .newsletter-section {
          width: var(--home-width);
          margin-inline: auto;
          padding-block: clamp(3.5rem, 6vw, 5rem);
        }

        @media (max-width: 900px) {
          .home-page .hero-copy {
            padding-right: 30%;
          }

          .home-page .content-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .home-page .home-companion-section {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 720px) {
          .home-page {
            --home-width: min(100% - 1.5rem, 44rem);
          }

          .home-page .hero {
            min-height: auto;
            padding-block: 4rem 4.5rem;
            background-position: 62% center;
          }

          .home-page .hero-copy {
            padding-right: 0;
            text-align: center;
          }

          .home-page .hero-logo {
            margin-inline: auto;
          }

          .home-page .hero-introduction,
          .home-page .hero-supporting {
            margin-inline: auto;
          }

          .home-page .hero-actions {
            justify-content: center;
          }

          .home-page .content-grid,
          .home-page .home-reflection-grid,
          .home-page .feature-split-book {
            grid-template-columns: 1fr;
          }

          .home-page .content-card {
            min-height: auto;
          }

          .home-page .home-companion-panel {
            padding: 1.2rem;
          }

          .home-page .feature-split-book {
            gap: 2rem;
          }

          .home-page .book-cover-wrap img {
            width: min(68vw, 17rem);
          }

          .home-page .feature-copy {
            text-align: center;
          }

          .home-page .feature-copy .eyebrow {
            margin-top: 1rem;
          }

          .home-page .newsletter-section {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        @media (max-width: 480px) {
          .home-page .hero h1 {
            font-size: clamp(3.2rem, 15vw, 4.5rem);
          }

          .home-page .hero-actions .button {
            width: 100%;
          }

          .home-page .reflection-card-body,
          .home-page .journal-card-body,
          .home-page .home-study-card {
            padding: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
}
