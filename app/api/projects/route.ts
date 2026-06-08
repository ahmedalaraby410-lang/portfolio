import { NextRequest, NextResponse } from "next/server";
import { getProjects, makeSlug, normalizeProject, saveProjects } from "@/lib/projects";

export const runtime = "nodejs";

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const projects = await getProjects();
  const project = normalizeProject({ ...body, slug: makeSlug(body.title || "project") });
  let slug = project.slug;
  let count = 2;

  while (projects.some((item) => item.slug === slug)) {
    slug = `${project.slug}-${count}`;
    count += 1;
  }

  project.slug = slug;
  project.id = slug;
  projects.unshift(project);
  await saveProjects(projects);

  return NextResponse.json(project, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const projects = await getProjects();
  const index = projects.findIndex((project) => project.id === body.id);

  if (index === -1) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const project = normalizeProject({
    ...projects[index],
    ...body,
    slug: projects[index].slug,
    id: projects[index].id
  });

  projects[index] = project;
  await saveProjects(projects);

  return NextResponse.json(project);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const projects = await getProjects();
  const nextProjects = projects.filter((project) => project.id !== id);
  await saveProjects(nextProjects);

  return NextResponse.json({ ok: true });
}
