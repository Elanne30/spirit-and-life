import type { ReactNode } from "react";

type ContentCardProps = {
  label: string;
  title: string;
  children: ReactNode;
};

export function ContentCard({ label, title, children }: ContentCardProps) {
  return (
    <article className="content-card">
      <p className="content-card-label">{label}</p>
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  );
}