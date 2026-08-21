import "server-only";
import crypto from "node:crypto";
import { sql } from "@vercel/postgres";

export type DownloadableResource = { id: string; slug: string; title: string; description: string; kind: "PDF" | "Audio" | "Document"; fileUrl: string; fileName: string | null; publishedAt: string };

let schemaPromise: Promise<void> | null = null;
async function ensureSchema() {
  if (!schemaPromise) schemaPromise = (async () => {
    await sql`CREATE TABLE IF NOT EXISTS downloadable_resources (id text PRIMARY KEY, slug text UNIQUE NOT NULL, title text NOT NULL, description text NOT NULL DEFAULT '', kind text NOT NULL, file_url text NOT NULL, file_name text, published_at timestamptz NOT NULL DEFAULT now(), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())`;
    await sql`CREATE INDEX IF NOT EXISTS downloadable_resources_published_at_idx ON downloadable_resources(published_at DESC)`;
  })();
  await schemaPromise;
}

function rowToResource(row: Record<string, unknown>): DownloadableResource { return { id: String(row.id), slug: String(row.slug), title: String(row.title), description: String(row.description ?? ""), kind: row.kind === "Audio" ? "Audio" : row.kind === "Document" ? "Document" : "PDF", fileUrl: String(row.file_url), fileName: row.file_name ? String(row.file_name) : null, publishedAt: new Date(String(row.published_at)).toISOString().slice(0, 10) }; }

export async function listDownloadableResources() { await ensureSchema(); const result = await sql`SELECT * FROM downloadable_resources ORDER BY published_at DESC, created_at DESC`; return result.rows.map(rowToResource); }
export async function getDownloadableResourceBySlug(slug: string) { await ensureSchema(); const result = await sql`SELECT * FROM downloadable_resources WHERE slug = ${slug} LIMIT 1`; return result.rows[0] ? rowToResource(result.rows[0]) : null; }
export async function createDownloadableResourceRecord(input: Omit<DownloadableResource, "id">) { await ensureSchema(); const id = crypto.randomUUID(); await sql`INSERT INTO downloadable_resources (id, slug, title, description, kind, file_url, file_name, published_at) VALUES (${id}, ${input.slug}, ${input.title}, ${input.description}, ${input.kind}, ${input.fileUrl}, ${input.fileName}, ${input.publishedAt})`; return getDownloadableResourceBySlug(input.slug); }
