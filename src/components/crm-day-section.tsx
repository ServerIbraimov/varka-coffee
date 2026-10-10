export function CrmDaySection({
  title,
  meta,
  children,
}: {
  title: string
  meta?: string
  children: React.ReactNode
}) {
  return (
    <section className="relative">
      <div className="sticky top-0 z-20 -mx-1 mb-3 flex items-center justify-between gap-3 rounded-xl border border-line/80 bg-mist/95 px-3 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="h-8 w-1 rounded-full bg-pine" />
          <div>
            <p className="display text-xl leading-none">{title}</p>
            {meta ? <p className="mt-1 text-xs text-muted">{meta}</p> : null}
          </div>
        </div>
      </div>
      <div className="space-y-3 border-l border-line/80 pl-4 ml-1.5">{children}</div>
    </section>
  )
}
