import Link from "next/link"
import { listMenu } from "@/lib/menu"
import { formatPrice, safeImage } from "@/lib/format"
import { AddToCartButton } from "@/components/add-to-cart"
import { barImage, heroImage, origins, site } from "@/lib/site"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const menu = await listMenu({ availableOnly: true })
  const featured = menu.filter((item) => item.featured).slice(0, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: site.name,
    description: site.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address,
      addressLocality: site.city,
      addressCountry: site.countryCode,
    },
    telephone: site.phoneHref.replace("tel:", ""),
  }

  return (
    <div className="page-enter">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative min-h-[100svh] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImage}
          alt=""
          className="hero-kenburns absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_rgba(14,16,14,0.35))]" />

        <div className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-end px-5 pb-16 pt-28 sm:pb-24">
          <p className="fade-up text-xs tracking-[0.32em] text-brass uppercase">
            {site.city} · {site.district}
          </p>
          <h1 className="fade-up display mt-5 max-w-4xl text-[clamp(3.8rem,12vw,7.5rem)] leading-[0.9] text-white">
            {site.name}
          </h1>
          <p className="fade-up-delay mt-6 max-w-lg text-lg leading-8 text-white/78">
            Короткий эспрессо, дневной фильтр и стол у окна — без экранов и без спешки.
          </p>
          <div className="fade-up-delay mt-9 flex flex-wrap gap-3">
            <Link href="/menu" className="btn btn-pine">
              Смотреть меню
            </Link>
            <Link href="/book" className="btn btn-ghost">
              Забронировать стол
            </Link>
          </div>
        </div>
      </section>

      <div className="marquee w-full overflow-hidden border-y border-line/80 bg-mist/70">
        <div className="marquee-track flex w-max gap-10 py-4">
          {[...origins, ...origins].map((origin, index) => (
            <span key={`${origin}-${index}`} className="text-sm tracking-[0.28em] text-muted uppercase">
              {origin}
            </span>
          ))}
        </div>
      </div>

      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:py-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs tracking-[0.24em] text-brass uppercase">Сейчас на баре</p>
            <h2 className="display mt-3 max-w-xl text-5xl leading-[0.95] sm:text-6xl">
              Три чашки, с которых начинают
            </h2>
          </div>
          <Link href="/menu" className="hidden text-sm text-pine underline underline-offset-4 sm:inline">
            Всё меню
          </Link>
        </div>

        <ul className="mt-14 grid gap-7 md:grid-cols-3">
          {featured.map((item) => {
            const image = safeImage(item.image)
            return (
              <li
                key={item.id}
                className="group overflow-hidden rounded-[1.5rem] border border-line/80 bg-foam shadow-[0_24px_60px_-42px_rgba(14,16,14,0.5)]"
              >
                <div className="media-frame relative aspect-[4/5] bg-line">
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image}
                      alt=""
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  ) : null}
                  <span className="absolute right-3 bottom-3 z-10 rounded-full bg-foam/95 px-3 py-1 text-sm font-medium backdrop-blur">
                    {formatPrice(item.price)}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="display text-3xl leading-none">{item.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{item.description}</p>
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

      <section className="bg-pine text-foam">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-20 md:grid-cols-3">
          {[
            ["Короткая обжарка", "Лот стоит на баре, пока он свежий. Когда вкус садится — меняем зерно."],
            ["Эспрессо и фильтр", "Одно зерно, два способа. Можно сравнить без инструкции на стене."],
            ["Стол без таймера", "Дневной свет, розетка и чашка, которую не забирают через десять минут."],
          ].map(([title, text]) => (
            <article key={title}>
              <h2 className="display text-4xl leading-none">{title}</h2>
              <p className="mt-5 leading-7 text-foam/75">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-20 sm:py-24 lg:grid-cols-2">
        <div className="media-frame relative aspect-[5/4] bg-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={barImage} alt="Барная стойка кофейни" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div>
          <p className="text-xs tracking-[0.24em] text-brass uppercase">Визит</p>
          <h2 className="display mt-3 text-5xl leading-none sm:text-6xl">Старый город, пока светло</h2>
          <p className="mt-6 max-w-md leading-7 text-muted">
            {site.address}, {site.district}. Будни с {site.hours[0].open}, выходные с {site.hours[1].open}.
            Последняя бронь — в {site.hours[0].lastBooking}.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/book" className="btn btn-pine">
              Выбрать время
            </Link>
            <Link href="/order" className="btn btn-ghost-dark">
              Заказать навынос
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
