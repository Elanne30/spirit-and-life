import { Mail, MessageSquare, User } from "lucide-react";
import { countContactSubmissions, listContactSubmissions } from "@/app/lib/contact";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default async function AdminMessagesPage() {
  const [messages, total] = await Promise.all([listContactSubmissions(), countContactSubmissions()]);

  return (
    <section className="admin-management-page">
      <div className="admin-management-heading">
        <div>
          <h2>Messages</h2>
          <p>Read messages sent through the public contact form.</p>
        </div>
        <span className="admin-date"><MessageSquare size={16} />{total} total messages</span>
      </div>

      <article className="admin-card admin-subscriber-table-card">
        <div className="admin-panel-heading">
          <div><h3><Mail size={17} />Contact inbox</h3><p>Newest messages appear first. Reply directly to the sender's email address.</p></div>
        </div>

        {messages.length ? (
          <div className="admin-content-list">
            {messages.map((message) => (
              <article className="admin-content-list-item" key={message.id} style={{ alignItems: "start", cursor: "default" }}>
                <div style={{ minWidth: 0 }}>
                  <strong style={{ display: "flex", alignItems: "center", gap: ".45rem" }}><User size={15} />{message.name}</strong>
                  <small>{message.email} · {formatDate(message.created_at)}</small>
                  <p style={{ margin: ".8rem 0 0", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{message.message}</p>
                </div>
                <a className="admin-card-link" href={`mailto:${message.email}`}>Reply</a>
              </article>
            ))}
          </div>
        ) : (
          <div className="admin-empty-state">
            <MessageSquare size={28} />
            <h3>No messages yet</h3>
            <p>Messages submitted from the public contact page will appear here.</p>
          </div>
        )}
      </article>
    </section>
  );
}
