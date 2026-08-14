"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Reflection } from "@/app/data/reflections";

export function ReflectionLibrary({ reflections }: { reflections: Reflection[] }) {
  const categories = ["All", ...new Set(reflections.map((reflection) => reflection.category))];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const visibleReflections = selectedCategory === "All"
    ? reflections
    : reflections.filter((reflection) => reflection.category === selectedCategory);

  return (
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
  );
}
