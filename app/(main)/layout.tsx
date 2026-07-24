import { Navbar } from '@/components/site/navbar'
import { Footer } from '@/components/site/footer'
import { AnnouncementBar } from '@/components/site/announcement-bar'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { ChatWidget } from '@/components/chat/chat-widget'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <ChatWidget />
    </div>
  )
}
