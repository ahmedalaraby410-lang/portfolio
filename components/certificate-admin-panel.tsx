"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import { Eye, EyeOff, ImagePlus, Loader2, Pencil, Plus, Save, Trash2 } from "lucide-react";
import type { Certificate } from "@/data/certificates";

const emptyCertificate: Certificate = {
  id: "",
  title: "",
  issuer: "",
  description: "",
  date: "Completed",
  image: "",
  link: "",
  visible: true,
  order: 1
};

export function CertificateAdminPanel({ initialCertificates }: { initialCertificates: Certificate[] }) {
  const [certificates, setCertificates] = useState([...initialCertificates].sort((a, b) => a.order - b.order));
  const [draft, setDraft] = useState<Certificate>({ ...emptyCertificate, order: initialCertificates.length + 1 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const reset = () => {
    setDraft({ ...emptyCertificate, order: certificates.length + 1 });
    setEditingId(null);
  };

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    setBusy(true);
    const formData = new FormData();
    formData.append("folder", "certificates");
    formData.append("files", event.target.files[0]);
    try {
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      if (!response.ok) throw new Error();
      const data = (await response.json()) as { urls: string[] };
      const image = data.urls[0] || "";
      setDraft((current) => ({ ...current, image, link: current.link || image }));
      setMessage("Certificate image uploaded.");
    } catch {
      setMessage("Could not upload certificate image.");
    } finally {
      setBusy(false);
    }
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.image) {
      setMessage("Upload a certificate image first.");
      return;
    }
    setBusy(true);
    const response = await fetch("/api/certificates", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft)
    });
    if (response.ok) {
      const saved = (await response.json()) as Certificate;
      setCertificates((current) => (editingId
        ? current.map((item) => item.id === saved.id ? saved : item)
        : [...current, saved]).sort((a, b) => a.order - b.order));
      setDraft(saved);
      setEditingId(saved.id);
      setMessage(editingId ? "Certificate updated." : "Certificate added.");
    } else {
      setMessage("Could not save certificate.");
    }
    setBusy(false);
  };

  const update = async (certificate: Certificate, changes: Partial<Certificate>) => {
    const response = await fetch("/api/certificates", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...certificate, ...changes })
    });
    if (response.ok) {
      const saved = (await response.json()) as Certificate;
      setCertificates((current) => current.map((item) => item.id === saved.id ? saved : item).sort((a, b) => a.order - b.order));
    }
  };

  const remove = async (certificate: Certificate) => {
    if (!window.confirm(`Delete ${certificate.title}?`)) return;
    const response = await fetch(`/api/certificates?id=${encodeURIComponent(certificate.id)}`, { method: "DELETE" });
    if (response.ok) {
      setCertificates((current) => current.filter((item) => item.id !== certificate.id));
      if (editingId === certificate.id) reset();
    }
  };

  return (
    <section id="certificate-manager" className="mt-12 scroll-mt-28 border-t border-white/10 pt-12">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-[#B18D43]">Certificate Manager</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">Keep continuous learning current.</h2>
      </div>
      <div className="grid gap-8 xl:grid-cols-[0.78fr_1fr]">
        <form onSubmit={save} className="glass rounded-[28px] p-5 sm:p-7">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-semibold">{editingId ? "Edit certificate" : "Add certificate"}</h3>
            <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-sm"><Plus size={15} />New</button>
          </div>
          <div className="grid gap-4">
            <CertificateField label="Certificate title" value={draft.title} onChange={(title) => setDraft((current) => ({ ...current, title }))} required />
            <CertificateField label="Issuer" value={draft.issuer} onChange={(issuer) => setDraft((current) => ({ ...current, issuer }))} required />
            <CertificateField label="Completion date" value={draft.date} onChange={(date) => setDraft((current) => ({ ...current, date }))} />
            <CertificateField label="Certificate link" value={draft.link} onChange={(link) => setDraft((current) => ({ ...current, link }))} />
            <label>
              <span className="mb-2 block text-sm text-paper/48">Short description</span>
              <textarea rows={4} value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 outline-none focus:border-[#B18D43]/60" />
            </label>
            <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
              <span className="text-sm text-paper/62">Visible on portfolio</span>
              <input type="checkbox" checked={draft.visible} onChange={(event) => setDraft((current) => ({ ...current, visible: event.target.checked }))} className="size-5 accent-[#B18D43]" />
            </label>
            <label className="grid min-h-36 place-items-center overflow-hidden rounded-2xl border border-dashed border-white/18 bg-white/[0.03] p-4">
              <input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={upload} />
              {draft.image ? <div className="relative aspect-[16/10] w-full"><Image src={draft.image} alt="Certificate preview" fill unoptimized className="object-contain" /></div> : <span className="grid justify-items-center gap-3 text-sm text-paper/58"><ImagePlus className="text-[#B18D43]" />Upload certificate</span>}
            </label>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-paper px-5 py-3 text-sm font-semibold text-ink">{busy ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}{editingId ? "Save changes" : "Add certificate"}</button>
            {message ? <p className="text-sm text-paper/48">{message}</p> : null}
          </div>
        </form>

        <div className="glass rounded-[28px] p-5 sm:p-7">
          <p className="mb-5 text-sm uppercase tracking-[0.25em] text-paper/40">Published Certificates</p>
          <div className="grid gap-2">
            {certificates.map((certificate) => (
              <div key={certificate.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-black/25"><Image src={certificate.image} alt="" fill unoptimized className="object-cover" /></div>
                <div className="min-w-0 flex-1"><p className="truncate font-medium">{certificate.title}</p><p className="truncate text-xs text-paper/42">{certificate.issuer}</p></div>
                <button type="button" onClick={() => update(certificate, { visible: !certificate.visible })} className="grid size-9 place-items-center rounded-full border border-white/10 text-paper/55">{certificate.visible ? <Eye size={15} /> : <EyeOff size={15} />}</button>
                <button type="button" onClick={() => { setDraft(certificate); setEditingId(certificate.id); }} className="grid size-9 place-items-center rounded-full border border-white/10 text-paper/55"><Pencil size={15} /></button>
                <button type="button" onClick={() => remove(certificate)} className="grid size-9 place-items-center rounded-full border border-white/10 text-paper/55 hover:text-coral"><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CertificateField({ label, value, onChange, required = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <label><span className="mb-2 block text-sm text-paper/48">{label}</span><input required={required} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 outline-none focus:border-[#B18D43]/60" /></label>;
}
