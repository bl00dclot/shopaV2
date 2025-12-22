<script lang="ts">
    import type { PageProps } from './$types';
    import CartCard from '$lib/components/cartCard.svelte';
    let { data }: PageProps = $props();
</script>

<div class="container mx-auto p-4 grid gap-4">
    <h1 class="text-3xl font-bold mb-6">Shopping Cart</h1>
    {#each data.cartItems as item}
        <CartCard />
    {/each}
</div>