import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: Request) {
  const workspaceId = cookies().get("plato_workspace")?.value;
  const body = await req.json();

  const record = await prisma.feedback.create({
    data: {
      workspaceId,
      runId: body.runId,
      pagePath: body.pagePath,
      message: body.message,
      contextJson: body.context
    }
  });

  return NextResponse.json({
    ok: true,
    id: record.id,
    runId: body.runId
  });
}
