import { promises as fs } from "fs";
import path from "path";
import { makeSlug } from "@/lib/projects";
import type { Client } from "@/data/clients";

const dataPath = path.join(process.cwd(), "data", "clients.json");
const blobClientsPrefix = "cms/clients-";
const hasBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export async function getClients(): Promise<Client[]> {
  if (hasBlob) {
    const { list } = await import("@vercel/blob");
    const result = await list({ prefix: blobClientsPrefix, limit: 100 });
    const blob = result.blobs.sort((a, b) => {
      return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    })[0];

    if (blob) {
      const response = await fetch(blob.url, { cache: "no-store" });
      if (response.ok) return (await response.json()) as Client[];
    }
  }

  const raw = await fs.readFile(dataPath, "utf8");
  return JSON.parse(raw) as Client[];
}

export async function saveClients(clients: Client[]) {
  if (hasBlob) {
    const { put } = await import("@vercel/blob");
    await put(`${blobClientsPrefix}${Date.now()}.json`, JSON.stringify(clients, null, 2), {
      access: "public",
      contentType: "application/json"
    });
    return;
  }

  await fs.writeFile(dataPath, `${JSON.stringify(clients, null, 2)}\n`);
}

export function normalizeClient(input: Partial<Client>, fallbackOrder: number): Client {
  const name = input.name?.trim() || "Untitled Client";

  return {
    id: input.id || makeSlug(name) || `client-${Date.now()}`,
    name,
    logo: input.logo || "",
    category: input.category?.trim() || "",
    visible: input.visible !== false,
    order: Number.isFinite(Number(input.order)) ? Number(input.order) : fallbackOrder
  };
}
