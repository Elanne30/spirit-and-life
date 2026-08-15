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
    </div>
  );
}
