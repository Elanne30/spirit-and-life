import { put } from "@vercel/blob";

export type MediaKind = "audio" | "pdf" | "document";

const rules: Record<MediaKind, { maxBytes: number; types: Set<string> }> = {
  audio: { maxBytes: 250 * 1024 * 1024, types: new Set(["audio/mpeg", "audio/mp4", "audio/wav", "audio/x-m4a", "audio/aac", "audio/ogg"]) },
  pdf: { maxBytes: 25 * 1024 * 1024, types: new Set(["application/pdf"]) },
  document: { maxBytes: 25 * 1024 * 1024, types: new Set(["application/pdf", "text/plain", "application/rtf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]) },
};

export async function uploadMedia(file: File, kind: MediaKind, folder: string) {
  const rule = rules[kind];
  if (!rule.types.has(file.type)) throw new Error(`Unsupported ${kind} file type.`);
  if (file.size === 0 || file.size > rule.maxBytes) throw new Error(`The ${kind} file exceeds the allowed size.`);
  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const blob = await put(`${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}.${extension}`, file, { access: "public", addRandomSuffix: true, contentType: file.type });
  return blob.url;
}
