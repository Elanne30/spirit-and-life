# Phase 3 Video Architecture

This phase adds a separate Video content system without replacing the existing media systems.

- Admin Videos library and editor
- Hosted video files stored in Vercel Blob
- Optional thumbnail, transcript and YouTube URL
- Draft, published and archived states
- Publication destinations stored separately as JSON data
- Public playback route at `/resources/video/[slug]`
- Existing Podcast, Resource, Article, Reflection, Journal and other systems remain intact
- Existing `/api/admin/blob-upload` is intentionally unchanged; video uploads use `/api/admin/video-upload`

Large-file policy should be reviewed before production use of long or high-resolution videos.
