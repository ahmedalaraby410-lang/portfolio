import { promises as fs } from "fs";
import path from "path";
import { makeSlug } from "@/lib/projects";
import type { SocialItem } from "@/data/socials";

const dataPath = path.join(process.cwd(), "data", "socials.json");
const blobPrefix = "cms/socials-";
const hasBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export async function getSocials(): Promise<SocialItem[]> {
  if (hasBlob) {
    const { list } = await import("@vercel/blob");
    const result = await list({ prefix: blobPrefix, limit: 100 });
    const blob = result.blobs.sort((a, b) => (
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    ))[0];

    if (blob) {
      const response = await fetch(blob.url, { cache: "no-store" });
      if (response.ok) return (await response.json()) as SocialItem[];
    }
  }

  return JSON.parse(await fs.readFile(dataPath, "utf8")) as SocialItem[];
}

export async function saveSocials(socials: SocialItem[]) {
  if (hasBlob) {
    const { put } = await import("@vercel/blob");
    await put(`${blobPrefix}${Date.now()}.json`, JSON.stringify(socials, null, 2), {
      access: "public",
      contentType: "application/json"
    });
    return;
  }

  await fs.writeFile(dataPath, `${JSON.stringify(socials, null, 2)}\n`);
}

export function normalizeSocial(input: Partial<SocialItem>, fallbackOrder: number): SocialItem {
  const label = input.label?.trim() || "New Link";

  return {
    id: input.id || makeSlug(label) || `social-${Date.now()}`,
    label,
    url: input.url?.trim() || "#",
    visible: input.visible !== false,
    order: Number.isFinite(Number(input.order)) ? Number(input.order) : fallbackOrder
  };
}
