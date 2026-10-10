"use client"

import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth"
import { AdminShell } from "@/components/admin-shell"

export function AdminProviders({
  session,
  children,
}: {
  session: Session
  children: React.ReactNode
}) {
  return (
    <SessionProvider session={session}>
      <AdminShell userName={session.user.name || session.user.email}>{children}</AdminShell>
    </SessionProvider>
  )
}
