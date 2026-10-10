import type { Metadata } from "next"
import { MenuCatalog } from "@/components/menu-catalog"
import { listMenu } from "@/lib/menu"
import { categories } from "@/lib/site"

export const metadata: Metadata = { title: "Меню" }
export const dynamic = "force-dynamic"

export default async function MenuPage() {
  const menu = await listMenu({ availableOnly: true })

  return (
    <div className="page-enter mx-auto w-full max-w-6xl px-5 pt-28 pb-24">
      <div className="max-w-2xl">
        <p className="text-xs tracking-[0.24em] text-brass uppercase">Каталог</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl">Меню бара</h1>
        <p className="mt-4 text-muted leading-7">
          {categories.length} каталога · цены в рублях. Нажмите «В корзину» — позиция сразу откроется в панели справа.
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => {
          const count = menu.filter((m) => m.category === cat.id).length
          return (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="rounded-2xl border border-line bg-foam/80 px-4 py-4 transition hover:-translate-y-0.5 hover:border-pine/30 hover:bg-foam"
            >
              <p className="text-xs tracking-[0.16em] text-brass uppercase">{count} поз.</p>
              <p className="display mt-2 text-2xl">{cat.label}</p>
              <p className="mt-1 text-sm text-muted">{cat.blurb}</p>
            </a>
          )
        })}
      </div>

      <div className="mt-8">
        <MenuCatalog
          items={menu.map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            image: item.image,
            featured: item.featured,
          }))}
        />
      </div>
    </div>
  )
}
