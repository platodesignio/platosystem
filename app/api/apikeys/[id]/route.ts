import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.workspaceApiKey.update({
    where: { id: params.id },
    data: { revokedAt: new Date() }
  });

  return NextResponse.json({ ok: true });
}
