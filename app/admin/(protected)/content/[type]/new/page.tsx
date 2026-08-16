import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, FilePenLine, FileText } from "lucide-react";
import { DraftForm } from "@/app/admin/(protected)/content/draft-form";

const config = {
  reflection: {
    label: "New Reflection",
    description: "Write a new reflection for Spirit & Life.",
    icon: FilePenLine,
  },
  journal: {
    label: "New Journal",
    description: "Write a new journal entry for Spirit & Life.",
    icon: FileText,
  },
  book: {
    label: "New Book",
    description: "Add a new book to your Spirit & Life library.",
    icon: BookOpen,
  },
} as const;

export default async function NewContentPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  if (!(type in config)) {
    notFound();
  }

  const contentType = type as keyof typeof config;
  const current = config[contentType];
  const Icon = current.icon;

  return (
    <section className="admin-stack">
      <article className="admin-card">
        <Link className="admin-outline-link" href={`/admin/content/${contentType}`}>
          <ArrowLeft size={14} />
          Back to {contentType === "reflection" ? "Reflections" : contentType === "journal" ? "Journals" : "Books"}
        </Link>

        <div className="admin-heading-with-icon">
          <span className="admin-icon">
            <Icon size={22} />
          </span>
          <div>
            <p className="eyebrow">Create</p>
            <h1>{current.label}</h1>
            <p>{current.description}</p>
          </div>
        </div>
      </article>

      <article className="admin-card">
        <DraftForm initialContentType={contentType} />
      </article>
    </section>
  );
}
