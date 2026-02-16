import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const workspaceId = cookies().get("plato_workspace")?.value;
  if (!workspaceId)
    return NextResponse.json({ error: "No workspace" }, { status: 400 });

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId }
  });

  return NextResponse.json({ ok: true, workspace });
}

export async function PUT(req: Request) {
  const workspaceId = cookies().get("plato_workspace")?.value;
  if (!workspaceId)
    return NextResponse.json({ error: "No workspace" }, { status: 400 });

  const body = await req.json();

  const workspace = await prisma.workspace.update({
    where: { id: workspaceId },
    data: {
      name: body.name,
      slug: body.slug
    }
  });

  return NextResponse.json({ ok: true, workspace });
}
