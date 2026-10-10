"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { AddToCartButton } from "@/components/add-to-cart"
import { formatPrice, safeImage } from "@/lib/format"
import { categories } from "@/lib/site"

export type MenuCatalogItem = {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  featured: boolean
}

export function MenuCatalog({ items }: { items: MenuCatalogItem[] }) {
  const [active, setActive] = useState<string>("all")
  const [q, setQ] = useState("")

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return items.filter((i) => {
      if (active !== "all" && i.category !== active) return false
      if (!query) return true
      return (
        i.name.toLowerCase().includes(query) ||
        i.description.toLowerCase().includes(query)
      )
    })
  }, [items, active, q])

  const groups = useMemo(() => {
    return categories
      .map((cat) => ({
        ...cat,
        items: filtered.filter((i) => i.category === cat.id),
      }))
      .filter((g) => g.items.length > 0)
  }, [filtered])

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: items.length }
    for (const cat of categories) {
      map[cat.id] = items.filter((i) => i.category === cat.id).length
    }
    return map
  }, [items])

  return (
    <div>
      <div className="sticky top-[4.5rem] z-30 -mx-5 border-y border-line/70 bg-mist/90 px-5 py-3 backdrop-blur-xl sm:top-[4.75rem]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Поиск по меню..."
              className="field min-h-11 pl-9"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => setActive("all")}
              className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
                active === "all" ? "bg-pine text-white" : "border border-line bg-foam text-ink hover:border-pine/40"
              }`}
            >
              Все {counts.all}
            </button>
            {categories.map((cat) =>
              counts[cat.id] ? (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActive(cat.id)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
                    active === cat.id
                      ? "bg-pine text-white"
                      : "border border-line bg-foam text-ink hover:border-pine/40"
                  }`}
                >
                  {cat.label} {counts[cat.id]}
                </button>
              ) : null,
            )}
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-14">
        {groups.map((group) => (
          <section key={group.id} id={group.id} className="scroll-mt-44">
            <div className="mb-6">
              <h2 className="display text-4xl sm:text-5xl">{group.label}</h2>
              {group.blurb ? <p className="mt-2 text-sm text-muted">{group.blurb}</p> : null}
            </div>

            <ul className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => {
                const image = safeImage(item.image)
                return (
                  <li
                    key={item.id}
                    className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-line/80 bg-foam"
                  >
                    <div className="media-frame relative aspect-[4/3] shrink-0 bg-line">
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image}
                          alt=""
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                        />
                      ) : null}
                      {item.featured ? (
                        <span className="absolute top-3 left-3 z-10 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] text-foam">
                          хит
                        </span>
                      ) : null}
                      <span className="absolute right-3 bottom-3 z-10 rounded-full bg-foam/95 px-3 py-1 text-sm font-medium">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="display min-h-[2.4rem] text-2xl leading-tight">{item.name}</h3>
                      <p className="mt-2 line-clamp-3 min-h-[4.5rem] flex-1 text-sm leading-6 text-muted">
                        {item.description}
                      </p>
                      <div className="mt-4">
                        <AddToCartButton
                          menuItemId={item.id}
                          name={item.name}
                          price={item.price}
                          image={item.image}
                        />
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}

        {!groups.length ? (
          <p className="rounded-2xl border border-line bg-foam p-8 text-center text-muted">Ничего не найдено.</p>
        ) : null}
      </div>
    </div>
  )
}
