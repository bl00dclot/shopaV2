// src/routes/api/cart/+server.ts
import { json, type RequestEvent } from '@sveltejs/kit';
import { getOrCreateCart, getCartItems, upsertItems, deleteItem } from '$lib/server/cartService';
import { readCartId, setCartId } from '$lib/server/cookies';

const ensureCartId = async (event: RequestEvent) => {
  const existing = readCartId(event);
  const cartId = await getOrCreateCart(existing ?? undefined);
  if (!existing || existing !== cartId) setCartId(event, cartId);
  return cartId;
};

export async function GET(event) {
  const cartId = await ensureCartId(event);
  const cart = await getCartItems(cartId);
  return json(cart ?? { id: cartId, items: [] });
}

export async function POST(event) {
  const body = await event.request.json().catch(() => ({}));
  const items = Array.isArray(body.items) ? body.items : [];
  const cartId = await ensureCartId(event);
  await upsertItems(cartId, items);
  const cart = await getCartItems(cartId);
  return json(cart ?? { id: cartId, items: [] });
}

export async function DELETE(event) {
  const productId = event.url.searchParams.get('productId');
  const cartId = await ensureCartId(event);
  if (productId) await deleteItem(cartId, productId);
  const cart = await getCartItems(cartId);
  return json(cart ?? { id: cartId, items: [] });
}