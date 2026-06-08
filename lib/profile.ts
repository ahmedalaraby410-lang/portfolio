import { promises as fs } from "fs";
import path from "path";
import type { ProfileSettings } from "@/data/profile";

const dataPath = path.join(process.cwd(), "data", "profile.json");
const blobProfilePrefix = "cms/profile-";
const hasBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export async function getProfile(): Promise<ProfileSettings> {
  if (hasBlob) {
    const { list } = await import("@vercel/blob");
    const result = await list({ prefix: blobProfilePrefix, limit: 100 });
    const blob = result.blobs.sort((a, b) => {
      return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    })[0];

    if (blob) {
      const response = await fetch(blob.url, { cache: "no-store" });
      if (response.ok) return (await response.json()) as ProfileSettings;
    }
  }

  const raw = await fs.readFile(dataPath, "utf8");
  return JSON.parse(raw) as ProfileSettings;
}

export async function saveProfile(profile: ProfileSettings) {
  if (hasBlob) {
    const { put } = await import("@vercel/blob");
    await put(`${blobProfilePrefix}${Date.now()}.json`, JSON.stringify(profile, null, 2), {
      access: "public",
      contentType: "application/json"
    });
    return;
  }

  await fs.writeFile(dataPath, `${JSON.stringify(profile, null, 2)}\n`);
}
