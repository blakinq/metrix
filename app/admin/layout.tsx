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
    <div className="relative flex min-h-screen flex-col bg-background">
      <DashboardHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 md:px-10">{children}</main>
    </div>
  );
}
