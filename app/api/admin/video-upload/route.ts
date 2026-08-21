import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { requireAdminActionAccess } from "@/app/lib/admin-session";

const ALLOWED_TYPES = ["video/mp4", "video/webm", "video/quicktime", "image/jpeg", "image/png", "image/webp", "image/avif"];

export async function POST(request: Request) {
  if (!(await requireAdminActionAccess())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const body = (await request.json()) as HandleUploadBody;
    const response = await handleUpload({ body, request, onBeforeGenerateToken: async (pathname) => ({ allowedContentTypes: ALLOWED_TYPES, addRandomSuffix: true, tokenPayload: JSON.stringify({ pathname }) }) });
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload could not be prepared." }, { status: 400 });
  }
}
