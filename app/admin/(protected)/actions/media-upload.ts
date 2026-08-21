"use server";

import { put } from "@vercel/blob";
import { requireAdmin } from "@/app/lib/auth";

const LIMITS = { audio: 250 * 1024 * 1024, document: 25 * 1024 * 1024 } as const;
const TYPES = { audio: ["audio/mpeg", "audio/mp4", "audio/wav", "audio/x-m4a"], document: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"] } as const;

export async function uploadAdminMedia(file: File, kind: keyof typeof LIMITS) {
  await requireAdmin();
  if (!(file instanceof File) || file.size === 0) return { ok: false as const, error: "Choose a file." };
  if (file.size > LIMITS[kind]) return { ok: false as const, error: "File is too large." };
  if (!TYPES[kind].includes(file.type as never)) return { ok: false as const, error: "Unsupported file type." };
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const result = await put(`media/${kind}/${Date.now()}-${safeName}`, file, { access: "public", addRandomSuffix: true });
  return { ok: true as const, url: result.url, pathname: result.pathname };
}
