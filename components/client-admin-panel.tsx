"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, ImagePlus, Loader2, Pencil, Plus, Save, Trash2 } from "lucide-react";
import type { Client } from "@/data/clients";

const emptyClient: Client = {
  id: "",
  name: "",
  logo: "",
  category: "",
  visible: true,
  order: 1
};

export function ClientAdminPanel({ initialClients }: { initialClients: Client[] }) {
  const [clients, setClients] = useState([...initialClients].sort((a, b) => a.order - b.order));
  const [draft, setDraft] = useState<Client>({ ...emptyClient, order: initialClients.length + 1 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  const resetForm = () => {
    setDraft({ ...emptyClient, order: clients.length + 1 });
    setEditingId(null);
  };

  const uploadLogo = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    setBusy(true);
    const formData = new FormData();
    formData.append("folder", "clients");
    formData.append("files", event.target.files[0]);

    try {
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Upload failed");
      const data = (await response.json()) as { urls: string[] };
      setDraft((current) => ({ ...current, logo: data.urls[0] || current.logo }));
      setMessage("Logo uploaded.");
    } catch {
      setMessage("Could not upload that logo.");
    } finally {
      setBusy(false);
    }
  };

  const saveClient = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.logo) {
      setMessage("Upload a logo before saving.");
      return;
    }

    setBusy(true);
    const response = await fetch("/api/clients", {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft)
    });

    if (response.ok) {
      const saved = (await response.json()) as Client;
      const next = isEditing
        ? clients.map((client) => client.id === saved.id ? saved : client)
        : [...clients, saved];
      setClients(next.sort((a, b) => a.order - b.order));
      setDraft(saved);
      setEditingId(saved.id);
      setMessage(isEditing ? "Client updated." : "Client added.");
    } else {
      setMessage("Could not save client.");
    }
    setBusy(false);
  };

  const updateClient = async (client: Client, updates: Partial<Client>) => {
    setBusy(true);
    const response = await fetch("/api/clients", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...client, ...updates })
    });

    if (response.ok) {
      const saved = (await response.json()) as Client;
      setClients((current) => current.map((item) => item.id === saved.id ? saved : item).sort((a, b) => a.order - b.order));
      if (editingId === saved.id) setDraft(saved);
    }
    setBusy(false);
  };

  const moveClient = async (client: Client, direction: -1 | 1) => {
    const sorted = [...clients].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((item) => item.id === client.id);
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= sorted.length) return;

    const other = sorted[swapIndex];
    setBusy(true);
    const firstResponse = await fetch("/api/clients", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...client, order: other.order })
    });
    const secondResponse = await fetch("/api/clients", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...other, order: client.order })
    });

    if (firstResponse.ok && secondResponse.ok) {
      const first = (await firstResponse.json()) as Client;
      const second = (await secondResponse.json()) as Client;
      setClients((current) => current.map((item) => {
        if (item.id === first.id) return first;
        if (item.id === second.id) return second;
        return item;
      }).sort((a, b) => a.order - b.order));
      setMessage("Client order updated.");
    } else {
      setMessage("Could not reorder clients.");
    }
    setBusy(false);
  };

  const deleteClient = async (client: Client) => {
    if (!window.confirm(`Delete ${client.name}?`)) return;
    setBusy(true);
    const response = await fetch(`/api/clients?id=${encodeURIComponent(client.id)}`, { method: "DELETE" });
    if (response.ok) {
      setClients((current) => current.filter((item) => item.id !== client.id).map((item, index) => ({ ...item, order: index + 1 })));
      if (editingId === client.id) resetForm();
      setMessage("Client deleted.");
    } else {
      setMessage("Could not delete client.");
    }
    setBusy(false);
  };

  return (
    <section id="client-manager" className="mt-12 scroll-mt-28 border-t border-white/10 pt-12">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-[#B18D43]">Client Logo Manager</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">Manage the proof-of-trust marquee.</h2>
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.75fr_1fr]">
        <form onSubmit={saveClient} className="glass rounded-[28px] p-5 sm:p-7">
          <div className="mb-7 flex items-center justify-between gap-4">
            <h3 className="text-2xl font-semibold">{isEditing ? "Edit client" : "Add client"}</h3>
            <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-sm text-paper/68">
              <Plus size={15} />
              New
            </button>
          </div>

          <div className="grid gap-4">
            <AdminField label="Company name" value={draft.name} onChange={(name) => setDraft((current) => ({ ...current, name }))} required />
            <AdminField label="Category (optional)" value={draft.category || ""} onChange={(category) => setDraft((current) => ({ ...current, category }))} />
            <AdminField label="Order" type="number" value={String(draft.order)} onChange={(order) => setDraft((current) => ({ ...current, order: Number(order) || 1 }))} />

            <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
              <span className="text-sm text-paper/62">Visible on portfolio</span>
              <input
                type="checkbox"
                checked={draft.visible}
                onChange={(event) => setDraft((current) => ({ ...current, visible: event.target.checked }))}
                className="size-5 accent-[#B18D43]"
              />
            </label>

            <label className="grid min-h-32 place-items-center rounded-2xl border border-dashed border-white/18 bg-white/[0.03] p-5 text-center transition hover:border-[#B18D43]/60">
              <input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" onChange={uploadLogo} />
              {draft.logo ? (
                <div className="relative h-20 w-full">
                  <Image src={draft.logo} alt="Logo preview" fill unoptimized className="object-contain" />
                </div>
              ) : (
                <span className="grid justify-items-center gap-3 text-sm text-paper/58">
                  <ImagePlus size={23} className="text-[#B18D43]" />
                  Upload logo
                </span>
              )}
            </label>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-paper px-5 py-3 text-sm font-semibold text-ink transition hover:bg-[#D4B66F] disabled:opacity-60">
              {busy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isEditing ? "Save changes" : "Add client"}
            </button>
            {message ? <p className="text-sm text-paper/48">{message}</p> : null}
          </div>
        </form>

        <div className="glass rounded-[28px] p-5 sm:p-7">
          <p className="mb-5 text-sm uppercase tracking-[0.25em] text-paper/40">Logo Order</p>
          <div className="grid gap-2">
            {clients.map((client, index) => (
              <div key={client.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-black/25 p-2">
                  <Image src={client.logo} alt="" fill unoptimized className="object-contain p-2 grayscale" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{client.name}</p>
                  <p className="truncate text-xs text-paper/42">{client.category || "No category"} · Order {client.order}</p>
                </div>
                <button type="button" disabled={busy} onClick={() => updateClient(client, { visible: !client.visible })} className="grid size-9 place-items-center rounded-full border border-white/10 text-paper/55 transition hover:text-[#D4B66F]" aria-label={client.visible ? `Hide ${client.name}` : `Show ${client.name}`}>
                  {client.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button type="button" disabled={busy || index === 0} onClick={() => moveClient(client, -1)} className="grid size-9 place-items-center rounded-full border border-white/10 text-paper/55 disabled:opacity-25" aria-label={`Move ${client.name} up`}>
                  <ArrowUp size={15} />
                </button>
                <button type="button" disabled={busy || index === clients.length - 1} onClick={() => moveClient(client, 1)} className="grid size-9 place-items-center rounded-full border border-white/10 text-paper/55 disabled:opacity-25" aria-label={`Move ${client.name} down`}>
                  <ArrowDown size={15} />
                </button>
                <button type="button" onClick={() => { setDraft(client); setEditingId(client.id); }} className="grid size-9 place-items-center rounded-full border border-white/10 text-paper/55 hover:text-paper" aria-label={`Edit ${client.name}`}>
                  <Pencil size={15} />
                </button>
                <button type="button" onClick={() => deleteClient(client)} className="grid size-9 place-items-center rounded-full border border-white/10 text-paper/55 hover:text-coral" aria-label={`Delete ${client.name}`}>
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AdminField({
  label,
  value,
  onChange,
  required = false,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: "text" | "number";
}) {
  return (
    <label>
      <span className="mb-2 block text-sm text-paper/48">{label}</span>
      <input type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-paper outline-none transition focus:border-[#B18D43]/60" />
    </label>
  );
}
