<script lang="ts">
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		DarkMode,
		A,
		Button
	} from 'flowbite-svelte';
	import { fade } from 'svelte/transition';
	import { innerWidth } from 'svelte/reactivity/window';
	import { CartSolid } from 'flowbite-svelte-icons';
	import DropdownCart from './DropdownCart.svelte';

	let { drawerProducts } = $props();
</script>

<Navbar>
	<NavHamburger />
	<NavUl transition={fade} transitionParams={{ duration: 300 }}>
		<NavLi href="/">Home</NavLi>
		<NavLi href="/about">About</NavLi>
		<NavLi href="/contact">Contact</NavLi>
	</NavUl>
	<NavBrand href="/">
		<img src="/logo.svg" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
		<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Shopa</span>
		<img src="/logo.svg" class="m-3 h-6 sm:h-9" alt="Flowbite Logo" />
	</NavBrand>
	<div class="flex gap-2">
		<DarkMode />
		<!-- <Drawer cartProducts={drawerProducts} /> -->
		{#if innerWidth.current !== undefined && innerWidth.current < 768}
			<A href="/cart">
				<Button><CartSolid class="shrink-0 h-6 w-6" /></Button>
			</A>
		{:else}
			<DropdownCart cartProducts={drawerProducts} />
		{/if}
	</div>
</Navbar>
