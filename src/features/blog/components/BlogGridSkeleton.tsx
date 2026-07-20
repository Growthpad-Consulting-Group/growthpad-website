export default function BlogGridSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-secondary/10 pb-6 mb-10">
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 w-24 rounded-full bg-secondary/10" />
          ))}
        </div>
        <div className="flex gap-4">
          <div className="h-10 w-60 rounded-xl bg-secondary/10" />
          <div className="h-10 w-35 rounded-xl bg-secondary/10" />
        </div>
      </div>

      <div className="flex flex-col gap-12">
        <div className="flex flex-col lg:flex-row items-center gap-8 rounded-3xl border border-primary/10 bg-white/40 p-6">
          <div className="aspect-video w-full lg:w-3/5 shrink-0 rounded-2xl bg-secondary/10" />
          <div className="flex flex-1 flex-col gap-4">
            <div className="h-4 w-40 rounded bg-secondary/10" />
            <div className="h-8 w-full rounded bg-secondary/10" />
            <div className="h-4 w-full rounded bg-secondary/10" />
            <div className="h-4 w-2/3 rounded bg-secondary/10" />
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-5 rounded-2xl border border-primary/5 bg-white/20 p-5"
            >
              <div className="aspect-455/232 w-full rounded-xl bg-secondary/10" />
              <div className="flex flex-col gap-2">
                <div className="h-3 w-32 rounded bg-secondary/10" />
                <div className="h-5 w-full rounded bg-secondary/10" />
                <div className="h-4 w-full rounded bg-secondary/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
