import type { ReactNode } from "react";
import Link from "next/link";

type ContentCardProps = {
  label: string;
  title: string;
  children: ReactNode;
  href: string;
  action: string;
};

export function ContentCard({ label, title, children, href, action }: ContentCardProps) {
  return (
    <article className="content-card">
      <p className="content-card-label">{label}</p>
      <h3>{title}</h3>
      <p>{children}</p>
      <Link className="content-card-link" href={href}>{action}</Link>
    </article>
  );
}