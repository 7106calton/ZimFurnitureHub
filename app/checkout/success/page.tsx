import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="mx-auto max-w-md text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-6 font-serif text-3xl font-semibold tracking-tight">
          Payment Successful!
        </h1>
        <p className="mt-4 text-muted-foreground">
          Thank you for your order. We've received your payment and are currently processing your order. You'll receive an email confirmation shortly.
        </p>
        <div className="mt-10">
          <Button asChild className="w-full h-12">
            <Link href="/">Return to Store</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
