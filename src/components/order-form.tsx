"use client"

import { FormEvent, useMemo, useState } from "react"
import Link from "next/link"
import { createOrderAction } from "@/app/(public)/actions"
import { useCart } from "@/components/cart-provider"
import { PhoneInput } from "@/components/phone-input"
import { ThanksDialog } from "@/components/thanks-dialog"
import { formatPrice } from "@/lib/format"
import { cafeDateTime, minBookableDateStr, pickupTimeSlots } from "@/lib/hours"
import { site } from "@/lib/site"

export function OrderForm() {
  const { items, total, setQty, remove, clear } = useCart()
  const minDate = minBookableDateStr()
  const [date, setDate] = useState(minDate)
  const [time, setTime] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [thanksOpen, setThanksOpen] = useState(false)
  const [thanksMessage, setThanksMessage] = useState("")
  const [phoneKey, setPhoneKey] = useState(0)

  const slots = useMemo(() => pickupTimeSlots(date), [date])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!items.length) {
      setError("Добавьте позиции из меню.")
      return
    }
    if (!time) {
      setError("Выберите время самовывоза в часы работы.")
      return
    }

    setPending(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    const result = await createOrderAction({
      name: form.get("name"),
      phone: form.get("phone"),
      comment: form.get("comment") || "",
      pickupAt: cafeDateTime(date, time).toISOString(),
      items: items.map((i) => ({ menuItemId: i.menuItemId, qty: i.qty })),
    })

    setPending(false)
    if (!result.ok) {
      setError(result.message)
      return
    }

    clear()
    e.currentTarget.reset()
    setDate(minDate)
    setTime("")
    setPhoneKey((k) => k + 1)
    setThanksMessage(result.message)
    setThanksOpen(true)
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-2xl border border-line bg-mist p-6 sm:p-8">
        <h2 className="display text-3xl">Ваш заказ</h2>
        {!items.length ? (
          <p className="mt-4 text-muted">
            Корзина пуста.{" "}
            <Link href="/menu" className="text-pine underline underline-offset-4">
              Открыть меню
            </Link>
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {items.map((item) => (
              <li key={item.menuItemId} className="flex items-center justify-between gap-4 border-b border-line pb-4">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" className="h-9 w-9 rounded-lg border border-line" onClick={() => setQty(item.menuItemId, item.qty - 1)}>
                    −
                  </button>
                  <span className="w-6 text-center">{item.qty}</span>
                  <button type="button" className="h-9 w-9 rounded-lg border border-line" onClick={() => setQty(item.menuItemId, item.qty + 1)}>
                    +
                  </button>
                  <button type="button" className="ml-2 text-sm text-muted underline" onClick={() => remove(item.menuItemId)}>
                    убрать
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-6 flex items-baseline justify-between text-lg">
          <span>Итого</span>
          <span className="display text-3xl">{formatPrice(total)}</span>
        </p>
      </section>

      <form onSubmit={onSubmit} className="rounded-2xl border border-line bg-foam p-6 sm:p-8">
        <h2 className="display text-3xl">Контакты</h2>
        <p className="mt-2 text-sm text-muted">
          Самовывоз: будни {site.hours[0].open}–{site.hours[0].close}, выходные {site.hours[1].open}–
          {site.hours[1].close}
        </p>
        <div className="mt-6 grid gap-4">
          <label className="grid gap-1.5 text-sm">
            Имя
            <input name="name" required className="field" placeholder="Как к вам обращаться" />
          </label>
          <label className="grid gap-1.5 text-sm">
            Телефон
            <PhoneInput key={phoneKey} />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm">
              Дата
              <input
                type="date"
                required
                min={minDate}
                value={date}
                className="field"
                onChange={(e) => {
                  setDate(e.target.value)
                  setTime("")
                }}
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              Время
              <select required className="field" value={time} onChange={(e) => setTime(e.target.value)}>
                <option value="">Слот</option>
                {slots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="grid gap-1.5 text-sm">
            Комментарий
            <textarea name="comment" className="field" placeholder="Без сахара, на овсяном..." />
          </label>
        </div>

        {error ? <p className="mt-4 text-sm text-ember">{error}</p> : null}

        <button type="submit" disabled={pending || !items.length || !slots.length} className="btn btn-pine mt-6 w-full">
          {pending ? "Отправляем..." : "Оформить заказ"}
        </button>
      </form>

      <ThanksDialog
        open={thanksOpen}
        message={thanksMessage || "Заказ принят. Ждём вас у стойки."}
        onClose={() => setThanksOpen(false)}
      />
    </div>
  )
}
