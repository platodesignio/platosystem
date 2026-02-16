import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: Request) {
  const key = req.headers.get("x-plato-key");
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 401 });

  const keys = await prisma.workspaceApiKey.findMany({
    where: { revokedAt: null }
  });

  let matched = null;
  for (const k of keys) {
    if (await bcrypt.compare(key, k.keyHash)) {
      matched = k;
      break;
    }
  }

  if (!matched)
    return NextResponse.json({ error: "Invalid key" }, { status: 401 });

  const body = await req.json();

  const rate = await prisma.providerRate.findFirst({
    where: {
      workspaceId: matched.workspaceId,
      provider: body.provider,
      model: body.model
    }
  });

  const cost =
    body.costUsd ??
    (rate
      ? (body.inputTokens / 1_000_000) * rate.inputPer1M +
        (body.outputTokens / 1_000_000) * rate.outputPer1M
      : 0);

  await prisma.usageEvent.create({
    data: {
      workspaceId: matched.workspaceId,
      provider: body.provider,
      model: body.model,
      inputTokens: body.inputTokens,
      outputTokens: body.outputTokens,
      totalTokens: body.totalTokens,
      costUsd: cost,
      requestCount: body.requestCount ?? 1,
      occurredAt: new Date(body.occurredAt)
    }
  });

  return NextResponse.json({ ok: true });
}
