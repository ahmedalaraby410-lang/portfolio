"use client";

import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { ImagePlus, Loader2, Save, Trash2 } from "lucide-react";
import type { ProfileSettings } from "@/data/profile";

export function ProfileAdminPanel({ initialProfile }: { initialProfile: ProfileSettings }) {
  const [profile, setProfile] = useState(initialProfile);
  const [savedImage, setSavedImage] = useState(initialProfile.image);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    setBusy(true);

    const formData = new FormData();
    formData.append("folder", "profile");
    formData.append("files", event.target.files[0]);

    try {
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Upload failed");
      const data = (await response.json()) as { urls: string[] };
      setProfile({ image: data.urls[0] || "" });
      setMessage("Portrait uploaded. Save changes to publish it.");
    } catch {
      setMessage("Could not upload that image.");
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  };

  const saveChanges = async () => {
    setBusy(true);
    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile)
    });

    if (response.ok) {
      const saved = (await response.json()) as ProfileSettings;
      setProfile(saved);
      setSavedImage(saved.image);
      setMessage(saved.image ? "Profile picture updated." : "Profile picture removed. Initials will be shown.");
    } else {
      setMessage("Could not save profile settings.");
    }
    setBusy(false);
  };

  return (
    <section id="profile-settings" className="mb-12 scroll-mt-28 border-y border-white/10 py-10">
      <div className="mb-7">
        <p className="text-sm uppercase tracking-[0.3em] text-[#B18D43]">Profile Settings</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">Your portrait across the portfolio.</h2>
      </div>

      <div className="glass grid gap-7 rounded-[28px] p-5 sm:grid-cols-[220px_1fr] sm:p-7">
        <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.035]">
          {profile.image ? (
            <Image src={profile.image} alt="Profile preview" fill unoptimized className="object-cover" />
          ) : (
            <div className="grid h-full place-items-center text-4xl font-semibold tracking-[0.08em] text-[#D4B66F]">AA</div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <h3 className="text-2xl font-semibold">{profile.image ? "Profile picture ready" : "Initials fallback active"}</h3>
          <p className="mt-3 max-w-xl leading-7 text-paper/52">
            Use a square portrait at 800×800 or larger. Uploads are automatically cropped to a centered square and optimized for the Hero, About, and Contact sections.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <label className="inline-flex items-center gap-2 rounded-full bg-paper px-5 py-3 text-sm font-semibold text-ink transition hover:bg-[#D4B66F]">
              <input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadImage} />
              {busy ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
              {profile.image ? "Replace image" : "Upload image"}
            </label>
            <button
              type="button"
              disabled={!profile.image || busy}
              onClick={() => { setProfile({ image: "" }); setMessage("Image removed from preview. Save changes to publish."); }}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-3 text-sm text-paper/68 transition hover:border-coral/50 hover:text-coral disabled:opacity-35"
            >
              <Trash2 size={16} />
              Remove
            </button>
            <button
              type="button"
              disabled={busy || profile.image === savedImage}
              onClick={saveChanges}
              className="inline-flex items-center gap-2 rounded-full border border-[#B18D43]/35 px-5 py-3 text-sm text-[#D4B66F] transition hover:bg-[#B18D43]/10 disabled:opacity-35"
            >
              <Save size={16} />
              Save changes
            </button>
          </div>
          {message ? <p className="mt-4 text-sm text-paper/48">{message}</p> : null}
        </div>
      </div>
    </section>
  );
}
