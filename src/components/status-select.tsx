"use client"

import { useTransition } from "react"

type Option = { value: string; label: string }

export function StatusSelect({
  value,
  options,
  onChange,
}: {
  value: string
  options: readonly Option[]
  onChange: (status: string) => Promise<void>
}) {
  const [pending, start] = useTransition()

  return (
    <select
      className="field min-h-10 py-2 text-sm"
      value={value}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value
        start(async () => {
          await onChange(next)
        })
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}
