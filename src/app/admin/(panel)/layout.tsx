import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { AdminProviders } from "@/components/admin-providers"

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  return <AdminProviders session={session}>{children}</AdminProviders>
}
