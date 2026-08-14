import { Button } from "@/app/components/button";
import { ContentCard } from "@/app/components/content-card";
import { SectionHeading } from "@/app/components/section-heading";
import { getFeaturedBook, getFeaturedReflection } from "@/app/content/featured";
import { siteConfig } from "@/app/content/site-config";
import Link from "next/link";
import Image from "next/image";
import { HomeNewsletterSection } from "@/app/home-newsletter-section";

export default async function Home() {
  const featuredReflection = await getFeaturedReflection();
  const featuredBook = getFeaturedBook();

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

        <section className="home-feature page-container" aria-labelledby="featured-reflection-title">
          <SectionHeading eyebrow="Featured Reflection" title="A place to begin" />
          <div className="feature-split">
            <Image src={featuredReflection.image} alt={featuredReflection.title} width={1280} height={853} sizes="(max-width: 760px) 100vw, 50vw" />
            <div className="feature-copy">
              <p className="eyebrow">{featuredReflection.category}</p>
              <h2 id="featured-reflection-title">{featuredReflection.title}</h2>
              <p className="scripture-reference">{featuredReflection.scripture}</p>
              <p>{featuredReflection.introduction}</p>
              <div className="feature-action"><Button href={`/reflections/${featuredReflection.contentSlug}`}>Read More</Button><span>{featuredReflection.readingTime}</span></div>
            </div>
          </div>
          <Link className="quiet-link" href="/reflections">View All Reflections <span aria-hidden="true">→</span></Link>
        </section>

        <section className="home-feature home-book-feature page-container" aria-labelledby="featured-book-title">
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
        </section>

        <HomeNewsletterSection />
      </main>
    </div>
  );
}
