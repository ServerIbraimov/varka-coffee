export function PageLoader({ label = "ВАРКА" }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-5">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="loader-ring absolute inset-0 rounded-full border border-line border-t-pine" />
        <span className="loader-mark display text-lg text-pine">{label.slice(0, 1)}</span>
      </div>
      <p className="text-xs tracking-[0.28em] text-muted uppercase">Загрузка</p>
    </div>
  )
}
