import type { MetadataRoute } from "next";
import { ensurePublishingIntegrity } from "@/app/content/publishing-validation";
import { listPublishedBooks, listPublishedJournals, listPublishedReflections } from "@/app/content/repository";
import { listPublishedArticles } from "@/app/lib/content-drafts";
import { siteConfig } from "@/app/content/site-config";
import { studies } from "@/app/data/study-plan";
import { scriptureReferences } from "@/app/content/scripture";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await ensurePublishingIntegrity();
  const routes = ["", "articles", "reflections", "journals", "books", "podcast", "resources", "topics", "series", "questions", "study-center", "about", "contact", "scripture", "search", "privacy-policy", "terms-of-use"];
  const [reflections, journals, books, articles] = await Promise.all([listPublishedReflections(), listPublishedJournals(), listPublishedBooks(), listPublishedArticles()]);
  const contentRoutes = [
    ...articles.map((item) => `articles/${item.slug}`),
    ...reflections.map((item) => `reflections/${item.contentSlug}`),
    ...journals.map((item) => `journals/${item.contentSlug}`),
    ...books.map((item) => `books/${item.contentSlug}`),
    ...scriptureReferences.map((item) => `scripture/${item.slug}`),
    ...studies.map((item) => `study-center/${item.date}`),
  ];
  return [...routes, ...contentRoutes].map((route) => ({ url: new URL(route, siteConfig.url).toString(), changeFrequency: "monthly", priority: route === "" ? 1 : 0.7 }));
}
