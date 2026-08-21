import Link from "next/link";
import { notFound } from "next/navigation";
import { getDownloadableResourceBySlug } from "@/app/lib/resource-repository";

export default async function ResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = await getDownloadableResourceBySlug(slug);
  if (!resource) notFound();
  return <main className="mx-auto max-w-4xl px-6 py-16"><Link href="/resources" className="text-sm text-muted-foreground hover:underline">← Downloads</Link><p className="mt-6 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">{resource.kind}</p><h1 className="mt-3 text-4xl font-semibold tracking-tight">{resource.title}</h1><p className="mt-4 text-muted-foreground">{resource.description}</p><a href={resource.fileUrl} download={resource.fileName ?? undefined} className="mt-8 inline-flex rounded-full border px-5 py-2.5 text-sm font-medium hover:bg-muted/40">Download {resource.kind}</a></main>;
}
