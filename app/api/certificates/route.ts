import { NextRequest, NextResponse } from "next/server";
import { getCertificates, normalizeCertificate, saveCertificates } from "@/lib/certificates";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await getCertificates());
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const certificates = await getCertificates();
  const certificate = normalizeCertificate(body, certificates.length + 1);
  let id = certificate.id;
  let count = 2;
  while (certificates.some((item) => item.id === id)) id = `${certificate.id}-${count++}`;
  certificate.id = id;
  certificates.push(certificate);
  await saveCertificates(certificates);
  return NextResponse.json(certificate, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const certificates = await getCertificates();
  const index = certificates.findIndex((item) => item.id === body.id);
  if (index === -1) return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
  const certificate = normalizeCertificate({ ...certificates[index], ...body, id: certificates[index].id }, certificates[index].order);
  certificates[index] = certificate;
  await saveCertificates(certificates);
  return NextResponse.json(certificate);
}

export async function DELETE(request: NextRequest) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const certificates = (await getCertificates())
    .filter((item) => item.id !== id)
    .sort((a, b) => a.order - b.order)
    .map((item, index) => ({ ...item, order: index + 1 }));
  await saveCertificates(certificates);
  return NextResponse.json({ ok: true });
}
