<script lang="ts">
	import { Avatar, Badge, Button, Card, Dropdown, DropdownItem, P } from 'flowbite-svelte';
	import { CartSolid, CloseOutline, TrashBinOutline } from 'flowbite-svelte-icons';
	import { cart, clearCart, getCartItem, isEmpty, getCartItems, removeFromCart } from '$lib/client/cart.svelte';
	import { cartOpen, openCart } from '$lib/client/cartState.svelte';

	function productQuantity(id: string) {
		return getCartItem(id)?.quantity;
	}
	function emptyCart() {
		cartOpen.isOpen = false;
		clearCart();
	}
</script>

<Button><CartSolid class="shrink-0 h-6 w-6" /></Button>
<Dropdown bind:isOpen={cartOpen.isOpen}
 simple class="h-70 w-80 border-2 border-gray-300 dark:border-gray-600">
	<h5
		class="w-full mb-2 px-4 inline-flex justify-between items-center text-base font-semibold text-gray-500 dark:text-gray-400">
		<CartSolid class="me-2.5 h-5 w-5" />Shopping Cart<Button
			onclick={() => {
				cartOpen.isOpen = false;
			}}
			size="xs"
			color="alternative"
			outline={false}><CloseOutline class="shrink-0 h-4 w-4" /></Button>
	</h5>
	{#if isEmpty()}
		<div class="p-4 text-gray-500 dark:text-gray-600"><P>Shopping cart empty!</P></div>
		
	{/if}
	<div class="max-h-60 overflow-y-auto">
	{#each cart.items as product}
		<DropdownItem class="p-0">
			<Card class="p-3 rounded-none">
				<div class="flex justify-between pb-3">
					<Avatar src="/product.webp" cornerStyle="rounded" />
					<a href="/products/{product.id}">
						<h5 class="text-l font-semibold tracking-tight text-gray-900 dark:text-white">
							{product.name}
						</h5>
					</a>
				</div>
				<div class="flex justify-between">
					<Badge border size="small" color="gray"
						>Quantity: {productQuantity(product.id)}</Badge
					>
					<Button
						onclick={() => removeFromCart(product.id)}
						size="xs"
						color="alternative"
						outline={false}><TrashBinOutline class="shrink-0 h-6 w-6" /></Button
					>

					<!-- <Button size="xs" onclick={() => increaseQuantity(item.product.id)}>+</Button>
				<Button size="xs" onclick={() => decreaseQuantity(item.product.id)}>-</Button> -->
				</div>
				<div class="flex justify-end"></div>
			</Card>
		</DropdownItem>
	{/each}
	</div>
	<div class=" text-gray-500 dark:text-gray-400">
		
		{#if !isEmpty()}
		<Button
			onclick={() => {
				emptyCart();
			}}>Clear</Button
		>
			<a href="/checkout">
				<Button
					onclick={() => {
						cartOpen.isOpen = false;
					}}>Checkout</Button
				>
			</a>
		{/if}
		</div>
</Dropdown>
