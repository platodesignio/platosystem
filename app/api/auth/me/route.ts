import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const session = cookies().get("plato_user")?.value;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session },
    include: { memberships: { include: { workspace: true } } }
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const workspace = user.memberships[0]?.workspace;

  return NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    },
    workspace: workspace
      ? { id: workspace.id, name: workspace.name, slug: workspace.slug }
      : null
  });
}
