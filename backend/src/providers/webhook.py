import stripe
from flask import request, jsonify
from src.constants.constants import CONSTANT
from src.extensions import db
from src.models.order import Order
from datetime import datetime, timezone

stripe.api_key = CONSTANT['STRIPE_SK']
endpoint_secret = CONSTANT['ENDPOINT_SECRET']

def handle_webhook():
    """
    Handles Stripe webhook events, specifically checkout.session.completed.
    
    Returns:
        dict: Response with message and success status.
    
    Raises:
        ValueError: If webhook signature verification fails.
    """
    payload = request.get_data(as_text=True)
    sig_header = request.headers.get('Stripe-Signature')

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except ValueError as e:
        raise ValueError(f"Webhook Error: {str(e)}")
    except stripe.error.SignatureVerificationError as e:
        raise ValueError(f"Webhook Error: {str(e)}")

    # Handle the event
    if event['type'] == 'checkout.session.completed':
        data = event['data']['object']
        order_id = data.get('metadata', {}).get('orderId')
        paid = data.get('payment_status') == 'paid'

        if order_id and paid:
            order = Order.query.get(order_id)
            if order:
                order.is_paid = True
                order.paid_at = datetime.now(tz=timezone.utc)
                db.session.commit()
        else:
            print("Missing data or orderId in event object")
    else:
        print(f"Unhandled event type {event['type']}")

    return {'message': 'Success', 'success': True}