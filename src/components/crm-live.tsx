"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { Bell, BellOff, Radio } from "lucide-react"
import { formatPrice } from "@/lib/format"
import type { CrmBooking, CrmMessage, CrmOrder } from "@/lib/crm-events"

type Toast = {
  id: string
  href: string
  kicker: string
  title: string
}

const ALERTS_KEY = "varka-crm-alerts"
const alertListeners = new Set<() => void>()

function subscribeAlerts(listener: () => void) {
  alertListeners.add(listener)
  return () => alertListeners.delete(listener)
}

function alertsSnapshot() {
  return window.localStorage.getItem(ALERTS_KEY) === "1"
}

function alertsServerSnapshot() {
  return false
}

function publishAlerts(enabled: boolean) {
  window.localStorage.setItem(ALERTS_KEY, enabled ? "1" : "0")
  alertListeners.forEach((listener) => listener())
}

function guestWord(count: number) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return "гость"
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "гостя"
  return "гостей"
}

function beep() {
  if (!("AudioContext" in window)) return
  const context = new AudioContext()
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  oscillator.frequency.value = 680
  gain.gain.value = 0.04
  oscillator.connect(gain).connect(context.destination)
  oscillator.start()
  oscillator.stop(context.currentTime + 0.16)
  oscillator.onended = () => void context.close()
}

export function useCrmFeed(pathname: string) {
  const router = useRouter()
  const known = useRef<Map<string, string> | null>(null)
  const pathRef = useRef(pathname)
  const [connected, setConnected] = useState(false)
  const alertsOn = useSyncExternalStore(subscribeAlerts, alertsSnapshot, alertsServerSnapshot)
  const [unseenOrders, setUnseenOrders] = useState(0)
  const [unseenBookings, setUnseenBookings] = useState(0)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [seenPath, setSeenPath] = useState(pathname)

  useEffect(() => {
    pathRef.current = pathname
  }, [pathname])

  if (seenPath !== pathname) {
    setSeenPath(pathname)
    if (pathname.startsWith("/admin/orders")) setUnseenOrders(0)
    if (pathname.startsWith("/admin/bookings")) setUnseenBookings(0)
  }

  useEffect(() => {
    const abort = new AbortController()

    function note(order: CrmOrder | undefined, booking: CrmBooking | undefined) {
      const next: Toast[] = []
      if (order && !known.current?.has(order.id)) {
        next.push({
          id: order.id,
          href: "/admin/orders",
          kicker: "Новый заказ",
          title: `${order.guestName} · ${formatPrice(order.total)}`,
        })
        if (!pathRef.current.startsWith("/admin/orders")) setUnseenOrders((c) => c + 1)
      }
      if (booking && !known.current?.has(booking.id)) {
        next.push({
          id: booking.id,
          href: "/admin/bookings",
          kicker: "Новая бронь",
          title: `${booking.guestName} · ${booking.partySize} ${guestWord(booking.partySize)}`,
        })
        if (!pathRef.current.startsWith("/admin/bookings")) setUnseenBookings((c) => c + 1)
      }
      if (!next.length) return
      setToasts((current) => [...next, ...current].slice(0, 4))
      if (alertsSnapshot()) {
        beep()
        if (document.hidden && "Notification" in window && Notification.permission === "granted") {
          const first = next[0]
          if (first) new Notification(first.kicker, { body: first.title })
        }
      }
    }

    function remember(id: string, stamp: string) {
      known.current ??= new Map()
      const previous = known.current.get(id)
      known.current.set(id, stamp)
      return previous
    }

    function onMessage(message: CrmMessage) {
      if (message.type === "snapshot") {
        let changed = false
        if (known.current) {
          for (const order of message.orders) {
            if (!known.current.has(order.id)) {
              note(order, undefined)
              changed = true
            } else if (known.current.get(order.id) !== `${order.status}:${order.updatedAt}`) {
              changed = true
            }
          }
          for (const booking of message.bookings) {
            if (!known.current.has(booking.id)) {
              note(undefined, booking)
              changed = true
            } else if (known.current.get(booking.id) !== `${booking.status}:${booking.updatedAt}`) {
              changed = true
            }
          }
        }
        known.current ??= new Map()
        for (const order of message.orders) {
          known.current.set(order.id, `${order.status}:${order.updatedAt}`)
        }
        for (const booking of message.bookings) {
          known.current.set(booking.id, `${booking.status}:${booking.updatedAt}`)
        }
        if (changed) router.refresh()
        return
      }

      const stamp = `${message.status}:${message.updatedAt}`
      const previous = known.current?.get(message.id)
      if (previous === undefined && message.event === "created") {
        if (message.kind === "order" && message.guestName && message.total !== undefined) {
          note(
            {
              id: message.id,
              status: message.status,
              total: message.total,
              updatedAt: message.updatedAt,
              guestName: message.guestName,
            },
            undefined,
          )
        }
        if (message.kind === "booking" && message.guestName && message.partySize !== undefined) {
          note(undefined, {
            id: message.id,
            status: message.status,
            partySize: message.partySize,
            startsAt: message.updatedAt,
            updatedAt: message.updatedAt,
            guestName: message.guestName,
          })
        }
      }
      remember(message.id, stamp)
      if (previous === undefined || previous !== stamp) router.refresh()
    }

    async function read(signal: AbortSignal) {
      const response = await fetch("/api/crm/feed", {
        headers: { Accept: "text/event-stream" },
        cache: "no-store",
        signal,
      })
      if (response.status === 401) return false
      if (!response.ok || !response.body) throw new Error("feed")
      setConnected(true)
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const parts = buffer.split("\n\n")
        buffer = parts.pop() ?? ""
        for (const part of parts) {
          const data = part.split("\n").find((line) => line.startsWith("data: "))
          if (!data) continue
          onMessage(JSON.parse(data.slice(6)) as CrmMessage)
        }
      }
      return true
    }

    let stopped = false
    async function loop() {
      let delay = 1000
      while (!stopped) {
        try {
          const retry = await read(abort.signal)
          if (!retry) return
          delay = 1000
        } catch {
          if (stopped || abort.signal.aborted) return
          setConnected(false)
          await new Promise((resolve) => window.setTimeout(resolve, delay))
          delay = Math.min(delay * 2, 10000)
        }
      }
    }
    void loop()

    return () => {
      stopped = true
      abort.abort()
    }
  }, [router])

  function dismiss(id: string) {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }

  async function enableAlerts() {
    publishAlerts(true)
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission()
    }
    beep()
  }

  function disableAlerts() {
    publishAlerts(false)
  }

  return {
    connected,
    alertsOn,
    unseenOrders,
    unseenBookings,
    toasts,
    dismiss,
    enableAlerts,
    disableAlerts,
  }
}

export function CrmToasts({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
  if (!toasts.length) return null

  return (
    <div className="fixed right-4 bottom-4 z-50 flex w-[min(100%-2rem,22rem)] flex-col gap-2" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="toast-in rounded-2xl border border-white/10 bg-ink/95 px-4 py-3 text-foam shadow-[0_24px_60px_-28px_rgba(0,0,0,0.7)] backdrop-blur"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-[11px] tracking-[0.18em] text-brass uppercase">{toast.kicker}</p>
            <button type="button" className="text-sm text-foam/60" onClick={() => dismiss(toast.id)} aria-label="Закрыть">
              ×
            </button>
          </div>
          <Link href={toast.href} className="mt-1 block text-base" onClick={() => dismiss(toast.id)}>
            {toast.title}
          </Link>
        </div>
      ))}
    </div>
  )
}

export function CrmAlertToggle({
  connected,
  alertsOn,
  enableAlerts,
  disableAlerts,
}: {
  connected: boolean
  alertsOn: boolean
  enableAlerts: () => void
  disableAlerts: () => void
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] tracking-wide ${
          connected ? "bg-pine/15 text-pine" : "bg-line text-muted"
        }`}
      >
        <Radio size={12} />
        {connected ? "live" : "offline"}
      </span>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-full border border-line bg-foam px-2.5 py-1 text-[11px] text-ink"
        onClick={() => (alertsOn ? disableAlerts() : enableAlerts())}
      >
        {alertsOn ? <Bell size={12} /> : <BellOff size={12} />}
        {alertsOn ? "звук вкл" : "звук выкл"}
      </button>
    </div>
  )
}
