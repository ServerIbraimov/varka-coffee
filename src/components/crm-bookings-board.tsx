"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { StatusSelect } from "@/components/status-select"
import { StatusBadge, bookingBuckets } from "@/lib/crm-ui"
import { formatDateTime, formatPhone } from "@/lib/format"
import { bookingStatuses } from "@/lib/site"

export type CrmBookingRow = {
  id: string
  status: string
  partySize: number
  comment: string
  startsAt: string
  guestName: string
  guestPhone: string
}

export function CrmBookingsBoard({
  bookings,
  onStatus,
}: {
  bookings: CrmBookingRow[]
  onStatus: (id: string, status: string) => Promise<void>
}) {
  const [bucket, setBucket] = useState<string>("active")
  const [status, setStatus] = useState<string>("all")
  const [q, setQ] = useState("")

  const counts = useMemo(() => {
    const map: Record<string, number> = {}
    for (const b of bookingBuckets) {
      map[b.id] = b.statuses.length
        ? bookings.filter((o) => b.statuses.includes(o.status)).length
        : bookings.length
    }
    return map
  }, [bookings])

  const list = useMemo(() => {
    const b = bookingBuckets.find((x) => x.id === bucket)
    return bookings.filter((o) => {
      if (b && b.statuses.length && !b.statuses.includes(o.status)) return false
      if (status !== "all" && o.status !== status) return false
      const query = q.trim().toLowerCase()
      if (!query) return true
      return (
        o.guestName.toLowerCase().includes(query) ||
        o.guestPhone.includes(query) ||
        o.id.toLowerCase().includes(query)
      )
    })
  }, [bookings, bucket, status, q])

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-4xl">Брони</h1>
          <p className="mt-1 text-sm text-muted">{list.length} из {bookings.length}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {bookingBuckets.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => setBucket(b.id)}
            className={`rounded-full px-4 py-2 text-sm ${
              bucket === b.id ? "bg-pine text-white" : "border border-line bg-foam"
            }`}
          >
            {b.label} <span className="opacity-70">{counts[b.id] ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_12rem]">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Имя, телефон, ID..."
            className="field min-h-11 pl-9"
          />
        </div>
        <select className="field min-h-11" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Все статусы</option>
          {bookingStatuses.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 space-y-3">
        {list.map((booking) => (
          <article
            key={booking.id}
            className="rounded-2xl border border-line bg-foam p-4 transition hover:border-pine/30 sm:p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={booking.status} kind="booking" />
                  <Link href={`/admin/bookings/${booking.id}`} className="font-medium hover:underline">
                    {booking.guestName}
                  </Link>
                </div>
                <p className="mt-1 text-sm text-muted">{formatPhone(booking.guestPhone)}</p>
                <p className="mt-2 text-sm">
                  {booking.partySize} гост. · {formatDateTime(booking.startsAt)}
                </p>
                {booking.comment ? <p className="mt-1 text-sm text-muted">{booking.comment}</p> : null}
              </div>
              <div className="flex min-w-[11rem] flex-col items-end gap-3">
                <StatusSelect
                  value={booking.status}
                  options={bookingStatuses}
                  onChange={(next) => onStatus(booking.id, next)}
                />
                <Link href={`/admin/bookings/${booking.id}`} className="text-sm text-pine underline underline-offset-4">
                  Открыть
                </Link>
              </div>
            </div>
          </article>
        ))}
        {!list.length ? <p className="rounded-2xl border border-line bg-foam p-8 text-center text-muted">Нет броней по фильтру</p> : null}
      </div>
    </div>
  )
}
