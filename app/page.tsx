import { Button } from "@/app/components/button";
import { ContentCard } from "@/app/components/content-card";
import { SectionHeading } from "@/app/components/section-heading";
import { books } from "@/app/data/books";
import { reflections } from "@/app/data/reflections";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const featuredReflection = reflections[0];
  const featuredBook = books.find((book) => book.contentSlug === "thy-word-is-truth-a-journey-through-john-17") ?? books[0];

  return (
    <div className="site-frame home-page">
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-backdrop" />
          <div className="hero-copy">
            <Image
              className="hero-logo"
              src="/spiri_life_logo.jpg"
              alt="Spirit & Life"
              width={1280}
              height={853}
              priority
            />
            <p className="eyebrow">Thoughtful writing · Honest questions · Timeless truth</p>
            <h1 id="hero-title">Spirit &amp; Life</h1>
            <p className="hero-introduction">A place where Scripture, thoughtful reflection, and careful reasoning come together.</p>
            <p className="hero-supporting">Here you will find reflections, journals, biblical studies, and books written to encourage faith, deepen understanding, and cultivate a lifelong pursuit of truth.</p>
            <p className="hero-supporting">Whether you are reading quietly, studying carefully, or wrestling with difficult questions, there is room here to stay with the text.</p>
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
              Thoughtful writings exploring Scripture, theology, philosophy, apologetics, and Christian living.
            </ContentCard>
            <ContentCard label="02" title="Journals" href="/journals" action="Explore Journals">
              Personal observations, lessons learned, and reflections gathered through study and life.
            </ContentCard>
            <ContentCard label="03" title="Books" href="/books" action="Explore Books">
              Published and future writing projects exploring important biblical themes and questions.
            </ContentCard>
            <ContentCard label="04" title="Study Center" href="/study-center" action="Enter Study Center">
              Guided Bible study plans and practical learning resources for consistent study.
            </ContentCard>
          </div>
        </section>

        <section className="home-feature page-container" aria-labelledby="featured-reflection-title">
          <SectionHeading eyebrow="Featured Reflection" title="A place to begin" />
          <div className="feature-split">
            <Image src={featuredReflection.image} alt="" width={1280} height={853} sizes="(max-width: 760px) 100vw, 50vw" />
            <div className="feature-copy">
              <p className="eyebrow">{featuredReflection.category}</p>
              <h2 id="featured-reflection-title">{featuredReflection.title}</h2>
              <p className="scripture-reference">{featuredReflection.scripture}</p>
              <p>{featuredReflection.introduction}</p>
              <div className="feature-action"><Button href={`/reflections/${featuredReflection.contentSlug}`}>Read More</Button><span>{featuredReflection.readingTime}</span></div>
            </div>
          </div>
          <Link className="quiet-link" href="/reflections">View all reflections <span>→</span></Link>
        </section>

        <section className="home-feature home-book-feature page-container" aria-labelledby="featured-book-title">
          <SectionHeading eyebrow="Featured Book" title="From the Library" />
          <div className="feature-split feature-split-book">
            <div className="book-cover-wrap">
              {featuredBook.cover ? <Image src={featuredBook.cover} alt={featuredBook.title} width={700} height={960} sizes="(max-width: 760px) 70vw, 22rem" /> : <div className="book-cover-placeholder"><span>Spirit &amp; Life</span></div>}
            </div>
            <div className="feature-copy">
              <h2 id="featured-book-title">{featuredBook.title}</h2>
              <p className="eyebrow">Biblical Studies</p>
              <p>{featuredBook.description ?? "A growing collection of careful, Scripture-centered writing for readers who want to think deeply and live faithfully."}</p>
              <Button href={`/books/${featuredBook.contentSlug}`}>Learn More</Button>
            </div>
          </div>
        </section>

        <section className="newsletter-section page-container" aria-labelledby="newsletter-title">
          <div>
            <p className="eyebrow">Newsletter</p>
            <h2 id="newsletter-title">Stay Connected</h2>
            <p>Receive new reflections, biblical studies, and occasional notes from Spirit &amp; Life.</p>
          </div>
          <form className="newsletter-form">
            <label htmlFor="email">Email address</label>
            <div className="newsletter-field">
              <input id="email" name="email" type="email" placeholder="you@example.com" />
              <Button type="submit">Subscribe</Button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
