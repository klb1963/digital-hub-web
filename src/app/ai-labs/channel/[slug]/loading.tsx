// src/app/ai-labs/channel/[slug]/loading.tsx

export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-7 w-64 rounded-lg bg-black/10" />
      <div className="mt-3 h-4 w-96 rounded bg-black/5" />

      <div className="mt-8 grid gap-5">
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="h-5 w-40 rounded bg-black/10" />
          <div className="mt-4 space-y-2">
            <div className="h-4 w-full rounded bg-black/5" />
            <div className="h-4 w-5/6 rounded bg-black/5" />
            <div className="h-4 w-4/6 rounded bg-black/5" />
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="h-4 w-32 rounded bg-black/10" />
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-black/10 bg-white p-4">
                <div className="h-3 w-28 rounded bg-black/10" />
                <div className="mt-2 h-6 w-24 rounded bg-black/5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}