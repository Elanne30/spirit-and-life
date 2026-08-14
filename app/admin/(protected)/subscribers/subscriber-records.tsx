"use client";

import { useActionState, useDeferredValue, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { removeSubscriberAction } from "@/app/admin/(protected)/actions/communications";

export type AdminSubscriberRecord = {
  id: string;
  displayName: string;
  address: string;
  status: string;
  type: "Newsletter" | "Push";
  createdAt: string;
};

const initialState = { status: "idle" as const, message: "" };

export function SubscriberRecords({ records }: { records: AdminSubscriberRecord[] }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [actionState, formAction, isPending] = useActionState(removeSubscriberAction, initialState);
  const visibleRecords = records.filter((record) => {
    const matchesQuery = !deferredQuery || [record.displayName, record.address, record.id].some((value) => value.toLowerCase().includes(deferredQuery));
    return matchesQuery && (status === "all" || record.status === status) && (type === "all" || record.type === type);
  });
  const visibleIds = visibleRecords.map((record) => record.id);
  const selectedCount = selectedIds.length;
  const allVisibleSelected = Boolean(visibleIds.length) && visibleIds.every((id) => selectedIds.includes(id));

  function toggleAllVisible() {
    setSelectedIds((current) => allVisibleSelected ? current.filter((id) => !visibleIds.includes(id)) : Array.from(new Set([...current, ...visibleIds])));
  }

  return (
    <div className="admin-records-stack">
      <div className="admin-record-controls">
        <label className="admin-search-control" htmlFor="subscriber-search"><Search size={16} /><span className="sr-only">Search subscribers</span><input id="subscriber-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, or ID" /></label>
        <label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option>{Array.from(new Set(records.map((record) => record.status))).map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
        <label>Type<select value={type} onChange={(event) => setType(event.target.value)}><option value="all">All types</option><option value="Newsletter">Newsletter</option><option value="Push">Push</option></select></label>
      </div>
      <div className="admin-selection-toolbar"><span>{selectedCount} selected</span><button type="button" onClick={toggleAllVisible}>{allVisibleSelected ? "Unselect visible" : "Select visible"}</button><button type="button" onClick={() => setSelectedIds([])} disabled={!selectedCount}>Clear selection</button></div>
      {actionState.message ? <p className={actionState.status === "error" ? "form-error" : "form-note"} role="status">{actionState.message}</p> : null}
      <div className="admin-subscriber-table" role="table" aria-label="Subscriber records">
        <div role="row" className="admin-subscriber-row admin-subscriber-heading"><span><input type="checkbox" aria-label="Select all visible subscribers" checked={allVisibleSelected} onChange={toggleAllVisible} /></span><span>Display name</span><span>Subscriber ID</span><span>Email / endpoint</span><span>Status</span><span>Subscription type</span><span>Date joined</span><span>Actions</span></div>
        {visibleRecords.map((record) => (
          <div role="row" className="admin-subscriber-row" key={`${record.type}-${record.id}`}>
            <span><input type="checkbox" aria-label={`Select ${record.displayName}`} checked={selectedIds.includes(record.id)} onChange={(event) => setSelectedIds((current) => event.target.checked ? [...current, record.id] : current.filter((id) => id !== record.id))} /></span>
            <span title={record.displayName}>{record.displayName}</span><span title={record.id}>{record.id}</span><span title={record.address}>{record.address}</span><span>{record.status}</span><span>{record.type}</span><span>{new Date(record.createdAt).toLocaleDateString()}</span>
            <span><form action={formAction} onSubmit={(event) => { if (!window.confirm(`Remove ${record.displayName} (${record.address})? This is an administrative removal.`)) event.preventDefault(); }}><input type="hidden" name="subscriberId" value={record.id} /><input type="hidden" name="subscriberType" value={record.type === "Newsletter" ? "newsletter" : "push"} /><button className="admin-icon-button admin-icon-button-danger" type="submit" disabled={isPending} aria-label={`Remove ${record.displayName}`} title="Remove subscriber"><Trash2 size={15} /></button></form></span>
          </div>
        ))}
        {!visibleRecords.length ? <p className="admin-empty-table">No subscriber records match these filters.</p> : null}
      </div>
    </div>
  );
}