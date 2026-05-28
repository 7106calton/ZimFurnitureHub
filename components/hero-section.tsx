import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] w-full">
      <div className="mx-auto grid min-h-[90vh] max-w-7xl lg:grid-cols-2">
        {/* Content Side */}
        <div className="flex flex-col justify-center px-6 py-20 lg:px-8 lg:py-0">
          <div className="max-w-xl">
            <h1 className="font-serif text-5xl leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl text-balance">
              Elevated Living, Crafted for You.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
              Transform your space into a sanctuary of refined design. 
              Our curated collection blends timeless craftsmanship with 
              modern minimalism.
            </p>
            <div className="mt-10">
              <Button 
                size="lg" 
                className="h-12 px-8 text-sm font-medium tracking-wide"
              >
                Explore Collections
              </Button>
            </div>
          </div>
        </div>

        {/* Image Side */}
        <div className="relative order-first lg:order-last">
          <div className="relative h-[50vh] w-full lg:h-full">
            <Image
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80"
              alt="Luxurious minimalist living room with elegant neutral tones and modern furniture"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
