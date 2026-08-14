import "server-only";

import crypto from "node:crypto";
import { sql } from "@vercel/postgres";

export type DraftContentType = "reflection" | "journal" | "book";
export type DraftStatus = "draft" | "published";

export type ContentDraft = {
  id: string;
  content_type: DraftContentType;
  title: string;
  slug: string;
  status: DraftStatus;
  introduction: string | null;
  body: Record<string, unknown>;
  category: string | null;
  tags: string[];
  image_reference: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  author_id: string | null;
};

export type DraftInput = {
  contentType: DraftContentType;
  title: string;
  slug: string;
  introduction?: string;
  body?: Record<string, unknown>;
  category?: string;
  tags?: string[];
  imageReference?: string;
  authorId?: string;
};

let schemaPromise: Promise<void> | null = null;

function nowIso() {
  return new Date().toISOString();
}

export function normalizeDraftSlug(value: string) {
  return value.trim().toLowerCase();
}

export function isValidDraftSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 120;
}

async function ensureSchema() {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS content_drafts (
          id text PRIMARY KEY,
          content_type text NOT NULL CHECK (content_type IN ('reflection', 'journal', 'book')),
          title text NOT NULL,
          slug text NOT NULL,
          status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
          introduction text,
          body jsonb NOT NULL DEFAULT '{}'::jsonb,
          category text,
          tags jsonb NOT NULL DEFAULT '[]'::jsonb,
          image_reference text,
          created_at timestamptz NOT NULL DEFAULT now(),
          updated_at timestamptz NOT NULL DEFAULT now(),
          published_at timestamptz,
          author_id text,
          UNIQUE (content_type, slug)
        )
      `;

      await sql`CREATE INDEX IF NOT EXISTS content_drafts_content_type_idx ON content_drafts (content_type)`;
      await sql`CREATE INDEX IF NOT EXISTS content_drafts_status_idx ON content_drafts (status)`;
      await sql`CREATE INDEX IF NOT EXISTS content_drafts_updated_at_idx ON content_drafts (updated_at DESC)`;
    })();
  }

  await schemaPromise;
}

export async function listDrafts() {
  await ensureSchema();

  const result = await sql<ContentDraft>`
    SELECT *
    FROM content_drafts
    WHERE status = 'draft'
    ORDER BY updated_at DESC
  `;

  return result.rows;
}

export async function listAllDrafts(contentType?: DraftContentType) {
  await ensureSchema();

  const result = contentType
    ? await sql<ContentDraft>`
        SELECT * FROM content_drafts WHERE content_type = ${contentType} ORDER BY updated_at DESC
      `
    : await sql<ContentDraft>`
        SELECT * FROM content_drafts ORDER BY updated_at DESC
      `;

  return result.rows;
}

export async function getDraft(id: string) {
  await ensureSchema();

  const result = await sql<ContentDraft>`
    SELECT * FROM content_drafts WHERE id = ${id} LIMIT 1
  `;

  return result.rows[0] ?? null;
}

export async function getDraftByTypeAndSlug(contentType: DraftContentType, slug: string) {
  await ensureSchema();

  const normalizedSlug = normalizeDraftSlug(slug);

  const result = await sql<ContentDraft>`
    SELECT * FROM content_drafts WHERE content_type = ${contentType} AND slug = ${normalizedSlug} LIMIT 1
  `;

  return result.rows[0] ?? null;
}

export async function listPublishedDrafts(
  contentType?: DraftContentType,
) {
  await ensureSchema();

  const result = contentType
    ? await sql<ContentDraft>`
        SELECT *
        FROM content_drafts
        WHERE status = 'published'
          AND content_type = ${contentType}
        ORDER BY published_at DESC NULLS LAST, updated_at DESC
      `
    : await sql<ContentDraft>`
        SELECT *
        FROM content_drafts
        WHERE status = 'published'
        ORDER BY published_at DESC NULLS LAST, updated_at DESC
      `;

  return result.rows;
}

export async function getPublishedDraft(
  contentType: DraftContentType,
  slug: string,
) {
  await ensureSchema();

  const normalizedSlug = normalizeDraftSlug(slug);

  const result = await sql<ContentDraft>`
    SELECT *
    FROM content_drafts
    WHERE status = 'published'
      AND content_type = ${contentType}
      AND slug = ${normalizedSlug}
    LIMIT 1
  `;

  return result.rows[0] ?? null;
}

export async function createDraft(input: DraftInput) {
  await ensureSchema();

  const id = crypto.randomUUID();
  const timestamp = nowIso();
  const slug = normalizeDraftSlug(input.slug);

  await sql`
    INSERT INTO content_drafts (
      id,
      content_type,
      title,
      slug,
      status,
      introduction,
      body,
      category,
      tags,
      image_reference,
      created_at,
      updated_at,
      published_at,
      author_id
    ) VALUES (
      ${id},
      ${input.contentType},
      ${input.title},
      ${slug},
      'draft',
      ${input.introduction ?? null},
      ${JSON.stringify(input.body ?? {})}::jsonb,
      ${input.category ?? null},
      ${JSON.stringify(input.tags ?? [])}::jsonb,
      ${input.imageReference ?? null},
      ${timestamp},
      ${timestamp},
      NULL,
      ${input.authorId ?? null}
    )
  `;

  return getDraft(id);
}

export async function updateDraft(id: string, input: DraftInput) {
  await ensureSchema();

  const slug = normalizeDraftSlug(input.slug);

  await sql`
    UPDATE content_drafts
    SET content_type = ${input.contentType},
        title = ${input.title},
        slug = ${slug},
        introduction = ${input.introduction ?? null},
        body = ${JSON.stringify(input.body ?? {})}::jsonb,
        category = ${input.category ?? null},
        tags = ${JSON.stringify(input.tags ?? [])}::jsonb,
        image_reference = ${input.imageReference ?? null},
        updated_at = ${nowIso()}
    WHERE id = ${id}
  `;

  return getDraft(id);
}

export async function updateDraftImage(id: string, imageReference: string) {
  await ensureSchema();

  await sql`
    UPDATE content_drafts
    SET image_reference = ${imageReference}, updated_at = ${nowIso()}
    WHERE id = ${id}
  `;

  return getDraft(id);
}

export async function publishDraft(id: string) {
  await ensureSchema();

  const timestamp = nowIso();

  await sql`
    UPDATE content_drafts
    SET status = 'published',
        published_at = COALESCE(published_at, ${timestamp}),
        updated_at = ${timestamp}
    WHERE id = ${id}
  `;

  return getDraft(id);
}