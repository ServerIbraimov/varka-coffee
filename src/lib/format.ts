export function formatPrice(rubles: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(rubles)
}

export function formatDateTime(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function formatTime(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

/** Local calendar day key YYYY-MM-DD */
export function dayKey(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function formatDayHeading(key: string) {
  const [y, m, d] = key.split("-").map(Number)
  const date = new Date(y, m - 1, d)
  const today = new Date()
  const todayKey = dayKey(today)
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const yesterdayKey = dayKey(yesterday)

  if (key === todayKey) return "Сегодня"
  if (key === yesterdayKey) return "Вчера"

  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "long",
  }).format(date)
}

export function groupByDay<T>(items: T[], getDate: (item: T) => string | Date) {
  const map = new Map<string, T[]>()
  for (const item of items) {
    const key = dayKey(getDate(item))
    const list = map.get(key)
    if (list) list.push(item)
    else map.set(key, [item])
  }
  return [...map.entries()].sort(([a], [b]) => (a < b ? 1 : -1))
}

export function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "")
  if (digits.length === 11) {
    return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`
  }
  return phone
}

export function safeImage(src: string | null | undefined) {
  if (!src) return null
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) return src
  return null
}
