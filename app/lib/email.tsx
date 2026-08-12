import "server-only";

import crypto from "node:crypto";

const BREVO_TRANSACTIONAL_EMAIL_ENDPOINT = "https://api.brevo.com/v3/smtp/email";
const NEWSLETTER_SENDER_NAME = "Spirit & Life";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

type EmailShellProps = {
  preheader: string;
  headline: string;
  bodyParagraphs: string[];
  ctaLabel?: string;
  ctaHref?: string;
  footerNote?: string;
  unsubscribeHref: string;
};

type EmailDeliveryResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

function toText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderNewsletterEmail(props: EmailShellProps) {
  const bodyHtml = props.bodyParagraphs
    .map((paragraph) => `<p style="margin:0 0 16px;">${escapeHtml(paragraph)}</p>`)
    .join("");

  const ctaHtml = props.ctaLabel && props.ctaHref
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:12px 0 8px;"><tr><td><a href="${escapeHtml(props.ctaHref)}" style="display:inline-block;background-color:#231f1c;color:#fffaf3;padding:14px 22px;border-radius:999px;text-decoration:none;font-size:15px;font-weight:700;">${escapeHtml(props.ctaLabel)}</a></td></tr></table>`
    : "";

  const footerHtml = props.footerNote ? `<p style="margin:12px 0 4px;font-size:14px;line-height:1.6;color:#6f655b;">${escapeHtml(props.footerNote)}</p>` : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(props.headline)}</title>
  </head>
  <body style="margin:0;background-color:#f7f2ea;color:#231f1c;font-family:Georgia, 'Times New Roman', serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(props.preheader)}</div>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f7f2ea;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;background-color:#fffaf3;border:1px solid #e2d8c8;border-radius:20px;overflow:hidden;">
            <tr>
              <td style="padding:40px 40px 24px;">
                <p style="margin:0;color:#8b6b43;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;">Spirit &amp; Life</p>
                <h1 style="margin:14px 0 0;font-size:34px;line-height:1.1;">${escapeHtml(props.headline)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 8px;font-size:18px;line-height:1.7;">${bodyHtml}</td>
            </tr>
            ${ctaHtml}
            ${footerHtml ? `<tr><td style="padding:12px 40px 4px;">${footerHtml}</td></tr>` : ""}
            <tr>
              <td style="padding:16px 40px 40px;font-size:13px;line-height:1.6;color:#6f655b;">
                <p style="margin:0;">If you no longer want these emails, you can <a href="${escapeHtml(props.unsubscribeHref)}" style="color:#8b6b43;">unsubscribe here</a>.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function renderPlainTextNewsletter(params: {
  headline: string;
  paragraphs: string[];
  ctaLabel?: string;
  ctaHref?: string;
  unsubscribeHref: string;
}) {
  const parts = [params.headline, "", ...params.paragraphs.map((paragraph) => toText(paragraph))];

  if (params.ctaLabel && params.ctaHref) {
    parts.push("", `${params.ctaLabel}: ${params.ctaHref}`);
  }

  parts.push("", `Unsubscribe: ${params.unsubscribeHref}`);
  return parts.join("\n");
}

async function sendViaBrevo(payload: EmailPayload, fromEmail: string, apiKey: string): Promise<EmailDeliveryResult> {
  try {
    const response = await fetch(BREVO_TRANSACTIONAL_EMAIL_ENDPOINT, {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: NEWSLETTER_SENDER_NAME,
          email: fromEmail,
        },
        to: [{ email: payload.to }],
        subject: payload.subject,
        htmlContent: payload.html,
        textContent: payload.text,
      }),
    });

    if (!response.ok) {
      let providerCode: string | null = null;

      try {
        const errorBody = (await response.json()) as { code?: unknown };

        if (typeof errorBody.code === "string") {
          providerCode = errorBody.code;
        }
      } catch {
        providerCode = null;
      }

      console.error(
        `[newsletter-email] Brevo request failed with status ${response.status}${providerCode ? ` (${providerCode})` : ""}.`,
      );

      if (response.status === 400 || response.status === 401 || response.status === 403) {
        return { ok: false, error: "Email delivery is not configured." };
      }

      return { ok: false, error: "Email delivery failed." };
    }

    const result = (await response.json()) as { messageId?: string };
    return { ok: true, id: result.messageId ?? crypto.randomUUID() };
  } catch {
    console.error("[newsletter-email] Brevo transport error.");
    return { ok: false, error: "Email delivery failed." };
  }
}

export async function sendNewsletterEmail(payload: EmailPayload) {
  const fromEmail = process.env.NEWSLETTER_FROM_EMAIL?.trim();
  const brevoApiKey = process.env.BREVO_API_KEY?.trim();

  if (!fromEmail || !brevoApiKey) {
    return { ok: false as const, error: "Brevo email delivery is not configured." };
  }

  return sendViaBrevo(payload, fromEmail, brevoApiKey);
}