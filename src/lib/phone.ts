/** European calling codes, longest first for prefix match */
export const EUROPE_CALLING_CODES = [
  "359",
  "358",
  "357",
  "356",
  "355",
  "354",
  "353",
  "352",
  "351",
  "350",
  "423",
  "421",
  "420",
  "389",
  "387",
  "386",
  "385",
  "383",
  "382",
  "381",
  "380",
  "378",
  "377",
  "376",
  "375",
  "374",
  "373",
  "372",
  "371",
  "370",
  "49",
  "48",
  "47",
  "46",
  "45",
  "44",
  "43",
  "41",
  "40",
  "39",
  "36",
  "34",
  "33",
  "32",
  "31",
  "30",
  "7",
] as const

/** Digits only, E.164 without leading + */
export function normalizePhone(phone: string) {
  let digits = phone.replace(/\D/g, "")
  if (digits.startsWith("00")) digits = digits.slice(2)
  return digits.slice(0, 15)
}

export function matchEuropeCode(digits: string) {
  return EUROPE_CALLING_CODES.find((code) => digits.startsWith(code)) ?? null
}

export function isValidPhone(phone: string) {
  const digits = normalizePhone(phone)
  if (digits.length < 8 || digits.length > 15) return false
  const code = matchEuropeCode(digits)
  if (!code) return false
  const national = digits.slice(code.length)
  return national.length >= 5 && national.length <= 12
}

/** Input mask: +{country} XXX XXX XXX */
export function maskEuropePhone(raw: string) {
  const digits = normalizePhone(raw)
  if (!digits) return ""

  const code = matchEuropeCode(digits)
  if (code) {
    const national = digits.slice(code.length)
    const groups = national.match(/.{1,3}/g) ?? []
    return `+${code}${groups.length ? ` ${groups.join(" ")}` : ""}`
  }

  // Still typing country code (e.g. "37" → could be 370/371/372…)
  if (EUROPE_CALLING_CODES.some((c) => c.startsWith(digits))) {
    return `+${digits}`
  }

  const groups = digits.match(/.{1,3}/g) ?? []
  return `+${groups.join(" ")}`
}

export function formatPhone(phone: string) {
  const digits = normalizePhone(phone)
  if (!digits) return phone
  return maskEuropePhone(digits)
}
