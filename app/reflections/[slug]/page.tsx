import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReflectionArticle } from "@/app/components/reflection-article";
import { articleMetadata, articleStructuredData } from "@/app/content/seo";
import { getPublishedReflection } from "@/app/content/repository";

// Reflections are database-backed and can be published from Admin at any time.
// Keep the detail route dynamic so Previous/Next always sees the current
// published collection instead of a build-time snapshot.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const reflection = await getPublishedReflection(slug);
  return reflection ? articleMetadata(reflection.title, reflection.introduction, `/reflections/${reflection.contentSlug}`, reflection.image) : articleMetadata("Reflections", "Thoughtful Christian reflections from Spirit & Life.", "/reflections");
}

export default async function ReflectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const reflection = await getPublishedReflection(slug);

  if (!reflection) {
    notFound();
  }

  const structuredData = articleStructuredData({
    title: reflection.title,
    description: reflection.introduction,
    path: `/reflections/${reflection.contentSlug}`,
    image: reflection.image,
    date: reflection.date,
  });

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <ReflectionArticle reflection={reflection} />
  </>;
}
