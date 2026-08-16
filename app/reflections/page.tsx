import { listPublishedReflections } from "@/app/content/repository";
import { ReflectionLibrary } from "@/app/reflections/reflection-library";

const reflectionsPageStyles = `
  .reflections-page {
    padding-block: 0 7rem;
  }

  .reflections-page .reflections-introduction {
    position: relative;
    isolation: isolate;
    width: min(100% - 3rem, 76rem);
    max-width: none;
    min-height: 28rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: clamp(4.5rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem);
    border-bottom: 1px solid var(--line);
    text-align: center;
  }

  .reflections-page .reflections-introduction::before {
    position: absolute;
    z-index: -2;
    inset: 0;
    content: "";
    background:
      linear-gradient(90deg, color-mix(in srgb, var(--background) 98%, transparent) 0%, color-mix(in srgb, var(--background) 91%, transparent) 55%, color-mix(in srgb, var(--background) 58%, transparent) 100%),
      url("/images/reflections/Reading_scripture_in_context_why_it_matters.jpg") right center / cover no-repeat;
    opacity: 0.82;
  }

  .reflections-page .reflections-introduction::after {
    position: absolute;
    z-index: -1;
    inset: 0;
    content: "";
    background: radial-gradient(circle at 76% 45%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 34%);
    pointer-events: none;
  }

  .reflections-page .reflections-introduction .eyebrow {
    margin-bottom: 1.2rem;
  }

  .reflections-page .reflections-introduction h1 {
    max-width: 18ch;
    margin-bottom: 1.25rem;
    font-size: clamp(3.5rem, 7vw, 6.2rem);
    letter-spacing: -0.055em;
    line-height: 0.9;
  }

  .reflections-page .reflections-introduction > p:last-child {
    max-width: 38rem;
    margin-bottom: 0;
    color: var(--muted);
    font-size: 1rem;
    line-height: 1.65;
  }

  .reflections-page .reflection-library {
    width: min(100% - 3rem, 76rem);
    padding-block: 2rem 1rem;
    border-top: 0;
  }

  .reflections-page .filter-row {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.65rem;
    margin-bottom: 2.2rem;
  }

  .reflections-page .filter-pill {
    min-height: 2.5rem;
    padding: 0.55rem 1.05rem;
    border: 1px solid var(--line);
    border-radius: 999px;
    background: transparent;
    color: var(--muted);
    font: inherit;
    font-size: 0.76rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 160ms ease, border-color 160ms ease, color 160ms ease, transform 160ms ease;
  }

  .reflections-page .filter-pill:hover {
    border-color: color-mix(in srgb, var(--accent) 65%, var(--line));
    color: var(--foreground);
    transform: translateY(-1px);
  }

  .reflections-page .filter-pill.is-active {
    border-color: var(--accent);
    background: var(--accent);
    color: var(--on-accent);
  }

  .reflections-page .reflection-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
    align-items: start;
  }

  .reflections-page .reflection-card {
    min-width: 0;
    overflow: hidden;
    border: 1px solid var(--line);
    border-radius: 0.45rem;
    background: var(--surface);
    box-shadow: 0 0.75rem 1.8rem var(--shadow);
    transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
  }

  .reflections-page .reflection-card:hover {
    transform: translateY(-0.25rem);
    border-color: color-mix(in srgb, var(--accent) 40%, var(--line));
    box-shadow: 0 1.25rem 2.5rem var(--shadow);
  }

  .reflections-page .reflection-card-image {
    aspect-ratio: 1.58;
    background: var(--surface-muted);
  }

  .reflections-page .reflection-card-image img {
    transition: transform 260ms ease;
  }

  .reflections-page .reflection-card:hover .reflection-card-image img {
    transform: scale(1.025);
  }

  .reflections-page .reflection-card-body {
    min-height: 17rem;
    padding: 1.35rem 1.35rem 1.5rem;
  }

  .reflections-page .reflection-card-body .content-card-label {
    margin-bottom: 0.9rem;
    font-size: 0.62rem;
    letter-spacing: 0.16em;
  }

  .reflections-page .reflection-card h2 {
    margin-bottom: 1rem;
    font-size: clamp(1.65rem, 2.2vw, 2.15rem);
    letter-spacing: -0.035em;
    line-height: 1;
  }

  .reflections-page .reflection-card-body > p:not(.content-card-label):not(.card-reading-time) {
    margin-bottom: 0;
    color: var(--muted);
    font-size: 0.82rem;
    line-height: 1.6;
  }

  .reflections-page .reflection-card .card-reading-time {
    margin-top: 1rem;
    margin-bottom: 0;
    color: var(--muted);
    font-size: 0.72rem;
  }

  .reflections-page .reflection-card .content-card-link {
    margin-top: 1.15rem;
    border-bottom: 0;
    color: var(--accent-strong);
    font-size: 0.74rem;
  }

  .reflections-page .reflection-card .content-card-link:hover {
    color: var(--foreground);
  }

  .reflections-page .empty-state {
    padding-block: 4rem;
    color: var(--muted);
    text-align: center;
  }

  html[data-theme="light"] .reflections-page .reflections-introduction::before {
    opacity: 0.5;
  }

  @media (max-width: 900px) {
    .reflections-page .reflection-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .reflections-page .reflection-card-body {
      min-height: 16rem;
    }
  }

  @media (max-width: 720px) {
    .reflections-page {
      padding-bottom: 5rem;
    }

    .reflections-page .reflections-introduction,
    .reflections-page .reflection-library {
      width: min(100% - 2rem, 40rem);
    }

    .reflections-page .reflections-introduction {
      min-height: 24rem;
      padding-block: 4rem 3.5rem;
    }

    .reflections-page .reflections-introduction::before {
      background:
        linear-gradient(180deg, color-mix(in srgb, var(--background) 96%, transparent), color-mix(in srgb, var(--background) 78%, transparent)),
        url("/images/reflections/Reading_scripture_in_context_why_it_matters.jpg") center / cover no-repeat;
      opacity: 0.58;
    }

    .reflections-page .reflections-introduction h1 {
      font-size: clamp(3.2rem, 15vw, 5rem);
    }

    .reflections-page .reflection-library {
      padding-top: 1.5rem;
    }

    .reflections-page .filter-row {
      justify-content: flex-start;
      overflow-x: auto;
      flex-wrap: nowrap;
      margin-right: -0.5rem;
      margin-left: -0.5rem;
      padding: 0.25rem 0.5rem 0.5rem;
      scrollbar-width: none;
    }

    .reflections-page .filter-row::-webkit-scrollbar {
      display: none;
    }

    .reflections-page .filter-pill {
      flex: 0 0 auto;
    }

    .reflections-page .reflection-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .reflections-page .reflection-card-body {
      min-height: auto;
      padding: 1.25rem 1.2rem 1.35rem;
    }
  }
`;

export default async function ReflectionsPage() {
  const reflections = await listPublishedReflections();

  return (
    <main className="reflections-page">
      <style dangerouslySetInnerHTML={{ __html: reflectionsPageStyles }} />
      <section className="reflections-introduction page-container page-intro">
        <p className="eyebrow">The Library</p>
        <h1>Reflections</h1>
        <p>Thoughtful writings exploring Scripture, theology, philosophy, apologetics, and Christian living.</p>
      </section>

      <ReflectionLibrary reflections={reflections} />
    </main>
  );
}
