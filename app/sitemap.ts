import type { MetadataRoute } from "next";
import { siteConfig } from "@/app/content/site-config";
import { books } from "@/app/data/books";
import { journals } from "@/app/data/journals";
import { reflections } from "@/app/data/reflections";
import { scriptureReferences } from "@/app/content/scripture";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "reflections", "journals", "books", "study-center", "about", "contact", "scripture", "search", "privacy-policy", "terms-of-use"];
  const contentRoutes = [
    ...reflections.map((item) => `reflections/${item.contentSlug}`),
    ...journals.map((item) => `journals/${item.contentSlug}`),
    ...books.map((item) => `books/${item.contentSlug}`),
    ...scriptureReferences.map((item) => `scripture/${item.slug}`),
  ];

  return [...routes, ...contentRoutes].map((route) => ({
    url: new URL(route, siteConfig.url).toString(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
