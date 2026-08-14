"use server";

import { broadcastPushNotification } from "@/app/lib/push";
import { requireAdminActionAccess } from "@/app/lib/admin-session";
import { deletePushSubscriberRecord } from "@/app/lib/push";
import { deleteNewsletterBroadcast, removeNewsletterSubscriber, sendManualNewsletterBroadcast } from "@/app/lib/newsletter";
import { revalidatePath } from "next/cache";

export type AdminActionState = {
  status: "idle" | "success" | "error";
  message: string;
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
  const recipientMode = String(formData.get("recipientMode") ?? "all");
  const recipientIds = formData.getAll("recipientId").map(String).filter(Boolean);

  if (!subject || !message) {
    return { status: "error", message: "Subject and message are required." };
  }

  if (!confirmSend) {
    return { status: "error", message: "Please confirm before sending." };
  }

  if (recipientMode === "selected" && !recipientIds.length) {
    return { status: "error", message: "Select at least one active recipient." };
  }

  const paragraphs = splitParagraphs(message);
  const ctaHref = ctaHrefRaw && /^https?:\/\//i.test(ctaHrefRaw) ? ctaHrefRaw : undefined;

  const result = await sendManualNewsletterBroadcast({
    subject,
    bodyParagraphs: paragraphs,
    ctaLabel: ctaHref ? "Visit Spirit & Life" : undefined,
    ctaHref,
    recipientIds: recipientMode === "selected" ? recipientIds : undefined,
  });

  revalidatePath("/admin/newsletter");

  return {
    status: result.status,
    message: result.message,
  };
}

function revalidateAudienceViews() {
  revalidatePath("/admin");
  revalidatePath("/admin/subscribers");
  revalidatePath("/admin/newsletter");
}

export async function removeSubscriberAction(_previousState: AdminActionState, formData: FormData): Promise<AdminActionState> {
  if (!(await requireAdminActionAccess())) {
    return { status: "error", message: "Unauthorized." };
  }

  const id = String(formData.get("subscriberId") ?? "").trim();
  const type = String(formData.get("subscriberType") ?? "").trim();
  if (!id || (type !== "newsletter" && type !== "push")) {
    return { status: "error", message: "Subscriber details are required." };
  }

  const removed = type === "newsletter" ? await removeNewsletterSubscriber(id) : await deletePushSubscriberRecord(id);
  if (!removed) return { status: "error", message: "Subscriber record not found." };

  revalidateAudienceViews();
  return { status: "success", message: "Subscriber removed." };
}

export async function deleteNewsletterBroadcastAction(_previousState: AdminActionState, formData: FormData): Promise<AdminActionState> {
  if (!(await requireAdminActionAccess())) {
    return { status: "error", message: "Unauthorized." };
  }

  const id = String(formData.get("broadcastId") ?? "").trim();
  if (!id) return { status: "error", message: "Broadcast details are required." };

  const removed = await deleteNewsletterBroadcast(id);
  if (!removed) return { status: "error", message: "Broadcast not found." };

  revalidatePath("/admin/newsletter");
  return { status: "success", message: "Broadcast history removed." };
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
