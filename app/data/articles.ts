import type { ContentRelations } from "@/app/content/types";
export type ArticleSection = { heading: string; paragraphs: string[] };
export type Article = ContentRelations & { type: "Article"; contentSlug: string; title: string; date: string; readingTime: string; category: string; tags: string[]; introduction: string; image: string; featured?: boolean; sections: ArticleSection[]; richText?: import("@/app/content/article-rich-text").RichTextDocument };
export const articles: Article[] = [];
