export const site = {
  name: "ВАРКА",
  city: "Санкт-Петербург",
  tagline: "Спешалти на Петроградке",
  description:
    "Кофейня с короткой обжаркой: эспрессо, фильтр, выпечка и столы у окна без спешки.",
  address: "Большой пр. П.С., 28",
  metro: "Петроградская",
  phoneDisplay: "+7 (812) 401-28-17",
  phoneHref: "tel:+78124012817",
  email: "hello@varka.cafe",
  hours: [
    { days: "Пн–Пт", open: "08:00", close: "22:00", lastBooking: "21:00" },
    { days: "Сб–Вс", open: "09:00", close: "23:00", lastBooking: "22:00" },
  ],
  mapHref:
    "https://yandex.ru/maps/?text=%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3%20%D0%91%D0%BE%D0%BB%D1%8C%D1%88%D0%BE%D0%B9%20%D0%BF%D1%80.%20%D0%9F.%D0%A1.%2028",
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
  { id: "food", label: "Еда", blurb: "Выпечка к чашке" },
] as const
