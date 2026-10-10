import { Client } from "pg"
import { prisma } from "@/lib/prisma"
import type { CrmChange } from "@/lib/crm-events"

type Listener = (event: CrmChange) => void

type Bus = {
  listeners: Set<Listener>
  ready: Promise<void> | null
  client: Client | null
}

const globalForBus = globalThis as typeof globalThis & { crmBus?: Bus }

const bus: Bus =
  globalForBus.crmBus ??
  ({
    listeners: new Set(),
    ready: null,
    client: null,
  } satisfies Bus)

globalForBus.crmBus = bus

function listenUrl() {
  return process.env.DIRECT_URL || process.env.DATABASE_URL
}

async function listen() {
  if (bus.client) return
  const connectionString = listenUrl()
  if (!connectionString) throw new Error("DATABASE_URL is not set")

  const client = new Client({ connectionString })
  client.on("error", () => {
    bus.client = null
    bus.ready = null
    if (bus.listeners.size > 0) setTimeout(() => void ensureListen(), 2000)
  })
  await client.connect()
  await client.query("LISTEN crm")
  client.on("notification", (message) => {
    if (!message.payload) return
    try {
      const event = JSON.parse(message.payload) as CrmChange
      if (event?.type !== "change" || !event.id) return
      for (const listener of bus.listeners) listener(event)
    } catch {
      /* ignore */
    }
  })
  bus.client = client
}

function ensureListen() {
  bus.ready ??= listen().catch(() => {
    bus.ready = null
    bus.client = null
  })
  return bus.ready
}

export function subscribeCrm(listener: Listener) {
  bus.listeners.add(listener)
  return {
    ready: ensureListen(),
    unsubscribe() {
      bus.listeners.delete(listener)
    },
  }
}

export async function publishCrm(event: CrmChange) {
  try {
    const payload = JSON.stringify(event)
    await prisma.$executeRaw`SELECT pg_notify('crm', ${payload})`
  } catch {
    /* row already saved; SSE snapshot will catch up */
  }
}
