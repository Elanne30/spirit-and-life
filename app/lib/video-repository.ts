import { sql } from "@vercel/postgres";

export type VideoStatus = "draft" | "published" | "archived";

export type VideoRecord = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  transcript: string | null;
  youtubeUrl: string | null;
  status: VideoStatus;
  publishedAt: string | null;
  destinations: string[];
  createdAt: string;
  updatedAt: string;
};

let videosSchemaPromise: Promise<void> | null = null;

async function ensureVideosSchema() {
  if (!videosSchemaPromise) {
    videosSchemaPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS videos (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          video_url TEXT,
          thumbnail_url TEXT,
          transcript TEXT,
          youtube_url TEXT,
          status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
          published_at TIMESTAMPTZ,
          destinations JSONB NOT NULL DEFAULT '[]'::jsonb,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS videos_status_idx ON videos(status)`;
      await sql`CREATE INDEX IF NOT EXISTS videos_published_at_idx ON videos(published_at DESC)`;
    })().catch((error) => {
      videosSchemaPromise = null;
      throw error;
    });
  }
  await videosSchemaPromise;
}

export async function listVideos(status?: VideoStatus) {
  await ensureVideosSchema();
  const result = status
    ? await sql`SELECT * FROM videos WHERE status = ${status} ORDER BY COALESCE(published_at, created_at) DESC`
    : await sql`SELECT * FROM videos ORDER BY COALESCE(published_at, created_at) DESC`;
  return result.rows as unknown as VideoRecord[];
}

export async function getVideoBySlug(slug: string) {
  await ensureVideosSchema();
  const result = await sql`SELECT * FROM videos WHERE slug = ${slug} LIMIT 1`;
  return (result.rows[0] as unknown as VideoRecord | undefined) ?? null;
}

export async function createVideo(input: Omit<VideoRecord, "id" | "createdAt" | "updatedAt">) {
  await ensureVideosSchema();
  const result = await sql`
    INSERT INTO videos (title, slug, description, video_url, thumbnail_url, transcript, youtube_url, status, published_at, destinations)
    VALUES (${input.title}, ${input.slug}, ${input.description}, ${input.videoUrl}, ${input.thumbnailUrl}, ${input.transcript}, ${input.youtubeUrl}, ${input.status}, ${input.publishedAt}, ${JSON.stringify(input.destinations)})
    RETURNING *
  `;
  return result.rows[0] as unknown as VideoRecord;
}
