import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReflectionArticle } from "@/app/components/reflection-article";
import { articleMetadata } from "@/app/content/seo";
import { getPublishedReflection, listPublishedReflections } from "@/app/content/repository";

export async function generateStaticParams() {
  const reflections = await listPublishedReflections();
  return reflections.map((reflection) => ({ slug: reflection.contentSlug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const reflection = await getPublishedReflection(slug);
  return reflection ? articleMetadata(reflection.title, reflection.introduction, `/reflections/${reflection.contentSlug}`) : articleMetadata("Reflections", "Thoughtful Christian reflections from Spirit & Life.", "/reflections");
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

  return <ReflectionArticle reflection={reflection} />;
}
