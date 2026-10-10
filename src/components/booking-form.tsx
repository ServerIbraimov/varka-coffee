"use client"

import { FormEvent, useState } from "react"
import { createBookingAction } from "@/app/(public)/actions"

export function BookingForm() {
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)
    setMessage(null)

    const form = new FormData(e.currentTarget)
    const result = await createBookingAction({
      name: form.get("name"),
      phone: form.get("phone"),
      email: form.get("email") || "",
      partySize: form.get("partySize"),
      startsAt: form.get("startsAt"),
      comment: form.get("comment") || "",
    })

    setPending(false)
    if (!result.ok) {
      setError(result.message)
      return
    }

    setMessage(result.message)
    e.currentTarget.reset()
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-line bg-foam p-6 sm:p-8">
      <h2 className="display text-3xl">Бронь стола</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm sm:col-span-2">
          Имя
          <input name="name" required className="field" placeholder="Имя" />
        </label>
        <label className="grid gap-1.5 text-sm">
          Телефон
          <input name="phone" required className="field" placeholder="+7 900 000-00-00" />
        </label>
        <label className="grid gap-1.5 text-sm">
          Гостей
          <input name="partySize" type="number" min={1} max={12} defaultValue={2} required className="field" />
        </label>
        <label className="grid gap-1.5 text-sm sm:col-span-2">
          Дата и время
          <input name="startsAt" type="datetime-local" required className="field" />
        </label>
        <label className="grid gap-1.5 text-sm sm:col-span-2">
          Email <span className="text-muted">(необязательно)</span>
          <input name="email" type="email" className="field" />
        </label>
        <label className="grid gap-1.5 text-sm sm:col-span-2">
          Пожелания
          <textarea name="comment" className="field" placeholder="У окна, детский стул..." />
        </label>
      </div>

      {error ? <p className="mt-4 text-sm text-ember">{error}</p> : null}
      {message ? <p className="mt-4 text-sm text-pine">{message}</p> : null}

      <button type="submit" disabled={pending} className="btn btn-pine mt-6 w-full sm:w-auto">
        {pending ? "Отправляем..." : "Забронировать"}
      </button>
    </form>
  )
}
