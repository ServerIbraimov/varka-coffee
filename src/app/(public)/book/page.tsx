import type { Metadata } from "next"
import { BookingForm } from "@/components/booking-form"
import { site } from "@/lib/site"

export const metadata: Metadata = { title: "Бронь" }

export default function BookPage() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 pt-28 pb-20 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <p className="text-xs tracking-[0.22em] text-pine uppercase">Столы</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl">Забронировать</h1>
        <p className="mt-4 max-w-md leading-7 text-muted">
          {site.address}. Бронь держим 15 минут. Для компаний от 7 человек лучше позвонить:{" "}
          <a href={site.phoneHref} className="text-pine underline underline-offset-4">
            {site.phoneDisplay}
          </a>
        </p>
        <ul className="mt-8 space-y-3 text-sm text-muted">
          {site.hours.map((h) => (
            <li key={h.days} className="flex justify-between gap-6 border-b border-line pb-3">
              <span>{h.days}</span>
              <span>
                {h.open}–{h.close}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <BookingForm />
    </div>
  )
}
