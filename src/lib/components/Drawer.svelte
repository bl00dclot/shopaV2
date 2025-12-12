<script lang="ts">
	import {
		cart,
		clearCart,
		getCartItem,
		isEmpty,
		removeFromCart,
		updateQuantity
	} from '$lib/client/cart.svelte';
	import { drawerOpen } from '$lib/client/drawerState.svelte';
	import {
		Drawer,
		CardPlaceholder,
		Button,
		Sidebar,
		SidebarWrapper,
		SidebarGroup,
		SidebarItem,
		Card,
		Avatar,
		Badge,
		Footer
	} from 'flowbite-svelte';
	import { InfoCircleSolid, ArrowRightOutline, CartSolid } from 'flowbite-svelte-icons';

	let placement: 'right' | 'left' | 'top' | 'bottom' = $state('right');
	let { cartProducts } = $props();
	function productQuantity(id: string) {
		return getCartItem(id)?.quantity;
	}
	function increaseQuantity(id: string) {
		let quantity = productQuantity(id);
		if (typeof quantity === 'number') {
			quantity++;
			updateQuantity(id, quantity);
			return;
		}
		return;
	}
	function decreaseQuantity(id: string) {
		let quantity = productQuantity(id);
		if (typeof quantity === 'number') {
			quantity--;
			updateQuantity(id, quantity);
			return;
		}
		return;
	}
	function emptyCart() {
		$drawerOpen = false;
		clearCart();
	}
</script>

<div class="text-center">
	<Button onclick={() => ((placement = 'right'), ($drawerOpen = true))}
		><CartSolid class="shrink-0 h-6 w-6" /></Button
	>
</div>

<Drawer {placement} modal={true} bind:open={$drawerOpen}>
	<h5
		class="mb-4 inline-flex items-center text-base font-semibold text-gray-500 dark:text-gray-400"
	>
		<CartSolid class="me-2.5 h-5 w-5" />Shopping Cart
	</h5>
	{#if isEmpty()}
		<div class="text-gray-500 dark:text-gray-400">Shopping cart empty!</div>
	{/if}
	<Sidebar disableBreakpoints={true} class="top-16 w-full static">
		<SidebarWrapper class="overflow-y-auto w-auto rounded-sm px-0 py-0 dark:bg-gray-800">
			<SidebarGroup>
				{#each cartProducts as item}
					<Card class="p-1">
						<div class="flex justify-between pb-3">
							<Avatar src="/product.webp" cornerStyle="rounded" />
							<a href="/products/{item.product.id}">
								<h5 class="text-l font-semibold tracking-tight text-gray-900 dark:text-white">
									{item.product.name}
								</h5>
							</a>
						</div>
						<div class="flex justify-between p-5">
							<Badge border size="small" color="gray"
								>Quantity: {productQuantity(item.product.id)}</Badge
							>
							<Button size="xs" onclick={() => increaseQuantity(item.product.id)}>+</Button>
							<Button size="xs" onclick={() => decreaseQuantity(item.product.id)}>-</Button>
						</div>
						<div class="flex justify-end">
							<Button onclick={() => removeFromCart(item.product.id)} size="xs">Remove</Button>
						</div>
					</Card>
				{/each}
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>
	<Footer class="text-gray-500 dark:text-gray-400">
		<Button
			onclick={() => {
				emptyCart();
			}}>Clear</Button
		>
		{#if !isEmpty()}
			<a href="/checkout">
				<Button
					onclick={() => {
						$drawerOpen = false;
					}}>Checkout</Button
				>
			</a>
		{/if}
	</Footer>
</Drawer>
