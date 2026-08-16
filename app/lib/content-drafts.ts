import "server-only";

import crypto from "node:crypto";
import { sql } from "@vercel/postgres";

export type DraftContentType = "reflection" | "journal" | "book";
export type DraftStatus = "draft" | "published";

// Snapshot of the fields that are actually live on the public site. Saved
// edits update the working columns below but never touch this snapshot until
// Publish/Publish Changes is pressed.
export type PublishedSnapshot = {
  title: string;
  slug: string;
  introduction: string | null;
  body: Record<string, unknown>;
  category: string | null;
  tags: string[];
  image_reference: string | null;
};

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
  published_snapshot: PublishedSnapshot | null;
  has_unpublished_changes: boolean;
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
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120)
    .replace(/-+$/g, "");
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
          published_snapshot jsonb,
          has_unpublished_changes boolean NOT NULL DEFAULT false,
          UNIQUE (content_type, slug)
        )
      `;

      await sql`ALTER TABLE content_drafts ADD COLUMN IF NOT EXISTS published_snapshot jsonb`;
      await sql`ALTER TABLE content_drafts ADD COLUMN IF NOT EXISTS has_unpublished_changes boolean NOT NULL DEFAULT false`;

      await sql`
        CREATE TABLE IF NOT EXISTS content_deletions (
          content_type text NOT NULL CHECK (content_type IN ('reflection', 'journal', 'book')),
          slug text NOT NULL,
          deleted_at timestamptz NOT NULL DEFAULT now(),
          PRIMARY KEY (content_type, slug)
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

export async function listDeletedContentSlugs(contentType: DraftContentType) {
  await ensureSchema();
  const result = await sql<{ slug: string }>`SELECT slug FROM content_deletions WHERE content_type = ${contentType}`;
  return new Set(result.rows.map((row) => row.slug));
}

export async function isContentDeleted(contentType: DraftContentType, slug: string) {
  await ensureSchema();
  const result = await sql<{ slug: string }>`
    SELECT slug FROM content_deletions WHERE content_type = ${contentType} AND slug = ${normalizeDraftSlug(slug)} LIMIT 1
  `;
  return Boolean(result.rows[0]);
}

export async function deleteContent(contentType: DraftContentType, slug: string) {
  await ensureSchema();
  const normalizedSlug = normalizeDraftSlug(slug);
  await sql`
    DELETE FROM content_drafts
    WHERE content_type = ${contentType}
      AND (slug = ${normalizedSlug} OR published_snapshot->>'slug' = ${normalizedSlug})
  `;
  await sql`
    INSERT INTO content_deletions (content_type, slug, deleted_at)
    VALUES (${contentType}, ${normalizedSlug}, ${nowIso()})
    ON CONFLICT (content_type, slug) DO UPDATE SET deleted_at = EXCLUDED.deleted_at
  `;
}

// Overlays the published snapshot onto the row so public rendering always
// reflects the last-published version, never unpublished working edits.
function resolvePublishedContent(draft: ContentDraft): ContentDraft {
  if (!draft.published_snapshot) {
    return draft;
  }

  const snapshot = draft.published_snapshot;

  return {
    ...draft,
    title: snapshot.title,
    slug: snapshot.slug,
    introduction: snapshot.introduction,
    body: snapshot.body,
    category: snapshot.category,
    tags: snapshot.tags,
    image_reference: snapshot.image_reference,
  };
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

  return result.rows.map(resolvePublishedContent);
}

export async function getPublishedDraft(
  contentType: DraftContentType,
  slug: string,
) {
  await ensureSchema();

  const normalizedSlug = normalizeDraftSlug(slug);

  // Match on the live (published_snapshot) slug when present so renaming the
  // working slug never breaks the currently-live public URL before publish.
  const result = await sql<ContentDraft>`
    SELECT *
    FROM content_drafts
    WHERE status = 'published'
      AND content_type = ${contentType}
      AND COALESCE(published_snapshot->>'slug', slug) = ${normalizedSlug}
    LIMIT 1
  `;

  const row = result.rows[0];
  return row ? resolvePublishedContent(row) : null;
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
        has_unpublished_changes = (status = 'published'),
        updated_at = ${nowIso()}
    WHERE id = ${id}
  `;

  return getDraft(id);
}

export async function updateDraftImage(id: string, imageReference: string) {
  await ensureSchema();

  await sql`
    UPDATE content_drafts
    SET image_reference = ${imageReference},
        has_unpublished_changes = (status = 'published'),
        updated_at = ${nowIso()}
    WHERE id = ${id}
  `;

  return getDraft(id);
}

// Snapshots the current working fields as the live published version. Saved
// edits made after this point only update the working columns again, leaving
// this snapshot (and therefore the public site) untouched until republished.
export async function publishDraft(id: string) {
  await ensureSchema();

  const timestamp = nowIso();

  await sql`
    UPDATE content_drafts
    SET status = 'published',
        published_snapshot = jsonb_build_object(
          'title', title,
          'slug', slug,
          'introduction', introduction,
          'body', body,
          'category', category,
          'tags', tags,
          'image_reference', image_reference
        ),
        has_unpublished_changes = false,
        published_at = COALESCE(published_at, ${timestamp}),
        updated_at = ${timestamp}
    WHERE id = ${id}
  `;

  return getDraft(id);
}
