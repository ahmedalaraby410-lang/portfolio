import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { makeSlug } from "@/lib/projects";

export const runtime = "nodejs";

const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml", "application/pdf"]);
const profileTypes = new Set(["image/png", "image/jpeg", "image/webp"]);

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const requestedFolder = formData.get("folder");
  const folder = requestedFolder === "clients" || requestedFolder === "profile" || requestedFolder === "certificates" || requestedFolder === "resume"
    ? requestedFolder
    : "uploads";
  const files = formData.getAll("files").filter((file): file is File => file instanceof File);

  if (!files.length) {
    return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", folder);
  await fs.mkdir(uploadDir, { recursive: true });

  const urls = await Promise.all(
    files.map(async (file) => {
      if (!allowedTypes.has(file.type)) {
        throw new Error(`${file.name} is not a supported image type`);
      }
      if (folder === "profile" && !profileTypes.has(file.type)) {
        throw new Error(`${file.name} is not a supported profile image type`);
      }
      if (folder === "resume" && file.type !== "application/pdf") {
        throw new Error(`${file.name} is not a PDF`);
      }

      const shouldNormalizeLogo = folder === "clients" && file.type !== "image/svg+xml";
      const shouldNormalizeProfile = folder === "profile";
      const originalExt = path.extname(file.name);
      const ext = folder === "resume" ? ".pdf" : shouldNormalizeLogo ? ".png" : shouldNormalizeProfile ? ".webp" : path.extname(file.name) || ".png";
      const base = makeSlug(path.basename(file.name, originalExt)) || "image";
      const filename = `${Date.now()}-${base}${ext.toLowerCase()}`;
      let bytes: Uint8Array = new Uint8Array(await file.arrayBuffer());
      let contentType = file.type;

      if (shouldNormalizeLogo) {
        const sharp = (await import("sharp")).default;
        bytes = await sharp(bytes)
          .trim({ threshold: 12 })
          .resize({ width: 900, height: 260, fit: "inside", withoutEnlargement: false })
          .extend({
            top: 70,
            bottom: 70,
            left: 80,
            right: 80,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .png()
          .toBuffer();
        contentType = "image/png";
      }

      if (shouldNormalizeProfile) {
        const sharp = (await import("sharp")).default;
        bytes = await sharp(bytes)
          .rotate()
          .resize(1200, 1200, { fit: "cover", position: "attention" })
          .webp({ quality: 88 })
          .toBuffer();
        contentType = "image/webp";
      }

      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const { put } = await import("@vercel/blob");
        const blob = await put(`${folder}/${filename}`, Buffer.from(bytes), {
          access: "public",
          contentType
        });
        return blob.url;
      }

      await fs.writeFile(path.join(uploadDir, filename), bytes);
      return `/${folder}/${filename}`;
    })
  );

  return NextResponse.json({ urls });
}
