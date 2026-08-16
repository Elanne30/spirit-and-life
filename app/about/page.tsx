import Image from "next/image";
import type { Metadata } from "next";
import { Button } from "@/app/components/button";
import { pageMetadata } from "@/app/content/seo";

export const metadata: Metadata = pageMetadata(
  "About",
  "Learn about Spirit & Life's purpose, approach to Scripture, and commitment to thoughtful Christian writing.",
  "/about",
);

export default function AboutPage() {
  return (
    <main className="about-main">
      <section className="page-intro page-container about-hero">
        <p className="eyebrow">About Spirit &amp; Life</p>
        <h1>A Library of Reflective Truths</h1>
        <p>A personal place for careful reading, honest questions, and thoughtful reflection.</p>
      </section>

      <section className="about-introduction">
        <div className="about-portrait-wrap">
          <Image className="about-portrait" src="/images/public_image_about_portrait.jpg" alt="Oluwaseun reading and writing beside an open Bible in a library" width={1024} height={1280} priority />
        </div>
        <div className="about-copy">
          <p className="eyebrow">Why I Created Spirit &amp; Life</p>
          <h2>Careful reading. Honest questions. Thoughtful reflection.</h2>
          <p>I created Spirit &amp; Life because I believe Scripture deserves careful reading, honest questions, and thoughtful reflection.</p>
          <p>My goal is not simply to publish articles, but to encourage readers to slow down, examine the biblical text carefully, and pursue truth with humility.</p>
          <p>I want this platform to be a place where thoughtful writing, careful reasoning, and biblical study come together in a way that encourages both the heart and the mind.</p>
        </div>
      </section>

      <section className="about-philosophy page-container" aria-label="Editorial philosophy">
        <article className="about-philosophy-section"><p className="eyebrow">My Approach</p><h2>Begin with the biblical text.</h2><p>Every piece of writing begins with the biblical text.</p><p>I seek to understand what Scripture says before asking what it means for us today.</p><p>I believe faithful application begins with faithful understanding, so I strive to read passages in context, reason carefully, and avoid forcing conclusions onto the text.</p></article>
        <article className="about-philosophy-section"><p className="eyebrow">Questions Are Welcome</p><h2>Truth has nothing to fear from careful examination.</h2><p>I do not believe honest questions weaken faith.</p><p>Many of the most meaningful discoveries begin with sincere curiosity.</p><p>I want Spirit &amp; Life to be a place where readers feel free to ask difficult questions, knowing that truth has nothing to fear from careful examination.</p></article>
        <article className="about-philosophy-section"><p className="eyebrow">Faith and Reason</p><h2>Faith and reason work together.</h2><p>I believe faith and reason work together.</p><p>Reason helps me examine ideas carefully, while faith calls me to trust God and live according to His Word.</p><p>For that reason, I aim to write in a way that is both biblically grounded and intellectually honest.</p></article>
        <article className="about-philosophy-section"><p className="eyebrow">Humility</p><h2>Remain teachable. Let Scripture have the final word.</h2><p>I recognize that faithful Christians do not always agree on every passage or theological question.</p><p>Where differences exist, I want to represent differing views fairly, remain teachable, and let Scripture have the final word.</p></article>
      </section>

      <section className="about-commitment page-container">
        <div><p className="eyebrow">My Commitment</p><h2>Writing worth reading carefully.</h2></div>
        <ul><li>Faithful to Scripture.</li><li>Thoughtfully reasoned.</li><li>Clearly written.</li><li>Honest.</li><li>Respectful.</li><li>Encouraging.</li><li>Worth reading carefully.</li></ul>
      </section>

      <section className="mission-copy">
        <p className="eyebrow">My Invitation</p>
        <h2>There is room here to slow down and grow.</h2>
        <p>Whether you are reading Scripture for the first time or have studied it for many years, I hope Spirit &amp; Life becomes a place where you can slow down, think deeply, and continue growing in your understanding of God&apos;s Word.</p>
        <blockquote>Read carefully. Think deeply. Reflect honestly. Study faithfully. Grow continually.</blockquote>
      </section>

      <section className="closing-invitation">
        <h2>Begin with the library.</h2>
        <p>Explore thoughtful writing and find a place to continue the conversation.</p>
        <div className="closing-actions"><Button href="/reflections">Explore Reflections</Button><Button href="/contact" variant="secondary">Get in Touch</Button></div>
      </section>

      <style>{`
        .about-main { background: var(--background); padding-bottom: 0; }
        .about-main .about-hero { position: relative; isolation: isolate; width: min(100% - 3rem, 76rem); max-width: none; min-height: 31rem; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; overflow: hidden; padding: clamp(4.5rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem); border-bottom: 1px solid var(--line); text-align: left; }
        .about-main .about-hero::before { position: absolute; z-index: -2; inset: 0; content: ""; background: linear-gradient(90deg, color-mix(in srgb, var(--background) 98%, transparent), color-mix(in srgb, var(--background) 88%, transparent) 45%, color-mix(in srgb, var(--background) 45%, transparent)), url("/images/books/books-hero-library.svg") center / cover no-repeat; opacity: .88; }
        .about-main .about-hero::after { position: absolute; z-index: -1; inset: 0; content: ""; background: radial-gradient(circle at 80% 48%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 34%); pointer-events: none; }
        .about-main .about-hero .eyebrow { margin-bottom: 1.1rem; }
        .about-main .about-hero h1 { max-width: 52rem; margin: .2rem 0 1.2rem; font-size: clamp(3.5rem, 7.5vw, 6.5rem); line-height: .88; letter-spacing: -.055em; }
        .about-main .about-hero > p:last-child { max-width: 38rem; margin: 0; color: var(--muted); line-height: 1.7; }
        .about-main .about-introduction { width: min(100% - 3rem, 76rem); margin-inline: auto; display: grid; grid-template-columns: minmax(13rem, 20rem) minmax(0, 1fr); align-items: center; gap: clamp(2.5rem, 7vw, 7rem); padding: clamp(4rem, 7vw, 6rem) 0; border-bottom: 1px solid var(--line); }
        .about-main .about-portrait-wrap { display: flex; justify-content: center; }
        .about-main .about-portrait { width: min(100%, 13.5rem); aspect-ratio: 1; height: auto; display: block; object-fit: cover; object-position: center top; border: 1px solid color-mix(in srgb, var(--accent) 45%, var(--line)); border-radius: 50%; box-shadow: 0 1.2rem 3rem var(--shadow); }
        .about-main .about-copy { max-width: 44rem; }
        .about-main .about-copy h2 { margin: .4rem 0 1.2rem; font-size: clamp(2.2rem, 4vw, 3.7rem); line-height: .98; letter-spacing: -.035em; }
        .about-main .about-copy p:not(.eyebrow) { color: var(--muted); line-height: 1.8; }
        .about-main .about-philosophy { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; margin-top: clamp(2rem, 5vw, 4rem); border: 1px solid var(--line); background: var(--line); }
        .about-main .about-philosophy-section { padding: clamp(1.5rem, 3vw, 2.5rem); background: var(--surface); }
        .about-main .about-philosophy-section h2 { margin: .45rem 0 1rem; font-size: clamp(1.55rem, 2.7vw, 2.35rem); line-height: 1.02; }
        .about-main .about-philosophy-section p:not(.eyebrow) { color: var(--muted); line-height: 1.7; }
        .about-main .about-commitment { display: grid; grid-template-columns: minmax(0, 1fr) minmax(15rem, .8fr); gap: 4rem; align-items: start; padding-block: clamp(5rem, 9vw, 8rem); }
        .about-main .about-commitment h2 { margin-top: .4rem; font-size: clamp(2.2rem, 4.5vw, 4rem); line-height: .95; }
        .about-main .about-commitment ul { display: grid; grid-template-columns: 1fr 1fr; gap: .8rem 1.5rem; margin: 0; padding: 0; list-style: none; }
        .about-main .about-commitment li { padding: .85rem 0; border-bottom: 1px solid var(--line); color: var(--foreground); }
        .about-main .mission-copy { width: min(100% - 3rem, 62rem); margin: 0 auto; padding: clamp(4rem, 8vw, 7rem) 0; border-top: 1px solid var(--line); text-align: center; }
        .about-main .mission-copy h2 { margin: .4rem auto 1.2rem; max-width: 48rem; font-size: clamp(2.3rem, 5vw, 4.5rem); line-height: .95; }
        .about-main .mission-copy > p:not(.eyebrow) { max-width: 46rem; margin-inline: auto; color: var(--muted); line-height: 1.8; }
        .about-main .mission-copy blockquote { max-width: 48rem; margin: 2rem auto 0; padding: 1.5rem 1rem; border-block: 1px solid var(--line); color: var(--accent); font-size: clamp(1.05rem, 2vw, 1.35rem); font-weight: 600; line-height: 1.6; }
        .about-main .closing-invitation { padding: clamp(4rem, 7vw, 6rem) 1.5rem; background: var(--surface); border-top: 1px solid var(--line); text-align: center; }
        .about-main .closing-invitation h2 { margin-bottom: .7rem; font-size: clamp(2.2rem, 4.5vw, 4rem); line-height: .95; }
        .about-main .closing-invitation > p { margin-bottom: 1.5rem; color: var(--muted); }
        .about-main .closing-actions { display: flex; justify-content: center; gap: .8rem; flex-wrap: wrap; }
        @media (max-width: 760px) { .about-main .about-hero, .about-main .about-introduction { width: min(100% - 2rem, 40rem); } .about-main .about-hero { min-height: 25rem; padding-block: 4rem 3.5rem; } .about-main .about-hero::before { background: linear-gradient(180deg, color-mix(in srgb, var(--background) 96%, transparent), color-mix(in srgb, var(--background) 72%, transparent)), url("/images/books/books-hero-library.svg") center / cover no-repeat; opacity: .68; } .about-main .about-hero h1 { font-size: clamp(3.3rem, 15vw, 5.2rem); } .about-main .about-introduction { grid-template-columns: 1fr; gap: 2rem; } .about-main .about-portrait { width: min(45vw, 12rem); } .about-main .about-philosophy { grid-template-columns: 1fr; } .about-main .about-commitment { grid-template-columns: 1fr; gap: 2rem; } .about-main .about-commitment ul { grid-template-columns: 1fr; } .about-main .mission-copy { width: min(100% - 2rem, 40rem); text-align: left; } .about-main .mission-copy blockquote { text-align: center; } }
      `}</style>
    </main>
  );
}
