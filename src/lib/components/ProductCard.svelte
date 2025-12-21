<script lang="ts">
	import { Card, Button, Rating, Badge } from 'flowbite-svelte';
	import type { products } from '$lib/server/db/schema';
	import { addToCart } from '$lib/client/cart.svelte';
	import AddToCart from './ui/AddToCart.svelte';
	import type { CartItem } from '$lib/client/cart.svelte';

	// type Product = typeof products.$inferSelect;
	// let { product }: { product: Product } = $props();
	let {
		product,
		showRating = true,
		showBuyNow = true,
		showAvailability = true,
		showPrice = true
	} = $props();
</script>

<Card class="p-0">
	<a href="/products/{product.id}">
		<img class="rounded-t-lg p-8" src="product.webp" alt="product 1" />
	</a>
	<div class="px-5 pb-5">
		<a href="/products/{product.id}">
			<h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
				{product.name}
			</h5>
		</a>
		{#if showRating}
			<Rating rating={4} size={24} class="mt-2.5 mb-5">
				{#snippet text()}
					<Badge class="ms-3">4</Badge>
				{/snippet}
			</Rating>
		{/if}
		{#if showAvailability}
			{#if product.inStock}
				<span class="badge dark:text-white">In Stock</span>
			{:else}
				<span class="badge out-of-stock dark:text-white">Out of Stock</span>
			{/if}
		{/if}
		<div class="flex items-center justify-between">
			{#if showPrice}
				<span class="text-3xl font-bold text-gray-900 dark:text-white">{product.price}</span>
			{/if}
		</div>
		{#if showBuyNow}
			<div class="flex justify-end gap-5 pt-3">
				<AddToCart data={{id: product.id, name: product.name, price: product.price, image: product.image}}/>
				<Button size="sm" href="/products/{product.id}">Buy now</Button>
			</div>
		{/if}
	</div>
</Card>
