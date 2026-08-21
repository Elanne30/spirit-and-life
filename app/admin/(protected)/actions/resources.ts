"use server";

import { sql } from "@vercel/postgres";
import { requireAdminActionAccess } from "@/app/lib/admin-session";
import crypto from "node:crypto";

export async function createDownloadableResource(input: { title: string; description: string; kind: "PDF" | "Audio" | "Document"; fileUrl: string; fileName?: string; publishedAt?: string }) {
  if (!(await requireAdminActionAccess())) return { ok: false as const, error: "Unauthorized." };
  const title = input.title.trim();
  if (!title || !input.fileUrl) return { ok: false as const, error: "Title and file are required." };
  const slug = title.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120) || `resource-${crypto.randomUUID().slice(0, 8)}`;
  await sql`CREATE TABLE IF NOT EXISTS downloadable_resources (id text PRIMARY KEY, slug text UNIQUE NOT NULL, title text NOT NULL, description text NOT NULL DEFAULT '', kind text NOT NULL, file_url text NOT NULL, file_name text, published_at timestamptz NOT NULL DEFAULT now(), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())`;
  await sql`INSERT INTO downloadable_resources (id, slug, title, description, kind, file_url, file_name, published_at) VALUES (${crypto.randomUUID()}, ${slug}, ${title}, ${input.description.trim()}, ${input.kind}, ${input.fileUrl}, ${input.fileName ?? null}, ${input.publishedAt || new Date().toISOString()})`;
  return { ok: true as const, slug };
}
