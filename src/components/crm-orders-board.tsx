"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { CrmDaySection } from "@/components/crm-day-section"
import { StatusSelect } from "@/components/status-select"
import { StatusBadge, orderBuckets } from "@/lib/crm-ui"
import {
  formatDayHeading,
  formatPhone,
  formatPrice,
  formatTime,
  groupByDay,
} from "@/lib/format"
import { orderStatuses } from "@/lib/site"

export type CrmOrderRow = {
  id: string
  status: string
  total: number
  comment: string
  createdAt: string
  pickupAt: string | null
  guestName: string
  guestPhone: string
  itemsLabel: string
}

export function CrmOrdersBoard({
  orders,
  onStatus,
}: {
  orders: CrmOrderRow[]
  onStatus: (id: string, status: string) => Promise<void>
}) {
  const [bucket, setBucket] = useState<string>("active")
  const [status, setStatus] = useState<string>("all")
  const [q, setQ] = useState("")
  const [dayFilter, setDayFilter] = useState<string>("all")

  const counts = useMemo(() => {
    const map: Record<string, number> = {}
    for (const b of orderBuckets) {
      map[b.id] = b.statuses.length
        ? orders.filter((o) => b.statuses.includes(o.status)).length
        : orders.length
    }
    return map
  }, [orders])

  const list = useMemo(() => {
    const b = orderBuckets.find((x) => x.id === bucket)
    return orders.filter((o) => {
      if (b && b.statuses.length && !b.statuses.includes(o.status)) return false
      if (status !== "all" && o.status !== status) return false
      const query = q.trim().toLowerCase()
      if (!query) return true
      return (
        o.guestName.toLowerCase().includes(query) ||
        o.guestPhone.includes(query) ||
        o.itemsLabel.toLowerCase().includes(query) ||
        o.id.toLowerCase().includes(query)
      )
    })
  }, [orders, bucket, status, q])

  const days = useMemo(() => groupByDay(list, (o) => o.createdAt), [list])

  const dayOptions = useMemo(
    () => days.map(([key, items]) => ({ key, label: formatDayHeading(key), count: items.length })),
    [days],
  )

  const visibleDays = useMemo(
    () => (dayFilter === "all" ? days : days.filter(([key]) => key === dayFilter)),
    [days, dayFilter],
  )

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-4xl">Заказы</h1>
          <p className="mt-1 text-sm text-muted">
            {list.length} из {orders.length} · по дням смены
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {orderBuckets.map((b) => (
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

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={() => setDayFilter("all")}
          className={`shrink-0 rounded-xl px-3 py-2 text-sm ${
            dayFilter === "all" ? "bg-ink text-foam" : "border border-line bg-foam"
          }`}
        >
          Все дни
        </button>
        {dayOptions.map((d) => (
          <button
            key={d.key}
            type="button"
            onClick={() => setDayFilter(d.key)}
            className={`shrink-0 rounded-xl px-3 py-2 text-sm ${
              dayFilter === d.key ? "bg-ink text-foam" : "border border-line bg-foam"
            }`}
          >
            {d.label} · {d.count}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_12rem]">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Имя, телефон, позиция, ID..."
            className="field min-h-11 pl-9"
          />
        </div>
        <select className="field min-h-11" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Все статусы</option>
          {orderStatuses.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8 space-y-8">
        {visibleDays.map(([key, dayOrders]) => {
          const revenue = dayOrders
            .filter((o) => o.status !== "cancelled")
            .reduce((s, o) => s + o.total, 0)
          const active = dayOrders.filter((o) =>
            ["new", "preparing", "ready"].includes(o.status),
          ).length
          return (
            <CrmDaySection
              key={key}
              title={formatDayHeading(key)}
              meta={`${dayOrders.length} заказ. · ${active} активн. · ${formatPrice(revenue)}`}
            >
              {dayOrders.map((order) => (
                <article
                  key={order.id}
                  className="rounded-2xl border border-line bg-foam p-4 transition hover:border-pine/30 sm:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-mist px-2 py-0.5 text-xs font-medium text-muted tabular-nums">
                          {formatTime(order.createdAt)}
                        </span>
                        <StatusBadge status={order.status} />
                        <Link href={`/admin/orders/${order.id}`} className="font-medium hover:underline">
                          {order.guestName}
                        </Link>
                      </div>
                      <p className="mt-1 text-sm text-muted">{formatPhone(order.guestPhone)}</p>
                      <p className="mt-2 text-sm">{order.itemsLabel}</p>
                      {order.comment ? <p className="mt-1 text-sm text-muted">{order.comment}</p> : null}
                      {order.pickupAt ? (
                        <p className="mt-2 text-xs text-muted">Самовывоз {formatTime(order.pickupAt)}</p>
                      ) : null}
                    </div>
                    <div className="flex min-w-[11rem] flex-col items-end gap-3">
                      <p className="display text-2xl">{formatPrice(order.total)}</p>
                      <StatusSelect
                        value={order.status}
                        options={orderStatuses}
                        onChange={(next) => onStatus(order.id, next)}
                      />
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-sm text-pine underline underline-offset-4"
                      >
                        Открыть
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </CrmDaySection>
          )
        })}
        {!visibleDays.length ? (
          <p className="rounded-2xl border border-line bg-foam p-8 text-center text-muted">
            Нет заказов по фильтру
          </p>
        ) : null}
      </div>
    </div>
  )
}
