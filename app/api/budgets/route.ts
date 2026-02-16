import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: Request) {
  const workspaceId = cookies().get("plato_workspace")?.value;
  const body = await req.json();

  const budget = await prisma.budget.create({
    data: {
      workspaceId,
      name: body.name,
      amountUsd: body.amountUsd,
      thresholdPct: body.thresholdPct,
      isActive: true
    }
  });

  return NextResponse.json({ ok: true, budget });
}
