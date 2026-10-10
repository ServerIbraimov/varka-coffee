import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { googleConfigured, isAdminEmail } from "@/lib/admins"
import { prisma } from "@/lib/prisma"
import { loginSchema } from "@/lib/validators"

const providers = []

if (googleConfigured()) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  )
}

providers.push(
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const parsed = loginSchema.safeParse(credentials)
      if (!parsed.success) return null

      const email = parsed.data.email.toLowerCase()
      const admin = await prisma.admin.findUnique({ where: { email } })
      if (!admin?.passwordHash) return null

      const ok = await bcrypt.compare(parsed.data.password, admin.passwordHash)
      if (!ok) return null

      return { id: admin.id, email: admin.email, name: admin.name }
    },
  }),
)

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 12 },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers,
  callbacks: {
    // Prefer request host over a stale AUTH_URL (e.g. localhost on Vercel)
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      try {
        const target = new URL(url)
        if (target.origin === baseUrl) return url
      } catch {
        /* ignore */
      }
      return baseUrl
    },
    async signIn({ account, profile, user }) {
      if (account?.provider === "credentials") return Boolean(user?.email)

      if (account?.provider === "google") {
        const email = typeof profile?.email === "string" ? profile.email : ""
        if (profile?.email_verified !== true || !email) return false
        if (!isAdminEmail(email)) return false

        await prisma.admin.upsert({
          where: { email: email.toLowerCase() },
          update: {
            name: typeof profile?.name === "string" ? profile.name : email,
          },
          create: {
            email: email.toLowerCase(),
            name: typeof profile?.name === "string" ? profile.name : email,
            passwordHash: null,
          },
        })
        return true
      }

      return false
    },
    async jwt({ token, user, profile, account }) {
      if (user) {
        token.sub = user.id
        token.email = user.email
        token.name = user.name
      }
      if (account?.provider === "google" && typeof profile?.email === "string") {
        token.email = profile.email
        if (typeof profile.name === "string") token.name = profile.name
        const admin = await prisma.admin.findUnique({
          where: { email: profile.email.toLowerCase() },
        })
        if (admin) token.sub = admin.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? ""
        session.user.email = (token.email as string) || ""
        session.user.name = (token.name as string) || ""
      }
      return session
    },
  },
})
