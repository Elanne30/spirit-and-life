import { notFound } from "next/navigation";
import { ArticleArticle } from "@/app/components/article-article";
import { articleMetadata, articleStructuredData } from "@/app/content/seo";
import { getPublishedArticle } from "@/app/lib/content-drafts";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  return article
    ? articleMetadata(article.title, article.introduction ?? "", `/articles/${article.slug}`, article.image_reference ?? undefined)
    : articleMetadata("Articles", "Thoughtful writing from Spirit & Life.", "/articles");
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) notFound();

  const body = article.body;
  const structuredData = articleStructuredData({
    title: article.title,
    description: article.introduction ?? "",
    path: `/articles/${article.slug}`,
    image: article.image_reference ?? (typeof body.image === "string" ? body.image : undefined),
    date: typeof body.date === "string" ? body.date : undefined,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <ArticleArticle article={article} />
    </>
  );
}
