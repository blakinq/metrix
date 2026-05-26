import { DashboardHeader } from "@/components/dashboard/header";

export default function SitesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <DashboardHeader />
      <div className="flex flex-1">{children}</div>
    </div>
  );
}
