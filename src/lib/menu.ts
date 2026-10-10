import { prisma } from "@/lib/prisma"

export async function listMenu(opts?: { availableOnly?: boolean }) {
  return prisma.menuItem.findMany({
    where: opts?.availableOnly ? { available: true } : undefined,
    orderBy: [{ sort: "asc" }, { name: "asc" }],
  })
}

export async function getMenuByIds(ids: string[]) {
  if (!ids.length) return []
  return prisma.menuItem.findMany({
    where: { id: { in: ids }, available: true },
  })
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/ё/g, "e")
    .replace(/[^a-z0-9а-я]+/gi, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60)
}
