import { NextResponse } from "next/server"
import { auth } from "@/auth"

export default auth((req) => {
  const { pathname } = req.nextUrl

  if (!pathname.startsWith("/admin")) return NextResponse.next()
  if (pathname.startsWith("/admin/login")) return NextResponse.next()

  if (!req.auth) {
    const url = req.nextUrl.clone()
    url.pathname = "/admin/login"
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*"],
}
