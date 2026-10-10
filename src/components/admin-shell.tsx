"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  Users,
  UtensilsCrossed,
} from "lucide-react"
import { signOut } from "next-auth/react"
import { CrmAlertToggle, CrmToasts, useCrmFeed } from "@/components/crm-live"

const links = [
  { href: "/admin", label: "Обзор", icon: LayoutDashboard, badge: null as null | "orders" | "bookings" },
  { href: "/admin/orders", label: "Заказы", icon: ShoppingBag, badge: "orders" as const },
  { href: "/admin/bookings", label: "Брони", icon: CalendarDays, badge: "bookings" as const },
  { href: "/admin/menu", label: "Меню", icon: UtensilsCrossed, badge: null },
  { href: "/admin/guests", label: "Гости", icon: Users, badge: null },
]

export function AdminShell({
  children,
  userName,
}: {
  children: React.ReactNode
  userName: string
}) {
  const pathname = usePathname()
  const feed = useCrmFeed(pathname)

  return (
    <div className="min-h-screen bg-stone lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-line bg-mist/90 backdrop-blur lg:border-r lg:border-b-0">
        <div className="px-5 py-6">
          <Link href="/admin" className="display text-2xl tracking-tight">
            ВАРКА <span className="text-brass">CRM</span>
          </Link>
          <p className="mt-1 text-xs text-muted">{userName}</p>
          <div className="mt-4">
            <CrmAlertToggle
              connected={feed.connected}
              alertsOn={feed.alertsOn}
              enableAlerts={feed.enableAlerts}
              disableAlerts={feed.disableAlerts}
            />
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col">
          {links.map((link) => {
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname === link.href || pathname.startsWith(`${link.href}/`)
            const Icon = link.icon
            const count =
              link.badge === "orders"
                ? feed.unseenOrders
                : link.badge === "bookings"
                  ? feed.unseenBookings
                  : 0
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm transition ${
                  active ? "bg-pine text-white shadow-sm" : "text-ink hover:bg-foam"
                }`}
              >
                <Icon size={16} />
                <span className="flex-1">{link.label}</span>
                {count > 0 ? (
                  <span
                    className={`inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-[11px] font-semibold ${
                      active ? "bg-white/20 text-white" : "bg-ember text-white"
                    }`}
                  >
                    {count}
                  </span>
                ) : null}
              </Link>
            )
          })}
        </nav>
        <div className="hidden px-3 pb-6 lg:block">
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-foam"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
          >
            <LogOut size={16} />
            Выйти
          </button>
          <Link href="/" className="mt-2 block px-3 text-xs text-muted hover:underline">
            ← На сайт
          </Link>
        </div>
      </aside>
      <div className="px-5 py-8 lg:px-10">{children}</div>
      <CrmToasts toasts={feed.toasts} dismiss={feed.dismiss} />
    </div>
  )
}
