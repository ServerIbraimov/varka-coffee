"use client"

import { FormEvent, useMemo, useState } from "react"
import { createBookingAction } from "@/app/(public)/actions"
import { bookingTimeSlots, minBookableDateStr, moscowDateTime } from "@/lib/hours"
import { site } from "@/lib/site"

export function BookingForm() {
  const minDate = minBookableDateStr()
  const [date, setDate] = useState(minDate)
  const [time, setTime] = useState("")
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const slots = useMemo(() => bookingTimeSlots(date), [date])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!time) {
      setError("Выберите время в часы работы.")
      return
    }

    setPending(true)
    setError(null)
    setMessage(null)

    const form = new FormData(e.currentTarget)
    const startsAt = moscowDateTime(date, time).toISOString()
    const result = await createBookingAction({
      name: form.get("name"),
      phone: form.get("phone"),
      partySize: form.get("partySize"),
      startsAt,
      comment: form.get("comment") || "",
    })

    setPending(false)
    if (!result.ok) {
      setError(result.message)
      return
    }

    setMessage(result.message)
    e.currentTarget.reset()
    setTime("")
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-line bg-foam p-6 sm:p-8">
      <h2 className="display text-3xl">Бронь стола</h2>
      <p className="mt-2 text-sm text-muted">
        Будни {site.hours[0].open}–{site.hours[0].lastBooking}, выходные {site.hours[1].open}–
        {site.hours[1].lastBooking} (МСК)
      </p>
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
        <label className="grid gap-1.5 text-sm">
          Дата
          <input
            type="date"
            required
            min={minDate}
            value={date}
            className="field"
            onChange={(e) => {
              setDate(e.target.value)
              setTime("")
            }}
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          Время
          <select
            required
            className="field"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            <option value="">Выберите слот</option>
            {slots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </label>
        {!slots.length ? (
          <p className="text-sm text-ember sm:col-span-2">На эту дату свободных слотов нет — выберите другой день.</p>
        ) : null}
        <label className="grid gap-1.5 text-sm sm:col-span-2">
          Пожелания
          <textarea name="comment" className="field" placeholder="У окна, детский стул..." />
        </label>
      </div>

      {error ? <p className="mt-4 text-sm text-ember">{error}</p> : null}
      {message ? <p className="mt-4 text-sm text-pine">{message}</p> : null}

      <button type="submit" disabled={pending || !slots.length} className="btn btn-pine mt-6 w-full sm:w-auto">
        {pending ? "Отправляем..." : "Забронировать"}
      </button>
    </form>
  )
}
