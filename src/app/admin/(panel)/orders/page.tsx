import { updateOrderStatus } from "@/app/admin/actions"
import { CrmOrdersBoard } from "@/components/crm-orders-board"
import { prisma } from "@/lib/prisma"

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { guest: true, items: true },
    take: 200,
  })

  const rows = orders.map((order) => ({
    id: order.id,
    status: order.status,
    total: order.total,
    comment: order.comment,
    createdAt: order.createdAt.toISOString(),
    pickupAt: order.pickupAt?.toISOString() ?? null,
    guestName: order.guest.name,
    guestPhone: order.guest.phone,
    itemsLabel: order.items.map((i) => `${i.name} × ${i.qty}`).join(" · "),
  }))

  async function onStatus(id: string, status: string) {
    "use server"
    await updateOrderStatus(id, status)
  }

  return <CrmOrdersBoard orders={rows} onStatus={onStatus} />
}
