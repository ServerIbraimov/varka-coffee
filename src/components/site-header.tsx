"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu, ShoppingBag, X } from "lucide-react"
import { site } from "@/lib/site"
import { useCart } from "@/components/cart-provider"

const links = [
  { href: "/menu", label: "Меню" },
  { href: "/order", label: "Заказ" },
  { href: "/book", label: "Бронь" },
  { href: "/about", label: "О нас" },
]

export function SiteHeader({ onHero = false }: { onHero?: boolean }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { count, openCart, bump } = useCart()
  const isHome = pathname === "/"
  const light = onHero && isHome && !scrolled && !open

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition duration-300 ${
        light ? "text-white" : "text-ink"
      } ${scrolled || open || !isHome ? "border-b border-line/70 bg-mist/85 backdrop-blur-xl" : "bg-transparent"}`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:py-5">
        <Link href="/" className="display text-2xl tracking-tight">
          {site.name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-[0.04em] transition ${
                pathname === link.href ? "opacity-100" : "opacity-65 hover:opacity-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            key={bump}
            onClick={openCart}
            className={`cart-bump relative inline-flex h-10 items-center gap-2 rounded-full border px-3 text-sm font-medium transition ${
              light ? "border-white/30 bg-white/10 text-white" : "border-line bg-foam text-ink"
            }`}
            aria-label="Открыть корзину"
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">Корзина</span>
            {count > 0 ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-pine px-1.5 text-[11px] text-white">
                {count}
              </span>
            ) : null}
          </button>

          <Link
            href="/book"
            className={`btn hidden lg:inline-flex min-h-10 px-4 text-sm ${light ? "btn-ghost" : "btn-pine"}`}
          >
            Забронировать
          </Link>

          <button
            type="button"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border md:hidden ${
              light ? "border-white/25" : "border-line"
            }`}
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-line/50 bg-mist/95 px-5 py-5 backdrop-blur md:hidden">
          <div className="flex flex-col gap-3 text-ink">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="py-1 text-lg" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              className="btn btn-ghost-dark w-full"
              onClick={() => {
                setOpen(false)
                openCart()
              }}
            >
              Корзина {count > 0 ? `(${count})` : ""}
            </button>
            <Link href="/book" className="btn btn-pine w-full" onClick={() => setOpen(false)}>
              Забронировать
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  )
}
