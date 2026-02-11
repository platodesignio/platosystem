import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { generateApiKey, hashApiKey } from "@/lib/key.util";

function extractToken(cookieHeader: string | null) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/token=([^;]+)/);
  return match ? match[1] : null;
}

/* ============================
   GET: APIキー一覧取得
============================ */

export async function GET(req: Request) {
  try {
    const token = extractToken(req.headers.get("cookie"));
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);

    const keys = await prisma.apiKey.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        createdAt: true
      }
    });

    return NextResponse.json(keys);
  } catch (error) {
    console.error("GET apikey error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/* ============================
   POST: APIキー発行
============================ */

export async function POST(req: Request) {
  try {
    const token = extractToken(req.headers.get("cookie"));
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);

    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Invalid key name" },
        { status: 400 }
      );
    }

    const plainKey = generateApiKey();
    const hashedKey = hashApiKey(plainKey);

    await prisma.apiKey.create({
      data: {
        name,
        key: hashedKey,
        userId: decoded.userId
      }
    });

    // プレーンキーはこのレスポンスでのみ返す
    return NextResponse.json({
      apiKey: plainKey
    });
  } catch (error) {
    console.error("POST apikey error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/* ============================
   DELETE: APIキー削除
============================ */

export async function DELETE(req: Request) {
  try {
    const token = extractToken(req.headers.get("cookie"));
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Invalid key id" },
        { status: 400 }
      );
    }

    await prisma.apiKey.deleteMany({
      where: {
        id,
        userId: decoded.userId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE apikey error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
