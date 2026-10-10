import Link from "next/link"
import { StatusBadge } from "@/lib/crm-ui"
import {
  formatDayHeading,
  formatPrice,
  formatTime,
  groupByDay,
} from "@/lib/format"
import { prisma } from "@/lib/prisma"

export default async function AdminDashboardPage() {
  const [ordersNew, bookingsNew, ordersActive, guests, revenue, recentOrders, upcomingBookings] =
    await Promise.all([
      prisma.order.count({ where: { status: "new" } }),
      prisma.booking.count({ where: { status: "new" } }),
      prisma.order.count({ where: { status: { in: ["new", "preparing", "ready"] } } }),
      prisma.guest.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: "cancelled" } },
      }),
      prisma.order.findMany({
        take: 24,
        orderBy: { createdAt: "desc" },
        include: { guest: true, items: true },
      }),
      prisma.booking.findMany({
        take: 24,
        orderBy: { startsAt: "asc" },
        where: { startsAt: { gte: new Date(Date.now() - 86400000) }, status: { not: "cancelled" } },
        include: { guest: true },
      }),
    ])

  const cards = [
    { label: "Новые заказы", value: String(ordersNew), href: "/admin/orders" },
    { label: "Активные заказы", value: String(ordersActive), href: "/admin/orders" },
    { label: "Новые брони", value: String(bookingsNew), href: "/admin/bookings" },
    { label: "Выручка", value: formatPrice(revenue._sum.total ?? 0), href: "/admin/orders" },
  ]

  const orderDays = groupByDay(recentOrders, (o) => o.createdAt).slice(0, 4)
  const bookingDays = groupByDay(upcomingBookings, (b) => b.startsAt).slice(0, 4)

  return (
    <div>
      <h1 className="display text-4xl">Обзор</h1>
      <p className="mt-2 text-muted">Гости: {guests}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-line bg-foam p-5 transition hover:border-pine/40"
          >
            <p className="text-xs tracking-[0.16em] text-muted uppercase">{card.label}</p>
            <p className="display mt-3 text-3xl">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-foam p-6">
          <div className="flex items-center justify-between">
            <h2 className="display text-2xl">Заказы по дням</h2>
            <Link href="/admin/orders" className="text-sm text-pine underline">
              Все
            </Link>
          </div>
          <div className="mt-5 space-y-5">
            {orderDays.map(([key, dayOrders]) => {
              const dayRevenue = dayOrders
                .filter((o) => o.status !== "cancelled")
                .reduce((s, o) => s + o.total, 0)
              return (
                <div key={key}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">{formatDayHeading(key)}</p>
                    <p className="text-xs text-muted">
                      {dayOrders.length} · {formatPrice(dayRevenue)}
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {dayOrders.slice(0, 5).map((order) => (
                      <li key={order.id}>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="flex items-start justify-between gap-3 rounded-xl border border-transparent px-2 py-2 hover:border-line hover:bg-mist/70"
                        >
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs tabular-nums text-muted">{formatTime(order.createdAt)}</span>
                              <StatusBadge status={order.status} />
                              <span className="font-medium">{order.guest.name}</span>
                            </div>
                            <p className="mt-1 truncate text-xs text-muted">
                              {order.items.map((i) => `${i.name}×${i.qty}`).join(", ")}
                            </p>
                          </div>
                          <p className="shrink-0 text-sm">{formatPrice(order.total)}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
            {!orderDays.length ? <p className="text-muted">Пока пусто</p> : null}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-foam p-6">
          <div className="flex items-center justify-between">
            <h2 className="display text-2xl">Брони по дням</h2>
            <Link href="/admin/bookings" className="text-sm text-pine underline">
              Все
            </Link>
          </div>
          <div className="mt-5 space-y-5">
            {bookingDays.map(([key, dayBookings]) => (
              <div key={key}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{formatDayHeading(key)}</p>
                  <p className="text-xs text-muted">{dayBookings.length} брон.</p>
                </div>
                <ul className="space-y-2">
                  {dayBookings.slice(0, 5).map((b) => (
                    <li key={b.id}>
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="flex items-start justify-between gap-3 rounded-xl border border-transparent px-2 py-2 hover:border-line hover:bg-mist/70"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs tabular-nums text-muted">{formatTime(b.startsAt)}</span>
                            <StatusBadge status={b.status} kind="booking" />
                            <span className="font-medium">{b.guest.name}</span>
                          </div>
                          <p className="mt-1 text-xs text-muted">{b.partySize} гост.</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {!bookingDays.length ? <p className="text-muted">Пока пусто</p> : null}
          </div>
        </section>
      </div>
    </div>
  )
}
