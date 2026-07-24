import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { Archivo } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { CartProvider } from '@/components/cart/cart-provider'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: {
    default: 'Liminal Surf & Skate Co. — Ride the line',
    template: '%s | Liminal Surf & Skate Co.',
  },
  description:
    'Surf and skate gear, handmade coastal goods, and a community that lives where the land meets the sea. Shop decks, boards, wetsuits and apparel.',
  generator: 'v0.app',
  keywords: ['surf', 'skate', 'surfboards', 'skateboards', 'wetsuits', 'streetwear', 'coastal'],
  openGraph: {
    title: 'Liminal Surf & Skate Co.',
    description: 'Ride the Liminal line. Surf & skate gear and a coastal community.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#0b6b78',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${archivo.variable} bg-background`}>
      <body className="font-sans antialiased">
        <CartProvider>{children}</CartProvider>
        <Toaster richColors position="top-center" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
