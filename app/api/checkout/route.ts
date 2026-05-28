import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { items } = await request.json()

    if (!items || items.length === 0) {
      return new NextResponse("No items in cart", { status: 400 })
    }

    // 1. Calculate total
    const totalAmount = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)

    // 2. Create Order in Supabase (status: pending)
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        total_amount: totalAmount,
        status: 'pending',
        // user_id is null for guest checkout
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error('Supabase Order Error:', orderError)
      return new NextResponse("Database error", { status: 500 })
    }

    // 3. Create Order Items
    const orderItemsToInsert = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_time: item.price,
    }))

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItemsToInsert)

    if (itemsError) {
      console.error('Supabase Order Items Error:', itemsError)
      return new NextResponse("Database error", { status: 500 })
    }

    // 4. Create Stripe Checkout Session
    const line_items = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects cents
      },
      quantity: item.quantity,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
      metadata: {
        orderId: order.id,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Stripe Error:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
