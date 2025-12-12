import type { PageServerLoad } from './$types';
import { cart, getCartItems } from '$lib/client/cart.svelte';
import { loadCartFromCookie } from '$lib/server/cart-loader';

export const load = (async (event) => {
  const cart = await loadCartFromCookie(event)
  return {cart}
}) satisfies PageServerLoad;