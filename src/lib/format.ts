/** Prices are stored as euro cents (250 → €2.50) */
export function formatPrice(cents: number) {
  return new Intl.NumberFormat("ru-LT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100)
}

const CAFE_TZ = "Europe/Vilnius"

export function formatDateTime(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value
  return new Intl.DateTimeFormat("ru-LT", {
    timeZone: CAFE_TZ,
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function formatTime(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value
  return new Intl.DateTimeFormat("ru-LT", {
    timeZone: CAFE_TZ,
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

/** Cafe calendar day key YYYY-MM-DD in Europe/Vilnius */
export function dayKey(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: CAFE_TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  )
  return `${parts.year}-${parts.month}-${parts.day}`
}

export function formatDayHeading(key: string) {
  const [y, m, d] = key.split("-").map(Number)
  const date = new Date(Date.UTC(y, m - 1, d, 12))
  const todayKey = dayKey(new Date())
  const yesterday = new Date(Date.now() - 86400000)
  const yesterdayKey = dayKey(yesterday)

  if (key === todayKey) return "Сегодня"
  if (key === yesterdayKey) return "Вчера"

  return new Intl.DateTimeFormat("ru-LT", {
    timeZone: CAFE_TZ,
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
  // Lithuania: 370XXXXXXXX (11 digits)
  if (digits.startsWith("370") && digits.length === 11) {
    return `+370 ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`
  }
  if (digits.length === 11 && digits.startsWith("7")) {
    return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`
  }
  return phone
}

export function safeImage(src: string | null | undefined) {
  if (!src) return null
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) return src
  return null
}
