import { formatDateTime, formatPhone } from "@/lib/format"
import { prisma } from "@/lib/prisma"

export default async function AdminGuestsPage() {
  const guests = await prisma.guest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { orders: true, bookings: true } },
    },
    take: 200,
  })

  return (
    <div>
      <h1 className="display text-4xl">Гости</h1>
      <p className="mt-2 text-muted">CRM-карточки из заказов и броней</p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-foam">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line text-xs tracking-[0.14em] text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Имя</th>
              <th className="px-4 py-3 font-medium">Телефон</th>
              <th className="px-4 py-3 font-medium">Заказы</th>
              <th className="px-4 py-3 font-medium">Брони</th>
              <th className="px-4 py-3 font-medium">С</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest) => (
              <tr key={guest.id} className="border-b border-line/70">
                <td className="px-4 py-3">
                  <p className="font-medium">{guest.name}</p>
                  {guest.email ? <p className="text-xs text-muted">{guest.email}</p> : null}
                </td>
                <td className="px-4 py-3">{formatPhone(guest.phone)}</td>
                <td className="px-4 py-3">{guest._count.orders}</td>
                <td className="px-4 py-3">{guest._count.bookings}</td>
                <td className="px-4 py-3 text-muted">{formatDateTime(guest.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!guests.length ? <p className="p-6 text-muted">Гостей пока нет.</p> : null}
      </div>
    </div>
  )
}
