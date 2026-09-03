import { NextResponse } from "next/server";
import { listPublishedVideos, VIDEO_DESTINATIONS, type VideoDestination } from "@/app/lib/video-repository";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const destination = new URL(request.url).searchParams.get("destination");
  const selected = VIDEO_DESTINATIONS.includes(destination as VideoDestination) ? destination as VideoDestination : undefined;
  const videos = await listPublishedVideos(selected);
  return NextResponse.json(videos.map((video) => ({
    id: video.id,
    title: video.title,
    slug: video.slug,
    description: video.description,
    videoUrl: video.videoUrl,
    youtubeUrl: video.youtubeUrl,
    thumbnailUrl: video.thumbnailUrl,
    duration: video.duration,
  })));
}
