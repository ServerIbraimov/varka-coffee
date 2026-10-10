"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

export type CartLine = {
  menuItemId: string
  name: string
  price: number
  qty: number
  image?: string
}

type LastAdded = {
  name: string
  image?: string
  at: number
}

type CartContextValue = {
  items: CartLine[]
  count: number
  total: number
  open: boolean
  lastAdded: LastAdded | null
  bump: number
  add: (item: Omit<CartLine, "qty">, qty?: number) => void
  setQty: (menuItemId: string, qty: number) => void
  remove: (menuItemId: string) => void
  clear: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  clearLastAdded: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = "varka-cart-v1"

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([])
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(false)
  const [lastAdded, setLastAdded] = useState<LastAdded | null>(null)
  const [bump, setBump] = useState(0)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw) as CartLine[])
    } catch {
      /* ignore */
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, ready])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!lastAdded) return
    const t = window.setTimeout(() => setLastAdded(null), 3200)
    return () => window.clearTimeout(t)
  }, [lastAdded])

  const add = useCallback((item: Omit<CartLine, "qty">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.menuItemId === item.menuItemId)
      if (existing) {
        return prev.map((p) =>
          p.menuItemId === item.menuItemId ? { ...p, qty: Math.min(20, p.qty + qty) } : p,
        )
      }
      return [...prev, { ...item, qty }]
    })
    setLastAdded({ name: item.name, image: item.image, at: Date.now() })
    setBump((n) => n + 1)
    setOpen(true)
  }, [])

  const setQty = useCallback((menuItemId: string, qty: number) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((p) => p.menuItemId !== menuItemId)
      return prev.map((p) => (p.menuItemId === menuItemId ? { ...p, qty } : p))
    })
  }, [])

  const remove = useCallback((menuItemId: string) => {
    setItems((prev) => prev.filter((p) => p.menuItemId !== menuItemId))
  }, [])

  const clear = useCallback(() => setItems([]), [])
  const openCart = useCallback(() => setOpen(true), [])
  const closeCart = useCallback(() => setOpen(false), [])
  const toggleCart = useCallback(() => setOpen((v) => !v), [])
  const clearLastAdded = useCallback(() => setLastAdded(null), [])

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0)
    const total = items.reduce((s, i) => s + i.price * i.qty, 0)
    return {
      items,
      count,
      total,
      open,
      lastAdded,
      bump,
      add,
      setQty,
      remove,
      clear,
      openCart,
      closeCart,
      toggleCart,
      clearLastAdded,
    }
  }, [items, open, lastAdded, bump, add, setQty, remove, clear, openCart, closeCart, toggleCart, clearLastAdded])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
