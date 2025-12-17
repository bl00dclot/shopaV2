// src/routes/api/payments/fulfill-x402/+server.ts
import type { RequestEvent } from './$types';
import { json } from '@sveltejs/kit';
import { settlePayment } from 'thirdweb/x402';

import { db } from '$lib/server/db';
import { paymentSessions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

import { thirdwebFacilitator, x402Network } from '$lib/server/x402';
import { markOrderPaidAndSendEmail } from '$lib/server/orders'; // you implement this
import { env } from '$env/dynamic/private';


const PUBLIC_BASE_URL = env.PUBLIC_BASE_URL ?? 'http://localhost:5173';
const SERVER_WALLET_ADDRESS = env.SERVER_WALLET_ADDRESS!;

export async function GET(event: RequestEvent) {
  try {
    const sessionId = event.url.searchParams.get('sessionId');
    if (!sessionId) {
      return new Response('Missing sessionId', { status: 400 });
    }

    if (!thirdwebFacilitator || !x402Network || !SERVER_WALLET_ADDRESS) {
      return new Response('x402 not configured on server', { status: 500 });
    }

    // Load payment session
    const session = await db
      .select()
      .from(paymentSessions)
      .where(eq(paymentSessions.id, sessionId))
      .get();

    if (!session) {
      return new Response('Payment session not found', { status: 404 });
    }
    if (session.state === 'paid') {
      // Idempotent: already fulfilled
      return json({ ok: true, sessionId, alreadyPaid: true });
    }
    if (session.state !== 'pending') {
      return new Response('Payment session is not pending', { status: 400 });
    }

    const paymentData = event.request.headers.get('x-payment') ?? undefined;

    const resourceUrl = `${PUBLIC_BASE_URL}/api/payments/complete?sessionId=${sessionId}`;

    const result = await settlePayment({
      resourceUrl,
      method: 'GET',
      paymentData,
      payTo: SERVER_WALLET_ADDRESS,
      network: x402Network,
      price: session.amount, // string; matches what you stored from cart
      facilitator: thirdwebFacilitator,
      routeConfig: {
        description: 'Physical goods order fulfillment',
        mimeType: 'application/json',
        maxTimeoutSeconds: 3600,
      },
    });

    // If settlement succeeded (payment verified)
    if (result.status === 200) {
      const now = new Date();

      // TODO: if result has tx hash or payer address, store it here
      await db
        .update(paymentSessions)
        .set({
          state: 'paid',
          updatedAt: now,
        })
        .where(eq(paymentSessions.id, sessionId))
        .run();

      // Also mark order paid and send email (you implement this)
      await markOrderPaidAndSendEmail({
        orderId: session.orderId,
        amount: session.amount,
        chainId: session.chainId,
        tokenAddress: session.tokenAddress,
        // txHash: result.txHash ?? undefined, // adjust if settlePayment exposes it
      });

      return json({ ok: true, sessionId });
    }

    // Otherwise, forward the x402 response (e.g. 402 Payment Required) to the client
    return new Response(JSON.stringify(result.responseBody), {
      status: result.status,
      headers: result.responseHeaders,
    });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : 'Failed to fulfill payment';
    return new Response(message, { status: 500 });
  }
}