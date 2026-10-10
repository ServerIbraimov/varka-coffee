import type { Metadata } from "next"
import Link from "next/link"
import { pourImage, site } from "@/lib/site"

export const metadata: Metadata = { title: "О нас" }

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pt-28 pb-20">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-xs tracking-[0.22em] text-pine uppercase">О кофейне</p>
          <h1 className="display mt-3 text-5xl sm:text-6xl">{site.name}</h1>
          <p className="mt-5 max-w-md text-lg leading-8 text-muted">{site.description}</p>
          <p className="mt-4 max-w-md leading-7 text-muted">
            Мы жарим короткими партиями и держим на баре только то зерно, которое сейчас звучит.
            Молочные напитки — на цельном или овсяном. Выпечка — своя, по утрам.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/menu" className="btn btn-pine">
              Меню
            </Link>
            <a href={site.mapHref} target="_blank" rel="noreferrer" className="btn btn-ghost-dark">
              На карте
            </a>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden bg-line sm:aspect-[5/4]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={pourImage} alt="Приготовление фильтра" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      </div>
    </div>
  )
}
