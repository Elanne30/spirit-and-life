import Image from "next/image";
import { Button } from "@/app/components/button";

export default function AboutPage() {
  return (
    <main className="about-main">
      <section className="page-intro page-container">
        <p className="eyebrow">About</p>
        <h1>The Vision Behind Spirit &amp; Life</h1>
        <p>A personal digital library where Scripture, thoughtful reflection, and careful reasoning come together.</p>
      </section>

      <section className="about-introduction">
        <Image src="/images/about-portrait.jpg" alt="A reader studying with an open Bible" width={900} height={1200} priority />
        <div className="about-copy">
          <h2>A Brief Introduction</h2>
          <p>Spirit &amp; Life exists to encourage thoughtful engagement with Scripture, Christian faith, and life through careful writing, honest reflection, and biblical reasoning.</p>
          <p>This is not simply a blog or a ministry homepage. It is a growing digital library where readers can slow down, think deeply, and engage with carefully written content.</p>
          <p>Every piece of writing begins with the biblical text. The aim is to understand what Scripture says before asking what it means for us today, because faithful application begins with faithful understanding.</p>
        </div>
      </section>

      <section className="mission-copy">
        <p className="eyebrow">Mission</p>
        <blockquote>To help readers engage thoughtfully with Scripture through reflective writing, careful study, and a clear, welcoming reading experience.</blockquote>
        <p>Questions are welcome here. Spirit &amp; Life is built to be a quiet place where sincere curiosity and careful reflection can grow.</p>
      </section>

      <section className="closing-invitation">
        <h2>Begin Reading</h2>
        <p>Explore the library and find resources that encourage thoughtful engagement with God&apos;s Word.</p>
        <div className="closing-actions">
          <Button href="/reflections">Explore Reflections</Button>
          <Button href="/contact" variant="secondary">Get in Touch</Button>
        </div>
      </section>
    </main>
  );
}
