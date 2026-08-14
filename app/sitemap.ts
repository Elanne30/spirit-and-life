import type { MetadataRoute } from "next";
import { ensurePublishingIntegrity } from "@/app/content/publishing-validation";
import { listPublishedBooks, listPublishedJournals, listPublishedReflections } from "@/app/content/repository";
import { siteConfig } from "@/app/content/site-config";
import { studies } from "@/app/data/study-plan";
import { scriptureReferences } from "@/app/content/scripture";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await ensurePublishingIntegrity();

  const routes = ["", "reflections", "journals", "books", "study-center", "about", "contact", "scripture", "search", "privacy-policy", "terms-of-use"];
  const reflections = await listPublishedReflections();
  const contentRoutes = [
    ...reflections.map((item) => `reflections/${item.contentSlug}`),
    ...listPublishedJournals().map((item) => `journals/${item.contentSlug}`),
    ...listPublishedBooks().map((item) => `books/${item.contentSlug}`),
    ...scriptureReferences.map((item) => `scripture/${item.slug}`),
    ...studies.map((item) => `study-center/${item.date}`),
  ];

  return [...routes, ...contentRoutes].map((route) => ({
    url: new URL(route, siteConfig.url).toString(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
