import "server-only";

import crypto from "node:crypto";
import { sql } from "@vercel/postgres";
import { journals } from "@/app/data/journals";
import { reflections } from "@/app/data/reflections";
import { siteConfig } from "@/app/content/site-config";
import { sendNewsletterEmail, renderNewsletterEmail, renderPlainTextNewsletter } from "@/app/lib/email";

export type SubscriberStatus = "pending" | "subscribed" | "unsubscribed";

export type SubscriberRecord = {
  id: string;
  name?: string | null;
  email: string;
  status: SubscriberStatus;
  subscribed_at: string | null;
  unsubscribed_at: string | null;
  created_at: string;
  updated_at: string;
  confirmation_token_hash: string | null;
  unsubscribe_token_hash: string | null;
};

export type NewsletterActionResult = {
  message: string;
  status: "idle" | "success" | "error";
};

export type NewsletterSubscriberSummary = {
  pending: number;
  subscribed: number;
  unsubscribed: number;
  total: number;
};

export type NewsletterBroadcastRecord = {
  id: string;
  subject: string;
  body?: string;
  recipient_count: number;
  successful_recipient_count?: number;
  failed_recipient_count?: number;
  status: "draft" | "sent" | "failed";
  created_at: string;
  sent_at: string | null;
  error_message?: string | null;
};

export type NewsletterBroadcastRecipient = {
  id: string;
  broadcast_id: string;
  subscriber_id: string | null;
  email: string;
  delivery_status: "sent" | "failed";
  error_message: string | null;
  created_at: string;
};

export type BroadcastChannel = "email" | "push" | "both";

type NewsletterContentType = "reflection" | "journal";

type EmailDraft = {
  subject: string;
  title: string;
  paragraphs: string[];
  ctaLabel: string;
  ctaHref: string;
};

type BroadcastDraft = {
  subject: string;
  bodyParagraphs: string[];
  ctaLabel?: string;
  ctaHref?: string;
  footerNote?: string;
};

type NewsletterTokenPurpose = "confirm" | "unsubscribe";

type NewsletterTokenPayload = {
  id: string;
  email: string;
  purpose: NewsletterTokenPurpose;
};

let schemaPromise: Promise<void> | null = null;

function nowIso() {
  return new Date().toISOString();
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getTokenSecret() {
  return process.env.NEWSLETTER_TOKEN_SECRET ?? "dev-newsletter-token-secret";
}

function createSignedToken(payload: NewsletterTokenPayload) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", getTokenSecret()).update(encodedPayload).digest("base64url");
  return `${encodedPayload}.${signature}`;
}

function verifySignedToken(token: string, purpose: NewsletterTokenPurpose) {
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = crypto.createHmac("sha256", getTokenSecret()).update(encodedPayload).digest("base64url");
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (providedBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(providedBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as NewsletterTokenPayload;

    if (payload.purpose !== purpose || !payload.id || !payload.email) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function getSiteUrl() {
  return siteConfig.url.replace(/\/$/, "");
}

function unsubscribeUrl(token: string) {
  return `${getSiteUrl()}/unsubscribe?token=${encodeURIComponent(token)}`;
}

async function ensureSchema() {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
          id text PRIMARY KEY,
          email text UNIQUE NOT NULL,
          status text NOT NULL CHECK (status IN ('pending', 'subscribed', 'unsubscribed')),
          subscribed_at timestamptz,
          unsubscribed_at timestamptz,
          confirmation_token_hash text,
          unsubscribe_token_hash text,
          created_at timestamptz NOT NULL DEFAULT now(),
          updated_at timestamptz NOT NULL DEFAULT now()
        )
      `;

      await sql`ALTER TABLE newsletter_subscribers ALTER COLUMN unsubscribe_token_hash DROP NOT NULL`;

      await sql`
        CREATE TABLE IF NOT EXISTS newsletter_broadcasts (
          id text PRIMARY KEY,
          subject text NOT NULL,
          body text NOT NULL,
          recipient_count integer NOT NULL DEFAULT 0,
          status text NOT NULL CHECK (status IN ('draft', 'sent', 'failed')),
          created_at timestamptz NOT NULL DEFAULT now(),
          sent_at timestamptz,
          error_message text
        )
      `;

      await sql`ALTER TABLE newsletter_broadcasts ADD COLUMN IF NOT EXISTS successful_recipient_count integer NOT NULL DEFAULT 0`;
      await sql`ALTER TABLE newsletter_broadcasts ADD COLUMN IF NOT EXISTS failed_recipient_count integer NOT NULL DEFAULT 0`;

      await sql`
        CREATE TABLE IF NOT EXISTS newsletter_broadcast_recipients (
          id text PRIMARY KEY,
          broadcast_id text NOT NULL REFERENCES newsletter_broadcasts(id) ON DELETE CASCADE,
          subscriber_id text,
          email text NOT NULL,
          delivery_status text NOT NULL CHECK (delivery_status IN ('sent', 'failed')),
          error_message text,
          created_at timestamptz NOT NULL DEFAULT now()
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS newsletter_content_notifications (
          id text PRIMARY KEY,
          content_type text NOT NULL,
          content_slug text NOT NULL,
          subject text NOT NULL,
          recipient_count integer NOT NULL DEFAULT 0,
          status text NOT NULL CHECK (status IN ('draft', 'sent', 'failed')),
          created_at timestamptz NOT NULL DEFAULT now(),
          sent_at timestamptz,
          error_message text,
          UNIQUE (content_type, content_slug)
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS push_subscriptions (
          id text PRIMARY KEY,
          subscriber_id text,
          endpoint text UNIQUE NOT NULL,
          expiration_time timestamptz,
          p256dh text NOT NULL,
          auth text NOT NULL,
          status text NOT NULL CHECK (status IN ('active', 'inactive')),
          created_at timestamptz NOT NULL DEFAULT now(),
          updated_at timestamptz NOT NULL DEFAULT now()
        )
      `;
    })();
  }

  await schemaPromise;
}

async function getSubscriberByEmail(email: string) {
  const result = await sql<SubscriberRecord>`
    SELECT * FROM newsletter_subscribers WHERE email = ${email} LIMIT 1
  `;

  return result.rows[0] ?? null;
}

function buildContentDraft(contentType: NewsletterContentType, slug: string): EmailDraft | null {
  if (contentType === "reflection") {
    const reflection = reflections.find((item) => item.contentSlug === slug);

    if (!reflection) {
      return null;
    }

    return {
      subject: `New Reflection: ${reflection.title}`,
      title: reflection.title,
      paragraphs: [reflection.introduction, ...reflection.sections.flatMap((section) => section.paragraphs).slice(0, 2)],
      ctaLabel: "Read the reflection",
      ctaHref: `${getSiteUrl()}/reflections/${reflection.contentSlug}`,
    };
  }

  const journal = journals.find((item) => item.contentSlug === slug);

  if (!journal) {
    return null;
  }

  return {
    subject: `New Journal: ${journal.title}`,
    title: journal.title,
    paragraphs: [journal.introduction, ...journal.sections.flatMap((section) => section.paragraphs).slice(0, 2)],
    ctaLabel: "Read the journal",
    ctaHref: `${getSiteUrl()}/journals/${journal.contentSlug}`,
  };
}

async function storeSubscriber(input: {
  email: string;
  status: SubscriberStatus;
  subscribedAt: string | null;
  unsubscribedAt: string | null;
  existingId?: string;
}) {
  if (input.existingId) {
    await sql`
      UPDATE newsletter_subscribers
      SET status = ${input.status},
          subscribed_at = ${input.subscribedAt},
          unsubscribed_at = ${input.unsubscribedAt},
          confirmation_token_hash = NULL,
          unsubscribe_token_hash = NULL,
          updated_at = ${nowIso()}
      WHERE id = ${input.existingId}
    `;

    return input.existingId;
  }

  const id = crypto.randomUUID();
  await sql`
    INSERT INTO newsletter_subscribers (
      id,
      email,
      status,
      subscribed_at,
      unsubscribed_at,
      confirmation_token_hash,
      unsubscribe_token_hash,
      created_at,
      updated_at
    ) VALUES (
      ${id},
      ${input.email},
      ${input.status},
      ${input.subscribedAt},
      ${input.unsubscribedAt},
      NULL,
      NULL,
      ${nowIso()},
      ${nowIso()}
    )
  `;

  return id;
}

export async function subscribeToNewsletter(emailInput: string) {
  await ensureSchema();

  const email = normalizeEmail(emailInput);
  if (!isValidEmail(email)) {
    return { status: "error" as const, message: "Please enter a valid email address." };
  }

  const existing = await getSubscriberByEmail(email);
  if (existing?.status === "subscribed") {
    return { status: "success" as const, message: "You're already subscribed." };
  }

  await storeSubscriber({
    email,
    status: "subscribed",
    subscribedAt: nowIso(),
    unsubscribedAt: null,
    existingId: existing?.id,
  });

  return { status: "success" as const, message: "You're subscribed to Spirit & Life." };
}

export async function confirmNewsletterSubscription(token: string) {
  await ensureSchema();

  const payload = verifySignedToken(token, "confirm");
  if (!payload) {
    return { status: "error" as const, message: "This confirmation link is no longer valid." };
  }

  const subscriber = await getSubscriberByEmail(payload.email);
  if (!subscriber || subscriber.id !== payload.id) {
    return { status: "error" as const, message: "This confirmation link is no longer valid." };
  }

  await sql`
    UPDATE newsletter_subscribers
    SET status = 'subscribed',
        subscribed_at = COALESCE(subscribed_at, ${nowIso()}),
        unsubscribed_at = NULL,
        confirmation_token_hash = NULL,
        updated_at = ${nowIso()}
    WHERE id = ${subscriber.id}
  `;

  return { status: "success" as const, message: "Thank you. You're subscribed to Spirit & Life." };
}

export async function unsubscribeNewsletter(token: string) {
  await ensureSchema();

  const payload = verifySignedToken(token, "unsubscribe");
  if (!payload) {
    return { status: "error" as const, message: "This unsubscribe link is no longer valid." };
  }

  const subscriber = await getSubscriberByEmail(payload.email);
  if (!subscriber || subscriber.id !== payload.id) {
    return { status: "error" as const, message: "This unsubscribe link is no longer valid." };
  }

  await sql`
    UPDATE newsletter_subscribers
    SET status = 'unsubscribed',
        unsubscribed_at = ${nowIso()},
        confirmation_token_hash = NULL,
        updated_at = ${nowIso()}
    WHERE id = ${subscriber.id}
  `;

  return { status: "success" as const, message: "You have been unsubscribed from Spirit & Life emails." };
}

export async function countActiveNewsletterSubscribers() {
  await ensureSchema();

  const result = await sql<{ count: string }>`
    SELECT COUNT(*)::text AS count FROM newsletter_subscribers WHERE status = 'subscribed'
  `;

  return Number(result.rows[0]?.count ?? 0);
}

export async function listActiveNewsletterSubscribers() {
  await ensureSchema();

  const result = await sql<Pick<SubscriberRecord, "id" | "email">>`
    SELECT id, email FROM newsletter_subscribers WHERE status = 'subscribed' ORDER BY created_at ASC
  `;

  return result.rows;
}

export async function listNewsletterSubscribers() {
  await ensureSchema();
  const result = await sql<SubscriberRecord>`
    SELECT * FROM newsletter_subscribers ORDER BY created_at DESC
  `;
  return result.rows;
}

export async function removeNewsletterSubscriber(id: string) {
  await ensureSchema();
  const result = await sql<{ id: string }>`DELETE FROM newsletter_subscribers WHERE id = ${id} RETURNING id`;
  return Boolean(result.rows[0]);
}

export async function getNewsletterSubscriberSummary(): Promise<NewsletterSubscriberSummary> {
  await ensureSchema();

  const result = await sql<{ status: SubscriberStatus; count: string }>`
    SELECT status, COUNT(*)::text AS count
    FROM newsletter_subscribers
    GROUP BY status
  `;

  const summary: NewsletterSubscriberSummary = {
    pending: 0,
    subscribed: 0,
    unsubscribed: 0,
    total: 0,
  };

  for (const row of result.rows) {
    const count = Number(row.count);

    if (row.status === "pending") {
      summary.pending = count;
    }

    if (row.status === "subscribed") {
      summary.subscribed = count;
    }

    if (row.status === "unsubscribed") {
      summary.unsubscribed = count;
    }

    summary.total += count;
  }

  return summary;
}

export async function listRecentNewsletterBroadcasts(limit = 10) {
  await ensureSchema();

  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(50, Math.floor(limit))) : 10;

  const result = await sql<NewsletterBroadcastRecord>`
    SELECT id, subject, recipient_count, successful_recipient_count, failed_recipient_count, status, created_at, sent_at, error_message
    FROM newsletter_broadcasts
    ORDER BY created_at DESC
    LIMIT ${safeLimit}
  `;

  return result.rows;
}

export async function countNewsletterBroadcasts() {
  await ensureSchema();
  const result = await sql<{ count: string }>`SELECT COUNT(*)::text AS count FROM newsletter_broadcasts`;
  return Number(result.rows[0]?.count ?? 0);
}

export async function getNewsletterBroadcast(id: string) {
  await ensureSchema();
  const broadcast = await sql<NewsletterBroadcastRecord>`
    SELECT id, subject, body, recipient_count, successful_recipient_count, failed_recipient_count, status, created_at, sent_at, error_message
    FROM newsletter_broadcasts WHERE id = ${id} LIMIT 1
  `;
  if (!broadcast.rows[0]) return null;

  const recipients = await sql<NewsletterBroadcastRecipient>`
    SELECT id, broadcast_id, subscriber_id, email, delivery_status, error_message, created_at
    FROM newsletter_broadcast_recipients WHERE broadcast_id = ${id} ORDER BY created_at ASC
  `;
  return { ...broadcast.rows[0], recipients: recipients.rows };
}

export async function deleteNewsletterBroadcast(id: string) {
  await ensureSchema();
  const result = await sql<{ id: string }>`DELETE FROM newsletter_broadcasts WHERE id = ${id} RETURNING id`;
  return Boolean(result.rows[0]);
}

export async function sendManualNewsletterBroadcast(draft: BroadcastDraft & { recipientIds?: string[] }) {
  await ensureSchema();

  const activeSubscribers = await listActiveNewsletterSubscribers();
  const selectedIds = new Set(draft.recipientIds ?? []);
  const subscribers = draft.recipientIds?.length
    ? activeSubscribers.filter((subscriber) => selectedIds.has(subscriber.id))
    : activeSubscribers;
  const recipientCount = subscribers.length;
  const broadcastId = crypto.randomUUID();

  await sql`
    INSERT INTO newsletter_broadcasts (
      id,
      subject,
      body,
      recipient_count,
      status,
      created_at,
      sent_at
    ) VALUES (
      ${broadcastId},
      ${draft.subject},
      ${draft.bodyParagraphs.join("\n\n")},
      ${recipientCount},
      'draft',
      ${nowIso()},
      NULL
    )
  `;

  let sentCount = 0;
  let failedCount = 0;

  for (const subscriber of subscribers) {
    const unsubscribeLink = unsubscribeUrl(createSignedToken({ id: subscriber.id, email: subscriber.email, purpose: "unsubscribe" }));
    const result = await sendNewsletterEmail({
      to: subscriber.email,
      subject: draft.subject,
      html: renderNewsletterEmail({
        preheader: draft.subject,
        headline: draft.subject,
        bodyParagraphs: draft.bodyParagraphs,
        ctaLabel: draft.ctaLabel,
        ctaHref: draft.ctaHref,
        footerNote: draft.footerNote ?? "You are receiving this because you subscribed to Spirit & Life.",
        unsubscribeHref: unsubscribeLink,
      }),
      text: renderPlainTextNewsletter({
        headline: draft.subject,
        paragraphs: draft.bodyParagraphs,
        ctaLabel: draft.ctaLabel,
        ctaHref: draft.ctaHref,
        unsubscribeHref: unsubscribeLink,
      }),
    });

    if (result.ok) {
      sentCount += 1;
    } else {
      failedCount += 1;
    }

    await sql`
      INSERT INTO newsletter_broadcast_recipients (id, broadcast_id, subscriber_id, email, delivery_status, error_message, created_at)
      VALUES (${crypto.randomUUID()}, ${broadcastId}, ${subscriber.id}, ${subscriber.email}, ${result.ok ? "sent" : "failed"}, ${result.ok ? null : "Delivery failed."}, ${nowIso()})
    `;
  }

  await sql`
    UPDATE newsletter_broadcasts
    SET status = ${sentCount > 0 ? "sent" : "failed"},
        recipient_count = ${recipientCount},
        successful_recipient_count = ${sentCount},
        failed_recipient_count = ${failedCount},
        sent_at = ${sentCount > 0 ? nowIso() : null},
        error_message = ${sentCount > 0 ? null : "No subscribers received the broadcast."}
    WHERE id = ${broadcastId}
  `;

  return {
    status: sentCount > 0 ? ("success" as const) : ("error" as const),
    message: sentCount > 0
      ? failedCount
        ? `Newsletter sent to ${sentCount} of ${recipientCount} subscribers. ${failedCount} delivery ${failedCount === 1 ? "failed" : "failures"}.`
        : `Newsletter sent successfully to ${sentCount} subscriber${sentCount === 1 ? "" : "s"}.`
      : "No active subscribers received the broadcast.",
  };
}

export async function publishContentNotification(contentType: NewsletterContentType, slug: string) {
  await ensureSchema();

  const draft = buildContentDraft(contentType, slug);
  if (!draft) {
    return { status: "error" as const, message: "The selected content could not be found." };
  }

  const existing = await sql<{ id: string; status: string }>`
    SELECT id, status FROM newsletter_content_notifications WHERE content_type = ${contentType} AND content_slug = ${slug} LIMIT 1
  `;

  if (existing.rows[0]?.status === "sent") {
    return { status: "success" as const, message: "This content has already been announced." };
  }

  const subscribers = await listActiveNewsletterSubscribers();
  const recipientCount = subscribers.length;

  const text = renderPlainTextNewsletter({
    headline: draft.title,
    paragraphs: draft.paragraphs,
    ctaLabel: draft.ctaLabel,
    ctaHref: draft.ctaHref,
    unsubscribeHref: `${getSiteUrl()}/unsubscribe`,
  });

  await sql`
    INSERT INTO newsletter_content_notifications (
      id,
      content_type,
      content_slug,
      subject,
      recipient_count,
      status,
      created_at,
      sent_at
    ) VALUES (
      ${crypto.randomUUID()},
      ${contentType},
      ${slug},
      ${draft.subject},
      ${recipientCount},
      'draft',
      ${nowIso()},
      NULL
    )
    ON CONFLICT (content_type, content_slug) DO UPDATE
    SET subject = EXCLUDED.subject,
        recipient_count = EXCLUDED.recipient_count,
        status = 'draft',
        sent_at = NULL,
        error_message = NULL
  `;

  let sentCount = 0;

  for (const subscriber of subscribers) {
    const unsubscribeLink = unsubscribeUrl(createSignedToken({ id: subscriber.id, email: subscriber.email, purpose: "unsubscribe" }));
    const result = await sendNewsletterEmail({
      to: subscriber.email,
      subject: draft.subject,
      html: renderNewsletterEmail({
        preheader: draft.subject,
        headline: draft.title,
        bodyParagraphs: draft.paragraphs,
        ctaLabel: draft.ctaLabel,
        ctaHref: draft.ctaHref,
        footerNote: "You are receiving this because you subscribed to Spirit & Life.",
        unsubscribeHref: unsubscribeLink,
      }),
      text: `${text}\n\nUnsubscribe: ${unsubscribeLink}`,
    });

    if (result.ok) {
      sentCount += 1;
    }
  }

  await sql`
    UPDATE newsletter_content_notifications
    SET status = ${sentCount > 0 ? "sent" : "failed"},
        recipient_count = ${recipientCount},
        sent_at = ${sentCount > 0 ? nowIso() : null},
        error_message = ${sentCount > 0 ? null : "No subscribers received the content email."}
    WHERE content_type = ${contentType} AND content_slug = ${slug}
  `;

  return {
    status: sentCount > 0 ? ("success" as const) : ("error" as const),
    message: sentCount > 0 ? `Published content email sent to ${sentCount} subscriber${sentCount === 1 ? "" : "s"}.` : "No active subscribers received the email.",
  };
}
