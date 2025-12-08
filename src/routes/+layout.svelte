<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
	// import { cartCount } from '$lib/client/cart.svelte';
	// import CartSidebar from '$lib/components/Sidebar.svelte';
	let { children } = $props();

	// const cartUi = uiHelpers();
	// let isCartOpen = $state(false);

	// $effect(() => {
	// 	isCartOpen = cartUi.isOpen;
	// });
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<!-- <header class="border-b p-4">
    <div class="container mx-auto flex justify-between items-center">
      <h1>My Shop</h1>
      <button 
        onclick={cartUi.toggle}
        class="relative p-2 hover:bg-gray-100 rounded"
      >
        🛒 Cart
        {#if cartCount() > 0}
          <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cartCount}
          </span>
        {/if}
      </button>
    </div>
  </header> -->
<Navbar />
{@render children()}
<!-- <CartSidebar 
    isOpen={isCartOpen}
    closeSidebar={cartUi.close}
  /> -->
<Footer />
