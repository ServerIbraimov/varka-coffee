import { z } from "zod"

export const orderItemSchema = z.object({
  menuItemId: z.string().min(1),
  qty: z.coerce.number().int().min(1).max(20),
})

export const createOrderSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(10).max(20),
  comment: z.string().trim().max(400).optional().or(z.literal("")),
  pickupAt: z.string().min(1),
  items: z.array(orderItemSchema).min(1).max(30),
})

export const createBookingSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(10).max(20),
  partySize: z.coerce.number().int().min(1).max(12),
  startsAt: z.string().min(1),
  comment: z.string().trim().max(400).optional().or(z.literal("")),
})

export const menuItemSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().min(4).max(400),
  price: z.coerce.number().min(0.5).max(1000),
  category: z.string().trim().min(1),
  image: z.string().trim().max(500).optional().or(z.literal("")),
  featured: z.coerce.boolean().optional(),
  available: z.coerce.boolean().optional(),
  sort: z.coerce.number().int().min(0).max(999).optional(),
})

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6).max(100),
})

export function normalizePhone(phone: string) {
  let digits = phone.replace(/\D/g, "")
  // Lithuania: +370 6XX XXXXX / 8 6XX XXXXX
  if (digits.startsWith("370") && digits.length === 11) return digits
  if (digits.startsWith("8") && digits.length === 9) return `370${digits.slice(1)}`
  if (digits.length === 8 && digits.startsWith("6")) return `370${digits}`
  // legacy RU fallback
  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) {
    return `7${digits.slice(1)}`
  }
  if (digits.length === 10) return `7${digits}`
  return digits
}

export function isValidPhone(phone: string) {
  const n = normalizePhone(phone)
  return (n.startsWith("370") && n.length === 11) || (n.startsWith("7") && n.length === 11)
}
