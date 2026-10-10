import Link from "next/link"
import { notFound } from "next/navigation"
import { updateBookingStatus } from "@/app/admin/actions"
import { StatusSelect } from "@/components/status-select"
import { StatusBadge } from "@/lib/crm-ui"
import { formatDateTime, formatPhone } from "@/lib/format"
import { prisma } from "@/lib/prisma"
import { bookingStatuses } from "@/lib/site"

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { guest: true },
  })
  if (!booking) notFound()

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/bookings" className="text-sm text-muted hover:underline">
        ← К броням
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="display text-4xl">{booking.guest.name}</h1>
            <StatusBadge status={booking.status} kind="booking" />
          </div>
          <p className="mt-2 text-muted">{formatPhone(booking.guest.phone)}</p>
          <p className="mt-1 text-xs text-muted">ID {booking.id}</p>
        </div>
        <p className="display text-3xl">{booking.partySize} гост.</p>
      </div>

      <div className="mt-8 grid gap-4 rounded-2xl border border-line bg-foam p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">Статус</p>
          <div className="w-full max-w-xs">
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
        <div className="grid gap-2 border-t border-line pt-4 text-sm sm:grid-cols-2">
          <p>
            <span className="text-muted">Визит:</span> {formatDateTime(booking.startsAt)}
          </p>
          <p>
            <span className="text-muted">Создана:</span> {formatDateTime(booking.createdAt)}
          </p>
        </div>
        {booking.comment ? (
          <p className="rounded-xl bg-mist px-4 py-3 text-sm">
            <span className="text-muted">Комментарий: </span>
            {booking.comment}
          </p>
        ) : null}
      </div>
    </div>
  )
}
