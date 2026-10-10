"use client"

import { ChangeEvent, useState } from "react"
import { maskEuropePhone } from "@/lib/phone"

type Props = {
  name?: string
  required?: boolean
  className?: string
  defaultValue?: string
  placeholder?: string
}

export function PhoneInput({
  name = "phone",
  required = true,
  className = "field",
  defaultValue = "",
  placeholder = "+370 612 000 00",
}: Props) {
  const [value, setValue] = useState(() => (defaultValue ? maskEuropePhone(defaultValue) : ""))

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(maskEuropePhone(e.target.value))
  }

  return (
    <input
      name={name}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      required={required}
      className={className}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      maxLength={20}
      aria-label="Телефон"
    />
  )
}
