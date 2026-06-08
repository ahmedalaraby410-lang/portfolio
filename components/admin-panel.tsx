"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { ImagePlus, Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import type { Project } from "@/lib/types";

const emptyProject: Project = {
  id: "",
  slug: "",
  title: "",
  category: "",
  description: "",
  overview: "",
  problem: "",
  solution: "",
  process: "",
  outcome: "",
  coverImage: "",
  gallery: [],
  behanceUrl: "",
  tags: [],
  year: new Date().getFullYear().toString(),
  client: "",
  featured: true,
  orbitContributions: []
};

export function AdminPanel({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [draft, setDraft] = useState<Project>(emptyProject);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  const updateDraft = <K extends keyof Project>(key: K, value: Project[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const uploadImages = async (files: FileList | null) => {
    if (!files?.length) return [];

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });

    if (!response.ok) throw new Error("Image upload failed");
    const data = (await response.json()) as { urls: string[] };
    return data.urls;
  };

  const onCoverUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    setBusy(true);
    try {
      const [url] = await uploadImages(event.target.files);
      if (url) updateDraft("coverImage", url);
      setMessage("Cover image uploaded.");
    } catch {
      setMessage("Could not upload that cover image.");
    } finally {
      setBusy(false);
    }
  };

  const onGalleryUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    setBusy(true);
    try {
      const urls = await uploadImages(event.target.files);
      updateDraft("gallery", [...draft.gallery, ...urls]);
      setMessage(`${urls.length} gallery image${urls.length === 1 ? "" : "s"} uploaded.`);
    } catch {
      setMessage("Could not upload gallery images.");
    } finally {
      setBusy(false);
    }
  };

  const resetForm = () => {
    setDraft(emptyProject);
    setEditingId(null);
  };

  const editProject = (project: Project) => {
    setDraft(project);
    setEditingId(project.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProject = async (id: string) => {
    const confirmed = window.confirm("Delete this project? This removes it from the portfolio.");
    if (!confirmed) return;

    setBusy(true);
    const response = await fetch(`/api/projects?id=${encodeURIComponent(id)}`, { method: "DELETE" });

    if (response.ok) {
      setProjects((current) => current.filter((project) => project.id !== id));
      if (editingId === id) resetForm();
      setMessage("Project deleted.");
    } else {
      setMessage("Could not delete project.");
    }
    setBusy(false);
  };

  const saveProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);

    const payload = {
      ...draft,
      tags: draft.tags
        .join(",")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    };

    const response = await fetch("/api/projects", {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const saved = (await response.json()) as Project;
      setProjects((current) => (isEditing ? current.map((project) => (project.id === saved.id ? saved : project)) : [saved, ...current]));
      setDraft(saved);
      setEditingId(saved.id);
      setMessage(isEditing ? "Project updated." : "Project published.");
    } else {
      setMessage("Could not save project.");
    }

    setBusy(false);
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[0.95fr_0.75fr]">
      <form onSubmit={saveProject} className="glass rounded-[28px] p-5 sm:p-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-paper/40">{isEditing ? "Editing" : "New Project"}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">{isEditing ? draft.title : "Create a case study"}</h2>
          </div>
          <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-sm text-paper/68 transition hover:text-paper">
            <Plus size={16} />
            New
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Project title" value={draft.title} onChange={(value) => updateDraft("title", value)} required />
          <Field label="Category" value={draft.category} onChange={(value) => updateDraft("category", value)} required />
          <Field label="Client" value={draft.client || ""} onChange={(value) => updateDraft("client", value)} />
          <Field label="Year" value={draft.year || ""} onChange={(value) => updateDraft("year", value)} />
          <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 md:col-span-2">
            <span className="text-sm text-paper/58">Show in Featured Work</span>
            <input
              type="checkbox"
              checked={draft.featured !== false}
              onChange={(event) => setDraft((current) => ({ ...current, featured: event.target.checked }))}
              className="size-5 accent-[#B18D43]"
            />
          </label>
          <Field className="md:col-span-2" label="Behance link" value={draft.behanceUrl || ""} onChange={(value) => updateDraft("behanceUrl", value)} />
          <Field className="md:col-span-2" label="Tags, separated by commas" value={draft.tags.join(", ")} onChange={(value) => updateDraft("tags", value.split(",").map((tag) => tag.trim()))} />
          <Area className="md:col-span-2" label="Short description" value={draft.description} onChange={(value) => updateDraft("description", value)} required />
          <Area label="Overview" value={draft.overview} onChange={(value) => updateDraft("overview", value)} />
          <Area label="Problem" value={draft.problem} onChange={(value) => updateDraft("problem", value)} />
          <Area label="Solution" value={draft.solution} onChange={(value) => updateDraft("solution", value)} />
          <Area label="Process" value={draft.process} onChange={(value) => updateDraft("process", value)} />
          <Area className="md:col-span-2" label="Outcome" value={draft.outcome} onChange={(value) => updateDraft("outcome", value)} />

        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <UploadBox label="Upload cover image" onChange={onCoverUpload} multiple={false} />
          <UploadBox label="Upload gallery images" onChange={onGalleryUpload} multiple />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-paper px-5 py-3 text-sm font-semibold text-ink transition hover:bg-lime disabled:opacity-60">
            {busy ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {isEditing ? "Save Changes" : "Publish Project"}
          </button>
          {message ? <p className="text-sm text-paper/52">{message}</p> : null}
        </div>
      </form>

      <aside className="grid content-start gap-5">
        <div className="glass rounded-[28px] p-5">
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-paper/40">Preview</p>
          <div className="overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.04]">
            <div className="relative aspect-[16/11] bg-white/[0.04]">
              {draft.coverImage ? <Image src={draft.coverImage} alt="Cover preview" fill className="object-cover" /> : <div className="grid h-full place-items-center text-paper/35">Cover preview</div>}
            </div>
            <div className="p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-lime">{draft.category || "Category"}</p>
              <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{draft.title || "Project title"}</h3>
              <p className="mt-3 leading-6 text-paper/58">{draft.description || "Project description will appear here."}</p>
            </div>
          </div>
          {draft.gallery.length ? (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {draft.gallery.map((image) => (
                <div key={image} className="group relative aspect-square overflow-hidden rounded-xl border border-white/10">
                  <Image src={image} alt="Gallery preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => updateDraft("gallery", draft.gallery.filter((item) => item !== image))}
                    className="absolute right-1 top-1 grid size-7 place-items-center rounded-full bg-ink/80 opacity-0 transition group-hover:opacity-100"
                    aria-label="Remove gallery image"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="glass rounded-[28px] p-5">
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-paper/40">Published Projects</p>
          <div className="grid gap-2">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{project.title}</p>
                  <p className="truncate text-sm text-paper/45">{project.category}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button type="button" onClick={() => editProject(project)} className="grid size-9 place-items-center rounded-full border border-white/10 text-paper/62 transition hover:text-lime" aria-label={`Edit ${project.title}`}>
                    <Pencil size={15} />
                  </button>
                  <button type="button" onClick={() => deleteProject(project.id)} className="grid size-9 place-items-center rounded-full border border-white/10 text-paper/62 transition hover:text-coral" aria-label={`Delete ${project.title}`}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function Field({ label, value, onChange, className = "", required = false }: { label: string; value: string; onChange: (value: string) => void; className?: string; required?: boolean }) {
  return (
    <label className={className}>
      <span className="mb-2 block text-sm text-paper/48">{label}</span>
      <input required={required} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-paper outline-none transition placeholder:text-paper/25 focus:border-lime/60" />
    </label>
  );
}

function Area({ label, value, onChange, className = "", required = false }: { label: string; value: string; onChange: (value: string) => void; className?: string; required?: boolean }) {
  return (
    <label className={className}>
      <span className="mb-2 block text-sm text-paper/48">{label}</span>
      <textarea required={required} value={value} onChange={(event) => onChange(event.target.value)} rows={5} className="w-full resize-y rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-paper outline-none transition placeholder:text-paper/25 focus:border-lime/60" />
    </label>
  );
}

function UploadBox({ label, onChange, multiple }: { label: string; onChange: (event: ChangeEvent<HTMLInputElement>) => void; multiple?: boolean }) {
  return (
    <label className="grid min-h-36 place-items-center rounded-2xl border border-dashed border-white/18 bg-white/[0.035] p-5 text-center transition hover:border-lime/60">
      <input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple={multiple} onChange={onChange} />
      <span className="grid justify-items-center gap-3 text-sm text-paper/58">
        <ImagePlus size={24} className="text-lime" />
        {label}
      </span>
    </label>
  );
}
