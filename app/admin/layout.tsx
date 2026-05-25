import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/get-user";
import { DashboardHeader } from "@/components/dashboard/header";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) notFound();
  const me = await prisma.user.findUnique({ where: { id: user.id } });
  if (!me?.isSuperAdmin) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
