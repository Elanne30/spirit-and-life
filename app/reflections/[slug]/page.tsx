import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getReflection, reflections } from "@/app/data/reflections";

export function generateStaticParams() {
  return reflections.map((reflection) => ({ slug: reflection.contentSlug }));
}

export default async function ReflectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const reflection = getReflection(slug);

  if (!reflection) {
    notFound();
  }

  return (
    <main className="reflection-detail-page">
      <article className="reflection-detail">
        <header className="reflection-detail-header page-container">
          <p className="eyebrow">Reflection</p>
          <h1>{reflection.title}</h1>
          <div className="reflection-meta">
            <span>{reflection.date}</span>
            <span>{reflection.readingTime}</span>
            <span>{reflection.category}</span>
            <span>{reflection.scripture}</span>
          </div>
        </header>
        <div className="reflection-feature-image page-container">
          <Image
            src={reflection.image}
            alt=""
            width={1280}
            height={853}
            priority
            sizes="(max-width: 1220px) 100vw, 76rem"
          />
        </div>
        <div className="reflection-reading-column">
          <p className="reflection-introduction">{reflection.introduction}</p>
          {reflection.sections.map((section) => (
            <section className="reading-section" key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
          <Link className="button button-text" href="/reflections">
            Back to Reflections
          </Link>
        </div>
      </article>
    </main>
  );
}
