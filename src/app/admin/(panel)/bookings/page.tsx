import { updateBookingStatus } from "@/app/admin/actions"
import { CrmBookingsBoard } from "@/components/crm-bookings-board"
import { prisma } from "@/lib/prisma"

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { startsAt: "desc" },
    include: { guest: true },
    take: 200,
  })

  const rows = bookings.map((booking) => ({
    id: booking.id,
    status: booking.status,
    partySize: booking.partySize,
    comment: booking.comment,
    startsAt: booking.startsAt.toISOString(),
    guestName: booking.guest.name,
    guestPhone: booking.guest.phone,
  }))

  async function onStatus(id: string, status: string) {
    "use server"
    await updateBookingStatus(id, status)
  }

  return <CrmBookingsBoard bookings={rows} onStatus={onStatus} />
}
