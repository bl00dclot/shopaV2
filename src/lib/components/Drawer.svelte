<script lang="ts">
	import { getCartItems, removeFromCart } from '$lib/client/cart.svelte';
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
		Badge
	} from 'flowbite-svelte';
	import { InfoCircleSolid, ArrowRightOutline, CartSolid } from 'flowbite-svelte-icons';


	let open5 = $state(false);
	let placement: 'right' | 'left' | 'top' | 'bottom' = $state('right');
	// let cartProducts = [
	// 	{
	// 		id: 'pord1',
	// 		name: 'prod1',
	// 		description: 'asd',
	// 		image: '/product.webp',
	// 		inStock: 0,
	// 		price: '123'
	// 	},
	// 	{
	// 		id: 'pord1',
	// 		name: 'prod1',
	// 		description: 'asd',
	// 		image: '/product.webp',
	// 		inStock: 0,
	// 		price: '123'
	// 	}
	// ];
	  interface Product {
    id: string,
    name: string,
    image: string,
    price: string,
    inStock: string,
  }
	  type EnrichedItem = {
  id: string;
  quantity: number;
  product: Product; // or a proper Product type
};
	  const cartItems = $derived(getCartItems());
	  console.log(cartItems);
	  let enrichedItems = $state<any[]>([]);

$effect(() => {
  (async () => {
    const items = await Promise.all(
      cartItems.map(async item => {
        const res = await fetch(`/api/products/${item.id}`);
        const product = await res.json();
        return { ...item, product };
      })
    );
    enrichedItems = items;
  })();
});


</script>

<div class="text-center">
	<Button onclick={() => ((placement = 'right'), (open5 = true))}
		><CartSolid class="shrink-0 h-6 w-6" /></Button
	>
</div>

<Drawer {placement} bind:open={open5}>
	<h5
		class="mb-4 inline-flex items-center text-base font-semibold text-gray-500 dark:text-gray-400"
	>
		<CartSolid class="me-2.5 h-5 w-5" />Shopping Cart
	</h5>
	<Sidebar disableBreakpoints={true} class="top-16">
		<SidebarWrapper class="overflow-y-auto w-auto rounded-sm px-3 py-0 dark:bg-gray-800">
			<SidebarGroup>
				{#each enrichedItems as product}
					<Card class="p-3">
						<div class="flex justify-between pb-3">
							<Avatar src="product.webp" cornerStyle="rounded" />
							<a href="/products/{product.id}">
								<h5 class="text-l font-semibold tracking-tight text-gray-900 dark:text-white">
									{product.name}
								</h5>
							</a>
						</div>
						<div class="flex justify-between">
							<Badge border size="small" color="gray">1</Badge>
							<Button onclick={() => removeFromCart(product.id)} size="xs">Remove</Button>
						</div>
					</Card>
				{/each}
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>
	<!-- <CartGrid
		cartProducts={cartProducts}
	/> -->
</Drawer>
