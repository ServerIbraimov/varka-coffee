"use server"

import { revalidatePath } from "next/cache"
import { publishCrm } from "@/lib/crm-bus"
import { prisma } from "@/lib/prisma"
import { getMenuByIds } from "@/lib/menu"
import {
  createBookingSchema,
  createOrderSchema,
  normalizePhone,
} from "@/lib/validators"

export type ActionResult =
  | { ok: true; id: string; message: string }
  | { ok: false; message: string }

export async function createOrderAction(input: unknown): Promise<ActionResult> {
  const parsed = createOrderSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, message: "Проверьте имя, телефон и состав заказа." }
  }

  const data = parsed.data
  const phone = normalizePhone(data.phone)
  if (phone.length < 11) {
    return { ok: false, message: "Укажите корректный телефон." }
  }

  const menuItems = await getMenuByIds(data.items.map((i) => i.menuItemId))
  const byId = new Map(menuItems.map((m) => [m.id, m]))

  const lines = []
  let total = 0
  for (const line of data.items) {
    const item = byId.get(line.menuItemId)
    if (!item) return { ok: false, message: "Один из позиций недоступен. Обновите меню." }
    lines.push({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      qty: line.qty,
    })
    total += item.price * line.qty
  }

  const guest = await prisma.guest.upsert({
    where: { phone },
    update: {
      name: data.name,
      email: data.email || undefined,
    },
    create: {
      name: data.name,
      phone,
      email: data.email || "",
    },
  })

  const pickupAt = data.pickupAt ? new Date(data.pickupAt) : null
  if (pickupAt && Number.isNaN(pickupAt.getTime())) {
    return { ok: false, message: "Некорректное время самовывоза." }
  }

  const order = await prisma.order.create({
    data: {
      guestId: guest.id,
      comment: data.comment || "",
      total,
      pickupAt,
      items: { create: lines },
    },
    include: { guest: true },
  })

  await publishCrm({
    type: "change",
    kind: "order",
    event: "created",
    id: order.id,
    status: order.status,
    updatedAt: order.updatedAt.toISOString(),
    total: order.total,
    guestName: order.guest.name,
  })

  revalidatePath("/admin")
  revalidatePath("/admin/orders")
  revalidatePath("/admin/guests")

  return {
    ok: true,
    id: order.id,
    message: "Заказ принят. Ждём вас у стойки.",
  }
}

export async function createBookingAction(input: unknown): Promise<ActionResult> {
  const parsed = createBookingSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, message: "Проверьте данные бронирования." }
  }

  const data = parsed.data
  const phone = normalizePhone(data.phone)
  if (phone.length < 11) {
    return { ok: false, message: "Укажите корректный телефон." }
  }

  const startsAt = new Date(data.startsAt)
  if (Number.isNaN(startsAt.getTime())) {
    return { ok: false, message: "Некорректная дата." }
  }
  if (startsAt.getTime() < Date.now() - 60_000) {
    return { ok: false, message: "Выберите время в будущем." }
  }

  const guest = await prisma.guest.upsert({
    where: { phone },
    update: {
      name: data.name,
      email: data.email || undefined,
    },
    create: {
      name: data.name,
      phone,
      email: data.email || "",
    },
  })

  const booking = await prisma.booking.create({
    data: {
      guestId: guest.id,
      partySize: data.partySize,
      startsAt,
      comment: data.comment || "",
    },
    include: { guest: true },
  })

  await publishCrm({
    type: "change",
    kind: "booking",
    event: "created",
    id: booking.id,
    status: booking.status,
    updatedAt: booking.updatedAt.toISOString(),
    partySize: booking.partySize,
    guestName: booking.guest.name,
  })

  revalidatePath("/admin")
  revalidatePath("/admin/bookings")
  revalidatePath("/admin/guests")

  return {
    ok: true,
    id: booking.id,
    message: "Бронь отправлена. Мы подтвердим её в CRM.",
  }
}
