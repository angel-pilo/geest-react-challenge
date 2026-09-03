export function ContactSkeleton() {
  return (
    <div
      role="status"
      aria-label="Cargando contactos"
      className="overflow-hidden rounded-xl border border-slate-200 bg-white"
    >
      <span className="sr-only">Cargando contactos…</span>
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="flex items-center gap-5 border-b border-slate-100 p-6 motion-safe:animate-pulse"
        >
          <div className="size-10 shrink-0 rounded-full bg-slate-100" />
          <div className="h-4 w-1/4 rounded bg-slate-100" />
          <div className="h-4 flex-1 rounded bg-slate-100" />
          <div className="hidden h-6 w-24 rounded bg-slate-100 sm:block" />
        </div>
      ))}
    </div>
  )
}
