import "server-only";
import crypto from "node:crypto";
import { sql } from "@vercel/postgres";

export type PodcastEpisode = {
  id: string;
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  duration: string | null;
  coverImage: string | null;
  audioUrl: string | null;
  transcript: string | null;
  youtubeUrl: string | null;
  topicSlugs: string[];
  seriesSlug: string | null;
  questionSlugs: string[];
  articleSlugs: string[];
  resourceSlugs: string[];
  status: "draft" | "published";
};

let schemaPromise: Promise<void> | null = null;
async function ensureSchema() {
  if (!schemaPromise) schemaPromise = (async () => {
    await sql`CREATE TABLE IF NOT EXISTS podcast_episodes (id text PRIMARY KEY, slug text UNIQUE NOT NULL, title text NOT NULL, description text NOT NULL DEFAULT '', published_at timestamptz NOT NULL, duration text, cover_image text, audio_url text, transcript text, youtube_url text, topic_slugs jsonb NOT NULL DEFAULT '[]'::jsonb, series_slug text, question_slugs jsonb NOT NULL DEFAULT '[]'::jsonb, article_slugs jsonb NOT NULL DEFAULT '[]'::jsonb, resource_slugs jsonb NOT NULL DEFAULT '[]'::jsonb, status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())`;
    await sql`ALTER TABLE podcast_episodes ADD COLUMN IF NOT EXISTS youtube_url text`;
    await sql`ALTER TABLE podcast_episodes ADD COLUMN IF NOT EXISTS article_slugs jsonb NOT NULL DEFAULT '[]'::jsonb`;
    await sql`ALTER TABLE podcast_episodes ADD COLUMN IF NOT EXISTS resource_slugs jsonb NOT NULL DEFAULT '[]'::jsonb`;
    await sql`CREATE INDEX IF NOT EXISTS podcast_episodes_status_idx ON podcast_episodes(status)`;
    await sql`CREATE INDEX IF NOT EXISTS podcast_episodes_published_at_idx ON podcast_episodes(published_at DESC)`;
  })();
  await schemaPromise;
}

function jsonStrings(value: unknown) { return Array.isArray(value) ? value.map(String) : []; }
function rowToEpisode(row: Record<string, unknown>): PodcastEpisode {
  return {
    id: String(row.id), slug: String(row.slug), title: String(row.title), description: String(row.description ?? ""),
    publishedAt: new Date(String(row.published_at)).toISOString().slice(0, 10), duration: row.duration ? String(row.duration) : null,
    coverImage: row.cover_image ? String(row.cover_image) : null, audioUrl: row.audio_url ? String(row.audio_url) : null,
    transcript: row.transcript ? String(row.transcript) : null, youtubeUrl: row.youtube_url ? String(row.youtube_url) : null,
    topicSlugs: jsonStrings(row.topic_slugs), seriesSlug: row.series_slug ? String(row.series_slug) : null,
    questionSlugs: jsonStrings(row.question_slugs), articleSlugs: jsonStrings(row.article_slugs), resourceSlugs: jsonStrings(row.resource_slugs),
    status: row.status === "published" ? "published" : "draft",
  };
}

export async function listPodcastEpisodes(publishedOnly = true) { await ensureSchema(); const result = publishedOnly ? await sql`SELECT * FROM podcast_episodes WHERE status = 'published' ORDER BY published_at DESC` : await sql`SELECT * FROM podcast_episodes ORDER BY updated_at DESC`; return result.rows.map(rowToEpisode); }
export async function getPodcastEpisodeBySlug(slug: string) { await ensureSchema(); const result = await sql`SELECT * FROM podcast_episodes WHERE slug = ${slug} LIMIT 1`; return result.rows[0] ? rowToEpisode(result.rows[0]) : null; }
export async function createPodcastEpisode(input: Omit<PodcastEpisode, "id" | "status">) {
  await ensureSchema(); const id = crypto.randomUUID();
  await sql`INSERT INTO podcast_episodes (id, slug, title, description, published_at, duration, cover_image, audio_url, transcript, youtube_url, topic_slugs, series_slug, question_slugs, article_slugs, resource_slugs) VALUES (${id}, ${input.slug}, ${input.title}, ${input.description}, ${input.publishedAt}, ${input.duration}, ${input.coverImage}, ${input.audioUrl}, ${input.transcript}, ${input.youtubeUrl}, ${JSON.stringify(input.topicSlugs)}::jsonb, ${input.seriesSlug}, ${JSON.stringify(input.questionSlugs)}::jsonb, ${JSON.stringify(input.articleSlugs)}::jsonb, ${JSON.stringify(input.resourceSlugs)}::jsonb)`;
  return getPodcastEpisodeBySlug(input.slug);
}
export async function updatePodcastEpisode(slug: string, input: Partial<Pick<PodcastEpisode, "title" | "description" | "publishedAt" | "duration" | "audioUrl" | "transcript" | "youtubeUrl" | "topicSlugs" | "seriesSlug" | "questionSlugs" | "articleSlugs" | "resourceSlugs">>) {
  await ensureSchema();
  await sql`UPDATE podcast_episodes SET title = COALESCE(${input.title ?? null}, title), description = COALESCE(${input.description ?? null}, description), published_at = COALESCE(${input.publishedAt ?? null}, published_at), duration = ${input.duration ?? null}, audio_url = COALESCE(${input.audioUrl ?? null}, audio_url), transcript = ${input.transcript ?? null}, youtube_url = ${input.youtubeUrl ?? null}, topic_slugs = COALESCE(${input.topicSlugs ? JSON.stringify(input.topicSlugs) : null}::jsonb, topic_slugs), series_slug = ${input.seriesSlug ?? null}, question_slugs = COALESCE(${input.questionSlugs ? JSON.stringify(input.questionSlugs) : null}::jsonb, question_slugs), article_slugs = COALESCE(${input.articleSlugs ? JSON.stringify(input.articleSlugs) : null}::jsonb, article_slugs), resource_slugs = COALESCE(${input.resourceSlugs ? JSON.stringify(input.resourceSlugs) : null}::jsonb, resource_slugs), updated_at = now() WHERE slug = ${slug}`;
  return getPodcastEpisodeBySlug(slug);
}
export async function updatePodcastEpisodeStatus(slug: string, status: "draft" | "published") { await ensureSchema(); await sql`UPDATE podcast_episodes SET status = ${status}, updated_at = now() WHERE slug = ${slug}`; return getPodcastEpisodeBySlug(slug); }
export async function deletePodcastEpisode(slug: string) { await ensureSchema(); await sql`DELETE FROM podcast_episodes WHERE slug = ${slug}`; }
