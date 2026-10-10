import { CartDrawer } from "@/components/cart-drawer"
import { CartToast } from "@/components/cart-toast"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader onHero />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <CartDrawer />
      <CartToast />
    </>
  )
}
