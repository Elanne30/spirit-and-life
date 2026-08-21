export type PodcastEpisode = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  duration?: string;
  coverImage?: string;
  audioUrl?: string;
  transcript?: string;
  topicSlugs: readonly string[];
  seriesSlug?: string;
  questionSlugs?: readonly string[];
};

export const PODCAST_EPISODES: readonly PodcastEpisode[] = [];

export function getPodcastEpisode(slug: string) {
  return PODCAST_EPISODES.find((episode) => episode.slug === slug) ?? null;
}
