import "server-only";

import crypto from "node:crypto";
import { sql } from "@vercel/postgres";
import webpush from "web-push";

type PushSubscriptionPayload = {
  endpoint: string;
  expirationTime?: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
};

let schemaReady: Promise<void> | null = null;

export type PushSubscriberSummary = {
  active: number;
  inactive: number;
  total: number;
};

export type PushSubscriberRecord = {
  id: string;
  subscriber_id: string | null;
  endpoint: string;
  expiration_time: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
};

function nowIso() {
  return new Date().toISOString();
}

function ensureVapidConfiguration() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT ?? `mailto:${process.env.NEWSLETTER_FROM_EMAIL ?? "hello@spiritandlife.example"}`;

  if (publicKey && privateKey) {
    webpush.setVapidDetails(subject, publicKey, privateKey);
    return true;
  }

  return false;
}

async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
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

  await schemaReady;
}

export async function savePushSubscription(subscription: PushSubscriptionPayload) {
  await ensureSchema();

  const id = crypto.randomUUID();

  await sql`
    INSERT INTO push_subscriptions (
      id,
      subscriber_id,
      endpoint,
      expiration_time,
      p256dh,
      auth,
      status,
      created_at,
      updated_at
    ) VALUES (
      ${id},
      NULL,
      ${subscription.endpoint},
      ${subscription.expirationTime ? new Date(subscription.expirationTime).toISOString() : null},
      ${subscription.keys.p256dh},
      ${subscription.keys.auth},
      'active',
      ${nowIso()},
      ${nowIso()}
    )
    ON CONFLICT (endpoint) DO UPDATE
    SET expiration_time = EXCLUDED.expiration_time,
        p256dh = EXCLUDED.p256dh,
        auth = EXCLUDED.auth,
        status = 'active',
        updated_at = ${nowIso()}
  `;

  return { status: "success" as const, message: "Push subscription saved." };
}

export async function removePushSubscription(endpoint: string) {
  await ensureSchema();

  await sql`
    UPDATE push_subscriptions
    SET status = 'inactive',
        updated_at = ${nowIso()}
    WHERE endpoint = ${endpoint}
  `;

  return { status: "success" as const, message: "Push subscription removed." };
}

export async function broadcastPushNotification(payload: { title: string; body: string; url?: string }) {
  await ensureSchema();

  if (!ensureVapidConfiguration()) {
    return { status: "error" as const, message: "Push notifications are not configured." };
  }

  const result = await sql<{ endpoint: string; expirationTime: string | null; p256dh: string; auth: string }>`
    SELECT endpoint, expiration_time AS "expirationTime", p256dh, auth
    FROM push_subscriptions
    WHERE status = 'active'
    ORDER BY created_at ASC
  `;

  let sentCount = 0;

  for (const subscription of result.rows) {
    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          expirationTime: subscription.expirationTime ? new Date(subscription.expirationTime).getTime() : null,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth,
          },
        },
        JSON.stringify(payload),
      );
      sentCount += 1;
    } catch {
      await sql`
        UPDATE push_subscriptions
        SET status = 'inactive',
            updated_at = ${nowIso()}
        WHERE endpoint = ${subscription.endpoint}
      `;
    }
  }

  return {
    status: sentCount > 0 ? ("success" as const) : ("error" as const),
    message: sentCount > 0 ? `Push notification sent to ${sentCount} subscription${sentCount === 1 ? "" : "s"}.` : "No active push subscriptions received the notification.",
  };
}

export async function getPushSubscriberSummary(): Promise<PushSubscriberSummary> {
  await ensureSchema();

  const result = await sql<{ status: "active" | "inactive"; count: string }>`
    SELECT status, COUNT(*)::text AS count
    FROM push_subscriptions
    GROUP BY status
  `;

  const summary: PushSubscriberSummary = {
    active: 0,
    inactive: 0,
    total: 0,
  };

  for (const row of result.rows) {
    const count = Number(row.count);

    if (row.status === "active") {
      summary.active = count;
    }

    if (row.status === "inactive") {
      summary.inactive = count;
    }

    summary.total += count;
  }

  return summary;
}

export async function listPushSubscriberRecords(): Promise<PushSubscriberRecord[]> {
  await ensureSchema();
  const result = await sql<PushSubscriberRecord>`
    SELECT id, subscriber_id, endpoint, expiration_time, status, created_at, updated_at
    FROM push_subscriptions ORDER BY created_at DESC
  `;
  return result.rows;
}
