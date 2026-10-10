"use client"

import { useEffect, useState } from "react"

type Props = {
  open: boolean
  title?: string
  message: string
  onClose: () => void
}

export function ThanksDialog({
  open,
  title = "Спасибо!",
  message,
  onClose,
}: Props) {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (open) {
      setLeaving(false)
      setVisible(true)
      return
    }
    if (!visible) return
    setLeaving(true)
    const t = window.setTimeout(() => {
      setVisible(false)
      setLeaving(false)
    }, 320)
    return () => window.clearTimeout(t)
  }, [open, visible])

  useEffect(() => {
    if (!visible) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [visible, onClose])

  if (!visible) return null

  return (
    <div
      className={`thanks-overlay fixed inset-0 z-[80] flex items-center justify-center px-5 ${leaving ? "is-leaving" : ""}`}
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="thanks-title"
        className={`thanks-panel w-full max-w-md rounded-[1.6rem] border border-line bg-foam p-8 text-center shadow-[0_40px_80px_-40px_rgba(14,16,14,0.55)] ${leaving ? "is-leaving" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs tracking-[0.28em] text-brass uppercase">ВАРКА</p>
        <h2 id="thanks-title" className="display mt-3 text-5xl leading-none">
          {title}
        </h2>
        <p className="mt-4 text-base leading-7 text-muted">{message}</p>
        <button type="button" className="btn btn-pine mt-8 w-full sm:w-auto" onClick={onClose}>
          Хорошо
        </button>
      </div>
    </div>
  )
}
