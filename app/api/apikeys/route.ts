import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";

function generateKey() {
  return "plato_" + randomBytes(24).toString("hex");
}

export async function GET() {
  const workspaceId = cookies().get("plato_workspace")?.value;
  const keys = await prisma.workspaceApiKey.findMany({
    where: { workspaceId }
  });
  return NextResponse.json({ ok: true, keys });
}

export async function POST(req: Request) {
  const workspaceId = cookies().get("plato_workspace")?.value;
  const body = await req.json();

  const plainKey = generateKey();
  const hashed = await bcrypt.hash(plainKey, 10);

  await prisma.workspaceApiKey.create({
    data: {
      workspaceId,
      name: body.name,
      scope: body.scope,
      keyHash: hashed
    }
  });

  return NextResponse.json({ ok: true, apiKey: plainKey });
}
