"use server";

import { broadcastPushNotification } from "@/app/lib/push";
import { requireAdminActionAccess } from "@/app/lib/admin-session";
import { sendManualNewsletterBroadcast } from "@/app/lib/newsletter";

export type AdminActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialAdminActionState: AdminActionState = {
  status: "idle",
  message: "",
};

function splitParagraphs(value: string) {
  return value
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export async function sendAdminNewsletterBroadcastAction(_previousState: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const hasAccess = await requireAdminActionAccess();
  if (!hasAccess) {
    return { status: "error", message: "Unauthorized." };
  }

  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const confirmSend = String(formData.get("confirmSend") ?? "") === "yes";
  const ctaHrefRaw = String(formData.get("ctaHref") ?? "").trim();

  if (!subject || !message) {
    return { status: "error", message: "Subject and message are required." };
  }

  if (!confirmSend) {
    return { status: "error", message: "Please confirm before sending." };
  }

  const paragraphs = splitParagraphs(message);
  const ctaHref = ctaHrefRaw && /^https?:\/\//i.test(ctaHrefRaw) ? ctaHrefRaw : undefined;

  const result = await sendManualNewsletterBroadcast({
    subject,
    bodyParagraphs: paragraphs,
    ctaLabel: ctaHref ? "Visit Spirit & Life" : undefined,
    ctaHref,
  });

  return {
    status: result.status,
    message: result.message,
  };
}

export async function sendAdminPushBroadcastAction(_previousState: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const hasAccess = await requireAdminActionAccess();
  if (!hasAccess) {
    return { status: "error", message: "Unauthorized." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const urlRaw = String(formData.get("url") ?? "").trim();
  const confirmSend = String(formData.get("confirmSend") ?? "") === "yes";

  if (!title || !body) {
    return { status: "error", message: "Title and message are required." };
  }

  if (!confirmSend) {
    return { status: "error", message: "Please confirm before sending." };
  }

  const url = urlRaw && urlRaw.startsWith("/") ? urlRaw : undefined;

  const result = await broadcastPushNotification({
    title,
    body,
    url,
  });

  return {
    status: result.status,
    message: result.message,
  };
}
