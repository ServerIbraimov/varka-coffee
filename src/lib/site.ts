export const site = {
  name: "ВАРКА",
  city: "Вильнюс",
  country: "Литва",
  countryCode: "LT",
  tagline: "Спешалти в Старом городе",
  description:
    "Кофейня с короткой обжаркой: эспрессо, фильтр, десерты и тихие столы во дворе Старого Вильнюса.",
  address: "Pilies g. 12",
  district: "Старый город",
  phoneDisplay: "+370 612 45 817",
  phoneHref: "tel:+37061245817",
  email: "hello@varka.cafe",
  hours: [
    { days: "Пн–Пт", open: "08:00", close: "21:00", lastBooking: "20:00" },
    { days: "Сб–Вс", open: "09:00", close: "22:00", lastBooking: "21:00" },
  ],
  mapHref: "https://maps.google.com/?q=Pilies+g.+12,+Vilnius",
} as const

export const heroImage =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=2000&q=80"

export const barImage =
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1600&q=80"

export const pourImage =
  "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1600&q=80"

export const origins = [
  "Эфиопия",
  "Кения",
  "Колумбия",
  "Бразилия",
  "Руанда",
  "Гватемала",
] as const

export const orderStatuses = [
  { value: "new", label: "Новый" },
  { value: "preparing", label: "Готовим" },
  { value: "ready", label: "Готов" },
  { value: "done", label: "Выдан" },
  { value: "cancelled", label: "Отменён" },
] as const

export const bookingStatuses = [
  { value: "new", label: "Новая" },
  { value: "confirmed", label: "Подтверждена" },
  { value: "seated", label: "За столом" },
  { value: "done", label: "Завершена" },
  { value: "cancelled", label: "Отменена" },
] as const

export const categories = [
  { id: "espresso", label: "Эспрессо", blurb: "Плотные шоты и классика" },
  { id: "filter", label: "Фильтр", blurb: "Пуровер и лот дня" },
  { id: "milk", label: "С молоком", blurb: "Флэт, капучино, латте" },
  { id: "food", label: "Десерты", blurb: "Выпечка и сладкое к чашке" },
] as const
