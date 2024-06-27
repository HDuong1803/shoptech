import type { Request } from 'express'
import { Constant } from '@constants'
import { db } from '@utils'
import { buffer } from 'micro'
import Stripe from 'stripe'

const endpointSecret = Constant.ENDPOINT_SECRET
export const stripe = new Stripe(Constant.STRIPE_SK, {
  apiVersion: '2023-10-16'
})

export async function handler(req: Request): Promise<any> {
  const sig: string = req.headers['stripe-signature'] as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      await buffer(req),
      sig,
      endpointSecret
    )
  } catch (err: any) {
    throw new Error(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  let data
  let orderId
  let paid

  switch (event.type) {
    case 'checkout.session.completed':
      data = event.data.object
      if (data?.metadata?.orderId) {
        orderId = data.metadata.orderId
        paid = data.payment_status === 'paid'
        if (orderId && paid) {
          await db.order.update({
            where: {
              id: orderId
            },
            data: {
              is_paid: true,
              paid_at: new Date(Date.now())
            }
          })
        }
      } else {
        console.error('Missing data or orderId in event object')
      }
      break
    default:
      console.error(`Unhandled event type ${event.type}`)
  }

  return {
    message: 'Success',
    success: true
  }
}
