import Link from "next/link";
import Image from "next/image";
import { navigation } from "@/app/content/navigation";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-container footer-inner">
        <div>
          <Link className="brand-link" href="/">
            <Image className="brand-logo" src="/spiri_life_logo.jpg" alt="Spirit & Life" width={1280} height={853} />
          </Link>
          <p className="footer-note">Exploring God, life, and the world with clarity, depth, and faith.</p>
          <div className="footer-socials" aria-label="Social links">
            <a href="#" aria-label="YouTube">YT</a>
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Instagram">ig</a>
            <a href="#" aria-label="Twitter">tw</a>
          </div>
        </div>
        <div className="footer-column">
          <p className="footer-heading">Navigation</p>
          <div className="footer-links" aria-label="Footer navigation">
            {navigation.slice(1).map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          </div>
        </div>
        <div className="footer-column">
          <p className="footer-heading">Resources</p>
          <div className="footer-links">
            <Link href="/reflections">The library</Link>
            <Link href="/study-center">Study plans</Link>
            <Link href="/contact">Get in touch</Link>
          </div>
        </div>
      </div>
      <div className="page-container footer-bottom">
        <p className="copyright">© {new Date().getFullYear()} Spirit &amp; Life. All rights reserved.</p>
        <p>Thoughtful writing · Honest questions · Timeless truth.</p>
      </div>
    </footer>
  );
}