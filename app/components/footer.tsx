import Link from "next/link";
import Image from "next/image";
import { siFacebook, siWhatsapp, siYoutube } from "simple-icons";
import { navigation } from "@/app/content/navigation";
import { socialLinks } from "@/app/content/social";
import { siteConfig } from "@/app/content/site-config";

const additionalLinks = [
  { label: "Newsletter", href: "/#newsletter" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Use", href: "/terms-of-use" },
];

const socialIcons = { YouTube: siYoutube, Facebook: siFacebook, WhatsApp: siWhatsapp };

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-container footer-inner">
        <div>
          <Link className="brand-link footer-brand-link" href="/">
            <Image className="brand-logo" src={siteConfig.brand.logo} alt="Spirit & Life" width={616} height={496} />
            <span className="footer-brand-copy">
              <strong>Spirit &amp; Life</strong>
              <small>A library of reflective truths</small>
            </span>
          </Link>
          <p className="footer-note">Exploring God, life, and the world with clarity, depth, and faith.</p>
          <p className="footer-heading sr-only">Social Media</p>
          <div className="footer-socials" aria-label="Social media">
            {socialLinks.map(({ label, href }) => {
              const icon = socialIcons[label];
              const iconMarkup = <svg aria-hidden="true" className="footer-social-icon" viewBox="0 0 24 24" focusable="false"><path d={icon.path} /></svg>;

              return <a className="footer-social-link" key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>{iconMarkup}</a>;
            })}
          </div>
        </div>
        <div className="footer-column">
          <p className="footer-heading">Navigation</p>
          <div className="footer-links footer-navigation-links" aria-label="Footer navigation">
            {navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          </div>
        </div>
        <div className="footer-column">
          <p className="footer-heading">Resources</p>
          <div className="footer-links" aria-label="Resources">
            {additionalLinks.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
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