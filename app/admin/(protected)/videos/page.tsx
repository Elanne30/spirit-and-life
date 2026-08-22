import Link from "next/link";
import { CalendarDays, Clock3, Eye, Plus, Search, Video } from "lucide-react";
import { listVideos } from "@/app/lib/video-repository";
import { VideoMoreActions } from "@/app/admin/(protected)/videos/video-more-actions";
import styles from "../content/admin-library-reference.module.css";

export const dynamic = "force-dynamic";

function statusLabel(status: "draft" | "published" | "archived") {
  if (status === "published") return "Published";
  if (status === "archived") return "Archived";
  return "Draft";
}

function statusClass(status: "draft" | "published" | "archived") {
  return status === "published" ? styles.statusPublished : styles.statusDraft;
}

function displayDate(value: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function AdminVideosPage() {
  const videos = await listVideos();
  const publishedCount = videos.filter((video) => video.status === "published").length;
  const draftCount = videos.filter((video) => video.status === "draft").length;

  return (
    <section className={`${styles.library} admin-library-page`}>
      <div className={styles.heading}>
        <h1>Videos</h1>
        <p>Manage hosted videos and YouTube-linked videos for Spirit &amp; Life.</p>
      </div>

      <div className={styles.toolbar}>
        <nav className={styles.tabs} aria-label="Video filters">
          <span className={`${styles.tab} ${styles.tabActive}`}>All ({videos.length})</span>
          <span className={styles.tab}>Published ({publishedCount})</span>
          <span className={styles.tab}>Drafts ({draftCount})</span>
          <span className={styles.tab}>Archived ({videos.filter((video) => video.status === "archived").length})</span>
        </nav>
        <label className={styles.search}>
          <Search size={15} aria-hidden="true" />
          <input aria-label="Search videos" placeholder="Search videos..." readOnly />
        </label>
        <Link className={`button button-primary ${styles.addButton}`} href="/admin/videos/new" aria-label="Add Video">
          <Plus size={15} />
          Add Video
        </Link>
      </div>

      {videos.length ? (
        <div className={styles.grid}>
          {videos.map((video) => (
            <article className={styles.card} key={video.id}>
              <Link className={styles.imageWrap} href={`/admin/videos/${video.slug}/edit`} aria-label={`Open ${video.title}`}>
                {video.thumbnailUrl ? (
                  <img className={styles.image} src={video.thumbnailUrl} alt="" loading="lazy" />
                ) : (
                  <span className={styles.imagePlaceholder}>
                    <Video size={24} />
                    Video
                  </span>
                )}
                <span className={`${styles.status} ${statusClass(video.status)}`}>
                  {statusLabel(video.status)}
                </span>
              </Link>

              <div className={styles.body}>
                <p className={styles.category}>
                  {video.destinations.length
                    ? video.destinations.map((destination) => destination.charAt(0).toUpperCase() + destination.slice(1)).join(" · ")
                    : "Video"}
                </p>
                <h2 className={styles.title}>{video.title}</h2>
                <div className={styles.meta}>
                  {displayDate(video.publishedAt ?? video.createdAt) ? (
                    <span><CalendarDays size={12} />{displayDate(video.publishedAt ?? video.createdAt)}</span>
                  ) : null}
                  {video.duration ? <span><Clock3 size={12} />{video.duration}</span> : null}
                </div>
              </div>

              <div className={styles.actions}>
                <Link className={styles.action} href={`/admin/videos/${video.slug}/edit`}>Edit</Link>
                <Link className={styles.action} href={`/resources/video/${video.slug}`} target="_blank" aria-label={`Preview ${video.title}`} title="Preview">
                  <Eye size={15} />
                </Link>
                <VideoMoreActions slug={video.slug} title={video.title} status={video.status} id={video.id} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>No videos yet. Add your first video to begin.</div>
      )}
    </section>
  );
}
