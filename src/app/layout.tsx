import type { Metadata } from "next"
import { Fraunces, Outfit } from "next/font/google"
import { CartProvider } from "@/components/cart-provider"
import { site } from "@/lib/site"
import "./globals.css"

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
})

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
})

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${outfit.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="relative min-h-full flex flex-col bg-stone text-ink">
        <div className="noise pointer-events-none fixed inset-0 z-[1] opacity-[0.22]" />
        <div className="relative z-[2] flex min-h-full flex-1 flex-col">
          <CartProvider>{children}</CartProvider>
        </div>
      </body>
    </html>
  )
}
