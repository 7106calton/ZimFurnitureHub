'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useCart } from './cart-context'
import { createClient } from '@/utils/supabase/client'

const mockProducts = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Oslo Velvet Sofa',
    price: 2890,
    image_url: 'https://images.unsplash.com/photo-1550254478-ead40cc54513?w=600&q=80',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Nordic Lounge Chair',
    price: 1450,
    image_url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Zen Coffee Table',
    price: 890,
    image_url: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=600&q=80',
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Minimalist Bookshelf',
    price: 1290,
    image_url: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&q=80',
  },
]

export function BestSellers() {
  const { addItem } = useCart()
  const [products, setProducts] = useState(mockProducts)
  const supabase = createClient()

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(8)
      
      if (data && data.length > 0) {
        setProducts(data)
      }
    }

    fetchProducts()
  }, [])

  return (
    <section className="bg-secondary/50 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-3xl tracking-tight text-foreground md:text-4xl">
            Best Sellers
          </h2>
          <p className="mt-4 text-muted-foreground">
            Our most coveted pieces, chosen by discerning collectors
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="group">
              <div className="relative aspect-square overflow-hidden bg-card">
                <Image
                  src={product.image_url || 'https://images.unsplash.com/photo-1550254478-ead40cc54513?w=600&q=80'}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-4">
                <h3 className="font-medium text-foreground">{product.name}</h3>
                <p className="mt-1 text-muted-foreground">
                  ${Number(product.price).toLocaleString()}
                </p>
                <Button
                  variant="outline"
                  className="mt-4 w-full border-foreground/20 text-sm font-medium tracking-wide transition-colors hover:bg-foreground hover:text-background"
                  onClick={() => addItem({
                    id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    image: product.image_url || '',
                  })}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
