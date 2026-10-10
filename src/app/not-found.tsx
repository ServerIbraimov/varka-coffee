import Link from "next/link"
import { site } from "@/lib/site"

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-ink text-foam">
      <div className="noise pointer-events-none absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-pine/40 blur-3xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-5 py-20">
        <p className="text-xs tracking-[0.3em] text-brass uppercase">{site.name}</p>
        <h1 className="display mt-6 text-[clamp(4.5rem,18vw,9rem)] leading-none">404</h1>
        <p className="mt-6 max-w-md text-lg leading-8 text-foam/70">
          Этой страницы нет в меню. Может, она ушла на обжарку — или вы опечатались в адресе.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-pine">
            На главную
          </Link>
          <Link href="/menu" className="btn btn-ghost">
            Смотреть меню
          </Link>
        </div>
      </div>
    </div>
  )
}
