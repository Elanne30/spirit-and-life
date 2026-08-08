import Link from "next/link";
import { navigation } from "@/app/content/navigation";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-container footer-inner">
        <div>
          <Link className="wordmark" href="/">
            <span>Spirit</span>
            <span>&amp; Life</span>
          </Link>
          <p className="footer-note">Thoughtful Christian reading and study.</p>
        </div>
        <div className="footer-links" aria-label="Footer navigation">
          {navigation.slice(1, 5).map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
        <p className="copyright">© {new Date().getFullYear()} Spirit &amp; Life</p>
      </div>
    </footer>
  );
}