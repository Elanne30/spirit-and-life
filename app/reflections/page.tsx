import Image from "next/image";
import Link from "next/link";
import { reflections } from "@/app/data/reflections";

export default function ReflectionsPage() {
  return (
    <main className="reflections-page">
      <section className="reflections-introduction page-container page-intro">
        <p className="eyebrow">The Library</p>
        <h1>Reflections</h1>
        <p>Thoughtful writings exploring Scripture, theology, philosophy, apologetics, and Christian living.</p>
      </section>

      <section className="reflection-library page-container library-section" aria-labelledby="reflection-library-title">
        <div className="filter-row" aria-label="Reflection categories">
          <button className="filter-pill is-active" type="button">All</button>
          <button className="filter-pill" type="button">Biblical Studies</button>
          <button className="filter-pill" type="button">Theology</button>
          <button className="filter-pill" type="button">Christian Living</button>
          <button className="filter-pill" type="button">Faith &amp; Life</button>
          <button className="filter-pill" type="button">Philosophy</button>
          <button className="filter-pill" type="button">Apologetics</button>
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
                <p className="content-card-label">{reflection.category}</p>
                <h2>
                  <Link href={`/reflections/${reflection.contentSlug}`}>
                    {reflection.title}
                  </Link>
                </h2>
                <p>{reflection.introduction}</p>
                <p className="card-reading-time">{reflection.readingTime}</p>
                <Link className="content-card-link" href={`/reflections/${reflection.contentSlug}`}>
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
