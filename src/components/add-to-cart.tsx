"use client"

import { useEffect, useState } from "react"
import { Check, Plus } from "lucide-react"
import { useCart } from "@/components/cart-provider"

type Props = {
  menuItemId: string
  name: string
  price: number
  image?: string
  compact?: boolean
}

export function AddToCartButton({ menuItemId, name, price, image, compact }: Props) {
  const { add, items } = useCart()
  const [justAdded, setJustAdded] = useState(false)
  const inCart = items.find((i) => i.menuItemId === menuItemId)

  useEffect(() => {
    if (!justAdded) return
    const t = window.setTimeout(() => setJustAdded(false), 1400)
    return () => window.clearTimeout(t)
  }, [justAdded])

  return (
    <button
      type="button"
      className={`${compact ? "btn btn-pine min-h-10 px-4 text-sm" : "btn btn-pine w-full"} ${
        justAdded ? "ring-2 ring-pine/30" : ""
      }`}
      onClick={() => {
        add({ menuItemId, name, price, image })
        setJustAdded(true)
      }}
    >
      {justAdded ? (
        <>
          <Check size={16} />
          В корзине
        </>
      ) : (
        <>
          <Plus size={16} />
          {inCart ? `Ещё · ${inCart.qty}` : "В корзину"}
        </>
      )}
    </button>
  )
}
