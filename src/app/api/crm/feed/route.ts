import { auth } from "@/auth"
import { subscribeCrm } from "@/lib/crm-bus"
import type { CrmChange, CrmMessage, CrmSnapshot } from "@/lib/crm-events"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

async function snapshot(): Promise<CrmSnapshot> {
  const [orders, bookings] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        status: true,
        total: true,
        updatedAt: true,
        guest: { select: { name: true } },
      },
    }),
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        status: true,
        partySize: true,
        startsAt: true,
        updatedAt: true,
        guest: { select: { name: true } },
      },
    }),
  ])

  return {
    type: "snapshot",
    orders: orders.map((order) => ({
      id: order.id,
      status: order.status,
      total: order.total,
      updatedAt: order.updatedAt.toISOString(),
      guestName: order.guest.name,
    })),
    bookings: bookings.map((booking) => ({
      id: booking.id,
      status: booking.status,
      partySize: booking.partySize,
      startsAt: booking.startsAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
      guestName: booking.guest.name,
    })),
  }
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  const encoder = new TextEncoder()
  let unsubscribe = () => {}
  let ping: ReturnType<typeof setInterval> | undefined
  let poll: ReturnType<typeof setInterval> | undefined

  const stream = new ReadableStream({
    async start(controller) {
      const send = (message: CrmMessage) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(message)}\n\n`))
      }
      const buffer: CrmChange[] = []
      let live = false
      const subscription = subscribeCrm((event) => {
        if (!live) buffer.push(event)
        else send(event)
      })
      unsubscribe = subscription.unsubscribe

      try {
        await Promise.race([
          subscription.ready,
          new Promise((resolve) => setTimeout(resolve, 3000)),
        ])
        const current = await snapshot()
        send(current)
        const seen = new Set([
          ...current.orders.map((o) => o.id),
          ...current.bookings.map((b) => b.id),
        ])
        live = true
        for (const event of buffer) {
          if (!seen.has(event.id)) send(event)
        }

        // Fallback polling if LISTEN is unavailable
        poll = setInterval(() => {
          void snapshot()
            .then(send)
            .catch(() => undefined)
        }, 8000)

        ping = setInterval(() => {
          try {
            controller.enqueue(encoder.encode(`: ping\n\n`))
          } catch {
            if (ping) clearInterval(ping)
          }
        }, 20000)
      } catch {
        unsubscribe()
        controller.close()
      }
    },
    cancel() {
      unsubscribe()
      if (ping) clearInterval(ping)
      if (poll) clearInterval(poll)
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}
