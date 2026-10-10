import { site } from "@/lib/site"

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-ink text-foam">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="display text-4xl">{site.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-foam/70">{site.description}</p>
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] text-foam/45 uppercase">Контакты</p>
          <p className="mt-3">{site.address}</p>
          <p className="text-foam/70">м. {site.metro}</p>
          <a href={site.phoneHref} className="mt-3 block hover:underline">
            {site.phoneDisplay}
          </a>
          <a href={`mailto:${site.email}`} className="block text-foam/70 hover:underline">
            {site.email}
          </a>
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] text-foam/45 uppercase">Часы</p>
          <ul className="mt-3 space-y-2 text-sm">
            {site.hours.map((h) => (
              <li key={h.days} className="flex justify-between gap-4">
                <span>{h.days}</span>
                <span className="text-foam/70">
                  {h.open}–{h.close}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
