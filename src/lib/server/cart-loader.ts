// src/lib/server/cart-loader.ts
import type { Cookies } from '@sveltejs/kit';
import { getCartProducts } from '$lib/server/services/cart.service';

type CartProductMap = Awaited<ReturnType<typeof getCartProducts>>;
type CartProduct = CartProductMap extends Map<string, infer T> ? T : never;

export type CartItemWithProduct = {
  id: string;
  quantity: number;
  product: CartProduct;
};

type CartLoadContext = {
  cookies: Cookies;
  depends?: (dependency: string) => void;
};

export async function loadCartFromCookie(
  { cookies, depends }: CartLoadContext
): Promise<CartItemWithProduct[]> {
  depends?.('cart:data');

  const raw = cookies.get('cart');
  if (!raw) return [];

  let items: { id: string; quantity: number }[] = [];
  try {
    items = JSON.parse(raw);
    if (!Array.isArray(items)) items = [];
  } catch {
    items = [];
  }

  const ids = Array.from(new Set(items.map((i) => i.id)));
  if (!ids.length) return [];

  const products = await getCartProducts(ids); // Map id -> product

  return items
    .map((item) => {
      const product = products.get(item.id);
      return product
        ? { id: item.id, quantity: item.quantity, product }
        : null;
    })
    .filter(Boolean) as CartItemWithProduct[];
}