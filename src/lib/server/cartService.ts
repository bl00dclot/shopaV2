// src/lib/server/cartService.ts
import { db } from '$lib/server/db';
import { carts, cartItems } from '$lib/server/db/schema';
import { eq, and, lt, inArray, sql } from 'drizzle-orm';
import { randomUUID } from 'crypto';

const TTL_MS = 60 * 60 * 1000;

const asMs = (value: Date | number) =>
  typeof value === 'number' ? value : value.getTime();

export async function getOrCreateCart(cartId?: string) {
  const now = Date.now();
  if (cartId) {
    const existing = await db.select().from(carts).where(eq(carts.id, cartId)).get();
    if (existing && now - asMs(existing.updatedAt) <= TTL_MS) {
      await db.update(carts).set({ updatedAt: new Date() }).where(eq(carts.id, cartId)).run();
      return cartId;
    }
  }
  const id = randomUUID();
  const nowDate = new Date(now);
  await db.insert(carts).values({ id, createdAt: nowDate, updatedAt: nowDate }).run();
  return id;
}

export async function upsertItems(
  cartId: string,
  items: { productId: string; qty: number }[]
) {
  const clamped = items
    .map(({ productId, qty }) => ({ productId, qty: Math.min(Math.max(qty, 0), 99) }))
    .filter((i) => i.qty >= 0);

  const toDelete = clamped.filter((i) => i.qty === 0).map((i) => i.productId);
  if (toDelete.length) {
    await db
      .delete(cartItems)
      .where(and(eq(cartItems.cartId, cartId), inArray(cartItems.productId, toDelete)))
      .run();
  }

  const nowDate = new Date();
  const toUpsert = clamped.filter((i) => i.qty > 0);
  if (toUpsert.length) {
    await db
      .insert(cartItems)
      .values(toUpsert.map((i) => ({ ...i, cartId, updatedAt: nowDate })))
      .onConflictDoUpdate({
        target: [cartItems.cartId, cartItems.productId],
        set: { qty: sql`excluded.qty`, updatedAt: nowDate },
      })
      .run();
  }

  await db.update(carts).set({ updatedAt: nowDate }).where(eq(carts.id, cartId)).run();
}

export async function getCartItems(cartId: string) {
  const now = Date.now();
  const cart = await db.select().from(carts).where(eq(carts.id, cartId)).get();
  if (!cart || now - asMs(cart.updatedAt) > TTL_MS) return null;
  const items = await db.select().from(cartItems).where(eq(cartItems.cartId, cartId)).all();
  return { id: cartId, items };
}

export async function deleteItem(cartId: string, productId: string) {
  await db.delete(cartItems)
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId)))
    .run();
  await db.update(carts).set({ updatedAt: new Date() }).where(eq(carts.id, cartId)).run();
}

// Optional: periodic cleanup
export async function purgeExpired() {
  const cutoffDate = new Date(Date.now() - TTL_MS);
  await db.delete(carts).where(lt(carts.updatedAt, cutoffDate)).run();
}