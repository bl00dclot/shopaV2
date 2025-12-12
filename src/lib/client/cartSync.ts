// src/lib/client/cartSync.ts
import { invalidate } from '$app/navigation';

// call when cart changes (pass array of {id,quantity})
export async function syncCartToServer(cartItems: { id: string; quantity: number }[]) {
  // Set cookie (client-side) — simple approach
  document.cookie = `cart=${encodeURIComponent(JSON.stringify(cartItems))}; path=/;`;

  // tell layout to re-run its load
  await invalidate('cart:data');
}
