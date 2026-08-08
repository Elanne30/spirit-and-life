import { Button } from "@/app/components/button";
import { ContentCard } from "@/app/components/content-card";
import { SectionHeading } from "@/app/components/section-heading";
import Image from "next/image";

export default function Home() {
  return (
    <div className="site-frame">
      <main>
        <section className="hero page-container" aria-labelledby="hero-title">
          <div className="hero-copy">
            <Image
              className="hero-logo"
              src="/spiri_life_logo.jpg"
              alt="Spirit & Life"
              width={1280}
              height={853}
              priority
            />
            <p className="eyebrow">Thoughtful writing, honest questions, timeless truths.</p>
            <h1 id="hero-title">Welcome to Spirit &amp; Life</h1>
            <p className="hero-introduction">
              A place where Scripture, thoughtful reflection, and the life of
              faith come together.
            </p>
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
            eyebrow="The foundation"
            title="One connected place for reading and studying."
            description="Spirit & Life is not simply a collection of separate pages. Reading, reflection, Scripture exploration, books, journals, and study resources belong to one connected experience."
          />
          <div className="content-grid">
            <ContentCard label="01" title="Reflections" href="/reflections" action="Explore Reflections">
              Long-form Christian writing for patient attention.
            </ContentCard>
            <ContentCard label="02" title="Journals" href="/journals" action="Explore Journals">
              Shorter entries with a more immediate, personal voice.
            </ContentCard>
            <ContentCard label="03" title="Books" href="/books" action="Explore Books">
              A digital library designed for comfortable reading.
            </ContentCard>
            <ContentCard label="04" title="Study Center" href="/study-center" action="Enter Study Center">
              A clear home for Bible study and reading plans.
            </ContentCard>
          </div>
        </section>

        <section className="walk-section page-container" id="about">
          <p className="eyebrow">The Walk Ahead</p>
          <h2>A continuing practice of attention.</h2>
          <p>
            There is always more to read, more to consider, and more to bring
            before Scripture. Spirit &amp; Life is being built for that steady
            movement: reading, reflection, study, and growth over time.
          </p>
        </section>

        <section className="newsletter-section page-container" aria-labelledby="newsletter-title">
          <div>
            <p className="eyebrow">Stay Connected</p>
            <h2 id="newsletter-title">A quiet note when something new is ready.</h2>
            <p>Join the list for occasional updates on new writing, journals, books, and study resources.</p>
          </div>
          <form className="newsletter-form">
            <label htmlFor="email">Email address</label>
            <div className="newsletter-field">
              <input id="email" name="email" type="email" placeholder="you@example.com" />
              <Button type="submit">Subscribe</Button>
            </div>
            <p className="form-note">Newsletter delivery will be connected in a later phase.</p>
          </form>
        </section>
      </main>
    </div>
  );
}
