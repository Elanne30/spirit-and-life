import { listPublishedBooks, listPublishedJournals, listPublishedReflections } from "@/app/content/repository";
import { listPublishedArticles } from "@/app/lib/content-drafts";

export async function getFeaturedReflection() {
  const reflections = await listPublishedReflections();
  return reflections.find((reflection) => reflection.featured) ?? reflections[0];
}

export async function getFeaturedBook() {
  const books = await listPublishedBooks();
  return books.find((book) => book.featured) ?? books[0];
}

export async function getFeaturedJournal() {
  const journals = await listPublishedJournals();
  return journals[0];
}

export async function getFeaturedArticle() {
  const articles = await listPublishedArticles();
  return articles.find((article) => article.body.featured === true) ?? articles[0];
}

export async function getFeaturedContent() {
  const [article, reflection, journal, book] = await Promise.all([
    getFeaturedArticle(),
    getFeaturedReflection(),
    getFeaturedJournal(),
    getFeaturedBook(),
  ]);
  return { article, reflection, journal, book };
}
