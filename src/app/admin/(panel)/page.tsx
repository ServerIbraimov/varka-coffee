import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { formatDateTime, formatPrice } from "@/lib/format"

export default async function AdminDashboardPage() {
  const [ordersNew, bookingsNew, guests, revenue, recentOrders, upcomingBookings] =
    await Promise.all([
      prisma.order.count({ where: { status: "new" } }),
      prisma.booking.count({ where: { status: "new" } }),
      prisma.guest.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: "cancelled" } },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { guest: true, items: true },
      }),
      prisma.booking.findMany({
        take: 5,
        orderBy: { startsAt: "asc" },
        where: { startsAt: { gte: new Date() }, status: { not: "cancelled" } },
        include: { guest: true },
      }),
    ])

  const cards = [
    { label: "Новые заказы", value: String(ordersNew), href: "/admin/orders" },
    { label: "Новые брони", value: String(bookingsNew), href: "/admin/bookings" },
    { label: "Гости", value: String(guests), href: "/admin/guests" },
    {
      label: "Выручка (без отменённых)",
      value: formatPrice(revenue._sum.total ?? 0),
      href: "/admin/orders",
    },
  ]

  return (
    <div>
      <h1 className="display text-4xl">Обзор</h1>
      <p className="mt-2 text-muted">Живая лента заказов и броней для демо-CRM.</p>

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
            <h2 className="display text-2xl">Последние заказы</h2>
            <Link href="/admin/orders" className="text-sm text-pine underline">
              Все
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {recentOrders.map((order) => (
              <li key={order.id} className="flex items-start justify-between gap-3 border-b border-line pb-3 text-sm">
                <div>
                  <p className="font-medium">{order.guest.name}</p>
                  <p className="text-muted">
                    {order.items.map((i) => `${i.name}×${i.qty}`).join(", ")}
                  </p>
                </div>
                <div className="text-right">
                  <p>{formatPrice(order.total)}</p>
                  <p className="text-xs text-muted">{formatDateTime(order.createdAt)}</p>
                </div>
              </li>
            ))}
            {!recentOrders.length ? <li className="text-muted">Пока пусто</li> : null}
          </ul>
        </section>

        <section className="rounded-2xl border border-line bg-foam p-6">
          <div className="flex items-center justify-between">
            <h2 className="display text-2xl">Ближайшие брони</h2>
            <Link href="/admin/bookings" className="text-sm text-pine underline">
              Все
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {upcomingBookings.map((b) => (
              <li key={b.id} className="flex items-start justify-between gap-3 border-b border-line pb-3 text-sm">
                <div>
                  <p className="font-medium">{b.guest.name}</p>
                  <p className="text-muted">{b.partySize} гост.</p>
                </div>
                <p className="text-right text-muted">{formatDateTime(b.startsAt)}</p>
              </li>
            ))}
            {!upcomingBookings.length ? <li className="text-muted">Пока пусто</li> : null}
          </ul>
        </section>
      </div>
    </div>
  )
}
