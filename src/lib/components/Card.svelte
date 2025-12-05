<script lang="ts">
	import { Card, Button, Rating, Badge } from 'flowbite-svelte';
	import type { products } from '$lib/server/db/schema';

	type Product = typeof products.$inferSelect;

	// No defaults - card is "dumb", just displays what it receives
	let { product }: { product: Product } = $props();
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
		<Rating rating={4} size={24} class="mt-2.5 mb-5">
			{#snippet text()}
				<Badge class="ms-3">4</Badge>
			{/snippet}
		</Rating>
		{#if product.inStock}
			<span class="badge">In Stock</span>
		{:else}
			<span class="badge out-of-stock">Out of Stock</span>
		{/if}
		<div class="flex items-center justify-between">
			<span class="text-3xl font-bold text-gray-900 dark:text-white">{product.price}</span>
			<Button href="/">Buy now</Button>
		</div>
	</div>
</Card>
