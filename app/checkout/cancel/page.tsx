import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'

export default function CheckoutCancelPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="mx-auto max-w-md text-center">
        <XCircle className="mx-auto h-16 w-16 text-destructive" />
        <h1 className="mt-6 font-serif text-3xl font-semibold tracking-tight">
          Checkout Cancelled
        </h1>
        <p className="mt-4 text-muted-foreground">
          Your payment was cancelled and no charges were made. You can return to your cart to try again.
        </p>
        <div className="mt-10 flex flex-col gap-4">
          <Button asChild className="w-full h-12">
            <Link href="/">Return to Store</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
