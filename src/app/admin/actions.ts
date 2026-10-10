"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { publishCrm } from "@/lib/crm-bus"
import { prisma } from "@/lib/prisma"
import { slugify } from "@/lib/menu"
import { menuItemSchema } from "@/lib/validators"

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  return session
}

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin()
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: { guest: true },
  })
  await publishCrm({
    type: "change",
    kind: "order",
    event: "updated",
    id: order.id,
    status: order.status,
    updatedAt: order.updatedAt.toISOString(),
    total: order.total,
    guestName: order.guest.name,
  })
  revalidatePath("/admin")
  revalidatePath("/admin/orders")
}

export async function updateBookingStatus(bookingId: string, status: string) {
  await requireAdmin()
  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
    include: { guest: true },
  })
  await publishCrm({
    type: "change",
    kind: "booking",
    event: "updated",
    id: booking.id,
    status: booking.status,
    updatedAt: booking.updatedAt.toISOString(),
    partySize: booking.partySize,
    guestName: booking.guest.name,
  })
  revalidatePath("/admin")
  revalidatePath("/admin/bookings")
}

export async function upsertMenuItem(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get("id") || "")
  const raw = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    category: formData.get("category"),
    image: formData.get("image") || "",
    featured: formData.get("featured") === "on",
    available: formData.get("available") === "on",
    sort: formData.get("sort") || 0,
  }

  const parsed = menuItemSchema.safeParse(raw)
  if (!parsed.success) return { ok: false as const, message: "Проверьте поля меню." }

  const data = {
    ...parsed.data,
    image: parsed.data.image || "",
    featured: Boolean(parsed.data.featured),
    available: parsed.data.available !== false,
    sort: parsed.data.sort ?? 0,
  }

  if (id) {
    await prisma.menuItem.update({ where: { id }, data })
  } else {
    let slug = slugify(data.name)
    const exists = await prisma.menuItem.findUnique({ where: { slug } })
    if (exists) slug = `${slug}-${Date.now().toString(36)}`
    await prisma.menuItem.create({ data: { ...data, slug } })
  }

  revalidatePath("/admin/menu")
  revalidatePath("/menu")
  revalidatePath("/")
  return { ok: true as const }
}

export async function deleteMenuItem(id: string) {
  await requireAdmin()
  await prisma.menuItem.delete({ where: { id } })
  revalidatePath("/admin/menu")
  revalidatePath("/menu")
  revalidatePath("/")
}

export async function toggleMenuAvailability(id: string, available: boolean) {
  await requireAdmin()
  await prisma.menuItem.update({ where: { id }, data: { available } })
  revalidatePath("/admin/menu")
  revalidatePath("/menu")
}
