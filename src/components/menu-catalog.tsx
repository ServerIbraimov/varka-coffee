"use client"

import { useMemo, useState } from "react"
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

  const visible = useMemo(() => {
    if (active === "all") return items
    return items.filter((i) => i.category === active)
  }, [items, active])

  const groups = useMemo(() => {
    return categories
      .map((cat) => ({
        ...cat,
        items: visible.filter((i) => i.category === cat.id),
      }))
      .filter((g) => g.items.length > 0)
  }, [visible])

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
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setActive("all")}
            className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
              active === "all" ? "bg-pine text-white" : "border border-line bg-foam text-ink hover:border-pine/40"
            }`}
          >
            Все <span className="opacity-70">{counts.all}</span>
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
                {cat.label} <span className="opacity-70">{counts[cat.id]}</span>
              </button>
            ) : null,
          )}
        </div>
      </div>

      <div className="mt-10 space-y-16">
        {groups.map((group) => (
          <section key={group.id} id={group.id} className="scroll-mt-36">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="display text-4xl sm:text-5xl">{group.label}</h2>
                {group.blurb ? <p className="mt-2 max-w-md text-sm text-muted">{group.blurb}</p> : null}
              </div>
              <p className="text-xs tracking-[0.18em] text-brass uppercase">{group.items.length} поз.</p>
            </div>

            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => {
                const image = safeImage(item.image)
                return (
                  <li
                    key={item.id}
                    className="group flex flex-col overflow-hidden rounded-[1.4rem] border border-line/80 bg-foam shadow-[0_20px_50px_-40px_rgba(14,16,14,0.45)] transition hover:-translate-y-0.5 hover:border-pine/25 hover:shadow-[0_28px_60px_-36px_rgba(14,16,14,0.5)]"
                  >
                    <div className="media-frame relative aspect-[5/4] bg-line">
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image}
                          alt=""
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                        />
                      ) : null}
                      {item.featured ? (
                        <span className="absolute top-3 left-3 z-10 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] tracking-wide text-foam backdrop-blur">
                          хит
                        </span>
                      ) : null}
                      <span className="absolute right-3 bottom-3 z-10 rounded-full bg-foam/95 px-3 py-1 text-sm font-medium text-ink backdrop-blur">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="display text-2xl leading-none">{item.name}</h3>
                      <p className="mt-3 flex-1 text-sm leading-6 text-muted">{item.description}</p>
                      <div className="mt-5">
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
          <p className="rounded-2xl border border-line bg-foam p-8 text-center text-muted">
            В этой категории пока пусто.
          </p>
        ) : null}
      </div>
    </div>
  )
}
