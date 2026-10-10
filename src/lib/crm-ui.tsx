export const orderStatusMeta: Record<string, { label: string; tone: string; dot: string }> = {
  new: { label: "Новый", tone: "bg-sky-50 text-sky-800 border-sky-200", dot: "bg-sky-500" },
  preparing: { label: "Готовим", tone: "bg-amber-50 text-amber-900 border-amber-200", dot: "bg-amber-500" },
  ready: { label: "Готов", tone: "bg-emerald-50 text-emerald-900 border-emerald-200", dot: "bg-emerald-500" },
  done: { label: "Выдан", tone: "bg-stone-100 text-stone-600 border-stone-200", dot: "bg-stone-400" },
  cancelled: { label: "Отменён", tone: "bg-rose-50 text-rose-800 border-rose-200", dot: "bg-rose-500" },
}

export const bookingStatusMeta: Record<string, { label: string; tone: string; dot: string }> = {
  new: { label: "Новая", tone: "bg-sky-50 text-sky-800 border-sky-200", dot: "bg-sky-500" },
  confirmed: { label: "Подтверждена", tone: "bg-violet-50 text-violet-900 border-violet-200", dot: "bg-violet-500" },
  seated: { label: "За столом", tone: "bg-emerald-50 text-emerald-900 border-emerald-200", dot: "bg-emerald-500" },
  done: { label: "Завершена", tone: "bg-stone-100 text-stone-600 border-stone-200", dot: "bg-stone-400" },
  cancelled: { label: "Отменена", tone: "bg-rose-50 text-rose-800 border-rose-200", dot: "bg-rose-500" },
}

export const orderBuckets = [
  { id: "new", label: "Новые", statuses: ["new"] },
  { id: "active", label: "Активные", statuses: ["new", "preparing", "ready"] },
  { id: "done", label: "Завершённые", statuses: ["done"] },
  { id: "cancelled", label: "Отменённые", statuses: ["cancelled"] },
  { id: "all", label: "Все", statuses: [] as string[] },
] as const

export const bookingBuckets = [
  { id: "new", label: "Новые", statuses: ["new"] },
  { id: "active", label: "Активные", statuses: ["new", "confirmed", "seated"] },
  { id: "done", label: "Завершённые", statuses: ["done"] },
  { id: "cancelled", label: "Отменённые", statuses: ["cancelled"] },
  { id: "all", label: "Все", statuses: [] as string[] },
] as const

export function StatusBadge({
  status,
  kind = "order",
}: {
  status: string
  kind?: "order" | "booking"
}) {
  const meta = (kind === "order" ? orderStatusMeta : bookingStatusMeta)[status] ?? {
    label: status,
    tone: "bg-mist text-muted border-line",
    dot: "bg-muted",
  }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${meta.tone}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  )
}
