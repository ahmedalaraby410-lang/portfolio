import { promises as fs } from "fs";
import path from "path";
import { makeSlug } from "@/lib/projects";
import type { Certificate } from "@/data/certificates";

const dataPath = path.join(process.cwd(), "data", "certificates.json");
const blobPrefix = "cms/certificates-";
const hasBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export async function getCertificates(): Promise<Certificate[]> {
  if (hasBlob) {
    const { list } = await import("@vercel/blob");
    const result = await list({ prefix: blobPrefix, limit: 100 });
    const blob = result.blobs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0];
    if (blob) {
      const response = await fetch(blob.url, { cache: "no-store" });
      if (response.ok) return (await response.json()) as Certificate[];
    }
  }

  return JSON.parse(await fs.readFile(dataPath, "utf8")) as Certificate[];
}

export async function saveCertificates(certificates: Certificate[]) {
  if (hasBlob) {
    const { put } = await import("@vercel/blob");
    await put(`${blobPrefix}${Date.now()}.json`, JSON.stringify(certificates, null, 2), {
      access: "public",
      contentType: "application/json"
    });
    return;
  }
  await fs.writeFile(dataPath, `${JSON.stringify(certificates, null, 2)}\n`);
}

export function normalizeCertificate(input: Partial<Certificate>, fallbackOrder: number): Certificate {
  const title = input.title?.trim() || "Untitled Certificate";
  return {
    id: input.id || makeSlug(title) || `certificate-${Date.now()}`,
    title,
    issuer: input.issuer?.trim() || "",
    description: input.description?.trim() || "",
    date: input.date?.trim() || "Completed",
    image: input.image || "",
    link: input.link || input.image || "",
    visible: input.visible !== false,
    order: Number.isFinite(Number(input.order)) ? Number(input.order) : fallbackOrder
  };
}
