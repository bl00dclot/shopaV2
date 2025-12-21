// cart.svelte.ts

// import { syncCartToServer } from "./cartSync";
/**
 * Interface for cart items stored in localStorage
 * We only store the minimum data needed
 * @interface CartItem
 */
export interface CartItem {
	id: string;
	quantity: number;
  name: string;
  price: string;
  image: string;
}
/**
 * Configuration for cart storage
 */
const CART_STORAGE_KEY = 'shopping_cart' as const;
/**
 * Indicates if the cart has been initialized
 */
let initialized = $state(false);


/**
 * Cart state - only stores { id, quantity, name, price, image } for each item
 */
export const cart = $state({
  items: [] as CartItem[]
});

/**
 * Load cart from localStorage on initialization
 */
function loadCart(): void {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as unknown;
        if (Array.isArray(parsed)) {
          cart.items = parsed.filter(
            (item): item is CartItem =>
              typeof item === 'object' &&
              item !== null &&
              typeof item.id === 'string' &&
              typeof item.quantity === 'number' &&
              typeof item.name === 'string' &&
              typeof item.price === 'string' &&
              typeof item.image === 'string'
          );
        }
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      initialized = true;
    }
  }
}
/**
 * Save cart to localStorage
 */
async function saveCart(): Promise<void> {
  if (initialized && typeof window !== 'undefined') {
    if (initialized) {
      try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart.items));
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
    }
  }
        const cartServer = fetch('/api/cart').then(res => res.json()).catch(() => null);
      console.log('Fetched cart from server:', cartServer);
  //  try {
  //   // Persist server-side
  //   await syncCartToServer(cart.items);
  // } catch (err) {
  //   console.error('Failed to sync cart to server:', err);
  // }
}
/**
 * Add a product to the cart or increase its quantity
 */
export async function addToCart(cartItem: CartItem) {
  //localStorage validation
  if (cartItem.quantity <= 0) throw new Error('Quantity must be greater than 0');
  //localStorage update
  const existingItem = cart.items.find(item => item.id === cartItem.id);
  
  if (existingItem) {
    existingItem.quantity += cartItem.quantity;
  } else {
    cart.items.push({
      id: cartItem.id, quantity: cartItem.quantity,
      name: cartItem.name,
      price: cartItem.price,
      image: cartItem.image
    });
  }
  saveCart();
  const cartItemsServer = await fetch('/api/cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items: cart.items.map(item => ({
        productId: item.id,
        qty: item.quantity
      }))
    })});
      if (!cartItemsServer.ok) {
    console.error('Failed to sync cart with server:', await cartItemsServer.text());
      };
}
/**
 * Remove a product from the cart entirely
 */
export async function removeFromCart(productId: string) {
  cart.items = cart.items.filter(item => item.id !== productId);
  saveCart();
    const removeFromServerCart = await fetch(`/api/cart?productId=${encodeURIComponent(productId)}`, {
    method: 'DELETE'
  });
  if (!removeFromServerCart.ok) {
    console.error('Failed to remove item from server cart:', await removeFromServerCart.text());
  };
}
/**
 * Update the quantity of a specific product
 * If quantity is 0 or less, removes the item
 */
export function updateQuantity(productId: string, quantity: number): void {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  const item = cart.items.find(item => item.id === productId);
  if (item) {
    item.quantity = quantity;
    saveCart();
  }
}

/**
 * Clear all items from the cart
 */
export function clearCart(): void {
  cart.items = [];
  saveCart();
}

/**
 * Get a specific cart item by product ID
 */
export function getCartItem(productId: string): CartItem | undefined {
	return cart.items.find(item => item.id === productId);
}

/**
 * Get all cart items (returns a copy to prevent external mutations)
 */
export function getCartItems(): readonly CartItem[] {
  return cart.items;
}

/**
 * Check if a product is in the cart
 */
export function isInCart(productId: string): boolean {
	return cart.items.some(item => item.id === productId);
}
/**
 * Total quantity of all items in cart
 */
export const cartCount = () => cart.items.reduce((sum, item) => sum + item.quantity, 0);

/**
 * Total number of unique products in cart
 */
export const getUniqueItemCount = () => cart.items.length;

/**
 * Check if cart is empty
 */
export const isEmpty = () => cart.items.length === 0;

// Initialize cart on module load
loadCart();