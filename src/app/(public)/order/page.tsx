import type { Metadata } from "next"
import { OrderForm } from "@/components/order-form"

export const metadata: Metadata = { title: "Заказ" }

export default function OrderPage() {
  return (
    <div className="page-enter mx-auto w-full max-w-6xl px-5 pt-28 pb-24">
      <p className="text-xs tracking-[0.24em] text-brass uppercase">Навынос</p>
      <h1 className="display mt-3 text-5xl sm:text-6xl">Оформить заказ</h1>
      <p className="mt-4 max-w-xl text-muted leading-7">
        Состав корзины синхронизирован с панелью справа. Можно править количество здесь или через иконку корзины.
      </p>
      <div className="mt-10">
        <OrderForm />
      </div>
    </div>
  )
}
