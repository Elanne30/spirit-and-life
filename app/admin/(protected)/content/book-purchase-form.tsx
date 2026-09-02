"use client";

import { useActionState, useState } from "react";
import { saveBookPurchaseSettings } from "@/app/admin/(protected)/actions/book-purchase";

type PurchaseOption = { id: string; store: string; url: string; enabled: boolean };
type ActionState = { ok: boolean; message: string };
const initialState: ActionState = { ok: false, message: "" };

export function BookPurchaseForm({ draftId, initialOptions = [], initialPaperbackStatus = "Available Soon", initialPaperbackUrl = "" }: { draftId: string; initialOptions?: PurchaseOption[]; initialPaperbackStatus?: "Available Soon" | "Available"; initialPaperbackUrl?: string }) {
  const [state, formAction, pending] = useActionState(saveBookPurchaseSettings, initialState);
  const [options, setOptions] = useState<PurchaseOption[]>(initialOptions);
  const [paperbackStatus, setPaperbackStatus] = useState(initialPaperbackStatus);
  const [paperbackUrl, setPaperbackUrl] = useState(initialPaperbackUrl);
  function addOption() { setOptions((current) => [...current, { id: crypto.randomUUID(), store: "", url: "", enabled: true }]); }
  function updateOption(id: string, patch: Partial<PurchaseOption>) { setOptions((current) => current.map((option) => option.id === id ? { ...option, ...patch } : option)); }
  function removeOption(id: string) { setOptions((current) => current.filter((option) => option.id !== id)); }
  return <form action={formAction} className="admin-form">
    <input type="hidden" name="draftId" value={draftId} /><input type="hidden" name="purchaseOptions" value={JSON.stringify(options)} readOnly /><input type="hidden" name="paperbackStatus" value={paperbackStatus} readOnly /><input type="hidden" name="paperbackUrl" value={paperbackUrl} readOnly />
    <div className="admin-section-heading"><p className="eyebrow">Sales links</p><h2>Purchase Options</h2><p>Add as many external bookstores as you need. Readers will see polished store cards rather than raw URLs.</p></div>
    {options.map((option) => <div key={option.id} style={{ border: "1px solid var(--line)", padding: "1rem", marginBottom: "1rem", background: "var(--surface-muted)" }}><label>Store name</label><input value={option.store} onChange={(event) => updateOption(option.id, { store: event.target.value })} placeholder="Amazon" /><label>Purchase URL</label><input type="url" value={option.url} onChange={(event) => updateOption(option.id, { url: event.target.value })} placeholder="https://..." /><label className="admin-checkbox"><input type="checkbox" checked={option.enabled} onChange={(event) => updateOption(option.id, { enabled: event.target.checked })} /> Show this store publicly</label><button className="button button-secondary" type="button" onClick={() => removeOption(option.id)}>Remove</button></div>)}
    <button className="button button-secondary" type="button" onClick={addOption}>+ Add another purchase option</button>
    <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--line)" }}><div className="admin-section-heading"><p className="eyebrow">Print edition</p><h2>Paperback</h2></div><label>Paperback status</label><select value={paperbackStatus} onChange={(event) => setPaperbackStatus(event.target.value as "Available Soon" | "Available")}><option value="Available Soon">Available Soon</option><option value="Available">Available</option></select><label>Paperback purchase URL (optional)</label><input type="url" value={paperbackUrl} onChange={(event) => setPaperbackUrl(event.target.value)} placeholder="https://..." /></div>
    <button className="button button-primary" type="submit" disabled={pending}>{pending ? "Saving..." : "Save purchase settings"}</button>{state.message ? <p className={state.ok ? "form-note" : "form-error"} role="status">{state.message}</p> : null}
  </form>;
}
