import { MenuAdmin } from "@/components/menu-admin"
import { prisma } from "@/lib/prisma"

export default async function AdminMenuPage() {
  const items = await prisma.menuItem.findMany({
    orderBy: [{ sort: "asc" }, { name: "asc" }],
  })

  return <MenuAdmin items={items} />
}
