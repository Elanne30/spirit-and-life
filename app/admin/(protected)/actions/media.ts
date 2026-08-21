"use server";

import { requireAdminActionAccess } from "@/app/lib/admin-session";
import { uploadMedia, type MediaKind } from "@/app/lib/media-upload";

export type MediaUploadState = { status: "idle" | "success" | "error"; message: string; url?: string };

export async function uploadMediaAction(_previousState: MediaUploadState, formData: FormData): Promise<MediaUploadState> {
  if (!(await requireAdminActionAccess())) return { status: "error", message: "Unauthorized." };
  const file = formData.get("file");
  const kind = String(formData.get("kind") ?? "").trim() as MediaKind;
  const folder = String(formData.get("folder") ?? "media").trim() || "media";
  if (!(file instanceof File) || file.size === 0) return { status: "error", message: "Choose a file first." };
  if (!( ["audio", "pdf", "document"] as MediaKind[]).includes(kind)) return { status: "error", message: "Choose a valid media type." };
  try {
    const url = await uploadMedia(file, kind, folder);
    return { status: "success", message: "File uploaded.", url };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "The file could not be uploaded." };
  }
}
