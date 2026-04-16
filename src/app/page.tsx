import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-slate-400 font-medium">Initializing Research...</div>
        </div>
      }>
        <DashboardShell />
      </Suspense>
    </main>
  );
}
