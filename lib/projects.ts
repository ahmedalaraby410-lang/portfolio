import { promises as fs } from "fs";
import path from "path";
import slugify from "slugify";
import { PRODUCT_ORBIT_STAGES, type ProductOrbitStage, type Project } from "./types";

const dataPath = path.join(process.cwd(), "data", "projects.json");
const blobProjectsPrefix = "cms/projects-";
const hasBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export async function getProjects(): Promise<Project[]> {
  if (hasBlob) {
    const { list } = await import("@vercel/blob");
    const result = await list({ prefix: blobProjectsPrefix, limit: 100 });
    const blob = result.blobs.sort((a, b) => {
      return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    })[0];

    if (blob) {
      const response = await fetch(blob.url, { cache: "no-store" });
      if (response.ok) return (await response.json()) as Project[];
    }
  }

  const raw = await fs.readFile(dataPath, "utf8");
  return JSON.parse(raw) as Project[];
}

export async function getProject(slug: string) {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
}

export async function saveProjects(projects: Project[]) {
  if (hasBlob) {
    const { put } = await import("@vercel/blob");
    await put(`${blobProjectsPrefix}${Date.now()}.json`, JSON.stringify(projects, null, 2), {
      access: "public",
      contentType: "application/json"
    });
    return;
  }

  await fs.writeFile(dataPath, `${JSON.stringify(projects, null, 2)}\n`);
}

export function makeSlug(input: string) {
  return slugify(input, { lower: true, strict: true, trim: true });
}

export function normalizeProject(input: Partial<Project>): Project {
  const title = input.title?.trim() || "Untitled Project";
  const slug = input.slug?.trim() || makeSlug(title);

  return {
    id: input.id || slug,
    slug,
    title,
    category: input.category?.trim() || "Case Study",
    description: input.description?.trim() || "",
    overview: input.overview?.trim() || input.description?.trim() || "",
    problem: input.problem?.trim() || "",
    solution: input.solution?.trim() || "",
    process: input.process?.trim() || "",
    outcome: input.outcome?.trim() || "",
    coverImage: input.coverImage || "/images/default-cover.png",
    gallery: Array.isArray(input.gallery) ? input.gallery : [],
    behanceUrl: input.behanceUrl || "",
    tags: Array.isArray(input.tags)
      ? input.tags
      : String(input.tags || "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
    year: input.year || new Date().getFullYear().toString(),
    client: input.client || title,
    featured: input.featured !== false,
    orbitContributions: Array.isArray(input.orbitContributions)
      ? input.orbitContributions
          .filter((item) => PRODUCT_ORBIT_STAGES.includes(item.stage as ProductOrbitStage))
          .map((item) => ({
            stage: item.stage as ProductOrbitStage,
            note: item.note?.trim() || ""
          }))
      : []
  };
}
