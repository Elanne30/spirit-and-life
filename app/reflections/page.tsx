"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { listPublishedReflections } from "@/app/content/repository";

export default function ReflectionsPage() {
  const reflections = listPublishedReflections();
  const categories = ["All", ...new Set(reflections.map((reflection) => reflection.category))];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const visibleReflections = selectedCategory === "All"
    ? reflections
    : reflections.filter((reflection) => reflection.category === selectedCategory);

  return (
    <main className="reflections-page">
      <section className="reflections-introduction page-container page-intro">
        <p className="eyebrow">The Library</p>
        <h1>Reflections</h1>
        <p>Thoughtful writings exploring Scripture, theology, philosophy, apologetics, and Christian living.</p>
      </section>

      <section className="reflection-library page-container library-section" aria-label="Reflection library">
        <div className="filter-row" aria-label="Reflection categories">
          {categories.map((category) => (
            <button
              className={`filter-pill${selectedCategory === category ? " is-active" : ""}`}
              key={category}
              type="button"
              aria-pressed={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="reflection-grid">
          {visibleReflections.map((reflection) => (
            <article className="reflection-card" key={reflection.contentSlug}>
              <Link className="reflection-card-image" href={`/reflections/${reflection.contentSlug}`}>
                <Image
                  src={reflection.image}
                  alt={reflection.title}
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
