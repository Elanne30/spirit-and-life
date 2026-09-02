import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ShieldCheck, BookOpen, Heart, Clock, ShoppingBag } from "lucide-react";
import { notFound } from "next/navigation";
import { getPublishedBook } from "@/app/content/repository";

function StoreMark({ store }: { store: string }) {
  const normalized = store.toLowerCase();
  if (normalized.includes("amazon")) return <span className="store-wordmark amazon-mark">amazon<span className="amazon-smile">⌣</span></span>;
  if (normalized.includes("selar")) return <span className="store-wordmark selar-mark"><img className="selar-logo" src="/selar-logo.svg" alt="Selar" /></span>;
  return <span className="store-initial">{store.trim().charAt(0).toUpperCase() || "S"}</span>;
}

export default async function GetBookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = await getPublishedBook(slug);
  if (!book) notFound();

  const options = (book.purchaseOptions ?? []).filter((option) => option.enabled);
  const paperbackAvailable = book.paperbackStatus === "Available" && Boolean(book.paperbackUrl);
  const cover = book.cover;

  return (
    <main className="book-get-page">
      <section className="book-get-hero">
        {cover && <div className="book-get-hero-bg" style={{ backgroundImage: `url(${cover})` }} aria-hidden="true" />}
        <div className="book-get-hero-overlay" aria-hidden="true" />
        <div className="book-get-hero-inner">
          <div className="book-get-hero-copy">
            <p className="book-availability">{book.status === "Available" ? "Now Available" : "Coming Soon"}</p>
            <h1>{book.title}</h1>
            {book.subtitle && <p className="book-hero-subtitle">{book.subtitle}</p>}
            {book.description && <p className="book-hero-description">{book.description.split("\n\n")[0]}</p>}
            <div className="book-hero-rule" />
            <div className="book-hero-features">
              <span><ShieldCheck size={28} /><small>Biblically<br />Grounded</small></span>
              <span><BookOpen size={28} /><small>Historically<br />Informed</small></span>
              <span><Heart size={28} /><small>Spiritually<br />Transformative</small></span>
            </div>
          </div>
          <div className="book-get-cover">
            {cover && <Image src={cover} alt={book.title} width={560} height={760} priority />}
          </div>
        </div>
      </section>

      <section className="book-get-shell">
        <Link className="book-get-back" href={`/books/${book.contentSlug}`}><ArrowLeft size={15} /> Back to book</Link>
        <div className="book-get-header">
          <div className="book-get-icon"><ShoppingBag size={25} /></div>
          <p className="eyebrow">Get the book</p>
          <h2>Purchase digital copy or paperback</h2>
          <p>Purchase <strong>{book.title}</strong> from one of the available stores below. You will complete your purchase on the store&apos;s website.</p>
        </div>

        <div className="book-store-grid">
          {options.length ? options.map((option) => (
            <a className="book-store-card" key={option.id} href={option.url} target="_blank" rel="noopener noreferrer">
              <span className="book-store-brand"><StoreMark store={option.store} /></span>
              <span className="book-store-copy"><strong>{option.store}</strong><small>Purchase this book</small></span>
              <span className="book-store-action">Buy on {option.store} <ExternalLink size={17} /></span>
            </a>
          )) : (
            <div className="book-no-stores"><strong>Purchase links coming soon.</strong><span>This book is available, but store links have not been added yet.</span></div>
          )}
        </div>

        <section className="paperback-card">
          <div>
            <p className="eyebrow">Paperback edition</p>
            <h2>{paperbackAvailable ? "Get the printed edition" : "Paperback coming soon"}</h2>
            <p>{paperbackAvailable ? "The printed edition is available through the external store below." : "The paperback edition is being prepared and will be available soon."}</p>
          </div>
          {paperbackAvailable ? <a className="button button-primary" href={book.paperbackUrl} target="_blank" rel="noopener noreferrer">Get paperback <ExternalLink size={15} /></a> : <span className="paperback-status"><Clock size={16} /> Available soon</span>}
        </section>

        <div className="book-get-trust">
          <div><ShieldCheck size={28} /><span><strong>Secure Checkout</strong><small>Your purchase is safe and protected.</small></span></div>
          <div><BookOpen size={28} /><span><strong>Instant Access</strong><small>Get your digital copy immediately.</small></span></div>
          <div><Heart size={28} /><span><strong>Support</strong><small>We&apos;re here to help you every step.</small></span></div>
        </div>
      </section>

      <style>{`
        .book-get-page{min-height:100vh;background:var(--background);color:var(--foreground);overflow-x:hidden}
        .book-get-hero{position:relative;overflow:hidden;border-bottom:1px solid var(--line);min-height:35rem;background:#090b0c}
        .book-get-hero-bg{position:absolute;inset:-5rem;background-position:center;background-size:cover;filter:blur(24px);transform:scale(1.08);opacity:.48}
        .book-get-hero-overlay{position:absolute;inset:0;background:linear-gradient(90deg,rgba(4,5,6,.96) 0%,rgba(4,5,6,.78) 48%,rgba(4,5,6,.2) 100%),linear-gradient(0deg,rgba(4,5,6,.72),transparent 45%)}
        .book-get-hero-inner{position:relative;z-index:1;width:min(100% - 2rem,62rem);min-height:35rem;margin:auto;display:grid;grid-template-columns:1.05fr .95fr;align-items:center;gap:2rem;padding:3.5rem 0}
        .book-get-hero-copy{max-width:34rem}.book-availability{text-transform:uppercase;letter-spacing:.26em;font-size:.78rem;color:var(--accent);margin:0 0 1.2rem}.book-get-hero h1{font-size:clamp(3rem,7vw,5.6rem);line-height:.95;letter-spacing:-.055em;margin:0;color:#f6f1e8}.book-hero-subtitle{font-size:1.1rem;color:var(--accent);font-style:italic;margin:1rem 0 0}.book-hero-description{font-size:1rem;line-height:1.7;color:#d0cdca;max-width:31rem;margin:1.2rem 0 0}.book-hero-rule{height:1px;width:8rem;background:var(--accent);margin:1.8rem 0}.book-hero-features{display:flex;gap:1.1rem}.book-hero-features span{display:flex;align-items:center;gap:.55rem;color:var(--accent);padding-right:1.1rem;border-right:1px solid rgba(255,255,255,.18)}.book-hero-features span:last-child{border-right:0}.book-hero-features small{font-size:.8rem;line-height:1.35;color:#d6d2cc}.book-get-cover{display:flex;justify-content:center;align-items:center;height:100%}.book-get-cover img{width:min(100%,24rem);height:auto;max-height:31rem;object-fit:contain;filter:drop-shadow(0 1.5rem 2.5rem rgba(0,0,0,.55))}
        .book-get-shell{width:min(100% - 2rem,62rem);margin:auto;padding:2.5rem 0 4rem}.book-get-back{display:inline-flex;align-items:center;gap:.45rem;color:var(--muted);text-decoration:none;font-size:.9rem;margin-bottom:3rem}.book-get-back:hover{color:var(--foreground)}.book-get-header{max-width:44rem;margin-bottom:2.5rem}.book-get-icon{display:grid;place-items:center;width:3.1rem;height:3.1rem;border:1px solid color-mix(in srgb,var(--accent) 40%,var(--line));border-radius:50%;color:var(--accent);margin-bottom:1.3rem}.book-get-header h2{font-size:clamp(2.3rem,5vw,4.1rem);line-height:1;letter-spacing:-.045em;margin:.4rem 0 1rem}.book-get-header>p:last-child{color:var(--muted);line-height:1.75;font-size:1.03rem}
        .book-store-grid{display:grid;gap:1rem}.book-store-card{display:grid;grid-template-columns:6rem minmax(0,1fr) auto;align-items:center;gap:1.2rem;padding:1.15rem 1.25rem;border:1px solid var(--line);background:var(--surface);color:var(--foreground);text-decoration:none;box-shadow:0 .7rem 2rem var(--shadow);transition:transform 180ms ease,border-color 180ms ease;min-width:0}.book-store-card:hover{transform:translateY(-2px);border-color:color-mix(in srgb,var(--accent) 55%,var(--line))}.book-store-brand{display:grid;place-items:center;min-width:0;min-height:3rem}.store-wordmark{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;font-weight:800;font-size:1.25rem;letter-spacing:-.04em}.store-wordmark img.selar-logo{display:block;width:5.25rem;height:3rem;object-fit:contain;border-radius:.35rem}.amazon-mark{font-family:Arial,sans-serif}.amazon-smile{display:block;font-size:1.25rem;line-height:.25;margin-left:2rem}.selar-mark{font-weight:900}.store-initial{display:grid;place-items:center;width:2.8rem;height:2.8rem;border-radius:.7rem;background:var(--surface-muted);font-weight:800;color:var(--accent)}.book-store-copy{display:grid;gap:.2rem;min-width:0}.book-store-copy strong{font-size:1.05rem;overflow-wrap:anywhere}.book-store-copy small{color:var(--muted)}.book-store-action{display:inline-flex;align-items:center;justify-content:center;gap:.55rem;padding:.85rem 1rem;background:var(--accent);color:#18130a;font-weight:700;white-space:nowrap}.book-no-stores{display:grid;gap:.35rem;padding:1.5rem;border:1px dashed var(--line);background:var(--surface);color:var(--muted)}.book-no-stores strong{color:var(--foreground)}
        .paperback-card{display:flex;align-items:center;justify-content:space-between;gap:2rem;margin-top:3rem;padding:1.5rem;border:1px solid var(--line);background:var(--surface);box-shadow:0 .7rem 2rem var(--shadow)}.paperback-card h2{margin:.25rem 0 .45rem;font-size:1.4rem}.paperback-card p:not(.eyebrow){margin:0;color:var(--muted);line-height:1.6}.paperback-status{display:inline-flex;align-items:center;gap:.45rem;white-space:nowrap;padding:.55rem .8rem;border:1px solid var(--line);border-radius:999px;color:var(--muted);font-size:.8rem;font-weight:700}.book-get-trust{display:grid;grid-template-columns:repeat(3,1fr);margin-top:1rem;border:1px solid var(--line);background:var(--surface);border-radius:.5rem;overflow:hidden}.book-get-trust>div{display:flex;align-items:center;gap:.8rem;padding:1.25rem;border-right:1px solid var(--line);color:var(--accent);min-width:0}.book-get-trust>div:last-child{border-right:0}.book-get-trust span{display:grid;gap:.25rem;min-width:0}.book-get-trust strong{font-size:.9rem;color:var(--foreground)}.book-get-trust small{font-size:.78rem;line-height:1.4;color:var(--muted)}
        @media(max-width:760px){.book-get-hero-inner{grid-template-columns:1fr;min-height:auto;padding:3rem 0 3.5rem;gap:1.5rem}.book-get-cover{order:-1;justify-content:center;height:auto}.book-get-cover img{width:min(62%,15rem);max-height:22rem}.book-get-hero-copy{margin-top:0}.book-hero-features{flex-wrap:wrap;gap:.75rem}.book-hero-features span{padding-right:.75rem}.book-get-back{margin-bottom:2rem}.book-store-card{grid-template-columns:4rem minmax(0,1fr);gap:.9rem;padding:1rem}.book-store-action{grid-column:1 / -1;width:100%;min-height:2.9rem}.book-store-brand{align-self:center}.store-wordmark img.selar-logo{width:4rem;height:2.65rem}.book-get-trust{grid-template-columns:1fr}.book-get-trust>div{border-right:0;border-bottom:1px solid var(--line)}.book-get-trust>div:last-child{border-bottom:0}.paperback-card{align-items:flex-start;flex-direction:column;gap:1.25rem}.paperback-status{align-self:flex-start}}
        @media(max-width:420px){.book-get-shell{width:min(100% - 1.25rem,62rem);padding-top:2rem}.book-get-header h2{font-size:2.15rem}.book-get-header>p:last-child{font-size:.95rem;line-height:1.65}.book-store-card{grid-template-columns:3.5rem minmax(0,1fr);padding:.9rem}.book-store-copy strong{font-size:1rem}.book-store-copy small{font-size:.78rem}.book-store-action{font-size:.9rem}.book-hero-features span{font-size:.75rem}.book-hero-features small{font-size:.72rem}}
      `}</style>
    </main>
  );
}
