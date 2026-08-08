import { Button } from "@/app/components/button";
import { ContentCard } from "@/app/components/content-card";
import { SectionHeading } from "@/app/components/section-heading";

export default function Home() {
  return (
    <div className="site-frame">
      <main>
        <section className="hero page-container" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">A place for attentive faith</p>
            <h1 id="hero-title">Read deeply. Live faithfully.</h1>
            <p className="hero-introduction">
              Spirit &amp; Life is a growing home for Christian reflection,
              personal journals, digital books, and thoughtful Bible study.
            </p>
            <div className="hero-actions">
              <Button href="#explore">Explore Spirit &amp; Life</Button>
              <Button href="#about" variant="text">
                Learn about the project
              </Button>
            </div>
          </div>
          <div className="hero-mark" aria-hidden="true">
            <span>Spirit</span>
            <span>&amp; Life</span>
          </div>
        </section>

        <section className="foundation-section page-container" id="explore">
          <SectionHeading
            eyebrow="The foundation"
            title="One connected place for reading and study."
            description="The platform is being shaped around four ways of staying close to what matters: considered writing, honest reflection, long-form reading, and Scripture-centered study."
          />
          <div className="content-grid">
            <ContentCard label="01" title="Reflections">
              Long-form Christian writing for patient attention.
            </ContentCard>
            <ContentCard label="02" title="Journals">
              Shorter entries with a more immediate, personal voice.
            </ContentCard>
            <ContentCard label="03" title="Books">
              A digital library designed for comfortable reading.
            </ContentCard>
            <ContentCard label="04" title="Study Center">
              A clear home for Bible study and reading plans.
            </ContentCard>
          </div>
        </section>

        <section className="invitation-section page-container" id="about">
          <p className="eyebrow">The work ahead</p>
          <h2>Content that belongs together.</h2>
          <p>
            Every part of Spirit &amp; Life will help lead naturally to the
            next: from writing to Scripture, from Scripture to study, and back
            into a life of attentive reading.
          </p>
        </section>
      </main>
    </div>
  );
}
