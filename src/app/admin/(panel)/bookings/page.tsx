import { updateBookingStatus } from "@/app/admin/actions"
import { StatusSelect } from "@/components/status-select"
import { formatDateTime, formatPhone } from "@/lib/format"
import { prisma } from "@/lib/prisma"
import { bookingStatuses } from "@/lib/site"

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { startsAt: "desc" },
    include: { guest: true },
    take: 100,
  })

  return (
    <div>
      <h1 className="display text-4xl">Брони</h1>
      <p className="mt-2 text-muted">{bookings.length} записей</p>

      <div className="mt-8 space-y-4">
        {bookings.map((booking) => (
          <article key={booking.id} className="rounded-2xl border border-line bg-foam p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-medium">{booking.guest.name}</p>
                <p className="text-sm text-muted">{formatPhone(booking.guest.phone)}</p>
                <p className="mt-2 text-sm">
                  {booking.partySize} гост. · {formatDateTime(booking.startsAt)}
                </p>
                {booking.comment ? <p className="mt-1 text-sm text-muted">{booking.comment}</p> : null}
              </div>
              <div className="min-w-[10rem]">
                <StatusSelect
                  value={booking.status}
                  options={bookingStatuses}
                  onChange={async (status) => {
                    "use server"
                    await updateBookingStatus(booking.id, status)
                  }}
                />
              </div>
            </div>
          </article>
        ))}
        {!bookings.length ? <p className="text-muted">Броней пока нет.</p> : null}
      </div>
    </div>
  )
}
