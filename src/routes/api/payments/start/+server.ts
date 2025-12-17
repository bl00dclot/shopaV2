// src/routes/api/payments/start/+server.ts
import { json, type RequestEvent } from '@sveltejs/kit';
import { buildPaymentSession } from '$lib/server/paymentStart';
import { readCartId, setCartId } from '$lib/server/cookies';

export async function POST(event: RequestEvent) {
  try {
    const body = await event.request.json().catch(() => ({}));
    const cartId = readCartId(event);
    if (!cartId) return new Response('Cart missing', { status: 400 });

    const { email, shipping } = body;
    if (!email || !shipping?.line1 || !shipping?.city || !shipping?.postalCode || !shipping?.country) {
      return new Response('Missing email/shipping', { status: 400 });
    }

    const session = await buildPaymentSession({
      cartId,
      email,
      shipping,
    });

    // Touch cookie to extend TTL
    setCartId(event, cartId);

    // This payload is what the frontend needs to proceed to x402 flow.
    return json({
      sessionId: session.sessionId,
      orderId: session.orderId,
      price: {
        amount: session.amount,       // string (wei/smallest unit)
        tokenAddress: session.tokenAddress,
        chainId: session.chainId,
      },
      fullFillUrl: session.fulfillUrl,
    });
  } catch (err) {
    console.error(err);
  return new Response(
    err instanceof Error ? err.message : 'Failed to start payment',
    { status: 400 });
  }
}