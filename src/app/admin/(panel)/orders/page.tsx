import { updateOrderStatus } from "@/app/admin/actions"
import { StatusSelect } from "@/components/status-select"
import { formatDateTime, formatPhone, formatPrice } from "@/lib/format"
import { prisma } from "@/lib/prisma"
import { orderStatuses } from "@/lib/site"

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { guest: true, items: true },
    take: 100,
  })

  return (
    <div>
      <h1 className="display text-4xl">Заказы</h1>
      <p className="mt-2 text-muted">{orders.length} записей</p>

      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <article key={order.id} className="rounded-2xl border border-line bg-foam p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-medium">{order.guest.name}</p>
                <p className="text-sm text-muted">{formatPhone(order.guest.phone)}</p>
                <p className="mt-2 text-sm">
                  {order.items.map((i) => `${i.name} × ${i.qty}`).join(" · ")}
                </p>
                {order.comment ? <p className="mt-1 text-sm text-muted">{order.comment}</p> : null}
                <p className="mt-2 text-xs text-muted">{formatDateTime(order.createdAt)}</p>
              </div>
              <div className="flex min-w-[10rem] flex-col items-end gap-3">
                <p className="display text-2xl">{formatPrice(order.total)}</p>
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
          </article>
        ))}
        {!orders.length ? <p className="text-muted">Заказов пока нет.</p> : null}
      </div>
    </div>
  )
}
