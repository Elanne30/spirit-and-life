import "server-only";
import crypto from "node:crypto";
import { sql } from "@vercel/postgres";

export type ResourceStatus = "draft" | "published";
export type DownloadableResource = { id: string; slug: string; title: string; description: string; kind: "PDF" | "Audio" | "Document"; fileUrl: string | null; fileName: string | null; publishedAt: string; status: ResourceStatus };

async function ensureSchema() {
  await sql`CREATE TABLE IF NOT EXISTS downloadable_resources (id text PRIMARY KEY, slug text UNIQUE NOT NULL, title text NOT NULL, description text NOT NULL DEFAULT '', kind text NOT NULL, file_url text, file_name text, published_at timestamptz NOT NULL DEFAULT now(), status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())`;
}
function rowToResource(row: Record<string, unknown>): DownloadableResource { return { id: String(row.id), slug: String(row.slug), title: String(row.title), description: String(row.description ?? ""), kind: row.kind as DownloadableResource["kind"], fileUrl: row.file_url ? String(row.file_url) : null, fileName: row.file_name ? String(row.file_name) : null, publishedAt: new Date(String(row.published_at)).toISOString().slice(0, 10), status: row.status === "published" ? "published" : "draft" }; }
export async function listResources(publishedOnly = true) { await ensureSchema(); const result = publishedOnly ? await sql`SELECT * FROM downloadable_resources WHERE status = 'published' ORDER BY published_at DESC` : await sql`SELECT * FROM downloadable_resources ORDER BY updated_at DESC`; return result.rows.map(rowToResource); }
export async function getResourceBySlug(slug: string) { await ensureSchema(); const result = await sql`SELECT * FROM downloadable_resources WHERE slug = ${slug} LIMIT 1`; return result.rows[0] ? rowToResource(result.rows[0]) : null; }
export async function createResource(input: Omit<DownloadableResource, "id" | "status">) { await ensureSchema(); const id = crypto.randomUUID(); await sql`INSERT INTO downloadable_resources (id, slug, title, description, kind, file_url, file_name, published_at, status) VALUES (${id}, ${input.slug}, ${input.title}, ${input.description}, ${input.kind}, ${input.fileUrl}, ${input.fileName}, ${input.publishedAt}, 'draft')`; return getResourceBySlug(input.slug); }
export async function updateResourceStatus(slug: string, status: ResourceStatus) { await ensureSchema(); await sql`UPDATE downloadable_resources SET status = ${status}, updated_at = now() WHERE slug = ${slug}`; return getResourceBySlug(slug); }
