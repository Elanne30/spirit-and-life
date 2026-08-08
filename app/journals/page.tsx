import Image from "next/image";
import Link from "next/link";
import { journals } from "@/app/data/journals";

export default function JournalsPage() {
  return (
    <main className="journals-page">
      <section className="journals-introduction page-container">
        <p className="eyebrow">Journals</p>
        <h1>Short entries from the life of faith</h1>
        <p>
          Shorter entries capturing observations, thoughts, prayers, questions,
          and moments of reflection.
        </p>
      </section>

      <section className="journal-library page-container" aria-labelledby="journal-library-title">
        <div className="journal-library-heading">
          <p className="eyebrow">The journal</p>
          <h2 id="journal-library-title">Notes to return to.</h2>
        </div>
        <div className="journal-grid">
          {journals.map((journal) => (
            <article className="journal-card" key={journal.contentSlug}>
              <Link className="journal-card-image" href={`/journals/${journal.contentSlug}`}>
                <Image
                  src={journal.image}
                  alt=""
                  width={1280}
                  height={853}
                  sizes="(max-width: 720px) 100vw, 50vw"
                />
              </Link>
              <div className="journal-card-body">
                <p className="content-card-label">Journal</p>
                <h2>
                  <Link href={`/journals/${journal.contentSlug}`}>
                    {journal.title}
                  </Link>
                </h2>
                <Link className="content-card-link" href={`/journals/${journal.contentSlug}`}>
                  Read Journal
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
