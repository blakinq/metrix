import { DashboardHeader } from "@/components/dashboard/header";

export default function SitesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">{children}</div>
    </div>
  );
}
