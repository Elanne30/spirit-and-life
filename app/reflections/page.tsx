import Image from "next/image";
import Link from "next/link";
import { reflections } from "@/app/data/reflections";

export default function ReflectionsPage() {
  return (
    <main className="reflections-page">
      <section className="reflections-introduction page-container">
        <p className="eyebrow">Reflections</p>
        <h1>Thoughtful writing for the life of faith</h1>
        <p>
          Longer-form writings for careful reading, thoughtful consideration,
          and engagement with Scripture.
        </p>
      </section>

      <section className="reflection-library page-container" aria-labelledby="reflection-library-title">
        <div className="reflection-library-heading">
          <p className="eyebrow">The library</p>
          <h2 id="reflection-library-title">Read at a considered pace.</h2>
        </div>
        <div className="reflection-grid">
          {reflections.map((reflection) => (
            <article className="reflection-card" key={reflection.contentSlug}>
              <Link className="reflection-card-image" href={`/reflections/${reflection.contentSlug}`}>
                <Image
                  src={reflection.image}
                  alt=""
                  width={1280}
                  height={853}
                  sizes="(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </Link>
              <div className="reflection-card-body">
                <p className="content-card-label">Reflection</p>
                <h2>
                  <Link href={`/reflections/${reflection.contentSlug}`}>
                    {reflection.title}
                  </Link>
                </h2>
                <Link className="content-card-link" href={`/reflections/${reflection.contentSlug}`}>
                  Read Reflection
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
