import { Request, Response } from 'express'
import { Constant } from '@constants'
import { OrderDB } from '@schemas'
import { buffer } from 'micro'
import Stripe from 'stripe'

const endpointSecret = Constant.ENDPOINT_SECRET
export const stripe = new Stripe(Constant.STRIPE_SK, {
  apiVersion: '2023-10-16'
})

export default async function handler(req: Request, res: Response) {
  const sig: string = req.headers['stripe-signature'] as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      await buffer(req),
      sig,
      endpointSecret
    )
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`)
    return
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const data: Stripe.Checkout.Session = event.data.object
      if (data && data.metadata && data.metadata.orderId) {
        const orderId = data.metadata.orderId
        const paid = data.payment_status === 'paid'

        if (orderId && paid) {
          await OrderDB.findByIdAndUpdate(orderId, {
            paid: true
          })
        }
      } else {
        console.error('Missing data or orderId in event object')
      }
      break
    default:
      console.error(`Unhandled event type ${event.type}`)
  }

  res.status(200).send('Success')
}
