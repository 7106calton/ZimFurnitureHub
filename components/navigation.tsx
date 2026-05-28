'use client'

import Link from 'next/link'
import { Search, ShoppingBag } from 'lucide-react'
import { useCart } from './cart-context'

export function Navigation() {
  const { setIsOpen, totalItems } = useCart()

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Brand */}
        <Link 
          href="/" 
          className="font-serif text-xl tracking-tight text-foreground transition-opacity hover:opacity-70"
        >
          Zim Furniture Hub
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-10 md:flex">
          <Link 
            href="#" 
            className="text-sm font-medium tracking-wide text-muted-foreground transition-colors hover:text-foreground"
          >
            Living
          </Link>
          <Link 
            href="#" 
            className="text-sm font-medium tracking-wide text-muted-foreground transition-colors hover:text-foreground"
          >
            Bedroom
          </Link>
          <Link 
            href="#" 
            className="text-sm font-medium tracking-wide text-muted-foreground transition-colors hover:text-foreground"
          >
            Office
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button 
            className="p-2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <button 
            onClick={() => setIsOpen(true)}
            className="relative p-2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Shopping cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  )
}
