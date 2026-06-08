import { NextRequest, NextResponse } from "next/server";
import { getSocials, normalizeSocial, saveSocials } from "@/lib/socials";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await getSocials());
}

export async function POST(request: NextRequest) {
  const socials = await getSocials();
  const social = normalizeSocial(await request.json(), socials.length + 1);
  let id = social.id;
  let count = 2;

  while (socials.some((item) => item.id === id)) {
    id = `${social.id}-${count}`;
    count += 1;
  }

  social.id = id;
  socials.push(social);
  await saveSocials(socials);
  return NextResponse.json(social, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const socials = await getSocials();
  const index = socials.findIndex((item) => item.id === body.id);
  if (index === -1) return NextResponse.json({ error: "Social link not found" }, { status: 404 });

  const social = normalizeSocial({ ...socials[index], ...body, id: socials[index].id }, socials[index].order);
  socials[index] = social;
  await saveSocials(socials);
  return NextResponse.json(social);
}

export async function DELETE(request: NextRequest) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const next = (await getSocials())
    .filter((item) => item.id !== id)
    .sort((a, b) => a.order - b.order)
    .map((item, index) => ({ ...item, order: index + 1 }));

  await saveSocials(next);
  return NextResponse.json({ ok: true });
}
