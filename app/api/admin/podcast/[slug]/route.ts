import { NextResponse } from "next/server";
import { requireAdminActionAccess } from "@/app/lib/admin-session";
import { getPodcastEpisodeBySlug } from "@/app/lib/podcast-repository";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await requireAdminActionAccess())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { slug } = await params;
  const episode = await getPodcastEpisodeBySlug(decodeURIComponent(slug));

  if (!episode) {
    return NextResponse.json({ error: "Podcast episode not found." }, { status: 404 });
  }

  return NextResponse.json(episode, {
    headers: { "Cache-Control": "no-store" },
  });
}
