<script>
	import Hero from '$lib/components/Hero.svelte';
	import ProductGrid from '$lib/components/ui/ProductGrid.svelte';
	import Testimonial from '$lib/components/Testimonial.svelte';
	import { DarkMode } from 'flowbite-svelte';

	let { data } = $props();
</script>

<Hero />
<div class="container mx-auto px-4 py-8">
	<!-- Section Header -->
	<div class="text-center mb-12">
		<h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Products</h2>
	</div>
	<ProductGrid products={data.allProducts} />
</div>
<Testimonial />
