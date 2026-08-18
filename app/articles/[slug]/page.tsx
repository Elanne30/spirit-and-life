import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/app/components/article-page";
import { articleMetadata, articleStructuredData } from "@/app/content/seo";
import { getPublishedArticle } from "@/app/content/repository";
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const article = await getPublishedArticle(slug); return article ? articleMetadata(article.title, article.introduction, `/articles/${article.contentSlug}`, article.image) : articleMetadata("Articles", "Developed writing from Spirit & Life.", "/articles"); }
export default async function ArticleRoute({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const article = await getPublishedArticle(slug); if (!article) notFound(); const structuredData = articleStructuredData({ title: article.title, description: article.introduction, path: `/articles/${article.contentSlug}`, image: article.image, date: article.date }); return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><ArticlePage article={article} /></>; }
