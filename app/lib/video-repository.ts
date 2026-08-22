import { sql } from "@vercel/postgres";

export type VideoStatus = "draft" | "published" | "archived";
export const VIDEO_DESTINATIONS = ["home", "articles", "reflections", "journals", "resources"] as const;
export type VideoDestination = (typeof VIDEO_DESTINATIONS)[number];

export type VideoRecord = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  transcript: string | null;
  youtubeUrl: string | null;
  duration: string | null;
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
          duration TEXT,
          status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
          published_at TIMESTAMPTZ,
          destinations JSONB NOT NULL DEFAULT '[]'::jsonb,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`ALTER TABLE videos ADD COLUMN IF NOT EXISTS duration TEXT`;
      await sql`CREATE INDEX IF NOT EXISTS videos_status_idx ON videos(status)`;
      await sql`CREATE INDEX IF NOT EXISTS videos_published_at_idx ON videos(published_at DESC)`;
    })().catch((error) => {
      videosSchemaPromise = null;
      throw error;
    });
  }
  await videosSchemaPromise;
}

function mapVideo(row: Record<string, unknown>): VideoRecord {
  const destinations = Array.isArray(row.destinations)
    ? row.destinations.filter((value): value is string => typeof value === "string")
    : typeof row.destinations === "string"
      ? (() => { try { const parsed = JSON.parse(row.destinations as string); return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : []; } catch { return []; } })()
      : [];
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    slug: String(row.slug ?? ""),
    description: typeof row.description === "string" ? row.description : null,
    videoUrl: typeof row.video_url === "string" ? row.video_url : typeof row.videoUrl === "string" ? row.videoUrl : null,
    thumbnailUrl: typeof row.thumbnail_url === "string" ? row.thumbnail_url : typeof row.thumbnailUrl === "string" ? row.thumbnailUrl : null,
    transcript: typeof row.transcript === "string" ? row.transcript : null,
    youtubeUrl: typeof row.youtube_url === "string" ? row.youtube_url : typeof row.youtubeUrl === "string" ? row.youtubeUrl : null,
    duration: typeof row.duration === "string" ? row.duration : null,
    status: (row.status === "published" || row.status === "archived" ? row.status : "draft") as VideoStatus,
    publishedAt: typeof row.published_at === "string" ? row.published_at : typeof row.publishedAt === "string" ? row.publishedAt : null,
    destinations,
    createdAt: String(row.created_at ?? row.createdAt ?? ""),
    updatedAt: String(row.updated_at ?? row.updatedAt ?? ""),
  };
}

export async function listVideos(status?: VideoStatus) {
  await ensureVideosSchema();
  const result = status
    ? await sql`SELECT * FROM videos WHERE status = ${status} ORDER BY COALESCE(published_at, created_at) DESC`
    : await sql`SELECT * FROM videos ORDER BY COALESCE(published_at, created_at) DESC`;
  return result.rows.map((row) => mapVideo(row as Record<string, unknown>));
}

export async function listPublishedVideos(destination?: VideoDestination) {
  await ensureVideosSchema();
  const result = destination
    ? await sql`SELECT * FROM videos WHERE status = 'published' AND destinations @> ${JSON.stringify([destination])}::jsonb ORDER BY COALESCE(published_at, created_at) DESC`
    : await sql`SELECT * FROM videos WHERE status = 'published' ORDER BY COALESCE(published_at, created_at) DESC`;
  return result.rows.map((row) => mapVideo(row as Record<string, unknown>));
}

export async function getVideoBySlug(slug: string) {
  await ensureVideosSchema();
  const result = await sql`SELECT * FROM videos WHERE slug = ${slug} LIMIT 1`;
  return result.rows[0] ? mapVideo(result.rows[0] as Record<string, unknown>) : null;
}

export async function createVideo(input: Omit<VideoRecord, "id" | "createdAt" | "updatedAt">) {
  await ensureVideosSchema();
  const result = await sql`
    INSERT INTO videos (title, slug, description, video_url, thumbnail_url, transcript, youtube_url, duration, status, published_at, destinations)
    VALUES (${input.title}, ${input.slug}, ${input.description}, ${input.videoUrl}, ${input.thumbnailUrl}, ${input.transcript}, ${input.youtubeUrl}, ${input.duration}, ${input.status}, ${input.publishedAt}, ${JSON.stringify(input.destinations)})
    RETURNING *
  `;
  return mapVideo(result.rows[0] as Record<string, unknown>);
}

export async function updateVideo(id: string, input: Omit<VideoRecord, "id" | "createdAt" | "updatedAt">) {
  await ensureVideosSchema();
  const result = await sql`
    UPDATE videos SET
      title = ${input.title},
      slug = ${input.slug},
      description = ${input.description},
      video_url = ${input.videoUrl},
      thumbnail_url = ${input.thumbnailUrl},
      transcript = ${input.transcript},
      youtube_url = ${input.youtubeUrl},
      duration = ${input.duration},
      status = ${input.status},
      published_at = ${input.publishedAt},
      destinations = ${JSON.stringify(input.destinations)}::jsonb,
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return result.rows[0] ? mapVideo(result.rows[0] as Record<string, unknown>) : null;
}

export async function deleteVideo(id: string) {
  await ensureVideosSchema();
  const result = await sql`DELETE FROM videos WHERE id = ${id} RETURNING slug`;
  return result.rows[0] ? String(result.rows[0].slug) : null;
}
