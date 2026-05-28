import { CartProvider } from '@/components/cart-context'
import { Navigation } from '@/components/navigation'
import { HeroSection } from '@/components/hero-section'
import { FeaturedCollections } from '@/components/featured-collections'
import { BestSellers } from '@/components/best-sellers'
import { CartPanel } from '@/components/cart-panel'

export default function Home() {
  return (
    <CartProvider>
      <div className="min-h-screen">
        <Navigation />
        <main>
          <HeroSection />
          <FeaturedCollections />
          <BestSellers />
        </main>
        <footer className="border-t py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <p className="font-serif text-lg text-foreground">
                Zim Furniture Hub
              </p>
              <p className="text-sm text-muted-foreground">
                © 2026 Zim Furniture Hub. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
        <CartPanel />
      </div>
    </CartProvider>
  )
}
