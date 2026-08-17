import Link from "next/link";

type ReadingNavigationProps = {
  previous?: { href: string; title: string };
  next?: { href: string; title: string };
};

export function ReadingNavigation({ previous, next }: ReadingNavigationProps) {
  if (!previous && !next) return null;
  return (
    <nav className="reading-navigation" aria-label="Continue reading">
      {previous ? <Link href={previous.href} className="reading-navigation-item reading-navigation-previous"><span>Previous</span><strong>{previous.title}</strong></Link> : <span />}
      {next ? <Link href={next.href} className="reading-navigation-item reading-navigation-next"><span>Next</span><strong>{next.title}</strong></Link> : <span />}
    </nav>
  );
}
