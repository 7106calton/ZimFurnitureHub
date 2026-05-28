import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

const mockCollections = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    title: 'The Sofa Collection',
    description: 'Timeless comfort',
    image_url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
    href: '#',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    title: 'Minimalist Dining',
    description: 'Where memories gather',
    image_url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80',
    href: '#',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    title: 'Premium Bedding',
    description: 'Restful luxury',
    image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
    href: '#',
  },
]

export async function FeaturedCollections() {
  const supabase = await createClient()
  const { data: dbCollections } = await supabase.from('collections').select('*').limit(3)

  const collections = dbCollections && dbCollections.length > 0 ? dbCollections : mockCollections

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-3xl tracking-tight text-foreground md:text-4xl">
            Featured Collections
          </h2>
          <p className="mt-4 text-muted-foreground">
            Curated selections for every room in your home
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={collection.href || '#'}
              className="group relative aspect-[4/5] overflow-hidden bg-muted"
            >
              <Image
                src={collection.image_url || 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80'}
                alt={collection.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/0 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-background">
                <p className="text-sm font-medium tracking-wide opacity-80">
                  {collection.description}
                </p>
                <h3 className="mt-1 font-serif text-2xl">
                  {collection.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
