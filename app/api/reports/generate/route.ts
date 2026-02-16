import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: Request) {
  const workspaceId = cookies().get("plato_workspace")?.value;
  const body = await req.json();

  const job = await prisma.exportJob.create({
    data: {
      workspaceId,
      kind: body.kind,
      status: "QUEUED"
    }
  });

  return NextResponse.json({ ok: true, id: job.id });
}
