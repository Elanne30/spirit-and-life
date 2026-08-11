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
      <section className="page-intro page-container">
        <p className="eyebrow">About Spirit &amp; Life</p>
        <h1>A Library of Reflective Truths</h1>
        <p>A personal place for careful reading, honest questions, and thoughtful reflection.</p>
      </section>

      <section className="about-introduction">
        <Image src="/images/public_image_about_portrait.jpg" alt="Oluwaseun reading and writing beside an open Bible in a library" width={1024} height={1280} priority />
        <div className="about-copy">
          <p className="eyebrow">Why I Created Spirit &amp; Life</p>
          <h2>Careful reading. Honest questions. Thoughtful reflection.</h2>
          <p>I created Spirit &amp; Life because I believe Scripture deserves careful reading, honest questions, and thoughtful reflection.</p>
          <p>My goal is not simply to publish articles, but to encourage readers to slow down, examine the biblical text carefully, and pursue truth with humility.</p>
          <p>I want this platform to be a place where thoughtful writing, careful reasoning, and biblical study come together in a way that encourages both the heart and the mind.</p>
        </div>
      </section>

      <section className="about-philosophy page-container" aria-label="Editorial philosophy">
        <article className="about-philosophy-section">
          <p className="eyebrow">My Approach</p>
          <h2>Begin with the biblical text.</h2>
          <p>Every piece of writing begins with the biblical text.</p>
          <p>I seek to understand what Scripture says before asking what it means for us today.</p>
          <p>I believe faithful application begins with faithful understanding, so I strive to read passages in context, reason carefully, and avoid forcing conclusions onto the text.</p>
        </article>
        <article className="about-philosophy-section">
          <p className="eyebrow">Questions Are Welcome</p>
          <h2>Truth has nothing to fear from careful examination.</h2>
          <p>I do not believe honest questions weaken faith.</p>
          <p>Many of the most meaningful discoveries begin with sincere curiosity.</p>
          <p>I want Spirit &amp; Life to be a place where readers feel free to ask difficult questions, knowing that truth has nothing to fear from careful examination.</p>
        </article>
        <article className="about-philosophy-section">
          <p className="eyebrow">Faith and Reason</p>
          <h2>Faith and reason work together.</h2>
          <p>I believe faith and reason work together.</p>
          <p>Reason helps me examine ideas carefully, while faith calls me to trust God and live according to His Word.</p>
          <p>For that reason, I aim to write in a way that is both biblically grounded and intellectually honest.</p>
        </article>
        <article className="about-philosophy-section">
          <p className="eyebrow">Humility</p>
          <h2>Remain teachable. Let Scripture have the final word.</h2>
          <p>I recognize that faithful Christians do not always agree on every passage or theological question.</p>
          <p>Where differences exist, I want to represent differing views fairly, remain teachable, and let Scripture have the final word.</p>
        </article>
      </section>

      <section className="about-commitment page-container">
        <div>
          <p className="eyebrow">My Commitment</p>
          <h2>Writing worth reading carefully.</h2>
        </div>
        <ul>
          <li>Faithful to Scripture.</li>
          <li>Thoughtfully reasoned.</li>
          <li>Clearly written.</li>
          <li>Honest.</li>
          <li>Respectful.</li>
          <li>Encouraging.</li>
          <li>Worth reading carefully.</li>
        </ul>
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
        <div className="closing-actions">
          <Button href="/reflections">Explore Reflections</Button>
          <Button href="/contact" variant="secondary">Get in Touch</Button>
        </div>
      </section>
    </main>
  );
}
