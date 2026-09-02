"use client";

import { useState } from "react";

type PurchaseOption = { id: string; store: string; url: string; enabled: boolean };

export function BookPurchaseForm({ draftId, initialOptions = [], initialPaperbackStatus = "Available Soon", initialPaperbackUrl = "" }: { draftId: string; initialOptions?: PurchaseOption[]; initialPaperbackStatus?: "Available Soon" | "Available"; initialPaperbackUrl?: string }) {
  const [options, setOptions] = useState<PurchaseOption[]>(initialOptions);
  const [paperbackStatus, setPaperbackStatus] = useState(initialPaperbackStatus);
  const [paperbackUrl, setPaperbackUrl] = useState(initialPaperbackUrl);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  function addOption() { setOptions((current) => [...current, { id: crypto.randomUUID(), store: "", url: "", enabled: true }]); }
  function updateOption(id: string, patch: Partial<PurchaseOption>) { setOptions((current) => current.map((option) => option.id === id ? { ...option, ...patch } : option)); }
  function removeOption(id: string) { setOptions((current) => current.filter((option) => option.id !== id)); }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setMessage("");
    const formData = new FormData(event.currentTarget); formData.set("purchaseOptions", JSON.stringify(options)); formData.set("paperbackStatus", paperbackStatus); formData.set("paperbackUrl", paperbackUrl);
    const response = await fetch("/admin/actions/book-purchase", { method: "POST", body: formData });
    const result = await response.json().catch(() => ({ ok: false, message: "The settings could not be saved." }));
    setMessage(result.message ?? ""); setSaving(false);
  }

  return <form onSubmit={submit} className="admin-form">
    <input type="hidden" name="draftId" value={draftId} />
    <div className="admin-section-heading"><p className="eyebrow">Sales links</p><h2>Purchase Options</h2><p>Add as many external bookstores as you need. Readers will see polished store cards rather than raw URLs.</p></div>
    {options.map((option) => <div key={option.id} style={{ border: "1px solid var(--line)", padding: "1rem", marginBottom: "1rem", background: "var(--surface-muted)" }}>
      <label>Store name</label><input value={option.store} onChange={(event) => updateOption(option.id, { store: event.target.value })} placeholder="Amazon" />
      <label>Purchase URL</label><input type="url" value={option.url} onChange={(event) => updateOption(option.id, { url: event.target.value })} placeholder="https://..." />
      <label className="admin-checkbox"><input type="checkbox" checked={option.enabled} onChange={(event) => updateOption(option.id, { enabled: event.target.checked })} /> Show this store publicly</label>
      <button className="button button-secondary" type="button" onClick={() => removeOption(option.id)}>Remove</button>
    </div>)}
    <button className="button button-secondary" type="button" onClick={addOption}>+ Add another purchase option</button>
    <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--line)" }}>
      <div className="admin-section-heading"><p className="eyebrow">Print edition</p><h2>Paperback</h2></div>
      <label>Paperback status</label><select value={paperbackStatus} onChange={(event) => setPaperbackStatus(event.target.value as "Available Soon" | "Available")}><option value="Available Soon">Available Soon</option><option value="Available">Available</option></select>
      <label>Paperback purchase URL (optional)</label><input type="url" value={paperbackUrl} onChange={(event) => setPaperbackUrl(event.target.value)} placeholder="https://..." />
    </div>
    <button className="button button-primary" type="submit" disabled={saving}>{saving ? "Saving..." : "Save purchase settings"}</button>
    {message ? <p className="form-note" role="status">{message}</p> : null}
  </form>;
}
