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
          {reflection.scriptureReference ? (
            <p className="reflection-scripture">{reflection.scriptureReference}</p>
          ) : null}
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
          <p className="reflection-content-status">
            The full text of this reflection is not yet available in the project
            content files.
          </p>
          <Link className="button button-text" href="/reflections">
            Back to Reflections
          </Link>
        </div>
      </article>
    </main>
  );
}
