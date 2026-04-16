export default function GameLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Skeleton Nav */}
      <div className="bg-white border-b border-slate-200 h-16 flex items-center px-4">
        <div className="max-w-5xl mx-auto w-full flex justify-between">
          <div className="h-4 w-32 bg-slate-100 animate-pulse rounded" />
          <div className="h-4 w-24 bg-slate-100 animate-pulse rounded" />
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Skeleton Header */}
        <div className="space-y-3">
          <div className="h-8 w-64 bg-slate-200 animate-pulse rounded-lg" />
          <div className="h-4 w-96 bg-slate-100 animate-pulse rounded" />
        </div>

        {/* Skeleton Players */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48 bg-white border border-slate-200 rounded-2xl animate-pulse shadow-sm" />
          <div className="h-48 bg-white border border-slate-200 rounded-2xl animate-pulse shadow-sm" />
        </div>

        {/* Skeleton Result */}
        <div className="h-24 bg-white border border-slate-200 rounded-2xl animate-pulse shadow-sm" />

        {/* Skeleton Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-64 bg-white border border-slate-200 rounded-2xl animate-pulse shadow-sm" />
          <div className="h-64 bg-slate-900 rounded-2xl animate-pulse shadow-sm" />
        </div>
      </main>
    </div>
  );
}
