import { NextRequest, NextResponse } from "next/server";
import { getProfile, saveProfile } from "@/lib/profile";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await getProfile());
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const profile = { image: typeof body.image === "string" ? body.image : "" };
  await saveProfile(profile);
  return NextResponse.json(profile);
}
