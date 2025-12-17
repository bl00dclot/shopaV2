// src/lib/server/paymentStart.ts
import { db } from '$lib/server/db';
import { cartItems, carts } from '$lib/server/db/schema';
import { products } from '$lib/server/db/schema'; // adjust path
import { paymentSessions } from '$lib/server/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { env } from '$env/dynamic/private';

const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || 'http://localhost:5173';

type CheckoutInput = {
  cartId: string;
  email: string;
  shipping: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
};

//TODO: adjust products table with tokenAddress and chainId

// type ProductRow = {
//   id: string;
//   priceAmount: string; // stringified smallest unit
//   tokenAddress: string;
//   chainId: number;
//   name: string;
//   active: boolean;
//   maxPerOrder?: number | null;
//   stock?: number | null;
// };
type ProductRow = typeof products.$inferSelect;

const chainIdEnv = env.PAYMENT_CHAIN_ID;
const tokenAddressEnv = env.PAYMENT_TOKEN_ADDRESS;

const clampQty = (qty: number) => Math.min(Math.max(qty, 1), 99);

export async function buildPaymentSession(input: CheckoutInput) {
  const { cartId } = input;
  const cart = await db.select().from(carts).where(eq(carts.id, cartId)).get();
  if (!cart) throw new Error('Cart not found or expired');

  const items = await db.select().from(cartItems).where(eq(cartItems.cartId, cartId)).all();
  if (!items.length) throw new Error('Cart is empty');

  const productIds = items.map((i) => i.productId);
  const productRows = await db
    .select()
    .from(products)
    .where(inArray(products.id, productIds))
    .all();

  const productMap = new Map(productRows.map((p) => [p.id, p as ProductRow]));

  // Validate and compute total
  let total = 0n;
  let chainId: number | null = null;
  let tokenAddress: string | null = null;

  for (const line of items) {
    const product = productMap.get(line.productId);
    // if (!product || !product.active) throw new Error('Invalid or inactive product');
    if (!product) throw new Error('Invalid or inactive product');
    const qty = clampQty(line.qty);

    // if (product.maxPerOrder && qty > product.maxPerOrder)
    //   throw new Error('Quantity exceeds limit');
    // if (product.stock != null && qty > product.stock)
    if (product.inStock != null && qty > product.inStock)
      throw new Error('Insufficient stock');

    const lineAmount = BigInt(product.price) * BigInt(qty);
    total += lineAmount;

    if (chainId === null) chainId = parseInt(chainIdEnv);
    if (tokenAddress === null) tokenAddress = tokenAddressEnv;

    // if (chainId !== product.chainId || tokenAddress !== product.tokenAddress) {
    //   throw new Error('All items must share the same payment token/chain');
    // }
  }

  if (chainId === null || tokenAddress === null) throw new Error('Payment config missing');

  const sessionId = randomUUID();
  const orderId = randomUUID(); // placeholder; replace with real order creation if you have orders table
  const now = new Date();

    const fulfillUrl = `${PUBLIC_BASE_URL}/api/payments/complete?sessionId=${sessionId}`;


  await db
    .insert(paymentSessions)
    .values({
      id: sessionId,
      cartId,
      orderId,
      state: 'pending',
      chainId,
      tokenAddress,
      amount: total.toString(),
      createdAt: now,
      updatedAt: now,
    })
    .run();

  //TODO: reduce stock levels in products table upon payment completion
  //TODO: create an orders table to track orders

  // Here you’d also create/associate an order record with the cart + shipping + email.
  // For brevity, we return IDs; integrate with your orders table.

  return {
    sessionId,
    orderId,
    chainId,
    tokenAddress,
    amount: total.toString(),
    fulfillUrl,
  };
}