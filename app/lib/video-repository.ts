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

export async function listVideos(status?: VideoStatus) {
  const result = status
    ? await sql`SELECT * FROM videos WHERE status = ${status} ORDER BY COALESCE(published_at, created_at) DESC`
    : await sql`SELECT * FROM videos ORDER BY COALESCE(published_at, created_at) DESC`;
  return result.rows as unknown as VideoRecord[];
}

export async function getVideoBySlug(slug: string) {
  const result = await sql`SELECT * FROM videos WHERE slug = ${slug} LIMIT 1`;
  return (result.rows[0] as unknown as VideoRecord | undefined) ?? null;
}

export async function createVideo(input: Omit<VideoRecord, "id" | "createdAt" | "updatedAt">) {
  const result = await sql`
    INSERT INTO videos (title, slug, description, video_url, thumbnail_url, transcript, youtube_url, status, published_at, destinations)
    VALUES (${input.title}, ${input.slug}, ${input.description}, ${input.videoUrl}, ${input.thumbnailUrl}, ${input.transcript}, ${input.youtubeUrl}, ${input.status}, ${input.publishedAt}, ${JSON.stringify(input.destinations)})
    RETURNING *
  `;
  return result.rows[0] as unknown as VideoRecord;
}
