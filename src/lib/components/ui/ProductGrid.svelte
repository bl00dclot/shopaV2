<script>
	import Card from '../Card.svelte';
	import { CardPlaceholder } from "flowbite-svelte";
	let { products } = $props();
</script>

<div class="container mx-auto px-4 py-8">
	<!-- Section Header -->
	<div class="text-center mb-12">
		<h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Products</h2>
	</div>

	<!-- Product Grid -->
	{#if products === undefined || products.length() === 0}
		<div class="empty-state">
			<CardPlaceholder />
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<!-- Repeat for each product -->
			{#each products as product}
				<Card {product} />
			{/each}
		</div>
	{/if}
</div>
