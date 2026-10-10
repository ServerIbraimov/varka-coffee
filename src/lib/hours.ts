import { site } from "@/lib/site"

/** Europe/Vilnius — локальное время кофейни */
const TZ = "Europe/Vilnius"

function partsInTz(date: Date) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
  const map = Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]))
  const weekday = map.weekday
  const isWeekend = weekday === "Sat" || weekday === "Sun"
  return {
    y: Number(map.year),
    m: Number(map.month),
    d: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
    isWeekend,
  }
}

function parseHm(hm: string) {
  const [h, m] = hm.split(":").map(Number)
  return h * 60 + m
}

/** Offset of TZ at a UTC instant (ms to add to local components to get UTC... inverted below) */
function tzOffsetMs(timeZone: string, instant: Date) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
  const parts = Object.fromEntries(dtf.formatToParts(instant).map((p) => [p.type, p.value]))
  const asUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second),
  )
  return asUTC - instant.getTime()
}

export function hoursForDate(date: Date) {
  const { isWeekend } = partsInTz(date)
  return isWeekend ? site.hours[1] : site.hours[0]
}

export function isWithinBookingHours(date: Date) {
  const p = partsInTz(date)
  const hours = p.isWeekend ? site.hours[1] : site.hours[0]
  const mins = p.hour * 60 + p.minute
  const open = parseHm(hours.open)
  const last = parseHm(hours.lastBooking)
  return mins >= open && mins <= last
}

export function isWithinPickupHours(date: Date) {
  const p = partsInTz(date)
  const hours = p.isWeekend ? site.hours[1] : site.hours[0]
  const mins = p.hour * 60 + p.minute
  const open = parseHm(hours.open)
  const close = parseHm(hours.close) - 15
  return mins >= open && mins <= close
}

/** Build Date from YYYY-MM-DD and HH:mm in Europe/Vilnius */
export function cafeDateTime(dateStr: string, timeStr: string) {
  const [y, mo, d] = dateStr.split("-").map(Number)
  const [hh, mm] = timeStr.split(":").map(Number)
  const utcGuess = new Date(Date.UTC(y, mo - 1, d, hh, mm, 0))
  const offset = tzOffsetMs(TZ, utcGuess)
  return new Date(utcGuess.getTime() - offset)
}

/** @deprecated use cafeDateTime */
export const moscowDateTime = cafeDateTime

export function bookingTimeSlots(dateStr: string) {
  if (!dateStr) return [] as string[]
  const probe = cafeDateTime(dateStr, "12:00")
  const hours = hoursForDate(probe)
  const open = parseHm(hours.open)
  const last = parseHm(hours.lastBooking)
  const slots: string[] = []
  for (let m = open; m <= last; m += 30) {
    const hh = String(Math.floor(m / 60)).padStart(2, "0")
    const mm = String(m % 60).padStart(2, "0")
    slots.push(`${hh}:${mm}`)
  }
  const now = Date.now()
  return slots.filter((t) => cafeDateTime(dateStr, t).getTime() > now + 20 * 60_000)
}

export function pickupTimeSlots(dateStr: string) {
  if (!dateStr) return [] as string[]
  const probe = cafeDateTime(dateStr, "12:00")
  const hours = hoursForDate(probe)
  const open = parseHm(hours.open)
  const close = parseHm(hours.close) - 15
  const slots: string[] = []
  for (let m = open; m <= close; m += 15) {
    const hh = String(Math.floor(m / 60)).padStart(2, "0")
    const mm = String(m % 60).padStart(2, "0")
    slots.push(`${hh}:${mm}`)
  }
  const now = Date.now()
  return slots.filter((t) => cafeDateTime(dateStr, t).getTime() > now + 10 * 60_000)
}

export function minBookableDateStr() {
  const p = partsInTz(new Date())
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${p.y}-${pad(p.m)}-${pad(p.d)}`
}
