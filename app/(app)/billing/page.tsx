// app/(app)/billing/page.tsx
import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";

async function getWorkspaceId() {
  return cookies().get("plato_workspace")?.value || null;
}

export default async function BillingPage() {
  const workspaceId = await getWorkspaceId();
  if (!workspaceId) return <Empty message="No workspace selected." />;

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId }
  });

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="mt-2 text-sm text-white/60">
          Manage subscription, invoices, and payment methods.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card
          title="Subscription"
          subtitle="Upgrade, cancel, and manage your plan in Stripe."
          href="/billing/subscription"
        />
        <Card
          title="Invoices"
          subtitle="View and download past invoices."
          href="/billing/invoices"
        />
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <div className="text-sm font-medium">Workspace</div>
        <div className="mt-2 text-sm text-white/60 leading-relaxed">
          {workspace ? (
            <>
              <div>Name: {workspace.name}</div>
              <div>Slug: {workspace.slug}</div>
            </>
          ) : (
            "Workspace not found."
          )}
        </div>
        <div className="mt-6">
          <Link
            href="/billing/subscription"
            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-white/90 transition"
          >
            Manage subscription →
          </Link>
        </div>
      </section>
    </div>
  );
}

function Card({
  title,
  subtitle,
  href
}: {
  title: string;
  subtitle: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-white/20 transition"
    >
      <div className="text-xl font-semibold tracking-tight">{title}</div>
      <div className="mt-2 text-sm text-white/60 leading-relaxed">{subtitle}</div>
      <div className="mt-6 text-sm text-white/60">Open →</div>
    </Link>
  );
}

function Empty({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-white/60">
      {message}
    </div>
  );
}
