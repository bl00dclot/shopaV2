<script>
	import ProductCard from '../ProductCard.svelte';
	import { CardPlaceholder } from 'flowbite-svelte';

	let {
		products,
		class: className = '',
		showRating = true,
		showBuyNow = true,
		showAvailability = true,
		showPrice = true
	} = $props();
</script>

<!-- Product Grid -->
{#if products === undefined || products.length === 0}
	<div class="empty-state">
		<CardPlaceholder />
	</div>
{:else}
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 {className}">
		<!-- Repeat for each product -->
		{#each products as product}
			<ProductCard {product} {showRating} {showBuyNow} {showAvailability} {showPrice} />
		{/each}
	</div>
{/if}
