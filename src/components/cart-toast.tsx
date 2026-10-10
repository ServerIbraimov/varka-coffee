"use client"

import Link from "next/link"
import { Check, ShoppingBag, X } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { safeImage } from "@/lib/format"

export function CartToast() {
  const { lastAdded, clearLastAdded, openCart, count } = useCart()
  if (!lastAdded) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[70] flex justify-center px-4">
      <div className="toast-in pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl border border-pine/20 bg-ink px-4 py-3 text-foam shadow-[0_24px_60px_-28px_rgba(0,0,0,0.55)]">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-pine/30">
          {safeImage(lastAdded.image) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={safeImage(lastAdded.image)!} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-brass">
              <ShoppingBag size={18} />
            </div>
          )}
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-pine text-[10px]">
            <Check size={12} />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs tracking-[0.14em] text-brass uppercase">Добавлено</p>
          <p className="truncate font-medium">{lastAdded.name}</p>
          <p className="text-xs text-foam/55">В корзине: {count}</p>
        </div>
        <button type="button" className="btn btn-ghost min-h-9 px-3 text-sm" onClick={openCart}>
          Корзина
        </button>
        <Link href="/order" className="btn btn-pine min-h-9 px-3 text-sm" onClick={clearLastAdded}>
          Заказ
        </Link>
        <button type="button" className="text-foam/50" onClick={clearLastAdded} aria-label="Закрыть">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
