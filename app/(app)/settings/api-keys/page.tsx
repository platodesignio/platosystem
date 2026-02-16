// app/(app)/settings/api-keys/page.tsx
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import ApiKeysClient from "./ui";

async function getWorkspaceId() {
  return cookies().get("plato_workspace")?.value || null;
}

export default async function ApiKeysPage() {
  const workspaceId = await getWorkspaceId();
  if (!workspaceId) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-white/60">
        No workspace selected.
      </div>
    );
  }

  const keys = await prisma.workspaceApiKey.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">API Keys</h1>
        <p className="mt-2 text-sm text-white/60">
          Create keys for ingestion and operations. Secret is shown only once at creation.
        </p>
      </section>

      <ApiKeysClient initialKeys={keys.map((k) => ({
        id: k.id,
        name: k.name,
        scope: k.scope,
        createdAt: k.createdAt.toISOString(),
        lastUsedAt: k.lastUsedAt ? k.lastUsedAt.toISOString() : null,
        revokedAt: k.revokedAt ? k.revokedAt.toISOString() : null
      }))} />
    </div>
  );
}
