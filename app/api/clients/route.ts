import { NextRequest, NextResponse } from "next/server";
import { getClients, normalizeClient, saveClients } from "@/lib/clients";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await getClients());
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const clients = await getClients();
  const client = normalizeClient(body, clients.length + 1);
  let id = client.id;
  let count = 2;

  while (clients.some((item) => item.id === id)) {
    id = `${client.id}-${count}`;
    count += 1;
  }

  client.id = id;
  clients.push(client);
  await saveClients(clients);
  return NextResponse.json(client, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const clients = await getClients();
  const index = clients.findIndex((client) => client.id === body.id);

  if (index === -1) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const client = normalizeClient({ ...clients[index], ...body, id: clients[index].id }, clients[index].order);
  clients[index] = client;
  await saveClients(clients);
  return NextResponse.json(client);
}

export async function DELETE(request: NextRequest) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const clients = await getClients();
  const nextClients = clients
    .filter((client) => client.id !== id)
    .sort((a, b) => a.order - b.order)
    .map((client, index) => ({ ...client, order: index + 1 }));

  await saveClients(nextClients);
  return NextResponse.json({ ok: true });
}
