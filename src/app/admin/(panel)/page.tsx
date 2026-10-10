import Link from "next/link"
import { StatusBadge } from "@/lib/crm-ui"
import { formatDateTime, formatPrice } from "@/lib/format"
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
        take: 6,
        orderBy: { createdAt: "desc" },
        include: { guest: true, items: true },
      }),
      prisma.booking.findMany({
        take: 6,
        orderBy: { startsAt: "asc" },
        where: { startsAt: { gte: new Date() }, status: { not: "cancelled" } },
        include: { guest: true },
      }),
    ])

  const cards = [
    { label: "Новые заказы", value: String(ordersNew), href: "/admin/orders" },
    { label: "Активные заказы", value: String(ordersActive), href: "/admin/orders" },
    { label: "Новые брони", value: String(bookingsNew), href: "/admin/bookings" },
    { label: "Выручка", value: formatPrice(revenue._sum.total ?? 0), href: "/admin/orders" },
  ]

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
            <h2 className="display text-2xl">Заказы</h2>
            <Link href="/admin/orders" className="text-sm text-pine underline">
              Все
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {recentOrders.map((order) => (
              <li key={order.id} className="border-b border-line pb-3 text-sm">
                <Link href={`/admin/orders/${order.id}`} className="flex items-start justify-between gap-3 hover:opacity-80">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={order.status} />
                      <span className="font-medium">{order.guest.name}</span>
                    </div>
                    <p className="mt-1 text-muted">
                      {order.items.map((i) => `${i.name}×${i.qty}`).join(", ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p>{formatPrice(order.total)}</p>
                    <p className="text-xs text-muted">{formatDateTime(order.createdAt)}</p>
                  </div>
                </Link>
              </li>
            ))}
            {!recentOrders.length ? <li className="text-muted">Пока пусто</li> : null}
          </ul>
        </section>

        <section className="rounded-2xl border border-line bg-foam p-6">
          <div className="flex items-center justify-between">
            <h2 className="display text-2xl">Брони</h2>
            <Link href="/admin/bookings" className="text-sm text-pine underline">
              Все
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {upcomingBookings.map((b) => (
              <li key={b.id} className="border-b border-line pb-3 text-sm">
                <Link href={`/admin/bookings/${b.id}`} className="flex items-start justify-between gap-3 hover:opacity-80">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={b.status} kind="booking" />
                      <span className="font-medium">{b.guest.name}</span>
                    </div>
                    <p className="mt-1 text-muted">{b.partySize} гост.</p>
                  </div>
                  <p className="text-right text-muted">{formatDateTime(b.startsAt)}</p>
                </Link>
              </li>
            ))}
            {!upcomingBookings.length ? <li className="text-muted">Пока пусто</li> : null}
          </ul>
        </section>
      </div>
    </div>
  )
}
