// src/routes/+layout.server.ts
import type { LayoutServerLoad } from '../(shop)/$types';
import { getCartProducts } from '$lib/server/services/cart.service';
import { loadCartFromCookie } from '$lib/server/cart-loader';

export const load: LayoutServerLoad = async (event) => {
  const cart = await loadCartFromCookie(event)
  return {cart}
  // declare dependency that we will invalidate from client
  // depends('cart:data');

  // const raw = cookies.get('cart'); // stringified JSON or undefined
  // if (!raw) return { cart: [] };

  // let items: { id: string; quantity: number }[] = [];
  // try {
  //   items = JSON.parse(raw);
  //   if (!Array.isArray(items)) items = [];
  // } catch {
  //   items = [];
  // }

  // // dedupe ids and batch fetch
  // const ids = Array.from(new Set(items.map(i => i.id)));
  // if (ids.length === 0) return { cart: [] };

  // // server-side batch fetch from DB or internal fetch function
  // const products = await getCartProducts(ids); // returns Map id->product

  // // preserve order + quantity; if product missing filter it out
  // const enriched = items
  //   .map(it => {
  //     const product = products.get(it.id);
  //     if (!product) return null;
  //     return { ...it, product };
  //   })
  //   .filter(Boolean);

  // return { cart: enriched };
};
