"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, FileUp, Loader2, Pencil, Plus, Save, Trash2 } from "lucide-react";
import type { SocialItem } from "@/data/socials";

const emptySocial: SocialItem = {
  id: "",
  label: "",
  url: "",
  visible: true,
  order: 1
};

export function SocialAdminPanel({ initialSocials }: { initialSocials: SocialItem[] }) {
  const [socials, setSocials] = useState([...initialSocials].sort((a, b) => a.order - b.order));
  const [draft, setDraft] = useState<SocialItem>({ ...emptySocial, order: initialSocials.length + 1 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  const reset = () => {
    setDraft({ ...emptySocial, order: socials.length + 1 });
    setEditingId(null);
  };

  const saveSocial = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    const response = await fetch("/api/socials", {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft)
    });

    if (response.ok) {
      const saved = (await response.json()) as SocialItem;
      const next = isEditing
        ? socials.map((item) => item.id === saved.id ? saved : item)
        : [...socials, saved];
      setSocials(next.sort((a, b) => a.order - b.order));
      setDraft(saved);
      setEditingId(saved.id);
      setMessage(isEditing ? "Social link updated." : "Social link added.");
    } else {
      setMessage("Could not save social link.");
    }
    setBusy(false);
  };

  const updateSocial = async (social: SocialItem, updates: Partial<SocialItem>) => {
    setBusy(true);
    const response = await fetch("/api/socials", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...social, ...updates })
    });
    if (response.ok) {
      const saved = (await response.json()) as SocialItem;
      setSocials((current) => current.map((item) => item.id === saved.id ? saved : item).sort((a, b) => a.order - b.order));
      if (editingId === saved.id) setDraft(saved);
    }
    setBusy(false);
  };

  const moveSocial = async (social: SocialItem, direction: -1 | 1) => {
    const sorted = [...socials].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((item) => item.id === social.id);
    const other = sorted[index + direction];
    if (!other) return;

    setBusy(true);
    const [firstResponse, secondResponse] = await Promise.all([
      fetch("/api/socials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...social, order: other.order })
      }),
      fetch("/api/socials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...other, order: social.order })
      })
    ]);

    if (firstResponse.ok && secondResponse.ok) {
      const first = (await firstResponse.json()) as SocialItem;
      const second = (await secondResponse.json()) as SocialItem;
      setSocials((current) => current.map((item) => {
        if (item.id === first.id) return first;
        if (item.id === second.id) return second;
        return item;
      }).sort((a, b) => a.order - b.order));
      setMessage("Social order updated.");
    }
    setBusy(false);
  };

  const deleteSocial = async (social: SocialItem) => {
    if (!window.confirm(`Delete ${social.label}?`)) return;
    setBusy(true);
    const response = await fetch(`/api/socials?id=${encodeURIComponent(social.id)}`, { method: "DELETE" });
    if (response.ok) {
      setSocials((current) => current.filter((item) => item.id !== social.id).map((item, index) => ({ ...item, order: index + 1 })));
      if (editingId === social.id) reset();
      setMessage("Social link deleted.");
    }
    setBusy(false);
  };

  const uploadResume = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    setBusy(true);
    const formData = new FormData();
    formData.append("folder", "resume");
    formData.append("files", event.target.files[0]);

    try {
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Upload failed");
      const data = (await response.json()) as { urls: string[] };
      const url = data.urls[0];
      if (url) {
        const existingResume = socials.find((item) => item.label.toLowerCase().includes("resume"));
        if (existingResume) {
          await updateSocial(existingResume, { url });
        } else {
          setDraft((current) => ({ ...current, label: "Resume", url }));
        }
        setMessage("Resume uploaded and linked.");
      }
    } catch {
      setMessage("Could not upload that PDF.");
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  };

  return (
    <section id="social-settings" className="mb-12 scroll-mt-28 border-b border-white/10 pb-12">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-[#B18D43]">Social Settings</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">Manage your digital identity card.</h2>
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.72fr_1fr]">
        <form onSubmit={saveSocial} className="glass rounded-[28px] p-5 sm:p-7">
          <div className="mb-7 flex items-center justify-between gap-4">
            <h3 className="text-2xl font-semibold">{isEditing ? "Edit social link" : "Add social link"}</h3>
            <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-sm text-paper/68">
              <Plus size={15} />
              New
            </button>
          </div>

          <div className="grid gap-4">
            <SocialField label="Label" value={draft.label} onChange={(label) => setDraft((current) => ({ ...current, label }))} required />
            <SocialField label="URL or mailto link" value={draft.url} onChange={(url) => setDraft((current) => ({ ...current, url }))} required />
            <SocialField label="Order" type="number" value={String(draft.order)} onChange={(order) => setDraft((current) => ({ ...current, order: Number(order) || 1 }))} />
            <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
              <span className="text-sm text-paper/62">Visible in Hero card</span>
              <input type="checkbox" checked={draft.visible} onChange={(event) => setDraft((current) => ({ ...current, visible: event.target.checked }))} className="size-5 accent-[#B18D43]" />
            </label>
            <label className="flex min-h-24 items-center justify-center gap-3 rounded-2xl border border-dashed border-white/18 bg-white/[0.03] text-sm text-paper/58 transition hover:border-[#B18D43]/60">
              <input className="sr-only" type="file" accept="application/pdf" onChange={uploadResume} />
              <FileUp size={20} className="text-[#B18D43]" />
              Upload Resume PDF
            </label>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-paper px-5 py-3 text-sm font-semibold text-ink transition hover:bg-[#D4B66F] disabled:opacity-60">
              {busy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isEditing ? "Save changes" : "Add link"}
            </button>
            {message ? <p className="text-sm text-paper/48">{message}</p> : null}
          </div>
        </form>

        <div className="glass rounded-[28px] p-5 sm:p-7">
          <p className="mb-5 text-sm uppercase tracking-[0.25em] text-paper/40">Link Order</p>
          <div className="grid gap-2">
            {socials.map((social, index) => (
              <div key={social.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{social.label}</p>
                  <p className="truncate text-xs text-paper/42">{social.url}</p>
                </div>
                <button type="button" disabled={busy} onClick={() => updateSocial(social, { visible: !social.visible })} className="grid size-9 place-items-center rounded-full border border-white/10 text-paper/55" aria-label={social.visible ? `Hide ${social.label}` : `Show ${social.label}`}>
                  {social.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button type="button" disabled={busy || index === 0} onClick={() => moveSocial(social, -1)} className="grid size-9 place-items-center rounded-full border border-white/10 text-paper/55 disabled:opacity-25" aria-label={`Move ${social.label} up`}>
                  <ArrowUp size={15} />
                </button>
                <button type="button" disabled={busy || index === socials.length - 1} onClick={() => moveSocial(social, 1)} className="grid size-9 place-items-center rounded-full border border-white/10 text-paper/55 disabled:opacity-25" aria-label={`Move ${social.label} down`}>
                  <ArrowDown size={15} />
                </button>
                <button type="button" onClick={() => { setDraft(social); setEditingId(social.id); }} className="grid size-9 place-items-center rounded-full border border-white/10 text-paper/55" aria-label={`Edit ${social.label}`}>
                  <Pencil size={15} />
                </button>
                <button type="button" onClick={() => deleteSocial(social)} className="grid size-9 place-items-center rounded-full border border-white/10 text-paper/55 hover:text-coral" aria-label={`Delete ${social.label}`}>
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

function SocialField({
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
