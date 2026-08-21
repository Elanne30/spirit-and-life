import { notFound } from "next/navigation";
import { getVideoBySlug } from "@/app/lib/video-repository";
import { VideoPlayer } from "@/app/components/video-player";

export default async function VideoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  if (!video || video.status !== "published") notFound();
  return <main className="site-main"><article className="mx-auto max-w-5xl px-6 py-16"><p className="eyebrow">Video</p><h1 className="mt-3 text-4xl font-serif sm:text-5xl">{video.title}</h1>{video.description ? <p className="mt-5 max-w-3xl text-muted-foreground">{video.description}</p> : null}<div className="mt-10"><VideoPlayer src={video.videoUrl} youtubeUrl={video.youtubeUrl} title={video.title} poster={video.thumbnailUrl} /></div>{video.transcript ? <section className="prose mt-12 max-w-3xl"><h2>Transcript</h2><div className="whitespace-pre-wrap">{video.transcript}</div></section> : null}</article></main>;
}
