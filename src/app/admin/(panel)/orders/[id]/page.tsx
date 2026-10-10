import Link from "next/link"
import { notFound } from "next/navigation"
import { updateOrderStatus } from "@/app/admin/actions"
import { StatusSelect } from "@/components/status-select"
import { StatusBadge } from "@/lib/crm-ui"
import { formatDateTime, formatPhone, formatPrice } from "@/lib/format"
import { prisma } from "@/lib/prisma"
import { orderStatuses } from "@/lib/site"

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: { guest: true, items: true },
  })
  if (!order) notFound()

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/orders" className="text-sm text-muted hover:underline">
        ← К заказам
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="display text-4xl">{order.guest.name}</h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="mt-2 text-muted">{formatPhone(order.guest.phone)}</p>
          <p className="mt-1 text-xs text-muted">ID {order.id}</p>
        </div>
        <p className="display text-4xl">{formatPrice(order.total)}</p>
      </div>

      <div className="mt-8 grid gap-4 rounded-2xl border border-line bg-foam p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">Статус</p>
          <div className="w-full max-w-xs">
            <StatusSelect
              value={order.status}
              options={orderStatuses}
              onChange={async (status) => {
                "use server"
                await updateOrderStatus(order.id, status)
              }}
            />
          </div>
        </div>
        <div className="grid gap-2 border-t border-line pt-4 text-sm sm:grid-cols-2">
          <p>
            <span className="text-muted">Создан:</span> {formatDateTime(order.createdAt)}
          </p>
          <p>
            <span className="text-muted">Самовывоз:</span>{" "}
            {order.pickupAt ? formatDateTime(order.pickupAt) : "—"}
          </p>
        </div>
        {order.comment ? (
          <p className="rounded-xl bg-mist px-4 py-3 text-sm">
            <span className="text-muted">Комментарий: </span>
            {order.comment}
          </p>
        ) : null}
      </div>

      <section className="mt-6 rounded-2xl border border-line bg-foam p-6">
        <h2 className="display text-2xl">Состав</h2>
        <ul className="mt-4 divide-y divide-line">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 py-3 text-sm">
              <span>
                {item.name} × {item.qty}
              </span>
              <span>{formatPrice(item.price * item.qty)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
