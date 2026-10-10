"use client"

import { FormEvent, Suspense, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 5.1 29.3 3 24 3 12.3 3 3 12.3 3 24s9.3 21 21 21 21-9.3 21-21c0-1.4-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 5.1 29.3 3 24 3 16.3 3 9.6 7.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 45c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 36 26.8 37 24 37c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 40.6 16.2 45 24 45z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l.1.1 6.2 5.2C39.2 37.3 45 32 45 24c0-1.4-.1-2.3-.4-3.5z" />
    </svg>
  )
}

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const callback = params.get("callbackUrl") || "/admin"
  const authError = params.get("error")

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    })

    setPending(false)
    if (res?.error) {
      setError("Неверный email или пароль.")
      return
    }

    router.push(callback)
    router.refresh()
  }

  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-[1.75rem] border border-line/80 bg-foam/90 p-8 shadow-[0_40px_100px_-48px_rgba(16,18,16,0.55)] backdrop-blur-xl">
      <div className="pointer-events-none absolute -top-24 -right-16 h-48 w-48 rounded-full bg-pine/10 blur-3xl" />
      <p className="display relative text-4xl tracking-tight">ВАРКА</p>
      <h1 className="relative mt-2 text-lg text-muted">Вход в CRM</h1>

      <button
        type="button"
        className="btn btn-ghost-dark relative mt-8 w-full"
        onClick={() => signIn("google", { callbackUrl: callback })}
      >
        <GoogleIcon />
        Войти через Google
      </button>

      <div className="relative my-6 flex items-center gap-3 text-xs tracking-[0.18em] text-muted uppercase">
        <span className="h-px flex-1 bg-line" />
        или email
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={onSubmit} className="relative">
        <div className="grid gap-4">
          <label className="grid gap-1.5 text-sm">
            Email
            <input
              name="email"
              type="email"
              required
              defaultValue="admin@varka.cafe"
              className="field"
              autoComplete="username"
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            Пароль
            <input
              name="password"
              type="password"
              required
              defaultValue="varka2026"
              className="field"
              autoComplete="current-password"
            />
          </label>
        </div>

        {error || authError ? (
          <p className="mt-4 text-sm text-ember">
            {error || "Вход через Google не удался. Проверьте ADMIN_EMAILS и OAuth-ключи."}
          </p>
        ) : null}

        <button type="submit" disabled={pending} className="btn btn-pine mt-6 w-full">
          {pending ? "Входим..." : "Войти с паролем"}
        </button>
      </form>

      <p className="relative mt-4 text-xs leading-5 text-muted">
        Демо-пароль: admin@varka.cafe / varka2026. Google — если заданы AUTH_GOOGLE_* и email в ADMIN_EMAILS.
      </p>
      <Link href="/" className="relative mt-4 inline-block text-sm text-pine underline underline-offset-4">
        На сайт
      </Link>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-stone px-5 py-12">
      <div className="noise pointer-events-none absolute inset-0 opacity-[0.35]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(27,77,62,0.14),_transparent_55%)]" />
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
