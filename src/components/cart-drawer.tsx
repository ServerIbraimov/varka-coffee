"use client"

import Link from "next/link"
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { formatPrice, safeImage } from "@/lib/format"

export function CartDrawer() {
  const { items, total, count, open, closeCart, setQty, remove } = useCart()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
        aria-label="Закрыть корзину"
        onClick={closeCart}
      />

      <aside className="cart-drawer absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-foam shadow-[-24px_0_80px_-40px_rgba(14,16,14,0.55)]">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <p className="text-xs tracking-[0.2em] text-brass uppercase">Корзина</p>
            <h2 className="display mt-1 text-2xl">{count ? `${count} поз.` : "Пусто"}</h2>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line"
            onClick={closeCart}
            aria-label="Закрыть"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {!items.length ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-mist text-pine">
                <ShoppingBag size={22} />
              </div>
              <p className="display mt-5 text-3xl">Пока пусто</p>
              <p className="mt-2 max-w-xs text-sm text-muted">Добавьте позиции из меню</p>
              <Link href="/menu" className="btn btn-pine mt-6" onClick={closeCart}>
                Открыть меню
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const image = safeImage(item.image)
                return (
                  <li key={item.menuItemId} className="flex gap-3 rounded-2xl border border-line bg-mist/60 p-3">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-line">
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={image} alt="" className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium leading-snug">{item.name}</p>
                        <button
                          type="button"
                          className="text-muted hover:text-ember"
                          onClick={() => remove(item.menuItemId)}
                          aria-label="Убрать"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <p className="mt-1 text-sm text-muted">{formatPrice(item.price)}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-full border border-line bg-foam">
                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center"
                            onClick={() => setQty(item.menuItemId, item.qty - 1)}
                            aria-label="Минус"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-7 text-center text-sm font-medium">{item.qty}</span>
                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center"
                            onClick={() => setQty(item.menuItemId, Math.min(20, item.qty + 1))}
                            aria-label="Плюс"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="font-medium">{formatPrice(item.price * item.qty)}</p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {items.length ? (
          <div className="border-t border-line bg-foam px-5 py-5">
            <div className="flex items-baseline justify-between">
              <span className="text-muted">Итого</span>
              <span className="display text-3xl">{formatPrice(total)}</span>
            </div>
            <Link href="/order" className="btn btn-pine mt-4 w-full" onClick={closeCart}>
              Оформить заказ
            </Link>
          </div>
        ) : null}
      </aside>
    </div>
  )
}
