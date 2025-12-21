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
	import { onMount } from 'svelte';
	import { cartOpen } from '$lib/client/cartState.svelte';

	let visible = $state(true);
	let lastScrollY = $state(0);
	// let scrollingDown = $state(false);
	let scrolled = $state(false);

	onMount(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			scrolled = currentScrollY > 40;

			// Show navbar if at top of page
			if (currentScrollY <= 10) {
				visible = true;
				// scrollingDown = false;
			}
			if (currentScrollY > lastScrollY && currentScrollY > 10){
				cartOpen.isOpen = false;
			}
			// Hide if scrolling down and past threshold
			else if (currentScrollY > lastScrollY && currentScrollY > 50) {
				visible = false;
				// scrollingDown = true;
			}
			// Show if scrolling up
			else if (currentScrollY < lastScrollY) {
				visible = true;
				// scrollingDown = false;
			}

			lastScrollY = currentScrollY;
		};

		// Throttle scroll events for better performance
		let ticking = false;
		const onScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					handleScroll();
					ticking = false;
				});
				ticking = true;
			}
		};

		window.addEventListener('scroll', onScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', onScroll);
		};
	});
</script>

<!-- <div class="relative px-8"> -->
<Navbar
	class="fixed top-0 left-0 right-0 z-50 transition-all duration-400 ease-in-out {visible
		? 'translate-y-0'
		: '-translate-y-full'}
		{scrolled ? 'bg-gray-100/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg' : 'bg-transparent shadow-none'}"
	fluid
>
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
		{#if innerWidth.current !== undefined && innerWidth.current < 768}
			<A href="/cart">
				<Button><CartSolid class="shrink-0 h-6 w-6" /></Button>
			</A>
		{:else}
			<DropdownCart />
		{/if}
	</div>
</Navbar>
<!-- </div> -->
