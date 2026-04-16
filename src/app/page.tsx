import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Loader2 } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Suspense
        fallback={
          <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            <span className="ml-3 text-slate-500 font-medium">Loading Dashboard...</span>
          </div>
        }
      >
        <DashboardShell />
      </Suspense>
    </main>
  );
}
