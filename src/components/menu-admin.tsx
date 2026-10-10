"use client"

import { useState, useTransition } from "react"
import { deleteMenuItem, toggleMenuAvailability, upsertMenuItem } from "@/app/admin/actions"
import { formatPrice } from "@/lib/format"
import { categories } from "@/lib/site"

type Item = {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  featured: boolean
  available: boolean
  sort: number
}

export function MenuAdmin({ items }: { items: Item[] }) {
  const [editing, setEditing] = useState<Item | null>(null)
  const [creating, setCreating] = useState(false)
  const [pending, start] = useTransition()
  const [message, setMessage] = useState<string | null>(null)

  function close() {
    setEditing(null)
    setCreating(false)
  }

  async function onSubmit(formData: FormData) {
    start(async () => {
      const res = await upsertMenuItem(formData)
      if (res?.ok) {
        setMessage("Сохранено")
        close()
      } else {
        setMessage(res?.message || "Ошибка")
      }
    })
  }

  const formItem = editing

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="display text-4xl">Меню</h1>
          <p className="mt-2 text-muted">{items.length} позиций</p>
        </div>
        <button type="button" className="btn btn-pine" onClick={() => { setCreating(true); setEditing(null) }}>
          Добавить
        </button>
      </div>

      {message ? <p className="mt-4 text-sm text-pine">{message}</p> : null}

      {(creating || editing) && (
        <form action={onSubmit} className="mt-6 grid gap-4 rounded-2xl border border-line bg-foam p-6 sm:grid-cols-2">
          {formItem ? <input type="hidden" name="id" value={formItem.id} /> : null}
          <label className="grid gap-1.5 text-sm sm:col-span-2">
            Название
            <input name="name" required className="field" defaultValue={formItem?.name || ""} />
          </label>
          <label className="grid gap-1.5 text-sm sm:col-span-2">
            Описание
            <textarea name="description" required className="field" defaultValue={formItem?.description || ""} />
          </label>
          <label className="grid gap-1.5 text-sm">
            Цена €
            <input
              name="price"
              type="number"
              step="0.01"
              min="0.5"
              required
              className="field"
              defaultValue={formItem ? formItem.price / 100 : 3}
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            Категория
            <select name="category" className="field" defaultValue={formItem?.category || "espresso"}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm sm:col-span-2">
            URL картинки
            <input name="image" className="field" defaultValue={formItem?.image || ""} />
          </label>
          <label className="grid gap-1.5 text-sm">
            Сортировка
            <input name="sort" type="number" className="field" defaultValue={formItem?.sort ?? 0} />
          </label>
          <div className="flex items-center gap-6 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="featured" defaultChecked={formItem?.featured} />
              В хитах
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="available" defaultChecked={formItem?.available ?? true} />
              В продаже
            </label>
          </div>
          <div className="flex gap-3 sm:col-span-2">
            <button type="submit" disabled={pending} className="btn btn-pine">
              {pending ? "Сохраняем..." : "Сохранить"}
            </button>
            <button type="button" className="btn btn-ghost-dark" onClick={close}>
              Отмена
            </button>
          </div>
        </form>
      )}

      <ul className="mt-8 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-foam p-4">
            <div>
              <p className="font-medium">
                {item.name}{" "}
                {!item.available ? <span className="text-xs text-ember">скрыто</span> : null}
                {item.featured ? <span className="ml-2 text-xs text-pine">хит</span> : null}
              </p>
              <p className="text-sm text-muted">
                {categories.find((c) => c.id === item.category)?.label} · {formatPrice(item.price)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-ghost-dark min-h-10 px-3 text-sm"
                onClick={() =>
                  start(async () => {
                    await toggleMenuAvailability(item.id, !item.available)
                  })
                }
              >
                {item.available ? "Скрыть" : "Показать"}
              </button>
              <button
                type="button"
                className="btn btn-ghost-dark min-h-10 px-3 text-sm"
                onClick={() => {
                  setEditing(item)
                  setCreating(false)
                }}
              >
                Изменить
              </button>
              <button
                type="button"
                className="btn btn-ghost-dark min-h-10 px-3 text-sm text-ember"
                onClick={() =>
                  start(async () => {
                    if (confirm("Удалить позицию?")) await deleteMenuItem(item.id)
                  })
                }
              >
                Удалить
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
