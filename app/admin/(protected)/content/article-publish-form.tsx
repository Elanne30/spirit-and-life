import { publishArticleAction, unpublishArticleAction } from "@/app/admin/(protected)/actions/article-content";

export function ArticlePublishForm({ draftId, status, hasUnpublishedChanges }: { draftId: string; status: "draft" | "published"; hasUnpublishedChanges: boolean }) {
  return (
    <div className="admin-editor-actions">
      {status === "published" && !hasUnpublishedChanges ? (
        <form action={unpublishArticleAction}><input type="hidden" name="draftId" value={draftId} /><button className="button button-secondary" type="submit">Unpublish</button></form>
      ) : (
        <form action={publishArticleAction}><input type="hidden" name="draftId" value={draftId} /><button className="button button-primary" type="submit">{status === "published" ? "Publish Changes" : "Publish Article"}</button></form>
      )}
    </div>
  );
}
